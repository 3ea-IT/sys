<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Experience;
use App\Models\Hold;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Carbon\Carbon;

class BookingController extends Controller
{
    /**
     * Display instant bookings index (user dashboard)
     */
    public function index()
    {
        $user = Auth::user();
        
        if (!$user) {
            return redirect()->route('login');
        }

        $bookings = Booking::where('user_id', $user->id)
            ->with('experience')
            ->latest()
            ->paginate(10);

        return Inertia::render('Bookings/Index', [
            'bookings' => $bookings,
        ]);
    }

    /**
     * Show specific booking details
     */
    public function show(Booking $booking)
    {
        if (Auth::id() !== $booking->user_id) {
            abort(403, 'Unauthorized');
        }

        return Inertia::render('Bookings/Show', [
            'booking' => $booking->load(['experience', 'user.wallet']),
        ]);
    }

    /**
     * Store instant booking (Mode 1)
     */
    public function instantStore(Request $request)
    {
        $user = Auth::user();
        
        if (!$user) {
            return redirect()->route('login');
        }

        $request->validate([
            'experience_id' => [
                'required',
                'exists:experiences,id',
                Rule::exists('experiences', 'id')->where(function ($query) {
                    $query->where('status', 'active')
                          ->where('approval_status', 'approved')
                          ->where('instant_availability', '>', 0);
                }),
            ],
            'party_size' => 'required|integer|min:1', // Allow any number for instant booking
        ]);

        $experience = Experience::findOrFail($request->experience_id);
        $partySize = (int) $request->party_size;

        // Double-check availability (race condition protection)
        if (!$experience->supportsInstantBooking()) {
            return back()->with('error', 'Instant tickets are no longer available.');
        }

        // Check if enough seats are available for the party size
        if ($experience->instant_availability < $partySize) {
            return back()->with('error', "Only {$experience->instant_availability} ticket(s) available for instant booking.");
        }

        // Use DB transaction
        return DB::transaction(function () use ($user, $experience, $request, $partySize) {
            // 1. Create booking with party_size and per_person_amount
            $perPersonAmount = $experience->instant_price;
            $totalAmount = $perPersonAmount * $partySize;
            $booking = Booking::create([
                'user_id' => $user->id,
                'experience_id' => $experience->id,
                'booking_type' => 'instant',
                'party_size' => $partySize,
                'per_person_amount' => $perPersonAmount,
                'status' => 'confirmed',
                'total_amount' => $totalAmount,
                'paid_amount' => $totalAmount,
                'confirmed_at' => now(),
            ]);

            // 2. Deduct inventory (multiply by party_size)
            $experience->decrement('instant_availability', $partySize);

            // 3. Deduct from wallet
            $wallet = $user->wallet ?? $user->wallet()->create(['balance' => 0]);
            if ($wallet->balance < $totalAmount) {
                throw new \Exception('Insufficient wallet balance');
            }

            $wallet->decrement('balance', $totalAmount);

            // 4. Create transaction record
            WalletTransaction::create([
                'wallet_id' => $wallet->id,
                'amount' => $totalAmount,
                'type' => 'debit',
                'description' => "Instant booking #{$booking->id} for {$partySize} people - {$experience->title}",
                'reference_type' => 'booking',
                'reference_id' => $booking->id,
            ]);

            // 5. Success response - Return JSON for AJAX requests, redirect for page loads
            if (request()->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'bookingId' => $booking->id,
                    'isBooked' => true,
                    'message' => "Ticket confirmed for {$partySize} person(s)!"
                ]);
            }
            
            return redirect()->route('bookings.show', $booking)
                ->with('success', "Ticket confirmed for {$partySize} person(s)!");
        });
    }

    /**
     * Store hold booking (Mode 2)
     */
    public function holdStore(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $request->validate([
            'experience_id' => [
                'required',
                'exists:experiences,id',
                Rule::exists('experiences', 'id')->where(function ($query) {
                    $query->where('status', 'active')
                          ->where('approval_status', 'approved')
                          ->where('hold_token', '>', 0);
                }),
            ],
        ]);

        $experience = Experience::findOrFail($request->experience_id);

        // Use DB transaction
        return DB::transaction(function () use ($user, $experience, $request) {
            // 1. Create booking with hold token
            $booking = Booking::create([
                'user_id' => $user->id,
                'experience_id' => $experience->id,
                'booking_type' => 'hold_confirmed',
                'status' => 'pending',
                'hold_token_paid' => $experience->hold_token,
                'total_amount' => $experience->price,  // Full amount to be paid upon confirmation
            ]);

            // 2. Deduct from wallet (hold token)
            $wallet = $user->wallet ?? $user->wallet()->create(['balance' => 0]);
            if ($wallet->balance < $experience->hold_token) {
                throw new \Exception('Insufficient wallet balance for hold token');
            }

            $wallet->decrement('balance', $experience->hold_token);

            // 3. Create transaction record for the hold token payment
            WalletTransaction::create([
                'wallet_id' => $wallet->id,
                'amount' => $experience->hold_token,
                'type' => 'debit',
                'description' => "Hold token payment for booking {$booking->id}",
                'reference_type' => 'booking',
                'reference_id' => $booking->id,
            ]);

            // 4. Success response
            return redirect()->route('holds.index')
                ->with('success', 'Seat temporarily secured! Confirm or release within the time limit.');
        });
    }

    /**
     * Cancel booking (before event starts)
     */
    public function cancel(Booking $booking)
    {
        if (Auth::id() !== $booking->user_id) {
            abort(403);
        }

        if ($booking->status !== 'confirmed') {
            return back()->with('error', 'Cannot cancel this booking.');
        }

        return DB::transaction(function () use ($booking) {
            $booking->update([
                'status' => 'cancelled',
                'cancelled_at' => now(),
            ]);

            // Refund wallet
            $wallet = $booking->user->wallet;
            $wallet->increment('balance', $booking->paid_amount);

            // Transaction record for refund
            WalletTransaction::create([
                'wallet_id' => $wallet->id,
                'amount' => $booking->paid_amount,
                'type' => 'credit',
                'description' => "Booking cancellation #{$booking->id}",
                'reference_type' => 'booking',
                'reference_id' => $booking->id,
            ]);

            // Restore instant availability
            $booking->experience->increment('instant_availability');

            return redirect()->route('bookings.index')
                ->with('success', 'Booking cancelled and refunded.');
        });
    }

    /**
     * Vendor/Admin: List all bookings for experience/vendor
     */
    public function vendorIndex()
    {
        $user = Auth::user();
        
        if ($user->role !== 'vendor') {
            abort(403);
        }

        $bookings = Booking::with(['user', 'experience'])
            ->whereHas('experience', function ($query) use ($user) {
                $query->where('vendor_id', $user->id); // Assuming vendor_id exists
            })
            ->latest()
            ->paginate(20);

        return Inertia::render('Vendor/Bookings/Index', [
            'bookings' => $bookings,
        ]);
    }

    /**
     * Admin: All bookings dashboard
     */
    public function adminIndex()
    {
        $user = Auth::user();
        
        if ($user->role !== 'admin') {
            abort(403);
        }

        $bookings = Booking::with(['user', 'experience'])
            ->latest()
            ->paginate(50);

        $stats = [
            'total' => Booking::count(),
            'confirmed' => Booking::where('status', 'confirmed')->count(),
            'cancelled' => Booking::where('status', 'cancelled')->count(),
            'instant' => Booking::where('booking_type', 'instant')->count(),
        ];

        return Inertia::render('Admin/Bookings/Index', [
            'bookings' => $bookings,
            'stats' => $stats,
        ]);
    }
}
