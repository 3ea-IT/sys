<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Hold;
use App\Models\Payment;
use App\Services\RazorpayService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    protected $razorpay;

    public function __construct(RazorpayService $razorpay)
    {
        $this->razorpay = $razorpay;
    }

    /**
     * Create a payment order for instant booking
     */
    public function instantBookingOrder(Request $request)
    {
        if (!auth()->check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $request->validate([
            'experience_id' => 'required|exists:experiences,id',
            'party_size' => 'required|integer|min:1', // Allow any number for instant
        ]);

        $experience = \App\Models\Experience::find($request->experience_id);
        $partySize = (int) $request->party_size;
        $user = auth()->user();

        // Validate experience
        if ($experience->status->value !== 'active' || $experience->approval_status !== 'approved') {
            return response()->json(['error' => 'Experience not available'], 400);
        }

        if (!$experience->supportsInstantBooking()) {
            return response()->json(['error' => 'Instant booking not supported for this experience'], 400);
        }

        // Check seat availability for party size
        if ($experience->instant_availability < $partySize) {
            return response()->json(['error' => "Only {$experience->instant_availability} seat(s) available for instant booking."], 400);
        }

        // Calculate amount for party size
        $amount = ($experience->instant_price ?? $experience->price) * $partySize;

        // Create order
        $result = $this->razorpay->createOrder(
            $amount,
            "Instant booking for {$partySize} person(s) - {$experience->title}",
            $user->id,
            'booking_instant',
            $request->experience_id
        );

        if (!$result['success']) {
            return response()->json($result, 400);
        }

        // Store pending payment record
        Payment::create([
            'user_id' => $user->id,
            'order_id' => $result['order_id'],
            'payment_id' => null,
            'signature' => null,
            'amount' => $result['amount'],
            'party_size' => $partySize,
            'currency' => $result['currency'],
            'reference_type' => 'booking_instant',
            'reference_id' => $request->experience_id,
            'status' => 'pending',
        ]);

        return response()->json($result);
    }

    /**
     * Create a payment order for hold token
     */
    public function holdTokenOrder(Request $request)
    {
        if (!auth()->check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $request->validate([
            'experience_id' => 'required|exists:experiences,id',
            'party_size' => 'required|integer|min:1|max:2', // Max 2 people for holds
        ]);

        $experience = \App\Models\Experience::find($request->experience_id);
        $partySize = (int) $request->party_size;
        $user = auth()->user();

        // Validate experience
        if ($experience->status->value !== 'active' || $experience->approval_status !== 'approved') {
            return response()->json(['error' => 'Experience not available'], 400);
        }

        if (!$experience->supportsHoldBooking()) {
            return response()->json(['error' => 'Hold booking not supported for this experience'], 400);
        }

        // Calculate amount for party size
        $amount = $experience->hold_token * $partySize;

        // Create order for hold token
        $result = $this->razorpay->createOrder(
            $amount,
            "Hold token for {$partySize} person(s) - {$experience->title}",
            $user->id,
            'hold_token',
            $request->experience_id
        );

        if (!$result['success']) {
            return response()->json($result, 400);
        }

        // Store pending payment record
        Payment::create([
            'user_id' => $user->id,
            'order_id' => $result['order_id'],
            'payment_id' => null,
            'signature' => null,
            'amount' => $result['amount'],
            'party_size' => $partySize,
            'currency' => $result['currency'],
            'reference_type' => 'hold_token',
            'reference_id' => $request->experience_id,
            'status' => 'pending',
        ]);

        return response()->json($result);
    }

    /**
     * Create a payment order for hold confirmation
     */
    public function holdConfirmOrder(Request $request)
    {
        if (!auth()->check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $request->validate([
            'hold_id' => 'required|exists:holds,id',
        ]);

        $hold = Hold::findOrFail($request->hold_id);
        $user = auth()->user();
        $partySize = $hold->party_size ?? 1;

        // Validate ownership
        if ($hold->user_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Validate hold status
        if ($hold->status !== Hold::STATUS_ACTIVE) {
            return response()->json(['error' => 'This hold is no longer active'], 400);
        }

        if ($hold->hasExpired()) {
            return response()->json(['error' => 'Hold has expired'], 400);
        }

        $experience = $hold->experience;
        $fullPrice = ($experience->instant_price ?? $experience->price) * $partySize;

        // Create order for full experience price (accounting for party_size)
        $result = $this->razorpay->createOrder(
            $fullPrice,
            "Hold confirmation for {$partySize} person(s) - {$experience->title}",
            $user->id,
            'hold_confirmation',
            $hold->id
        );

        if (!$result['success']) {
            return response()->json($result, 400);
        }

        // Store pending payment record
        Payment::create([
            'user_id' => $user->id,
            'order_id' => $result['order_id'],
            'payment_id' => null,
            'signature' => null,
            'amount' => $result['amount'],
            'currency' => $result['currency'],
            'reference_type' => 'hold_confirmation',
            'reference_id' => $hold->id,
            'status' => 'pending',
        ]);

        return response()->json($result);
    }

    /**
     * Verify payment and complete booking/hold
     */
    public function verifyPayment(Request $request)
    {
        if (!auth()->check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $request->validate([
            'razorpay_order_id' => 'required',
            'razorpay_payment_id' => 'required',
            'razorpay_signature' => 'required',
        ]);

        $orderId = $request->razorpay_order_id;
        $paymentId = $request->razorpay_payment_id;
        $signature = $request->razorpay_signature;

        // Verify signature
        if (!$this->razorpay->verifyPayment($orderId, $paymentId, $signature)) {
            return response()->json(['error' => 'Payment verification failed'], 400);
        }

        // Find pending payment
        $payment = Payment::where('order_id', $orderId)
            ->where('user_id', auth()->id())
            ->where('status', 'pending')
            ->firstOrFail();

        return DB::transaction(function () use ($payment, $paymentId, $signature) {
            $user = auth()->user();

            // Update payment record
            $payment->update([
                'payment_id' => $paymentId,
                'signature' => $signature,
                'status' => 'success',
            ]);

            // Handle based on payment type
            if ($payment->reference_type === 'booking_instant') {
                return $this->completeInstantBooking($payment, $user);
            } elseif ($payment->reference_type === 'hold_token') {
                return $this->completeHoldToken($payment, $user);
            } elseif ($payment->reference_type === 'hold_confirmation') {
                return $this->completeHoldConfirmation($payment, $user);
            }

            return response()->json(['error' => 'Invalid payment type'], 400);
        });
    }

    /**
     * Complete instant booking after successful payment
     */
    private function completeInstantBooking($payment, $user)
    {
        $experience = \App\Models\Experience::find($payment->reference_id);
        $partySize = $payment->party_size ?? 1;

        // Check availability (accounting for party_size)
        $bookedSeats = Booking::where('experience_id', $experience->id)
            ->where('status', 'confirmed')
            ->get()
            ->sum('party_size');

        if ($bookedSeats + $partySize > $experience->instant_availability) {
            // Refund payment
            $this->razorpay->refundPayment($payment->payment_id, $payment->amount);
            $payment->update(['status' => 'refunded']);

            return response()->json([
                'error' => 'No seats available',
                'message' => 'Payment refunded. Please try another experience.',
            ], 400);
        }

        // Calculate per-person amount
        $perPersonAmount = $payment->amount / $partySize;

        // Create booking
        $booking = Booking::create([
            'user_id' => $user->id,
            'experience_id' => $experience->id,
            'booking_type' => 'instant',
            'party_size' => $partySize,
            'per_person_amount' => $perPersonAmount,
            'status' => 'confirmed',
            'total_amount' => $payment->amount,
            'paid_amount' => $payment->amount,
            'hold_token_paid' => 0,
            'confirmed_at' => now(),
        ]);

        // Link payment to booking
        $payment->update(['reference_id' => $booking->id]);

        Log::info('Instant booking completed via Razorpay', [
            'booking_id' => $booking->id,
            'user_id' => $user->id,
            'experience_id' => $experience->id,
            'party_size' => $partySize,
            'per_person_amount' => $perPersonAmount,
            'payment_id' => $payment->payment_id,
        ]);

        return response()->json([
            'success' => true,
            'booking_id' => $booking->id,
            'message' => "Booking confirmed for {$partySize} person(s)! Your ticket is ready.",
            'redirect' => route('bookings.show', $booking->id),
        ]);
    }

    /**
     * Complete hold token payment
     */
    private function completeHoldToken($payment, $user)
    {
        $experience = \App\Models\Experience::find($payment->reference_id);
        $partySize = $payment->party_size ?? 1;

        // Check availability (accounting for party_size)
        $activeHoldsCount = Hold::where('experience_id', $experience->id)
            ->where('status', Hold::STATUS_ACTIVE)
            ->where('expires_at', '>', now())
            ->get()
            ->sum('party_size');

        $bookedSeats = Booking::where('experience_id', $experience->id)
            ->where('status', 'confirmed')
            ->get()
            ->sum('party_size');

        $totalClaimedSeats = $activeHoldsCount + $bookedSeats;
        $availableSeats = $experience->capacity - $totalClaimedSeats;

        if ($availableSeats < $partySize) {
            // Refund payment
            $this->razorpay->refundPayment($payment->payment_id, $payment->amount);
            $payment->update(['status' => 'refunded']);

            return response()->json([
                'error' => 'No seats available',
                'message' => 'Payment refunded. You have been added to the waitlist.',
            ], 400);
        }

        // Calculate per-person amount
        $perPersonAmount = $payment->amount / $partySize;

        // Create hold
        $holdDurationMinutes = $experience->hold_duration ?? 30;
        $hold = Hold::create([
            'user_id' => $user->id,
            'experience_id' => $experience->id,
            'expires_at' => now()->addMinutes($holdDurationMinutes),
            'party_size' => $partySize,
            'per_person_amount' => $perPersonAmount,
            'status' => Hold::STATUS_ACTIVE,
            'source' => Hold::SOURCE_DIRECT,
        ]);

        // Link payment to hold
        $payment->update(['reference_id' => $hold->id]);

        Log::info('Hold created via Razorpay payment', [
            'hold_id' => $hold->id,
            'user_id' => $user->id,
            'experience_id' => $experience->id,
            'party_size' => $partySize,
            'per_person_amount' => $perPersonAmount,
            'payment_id' => $payment->payment_id,
        ]);

        return response()->json([
            'success' => true,
            'hold_id' => $hold->id,
            'message' => "Hold created for {$partySize} person(s)! You have {$holdDurationMinutes} minutes to confirm.",
            'redirect' => route('holds.active', $hold->id),
        ]);
    }

    /**
     * Complete hold confirmation payment
     */
    private function completeHoldConfirmation($payment, $user)
    {
        $hold = Hold::findOrFail($payment->reference_id);

        if ($hold->user_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        if ($hold->status !== Hold::STATUS_ACTIVE) {
            return response()->json(['error' => 'Hold is no longer active'], 400);
        }

        if ($hold->hasExpired()) {
            return response()->json(['error' => 'Hold has expired'], 400);
        }

        $experience = $hold->experience;
        $partySize = $hold->party_size ?? 1;
        $perPersonPrice = $experience->instant_price ?? $experience->price;
        $fullPrice = $perPersonPrice * $partySize;
        $tokenAlreadyPaid = $hold->per_person_amount * $partySize;

        // Create booking with party_size and per_person_amount from hold
        $booking = Booking::create([
            'user_id' => $user->id,
            'experience_id' => $experience->id,
            'booking_type' => 'hold_confirmed',
            'party_size' => $partySize,
            'per_person_amount' => $perPersonPrice,
            'status' => 'confirmed',
            'total_amount' => $fullPrice,
            'paid_amount' => $fullPrice,
            'hold_token_paid' => $tokenAlreadyPaid,
            'confirmed_at' => now(),
        ]);

        // Mark hold as confirmed
        $hold->confirm($booking->id);

        // Link payment to booking
        $payment->update(['reference_id' => $booking->id]);

        Log::info('Hold confirmation completed via Razorpay', [
            'hold_id' => $hold->id,
            'booking_id' => $booking->id,
            'user_id' => $user->id,
            'party_size' => $partySize,
            'payment_id' => $payment->payment_id,
        ]);

        return response()->json([
            'success' => true,
            'booking_id' => $booking->id,
            'message' => "Booking confirmed for {$partySize} person(s)! Your ticket is ready.",
            'redirect' => route('bookings.show', $booking->id),
        ]);
    }
}
