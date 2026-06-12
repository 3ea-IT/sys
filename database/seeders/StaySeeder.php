<?php

namespace Database\Seeders;

use App\Models\Stay;
use Illuminate\Database\Seeder;

class StaySeeder extends Seeder
{
    public function run(): void
    {
        $stays = [
            [
                'temple_id' => 1, // Ram Mandir
                'name' => 'Shri Ram Dharamshala',
                'description' => 'Budget-friendly accommodation near Ram Mandir',
                'price' => 300,
                'image' => 'room-1.jpg',
                'rating' => 4.2,
                'status' => 'active',
            ],
            [
                'temple_id' => 1,
                'name' => 'Hotel Saket Palace',
                'description' => 'Premium hotel with modern amenities',
                'price' => 2500,
                'image' => 'room-3.jpg',
                'rating' => 4.8,
                'status' => 'active',
            ],
            [
                'temple_id' => 2, // Kashi Vishwanath
                'name' => 'Kashi Vishwanath Dharamshala',
                'description' => 'Traditional dharamshala near Kashi temple',
                'price' => 250,
                'image' => 'room-4.jpg',
                'rating' => 4.3,
                'status' => 'active',
            ],
            [
                'temple_id' => 2,
                'name' => 'Ganga View Resort',
                'description' => 'Luxury resort with Ganga river view',
                'price' => 5500,
                'image' => 'room-5.jpg',
                'rating' => 4.8,
                'status' => 'active',
            ],
            [
                'temple_id' => 3, // Tirupati Balaji
                'name' => 'TTD Guest House',
                'description' => 'Government guest house near Tirupati temple',
                'price' => 600,
                'image' => 'room-6.jpg',
                'rating' => 4.3,
                'status' => 'active',
            ],
            [
                'temple_id' => 3,
                'name' => 'Fortune Fences Hotel',
                'description' => 'Premium hotel with excellent service',
                'price' => 4500,
                'image' => 'room-1.jpg',
                'rating' => 4.5,
                'status' => 'active',
            ],
            [
                'temple_id' => 4, // Mahakaleshwar
                'name' => 'Ujjain Heritage Hotel',
                'description' => 'Heritage hotel near Mahakaleshwar temple',
                'price' => 2000,
                'image' => 'room-3.jpg',
                'rating' => 4.4,
                'status' => 'active',
            ],
            [
                'temple_id' => 5, // Vaishno Devi
                'name' => 'Katra Pilgrim Lodge',
                'description' => 'Budget accommodation for Vaishno Devi pilgrims',
                'price' => 400,
                'image' => 'room-4.jpg',
                'rating' => 4.1,
                'status' => 'active',
            ],
        ];

        foreach ($stays as $stay) {
            Stay::create($stay);
        }
    }
}
