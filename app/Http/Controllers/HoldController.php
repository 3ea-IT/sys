<?php

namespace App\Http\Controllers;

use App\Models\Hold;
use App\Models\Experience;
use App\Models\Waitlist;
use App\Models\SystemSetting;
use App\Enums\ExperienceStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Inertia\Inertia;

class HoldController extends Controller
{
    /**
     * Store a new hold for an experience (token payment flow).
     * 
     * Flow:
     * 1. Check booking mode support
     * 2. Validate party_size (max 2 for holds)
     * 3. Deduct token from wallet (multiplied by party_size)
     * 4. Create hold with configured duration
     * 5. If no availability, add to waitlist instead
     */
    public function store(Request $request)
    {
        // Redirect guests to login
        if (!auth()->check()) {
            return redirect()->route('login');
        }

        $request->validate([
            'experience_id' => 'required|exists:experiences,id',
            'party_size' => 'required|integer|min:1|max:2', // Max 2 people for holds
        ]);

        $experience = Experience::find($request->experience_id);
        $partySize = (int) $request->party_size;
        
        \Log::info('Hold store initiated', [
            'user_id' => auth()->id(),
            'experience_id' => $request->experience_id,
            'party_size' => $partySize,
            'experience_status' => $experience->status,
            'approval_status' => $experience->approval_status,
        ]);

        // Check if experience is active and approved
        if ($experience->status->value !== 'active' || $experience->approval_status !== 'approved') {
            \Log::warning('Experience not available for hold', ['experience_id' => $experience->id]);
            return back()->with('error', 'This experience is not available for booking.');
        }

        // Check if experience supports hold bookings
        if (!$experience->supportsHoldBooking()) {
            \Log::warning('Experience does not support hold bookings', ['experience_id' => $experience->id]);
            return back()->with('error', 'This experience does not support hold bookings.');
        }

        $user = auth()->user();
        $wallet = $user->wallet;
        
        // Calculate token amount for party size
        $tokenAmount = $experience->hold_token * $partySize;
        
        \Log::info('Wallet check', [
            'user_id' => $user->id,
            'wallet_exists' => $wallet !== null,
            'wallet_balance' => $wallet?->balance ?? 0,
            'hold_token_for_party' => $tokenAmount,
        ]);

        // Check if user has sufficient balance for hold token (multiplied by party_size)
        if (!$wallet || $wallet->balance < $tokenAmount) {
            \Log::warning('Insufficient wallet balance for hold', [
                'user_id' => $user->id,
                'balance' => $wallet?->balance ?? 0,
                'required' => $tokenAmount,
            ]);
            return back()->with('error', 'Insufficient wallet balance for hold token. Add funds to your wallet.');
        }

        // ATOMIC TRANSACTION: Protect against race conditions
        return DB::transaction(function () use ($user, $experience, $wallet, $request, $partySize, $tokenAmount) {
            // Double-check availability (race condition protection)
            // Account for party_size in capacity calculation
            $activeHoldsCount = Hold::where('experience_id', $experience->id)
                ->where('status', Hold::STATUS_ACTIVE)
                ->where('expires_at', '>', Carbon::now())
                ->get()
                ->sum('party_size'); // Sum party sizes instead of count

            $instantBookingsCount = \App\Models\Booking::where('experience_id', $experience->id)
                ->where('status', 'confirmed')
                ->get()
                ->sum('party_size'); // Sum party sizes instead of count

            $totalClaimedSeats = $activeHoldsCount + $instantBookingsCount;
            $availableSeats = $experience->capacity - $totalClaimedSeats;

            if ($availableSeats < $partySize) {
                // Not enough seats for the party - add to waitlist
                Waitlist::addToWaitlist($user->id, $experience->id);
                
                return redirect()
                    ->route('holds.index')
                    ->with('info', "No {$partySize} seat(s) available. You have been added to the waitlist. We will notify you when seats become available.");
            }

            // Deduct token from wallet (multiplied by party_size)
            $wallet->decrement('balance', $tokenAmount);

            // Log wallet transaction
            \App\Models\WalletTransaction::create([
                'wallet_id' => $wallet->id,
                'type' => 'debit',
                'amount' => $tokenAmount,
                'description' => "Hold token for {$partySize} person(s) - {$experience->title}",
                'reference_id' => null, // Will be updated after hold creation
                'reference_type' => 'hold',
            ]);

            // Create the hold with duration from experience settings and party_size
            $holdDurationMinutes = $experience->hold_duration ?? 30;
            $perPersonAmount = $experience->hold_token;
            $hold = Hold::create([
                'user_id' => $user->id,
                'experience_id' => $experience->id,
                'expires_at' => Carbon::now()->addMinutes($holdDurationMinutes),
                'party_size' => $partySize,
                'per_person_amount' => $perPersonAmount,
                'status' => Hold::STATUS_ACTIVE,
                'source' => Hold::SOURCE_DIRECT,
            ]);
            
            \Log::info('Hold created successfully', [
                'hold_id' => $hold->id,
                'user_id' => $user->id,
                'experience_id' => $experience->id,
                'party_size' => $partySize,
                'status' => $hold->status,
                'expires_at' => $hold->expires_at,
            ]);

            // Update wallet transaction reference
            \App\Models\WalletTransaction::where('wallet_id', $wallet->id)
                ->latest()
                ->first()
                ->update(['reference_id' => $hold->id]);

            \Log::info('Hold creation completed, redirecting', ['hold_id' => $hold->id]);
            
            // Return JSON for AJAX requests, redirect for page loads
            if (request()->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'holdId' => $hold->id,
                    'isSecured' => true,
                    'message' => "Hold created for {$partySize} person(s)! You have {$holdDurationMinutes} minutes to confirm."
                ]);
            }
            
            return redirect()->route('holds.active', $hold->id)
                ->with('success', "Hold created! You have {$holdDurationMinutes} minutes to confirm.");
        });
    }

    /**
     * List the user's active, expiring, and past holds.
     */
    public function index()
    {
        // Redirect guests to login
        if (!auth()->check()) {
            return redirect()->route('login');
        }

        $userId = auth()->id();

        // ── Expiring Soon ─────────────────────────────────────────────────────
        $expiring = Hold::with('experience')
            ->where('user_id', $userId)
            ->expiringSoon(5) // Expiring within 5 minutes
            ->latest()
            ->get();

        // ── Active Holds ──────────────────────────────────────────────────────
        $active = Hold::with('experience')
            ->where('user_id', $userId)
            ->where('status', Hold::STATUS_ACTIVE)
            ->where('expires_at', '>', Carbon::now()->addMinutes(5))
            ->latest()
            ->get();

        // ── Past Holds ────────────────────────────────────────────────────────
        $past = Hold::with('experience')
            ->where('user_id', $userId)
            ->whereIn('status', [Hold::STATUS_RELEASED, Hold::STATUS_EXPIRED, Hold::STATUS_CONFIRMED])
            ->latest()
            ->paginate(20);

        // ── Waitlist Status ──────────────────────────────────────────────────
        $waitlist = Waitlist::where('user_id', $userId)
            ->with('experience')
            ->whereIn('status', ['waiting', 'offered'])
            ->latest()
            ->get();

        return Inertia::render('Holds/Index', [
            'expiring' => $expiring,
            'active' => $active,
            'past' => $past,
            'waitlist' => $waitlist,
        ]);
    }

    /**
     * Show a specific active hold for the user.
     */
    public function active(Hold $hold)
    {
        // Redirect guests to login
        if (!auth()->check()) {
            return redirect()->route('login');
        }

        // Ensure user owns this hold
        if ($hold->user_id !== auth()->id()) {
            abort(403, 'Unauthorized');
        }

        // Load experience with all properties
        $hold->load('experience');

        return Inertia::render('Holds/Active', [
            'hold' => $hold,
            'timeRemaining' => $hold->time_remaining,
            'holdDuration' => $hold->experience->hold_duration,
        ]);
    }

    /**
     * Confirm a hold (convert to booking with full payment).
     * 
     * Flow:
     * 1. Check hold is still active and not expired
     * 2. Charge remaining amount (full_price - token)
     * 3. Create booking record
     * 4. Mark hold as confirmed
     */
    public function confirm(Hold $hold, Request $request)
    {
        // Redirect guests to login
        if (!auth()->check()) {
            return redirect()->route('login');
        }

        // Ensure user owns this hold
        if ($hold->user_id !== auth()->id()) {
            abort(403, 'Unauthorized');
        }

        // Check if hold is still active
        if ($hold->status !== Hold::STATUS_ACTIVE) {
            return back()->with('error', 'This hold is no longer active.');
        }

        // Check if hold has expired
        if ($hold->hasExpired()) {
            $hold->autoExpire('expired_before_confirmation');
            return back()->with('error', 'Hold has expired. Please create a new hold.');
        }

        $experience = $hold->experience;
        $user = $hold->user;
        $wallet = $user->wallet;
        $partySize = $hold->party_size ?? 1;

        // Calculate remaining amount (accounting for party_size)
        $fullPrice = ($experience->instant_price ?? $experience->price) * $partySize;
        $tokenAlreadyPaid = $experience->hold_token * $partySize;
        $remainingAmount = max(0, $fullPrice - $tokenAlreadyPaid);

        return DB::transaction(function () use ($hold, $experience, $user, $wallet, $fullPrice, $tokenAlreadyPaid, $remainingAmount, $partySize) {
            // If there's a remaining amount, deduct from wallet
            if ($remainingAmount > 0) {
                if (!$wallet || $wallet->balance < $remainingAmount) {
                    throw new \Exception('Insufficient wallet balance to confirm booking.');
                }

                $wallet->decrement('balance', $remainingAmount);

                // Log wallet transaction
                \App\Models\WalletTransaction::create([
                    'wallet_id' => $wallet->id,
                    'type' => 'debit',
                    'amount' => $remainingAmount,
                    'description' => "Confirmation payment for {$partySize} person(s) - {$experience->title}",
                    'reference_id' => $hold->id,
                    'reference_type' => 'hold',
                ]);
            }

            // Create booking record with party_size and per_person_amount
            $perPersonPrice = $experience->instant_price ?? $experience->price;
            $booking = \App\Models\Booking::create([
                'user_id' => $user->id,
                'experience_id' => $experience->id,
                'booking_type' => 'hold_confirmed',
                'party_size' => $partySize,
                'per_person_amount' => $perPersonPrice,
                'status' => 'confirmed',
                'total_amount' => $fullPrice,
                'paid_amount' => $fullPrice,
                'hold_token_paid' => $tokenAlreadyPaid,
            ]);

            // Update hold to confirmed
            $hold->confirm($booking->id);

            return redirect()->route('bookings.show', $booking->id)
                ->with('success', "Booking confirmed for {$partySize} person(s)! Your ticket is ready.");
        });
    }

    /**
     * Release the hold (user cancellation).
     * 
     * Flow:
     * 1. Check hold is active
     * 2. Refund token to wallet
     * 3. Mark hold as released
     * 4. Offer to next in waitlist
     */
    public function release(Hold $hold, Request $request)
    {
        // Redirect guests to login
        if (!auth()->check()) {
            return redirect()->route('login');
        }

        // Ensure user owns this hold
        if ($hold->user_id !== auth()->id()) {
            abort(403, 'Unauthorized');
        }

        // Check if hold is still active
        if ($hold->status !== Hold::STATUS_ACTIVE) {
            return back()->with('error', 'This hold is no longer active.');
        }

        return DB::transaction(function () use ($hold) {
            $experience = $hold->experience;
            $wallet = $hold->user->wallet;
            $refundAmount = $experience->hold_token;

            // Refund token to wallet
            if ($wallet) {
                $wallet->increment('balance', $refundAmount);

                // Log wallet transaction
                \App\Models\WalletTransaction::create([
                    'wallet_id' => $wallet->id,
                    'type' => 'credit',
                    'amount' => $refundAmount,
                    'description' => "Hold refund for {$experience->title}",
                    'reference_id' => $hold->id,
                    'reference_type' => 'hold',
                ]);
            }

            // Release the hold
            $hold->release('user_requested');

            // Offer slot to next person in waitlist
            $nextInWaitlist = Waitlist::getNextInQueue($experience->id);
            if ($nextInWaitlist) {
                $offerDuration = SystemSetting::get('waitlist_offer_duration_minutes', 10);
                $nextInWaitlist->makeOffer($offerDuration);
            }

            return redirect()->route('holds.index')
                ->with('success', 'Hold released. Token refunded to your wallet.');
        });
    }
}
