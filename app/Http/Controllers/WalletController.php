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
        $user = auth()->user();
        $wallet = $user->wallet()->firstOrCreate(
            ['user_id' => $user->id],
            ['balance' => 0.00]
        );

        $transactions = $this->mappedTransactions($wallet)->take(5)->values();

        return Inertia::render('Wallet/Index', [
            'wallet' => $this->walletProp($wallet),
            'transactions' => $transactions,
        ]);
    }

    /**
     * Full wallet transaction history / logs page.
     */
    public function transactions()
    {
        $user = auth()->user();
        $wallet = $user->wallet()->firstOrCreate(
            ['user_id' => $user->id],
            ['balance' => 0.00]
        );

        return Inertia::render('Wallet/Transactions', [
            'wallet' => $this->walletProp($wallet),
            'transactions' => $this->mappedTransactions($wallet)->values(),
        ]);
    }

    private function walletProp(Wallet $wallet): array
    {
        return [
            'id' => $wallet->id,
            'user_id' => $wallet->user_id,
            'balance' => (float) $wallet->balance,
        ];
    }

    private function mappedTransactions(Wallet $wallet)
    {
        return $wallet->transactions()
            ->with(['booking' => function ($query) {
                $query->select('id', 'user_id', 'booking_type', 'status', 'total_amount');
            }])
            ->latest()
            ->get()
            ->map(function ($transaction) {
                return [
                    'id' => $transaction->id,
                    'amount' => (float) $transaction->amount,
                    'type' => $transaction->type,
                    'description' => $transaction->description ?? 'Wallet transaction',
                    'created_at' => $transaction->created_at->diffForHumans(),
                    'date' => $transaction->created_at->toISOString(),
                    'booking_id' => $transaction->booking->id ?? null,
                    'booking_type' => $transaction->booking->booking_type ?? null,
                    'booking_status' => $transaction->booking->status ?? null,
                    'booking_total_amount' => $transaction->booking->total_amount ?? null,
                ];
            });
    }
}
