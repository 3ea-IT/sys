<?php

namespace Database\Seeders;

use App\Models\FestivalShow;
use Illuminate\Database\Seeder;

class FestivalShowSeeder extends Seeder
{
    public function run(): void
    {
        $festivalShows = [
            [
                'temple_id' => 1, // Ram Mandir
                'name' => 'Rama Navami Celebration',
                'description' => 'Grand celebration of Lord Rama\'s birthday with special prayers and performances.',
                'image' => 'festival-1.jpeg',
                'date' => '2026-04-14',
                'time' => '06:00',
                'price' => 100,
                'capacity' => 5000,
                'status' => 'active',
            ],
            [
                'temple_id' => 1,
                'name' => 'Diwali Grand Celebration',
                'description' => 'Festival of lights with special aarti and cultural performances.',
                'image' => 'festival-2.webp',
                'date' => '2026-11-01',
                'time' => '18:00',
                'price' => 150,
                'capacity' => 8000,
                'status' => 'active',
            ],
            [
                'temple_id' => 2, // Kashi Vishwanath
                'name' => 'Maha Shivaratri Vigil',
                'description' => 'All-night vigil and special rituals dedicated to Lord Shiva.',
                'image' => 'festival-3.jpg',
                'date' => '2026-03-08',
                'time' => '20:00',
                'price' => 200,
                'capacity' => 3000,
                'status' => 'active',
            ],
            [
                'temple_id' => 2,
                'name' => 'Ganga Aarti Evening Show',
                'description' => 'Daily evening aarti at Kashi Vishwanath with sacred Ganga rituals.',
                'image' => 'festival-1.jpeg',
                'date' => '2026-07-15',
                'time' => '19:00',
                'price' => 50,
                'capacity' => 2000,
                'status' => 'active',
            ],
            [
                'temple_id' => 3, // Tirupati Balaji
                'name' => 'Vaikunta Ekadasi Festival',
                'description' => 'The most important festival at Tirupati with massive celebrations.',
                'image' => 'festival-2.webp',
                'date' => '2026-12-31',
                'time' => '05:00',
                'price' => 250,
                'capacity' => 15000,
                'status' => 'active',
            ],
            [
                'temple_id' => 4, // Mahakaleshwar
                'name' => 'Ujjain Kumbh Mela',
                'description' => 'Grand gathering for spiritual rituals and sacred bathing.',
                'image' => 'festival-3.jpg',
                'date' => '2026-05-20',
                'time' => '06:00',
                'price' => 180,
                'capacity' => 10000,
                'status' => 'active',
            ],
            [
                'temple_id' => 5, // Vaishno Devi
                'name' => 'Navratra Festival Show',
                'description' => 'Nine-day festival with special prayers and cultural performances.',
                'image' => 'festival-1.jpeg',
                'date' => '2026-09-25',
                'time' => '17:00',
                'price' => 120,
                'capacity' => 4000,
                'status' => 'active',
            ],
        ];

        foreach ($festivalShows as $show) {
            FestivalShow::create($show);
        }
    }
}
