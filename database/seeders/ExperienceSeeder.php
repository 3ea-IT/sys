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
                'title' => 'Azure Sky Lounge',
                'location' => 'Downtown District',
                'category' => 'dining',
                'price' => 120,
                'hold_token' => 20,
                'hold_duration' => 30,
                'capacity' => 50,
                'priority_score' => 90,
                'status' => 'active',
                'booking_mode' => 'both',
                'instant_price' => 120,
                'instant_availability' => 30,
            ],
            [
                'title' => 'Temple Darshan Priority Slot',
                'location' => 'Central Temple Complex',
                'category' => 'religious',
                'price' => 10,
                'hold_token' => 2,
                'hold_duration' => 15,
                'capacity' => 100,
                'priority_score' => 80,
                'status' => 'active',
                'booking_mode' => 'both',
                'instant_price' => 10,
                'instant_availability' => 50,
            ],
            [
                'title' => 'Founders Leadership Workshop',
                'location' => 'Innovation Hub',
                'category' => 'knowledge',
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
                'title' => 'Wellness Retreat Entry',
                'location' => 'Green Valley',
                'category' => 'wellness',
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
