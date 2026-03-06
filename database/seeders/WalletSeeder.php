<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Wallet;

class WalletSeeder extends Seeder
{
    public function run()
    {
        $user = User::first() ?? User::factory()->create();

        Wallet::create([
            'user_id' => $user->id,
            'balance' => 250.00,
        ]);
    }
}
