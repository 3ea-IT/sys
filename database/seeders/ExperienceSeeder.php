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
                'image' => '1774673608_Untitled design (12).jpg',
                'location' => 'Innovation Hub',
                'category' => 'sports',
                'price' => 75,
                'hold_token' => 15,
                'hold_duration' => 60,
                'capacity' => 30,
                'priority_score' => 85,
                'status' => 'active',
                'approval_status' => 'approved',
                'booking_mode' => 'both',
                'instant_price' => 75,
                'instant_availability' => 20,
            ],
            [
                'title' => 'Music Concert Night',
                'image' => '1772776024_Karaoke-Nights.jpg',
                'location' => 'Green Valley',
                'category' => 'music-shows',
                'price' => 200,
                'hold_token' => 25,
                'hold_duration' => 120,
                'capacity' => 20,
                'priority_score' => 95,
                'status' => 'active',
                'approval_status' => 'approved',
                'booking_mode' => 'both',
                'instant_price' => 200,
                'instant_availability' => 15,
            ],
        ]);
    }
}
