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
            TeamsTableSeeder::class,
            VenuesTableSeeder::class,
            IplMatchesTableSeeder::class,
            TempleSeeder::class,
            StaySeeder::class,
            TransportSeeder::class,
            ParkingSeeder::class,
            GuideSeeder::class,
            VipSeeder::class,
            FestivalShowSeeder::class,
            AssistanceSeeder::class,
            TourismPackageSeeder::class,
            FlightSeeder::class,
            RestaurantSeeder::class,
            DiningOfferSeeder::class,
            PropertySeeder::class,
            RoomTypeSeeder::class,
        ]);
    }
}
