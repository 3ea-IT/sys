<?php

namespace Database\Seeders;

use App\Models\Parking;
use Illuminate\Database\Seeder;

class ParkingSeeder extends Seeder
{
    public function run(): void
    {
        $parkings = [
            [
                'temple_id' => 1, // Ram Mandir
                'name' => 'Ram Mandir Main Parking',
                'location' => 'NH-27, Near Ram Janmabhoomi Gate, Ayodhya',
                'capacity' => 500,
                'price' => 30,
                'image' => 'park1.jpg',
                'description' => 'Secure and convenient parking facility with modern amenities. Well-maintained parking area with 24/7 security and surveillance.',
                'status' => 'active',
            ],
            [
                'temple_id' => 1,
                'name' => 'Ayodhya Pilgrim Parking Zone',
                'location' => 'Sector 5, Naya Ghat Road, Ayodhya',
                'capacity' => 500,
                'price' => 20,
                'image' => 'park2.jpg',
                'description' => 'Large capacity parking zone dedicated for 4-wheelers with easy entry and exit.',
                'status' => 'active',
            ],
            [
                'temple_id' => 1,
                'name' => 'Two-Wheeler Stand Gate 2',
                'location' => 'Near Gate 2, Ram Path, Ayodhya',
                'capacity' => 200,
                'price' => 10,
                'image' => 'park3.jpg',
                'description' => 'Dedicated two-wheeler parking stand right at Gate 2, very close to main temple.',
                'status' => 'active',
            ],
            [
                'temple_id' => 4, // Mahakaleshwar
                'name' => 'Mahakal Parking Complex',
                'location' => 'Mahakal Lok, Ujjain Bypass Road',
                'capacity' => 400,
                'price' => 25,
                'image' => 'park4.jpg',
                'description' => 'Premium parking complex with state-of-the-art facilities and climate control.',
                'status' => 'active',
            ],
            [
                'temple_id' => 5, // Vaishno Devi
                'name' => 'Vaishno Devi Base Camp Parking',
                'location' => 'Katra Bus Stand Area, Jammu',
                'capacity' => 200,
                'price' => 40,
                'image' => 'park5.jpg',
                'description' => 'Convenient parking facility at the base camp for Vaishno Devi pilgrims.',
                'status' => 'active',
            ],
            [
                'temple_id' => 5,
                'name' => 'Katra Bike Stand',
                'location' => 'Near Banganga Chowk, Katra',
                'capacity' => 150,
                'price' => 15,
                'image' => 'park6.jpg',
                'description' => 'Dedicated bike parking stand with security and CCTV coverage.',
                'status' => 'active',
            ],
        ];

        foreach ($parkings as $parking) {
            Parking::create($parking);
        }
    }
}
