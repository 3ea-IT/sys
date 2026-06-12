<?php

namespace Database\Seeders;

use App\Models\Assistance;
use Illuminate\Database\Seeder;

class AssistanceSeeder extends Seeder
{
    public function run(): void
    {
        $assistances = [
            [
                'temple_id' => 1, // Ram Mandir
                'name' => 'First Aid Station',
                'type' => 'Medical',
                'description' => 'Emergency medical assistance and basic first aid services available 24/7.',
                'image' => 'p1.jpg',
                'price' => 100,
                'availability' => '24/7',
                'status' => 'active',
            ],
            [
                'temple_id' => 1,
                'name' => 'Temple Security',
                'type' => 'Security',
                'description' => 'Professional security personnel for crowd management and assistance.',
                'image' => 'p2.png',
                'price' => 50,
                'availability' => '24/7',
                'status' => 'active',
            ],
            [
                'temple_id' => 1,
                'name' => 'Information Counter',
                'type' => 'Information',
                'description' => 'Comprehensive information about temple, rituals, and facilities.',
                'image' => 'p3.png',
                'price' => 0,
                'availability' => '6 AM - 10 PM',
                'status' => 'active',
            ],
            [
                'temple_id' => 2, // Kashi Vishwanath
                'name' => 'Wheelchair Service',
                'type' => 'Wheelchair',
                'description' => 'Wheelchair rental and assistance for elderly and disabled pilgrims.',
                'image' => 'p4.png',
                'price' => 200,
                'availability' => '24/7',
                'status' => 'active',
            ],
            [
                'temple_id' => 2,
                'name' => 'Medical Camp',
                'type' => 'Medical',
                'description' => 'Full medical facility with doctors and emergency services.',
                'image' => 'p-5.jpg',
                'price' => 300,
                'availability' => '24/7',
                'status' => 'active',
            ],
            [
                'temple_id' => 3, // Tirupati Balaji
                'name' => 'Lost & Found Counter',
                'type' => 'Lost & Found',
                'description' => 'Dedicated counter for lost and found items at the temple.',
                'image' => 'p-6.jpg',
                'price' => 50,
                'availability' => '7 AM - 9 PM',
                'status' => 'active',
            ],
            [
                'temple_id' => 3,
                'name' => 'Child Care Center',
                'type' => 'Other',
                'description' => 'Safe childcare facility while you complete your darshan.',
                'image' => 'p1.jpg',
                'price' => 150,
                'availability' => '6 AM - 8 PM',
                'status' => 'active',
            ],
            [
                'temple_id' => 4, // Mahakaleshwar
                'name' => 'Elderly Assistance',
                'type' => 'Wheelchair',
                'description' => 'Special assistance program for elderly pilgrims with porter and guide.',
                'image' => 'p2.png',
                'price' => 250,
                'availability' => '24/7',
                'status' => 'active',
            ],
            [
                'temple_id' => 5, // Vaishno Devi
                'name' => 'Mountain Guide Service',
                'type' => 'Information',
                'description' => 'Professional guides for safe navigation on mountain paths.',
                'image' => 'p3.png',
                'price' => 400,
                'availability' => '6 AM - 6 PM',
                'status' => 'active',
            ],
            [
                'temple_id' => 5,
                'name' => 'Emergency Medical Team',
                'type' => 'Medical',
                'description' => 'Equipped medical team available along the pilgrimage route.',
                'image' => 'p4.png',
                'price' => 500,
                'availability' => '24/7',
                'status' => 'active',
            ],
        ];

        foreach ($assistances as $assistance) {
            Assistance::create($assistance);
        }
    }
}
