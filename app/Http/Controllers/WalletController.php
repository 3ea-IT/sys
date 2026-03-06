<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WalletController extends Controller
{
    /**
     * Display the wallet overview including transactions linked to bookings.
     */
    public function index()
    {
        // Fetch the authenticated user's wallet
        $wallet = auth()->user()->wallet;

        // Fetch all transactions, including those linked to bookings (both instant and hold bookings)
        $transactions = $wallet?->transactions()
            ->with(['booking' => function($query) {
                // Load booking data and check if the booking type is 'instant' or 'hold'
                $query->select('id', 'user_id', 'booking_type', 'status', 'total_amount');
            }])
            ->latest()
            ->get() ?? [];

        // Pass wallet and transaction data to the view
        return Inertia::render('Wallet/Index', [
            'wallet' => $wallet,
            'transactions' => $transactions->map(function ($transaction) {
                return [
                    'id' => $transaction->id,
                    'amount' => $transaction->amount,
                    'type' => $transaction->type,
                    'description' => $transaction->description ?? 'Wallet transaction',
                    'created_at' => $transaction->created_at->diffForHumans(),
                    'booking_id' => $transaction->booking->id ?? null,
                    'booking_type' => $transaction->booking->booking_type ?? null,  // Instant or Hold
                    'booking_status' => $transaction->booking->status ?? null,      // Status of the booking
                    'booking_total_amount' => $transaction->booking->total_amount ?? null, // Total amount of the booking
                ];
            }),
        ]);
    }
}
