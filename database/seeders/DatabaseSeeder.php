<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run()
    {
        $this->call([
            WalletSeeder::class,
            ExperienceSeeder::class,
            HoldSeeder::class,
            WalletTransactionSeeder::class,
            CinemaSeeder::class,
        ]);
    }
}
