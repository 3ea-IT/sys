<?php

namespace Database\Seeders;

use App\Models\Flight;
use Illuminate\Database\Seeder;

class FlightSeeder extends Seeder
{
    public function run(): void
    {
        $flights = [
            [
                'airline' => 'IndiGo',
                'flight_number' => '6E-2134',
                'origin' => 'Delhi (DEL)',
                'destination' => 'Mumbai (BOM)',
                'departure_time' => now()->addDays(3)->setTime(9, 30),
                'arrival_time' => now()->addDays(3)->setTime(11, 45),
                'duration_minutes' => 135,
                'seat_class' => 'economy',
                'price' => 4500,
                'capacity' => 180,
                'seats_available' => 180,
                'status' => 'active',
            ],
            [
                'airline' => 'Air India',
                'flight_number' => 'AI-865',
                'origin' => 'Mumbai (BOM)',
                'destination' => 'Bengaluru (BLR)',
                'departure_time' => now()->addDays(2)->setTime(14, 0),
                'arrival_time' => now()->addDays(2)->setTime(15, 35),
                'duration_minutes' => 95,
                'seat_class' => 'economy',
                'price' => 3800,
                'capacity' => 150,
                'seats_available' => 150,
                'status' => 'active',
            ],
            [
                'airline' => 'Vistara',
                'flight_number' => 'UK-955',
                'origin' => 'Delhi (DEL)',
                'destination' => 'Bengaluru (BLR)',
                'departure_time' => now()->addDays(5)->setTime(7, 15),
                'arrival_time' => now()->addDays(5)->setTime(9, 55),
                'duration_minutes' => 160,
                'seat_class' => 'business',
                'price' => 12500,
                'capacity' => 40,
                'seats_available' => 40,
                'status' => 'active',
            ],
            [
                'airline' => 'SpiceJet',
                'flight_number' => 'SG-8169',
                'origin' => 'Chennai (MAA)',
                'destination' => 'Delhi (DEL)',
                'departure_time' => now()->addDays(4)->setTime(18, 20),
                'arrival_time' => now()->addDays(4)->setTime(21, 5),
                'duration_minutes' => 165,
                'seat_class' => 'economy',
                'price' => 5200,
                'capacity' => 160,
                'seats_available' => 160,
                'status' => 'active',
            ],
            [
                'airline' => 'IndiGo',
                'flight_number' => '6E-6202',
                'origin' => 'Kolkata (CCU)',
                'destination' => 'Mumbai (BOM)',
                'departure_time' => now()->addDays(6)->setTime(11, 45),
                'arrival_time' => now()->addDays(6)->setTime(14, 20),
                'duration_minutes' => 155,
                'seat_class' => 'economy',
                'price' => 6100,
                'capacity' => 180,
                'seats_available' => 180,
                'status' => 'active',
            ],
            [
                'airline' => 'Air India',
                'flight_number' => 'AI-440',
                'origin' => 'Bengaluru (BLR)',
                'destination' => 'Hyderabad (HYD)',
                'departure_time' => now()->addDays(1)->setTime(20, 0),
                'arrival_time' => now()->addDays(1)->setTime(21, 10),
                'duration_minutes' => 70,
                'seat_class' => 'economy',
                'price' => 2900,
                'capacity' => 140,
                'seats_available' => 140,
                'status' => 'active',
            ],
        ];

        foreach ($flights as $flight) {
            Flight::create($flight);
        }
    }
}
