<?php

namespace Database\Seeders;

use App\Models\Transport;
use Illuminate\Database\Seeder;

class TransportSeeder extends Seeder
{
    public function run(): void
    {
        $transports = [
            [
                'temple_id' => 1, // Ram Mandir
                'name' => 'Ram Mandir Express Shuttle',
                'type' => 'Bus',
                'description' => 'Direct shuttle from Ayodhya Railway Station to Ram Mandir',
                'image' => 'bus-1.jpg',
                'price' => 30,
                'status' => 'active',
            ],
            [
                'temple_id' => 1,
                'name' => 'Ayodhya City Auto',
                'type' => 'Auto',
                'description' => 'On-demand auto rickshaw service',
                'image' => 'bus-2.jpg',
                'price' => 50,
                'status' => 'active',
            ],
            [
                'temple_id' => 2, // Kashi Vishwanath
                'name' => 'Varanasi Ghat Auto Service',
                'type' => 'Auto',
                'description' => 'Auto service from Varanasi Station to Kashi temple',
                'image' => 'bus-3.jpg',
                'price' => 80,
                'status' => 'active',
            ],
            [
                'temple_id' => 3, // Tirupati Balaji
                'name' => 'Tirupati Premium Taxi',
                'type' => 'Taxi',
                'description' => 'Premium taxi service with AC and GPS tracking',
                'image' => 'bus-4.jpg',
                'price' => 450,
                'status' => 'active',
            ],
            [
                'temple_id' => 3,
                'name' => 'Tirupati Hilltop AC Bus',
                'type' => 'Bus',
                'description' => 'Frequent AC bus service to Tirumala',
                'image' => 'bus-5.jpg',
                'price' => 75,
                'status' => 'active',
            ],
            [
                'temple_id' => 4, // Mahakaleshwar
                'name' => 'Ujjain City Bus',
                'type' => 'Bus',
                'description' => 'City bus service to Mahakaleshwar temple',
                'image' => 'bus-6.jpg',
                'price' => 15,
                'status' => 'active',
            ],
            [
                'temple_id' => 5, // Vaishno Devi
                'name' => 'Katra Helicopter Shuttle',
                'type' => 'Taxi',
                'description' => 'Emergency taxi service for pilgrims',
                'image' => 'bus-7.jpg',
                'price' => 1800,
                'status' => 'active',
            ],
        ];

        foreach ($transports as $transport) {
            Transport::create($transport);
        }
    }
}
