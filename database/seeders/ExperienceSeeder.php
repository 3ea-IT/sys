<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Experience;

class ExperienceSeeder extends Seeder
{
    public function run()
    {
        Experience::insert([
            [
                'title' => 'Sports Tournament Access',
                'location' => 'Innovation Hub',
                'category' => 'sports',
                'price' => 75,
                'hold_token' => 15,
                'hold_duration' => 60,
                'capacity' => 30,
                'priority_score' => 85,
                'status' => 'active',
                'booking_mode' => 'both',
                'instant_price' => 75,
                'instant_availability' => 20,
            ],
            [
                'title' => 'Music Concert Night',
                'location' => 'Green Valley',
                'category' => 'music-shows',
                'price' => 200,
                'hold_token' => 25,
                'hold_duration' => 120,
                'capacity' => 20,
                'priority_score' => 95,
                'status' => 'active',
                'booking_mode' => 'both',
                'instant_price' => 200,
                'instant_availability' => 15,
            ],
        ]);
    }
}
