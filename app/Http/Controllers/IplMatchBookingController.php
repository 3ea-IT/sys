<?php

namespace App\Http\Controllers;

use App\Models\IplMatch;
use App\Models\IplMatchBooking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IplMatchBookingController extends Controller
{
    public function createRazorpayOrder(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $validated = $request->validate([
            'ipl_match_id' => 'required|exists:ipl_matches,id',
            'quantity' => 'required|integer|min:1|max:10',
            'amount_per_ticket' => 'required|numeric|min:1',
            'seat_numbers' => 'required|array|min:1',
            'seat_numbers.*' => 'required|string',
        ]);

        $match = IplMatch::findOrFail($validated['ipl_match_id']);
        $ticketPrice = $validated['amount_per_ticket'];
        $totalAmount = $ticketPrice * $validated['quantity'];

        // Create pending booking record so we can attach order IDs
        $existingBooking = IplMatchBooking::where('user_id', $user->id)
            ->where('ipl_match_id', $match->id)
            ->where('status', '!=', 'cancelled')
            ->first();

        if ($existingBooking) {
            return response()->json(['error' => 'You already have a booking for this match'], 400);
        }

        $booking = IplMatchBooking::create([
            'user_id' => $user->id,
            'ipl_match_id' => $match->id,
            'quantity' => $validated['quantity'],
            'seat_numbers' => $validated['seat_numbers'],
            'total_amount' => $totalAmount,
            'amount_per_ticket' => $ticketPrice,
            'status' => 'pending',
            'payment_status' => 'pending',
        ]);

        try {
            $razorpay = new \Razorpay\Api\Api(
                config('services.razorpay.key'),
                config('services.razorpay.secret')
            );

            $order = $razorpay->order->create([
                'amount' => $totalAmount * 100,
                'currency' => 'INR',
                'receipt' => 'ipl_booking_' . $booking->id,
                'notes' => [
                    'user_id' => $user->id,
                    'ipl_match_id' => $match->id,
                    'booking_id' => $booking->id,
                    'quantity' => $validated['quantity'],
                    'seat_numbers' => json_encode($validated['seat_numbers']),
                ],
            ]);

            $booking->update([
                'razorpay_order_id' => $order->id,
                'payment_details' => ['order_data' => $order],
            ]);

            return response()->json([
                'success' => true,
                'orderId' => $order->id,
                'amount' => $totalAmount,
                'currency' => 'INR',
                'booking_id' => $booking->id,
            ]);
        } catch (\Exception $e) {
            $booking->delete();
            return response()->json(['error' => 'Failed to create payment order.'], 500);
        }
    }

    public function verifyAndCreateBooking(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $validated = $request->validate([
            'razorpay_order_id' => 'required|string',
            'razorpay_payment_id' => 'required|string',
            'razorpay_signature' => 'required|string',
            'booking_id' => 'required|integer|exists:ipl_match_bookings,id',
        ]);

        $booking = IplMatchBooking::findOrFail($validated['booking_id']);
        if ($booking->user_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        if ($booking->razorpay_order_id && $booking->razorpay_order_id !== $validated['razorpay_order_id']) {
            return response()->json(['error' => 'Order ID mismatch'], 400);
        }

        if ($booking->payment_status === 'success') {
            return response()->json(['success' => true, 'message' => 'Booking already completed.']);
        }

        $razorpay = new \Razorpay\Api\Api(
            config('services.razorpay.key'),
            config('services.razorpay.secret')
        );

        try {
            $attributes = [
                'razorpay_order_id' => $validated['razorpay_order_id'],
                'razorpay_payment_id' => $validated['razorpay_payment_id'],
                'razorpay_signature' => $validated['razorpay_signature'],
            ];

            $razorpay->utility->verifyPaymentSignature($attributes);
        } catch (\Exception $e) {
            $booking->update(['payment_status' => 'failed']);
            return response()->json(['error' => 'Payment verification failed: ' . $e->getMessage()], 400);
        }

        $booking->update([
            'status' => 'completed',
            'payment_status' => 'success',
            'razorpay_payment_id' => $validated['razorpay_payment_id'],
            'razorpay_signature' => $validated['razorpay_signature'],
            'payment_details' => array_merge($booking->payment_details ?? [], [
                'verified_at' => now()->toDateTimeString(),
            ]),
        ]);

        return response()->json([
            'success' => true,
            'booking_id' => $booking->id,
            'message' => 'Payment successful. Booking confirmed.',
        ]);
    }

    public function showBookingConfirmation(IplMatchBooking $booking)
    {
        $user = Auth::user();
        if (!$user || $booking->user_id !== $user->id) {
            return redirect('/login');
        }

        $booking->load(['iplMatch.team1', 'iplMatch.team2', 'iplMatch.venue']);

        return inertia('Ipl/MatchBookingConfirmation', [
            'booking' => [
                'id' => $booking->id,
                'booking_reference' => $booking->booking_reference,
                'quantity' => $booking->quantity,
                'seat_numbers' => $booking->seat_numbers,
                'total_amount' => $booking->total_amount,
                'amount_per_ticket' => $booking->amount_per_ticket,
                'status' => $booking->status,
                'created_at' => $booking->created_at->format('M d, Y h:i A'),
                'payment_status' => $booking->payment_status,
            ],
            'match' => [
                'id' => $booking->iplMatch->id,
                'team1' => [
                    'id' => $booking->iplMatch->team1->id,
                    'name' => $booking->iplMatch->team1->name,
                    'logo' => $booking->iplMatch->team1->logo ?? null,
                ],
                'team2' => [
                    'id' => $booking->iplMatch->team2->id,
                    'name' => $booking->iplMatch->team2->name,
                    'logo' => $booking->iplMatch->team2->logo ?? null,
                ],
                'venue' => [
                    'name' => $booking->iplMatch->venue->name ?? $booking->iplMatch->location,
                    'city' => $booking->iplMatch->venue->city ?? null,
                ],
                'match_date' => $booking->iplMatch->match_date,
                'match_time' => $booking->iplMatch->match_time,
            ],
        ]);
    }
}
