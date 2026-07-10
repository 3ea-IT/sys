<?php

namespace App\Http\Controllers\Admin\Properties;

use App\Http\Controllers\Controller;
use App\Models\PropertyBooking;
use App\Models\WalletTransaction;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PropertyBookingController extends Controller
{
    public function index()
    {
        $status = request()->query('status', 'all');
        $search = request()->query('search', '');

        $query = PropertyBooking::with(['user', 'roomType.property']);

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('booking_reference', 'like', "%{$search}%")
                    ->orWhereHas('user', fn ($u) => $u->where('name', 'like', "%{$search}%"));
            });
        }

        $bookings = $query->latest()->paginate(15)->through(fn ($b) => [
            'id' => $b->id,
            'booking_reference' => $b->booking_reference,
            'customer_name' => $b->user->name ?? 'N/A',
            'property_name' => $b->roomType->property->name ?? 'N/A',
            'room_name' => $b->roomType->name ?? 'N/A',
            'check_in' => $b->check_in->format('M d, Y'),
            'check_out' => $b->check_out->format('M d, Y'),
            'total_amount' => (float) $b->total_amount,
            'status' => $b->status,
        ]);

        return Inertia::render('Admin/Properties/Bookings/Index', [
            'bookings' => $bookings,
            'search' => $search,
            'status' => $status,
        ]);
    }

    public function show(PropertyBooking $propertyBooking)
    {
        $propertyBooking->load(['user', 'roomType.property']);

        return Inertia::render('Admin/Properties/Bookings/Show', [
            'booking' => [
                'id' => $propertyBooking->id,
                'booking_reference' => $propertyBooking->booking_reference,
                'status' => $propertyBooking->status,
                'guest_count' => $propertyBooking->guest_count,
                'check_in' => $propertyBooking->check_in->format('M d, Y'),
                'check_out' => $propertyBooking->check_out->format('M d, Y'),
                'amount_per_night' => (float) $propertyBooking->amount_per_night,
                'total_amount' => (float) $propertyBooking->total_amount,
                'created_at' => $propertyBooking->created_at->format('M d, Y h:i A'),
                'customer_name' => $propertyBooking->user->name ?? 'N/A',
                'customer_email' => $propertyBooking->user->email ?? 'N/A',
                'property_name' => $propertyBooking->roomType->property->name ?? 'N/A',
                'property_location' => $propertyBooking->roomType->property->location ?? 'N/A',
                'room_name' => $propertyBooking->roomType->name ?? 'N/A',
            ],
        ]);
    }

    /**
     * Admin cancellation on the customer's behalf — refunds the wallet the same way self-service cancel does.
     */
    public function updateStatus(PropertyBooking $propertyBooking)
    {
        $status = request()->validate([
            'status' => 'required|in:confirmed,cancelled',
        ])['status'];

        if ($status === $propertyBooking->status) {
            return back()->with('error', 'Booking is already in that status.');
        }

        if ($status === 'cancelled') {
            DB::transaction(function () use ($propertyBooking) {
                $wallet = $propertyBooking->user->wallet;

                if ($wallet) {
                    $wallet->increment('balance', $propertyBooking->total_amount);

                    WalletTransaction::create([
                        'wallet_id' => $wallet->id,
                        'amount' => $propertyBooking->total_amount,
                        'type' => 'credit',
                        'description' => "Accommodation booking cancelled by admin #{$propertyBooking->id}",
                    ]);
                }

                $propertyBooking->update(['status' => 'cancelled']);
            });

            return back()->with('success', 'Booking cancelled and refunded.');
        }

        // Reinstating a cancelled booking re-charges the wallet to reverse the earlier refund.
        return DB::transaction(function () use ($propertyBooking) {
            $wallet = $propertyBooking->user->wallet;

            if (!$wallet || $wallet->balance < $propertyBooking->total_amount) {
                return back()->with('error', "Customer's wallet balance is too low to reinstate this booking.");
            }

            $wallet->decrement('balance', $propertyBooking->total_amount);

            WalletTransaction::create([
                'wallet_id' => $wallet->id,
                'amount' => $propertyBooking->total_amount,
                'type' => 'debit',
                'description' => "Accommodation booking reinstated by admin #{$propertyBooking->id}",
            ]);

            $propertyBooking->update(['status' => 'confirmed']);

            return back()->with('success', 'Booking reinstated.');
        });
    }
}
