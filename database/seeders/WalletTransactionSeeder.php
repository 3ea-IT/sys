<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Wallet;
use App\Models\WalletTransaction;

class WalletTransactionSeeder extends Seeder
{
    public function run()
    {
        $wallet = Wallet::first();

        WalletTransaction::insert([
            [
                'wallet_id' => $wallet->id,
                'amount' => -20,
                'type' => 'debit',
                'description' => 'Hold token – Azure Sky Lounge',
            ],
            [
                'wallet_id' => $wallet->id,
                'amount' => 50,
                'type' => 'credit',
                'description' => 'Wallet top-up',
            ],
        ]);
    }
}
