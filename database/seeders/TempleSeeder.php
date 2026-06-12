<?php

namespace Database\Seeders;

use App\Models\Temple;
use Illuminate\Database\Seeder;

class TempleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $temples = [
            [
                'name' => 'Kashi Vishwanath',
                'location' => 'Varanasi, Uttar Pradesh',
                'image' => '/banner/Kashi-temple-1.jpg',
                'rating' => 4.9,
                'crowd_level' => 'Moderate',
                'has_vip_darshan' => true,
                'instant_price' => 100,
                'hold_token' => 50,
                'description' => 'One of the holiest temples in Hinduism, dedicated to Lord Shiva. Located on the banks of the Ganges River, it is believed that Lord Shiva performs the final ritual of moksha for those who die here.',
                'amenities' => [
                    'Darshan Available',
                    'Special Pooja Services',
                    'Temple Store',
                    'Prasad Distribution',
                ],
                'timings' => [
                    [
                        'name' => 'Morning Aarti',
                        'time' => '05:00 - 06:00',
                        'type' => 'Regular'
                    ],
                    [
                        'name' => 'Evening Aarti',
                        'time' => '19:00 - 20:00',
                        'type' => 'Regular'
                    ],
                    [
                        'name' => 'Night Aarti',
                        'time' => '21:30 - 22:30',
                        'type' => 'Regular'
                    ],
                ],
                'facilities' => [
                    'Parking',
                    'Restrooms',
                    'Food Courts',
                    'Accommodation',
                    'Lost & Found',
                ],
                'status' => 'active',
            ],
            [
                'name' => 'Ram Mandir',
                'location' => 'Ayodhya, Uttar Pradesh',
                'image' => '/banner/Ram_Mandir.jpg',
                'rating' => 4.8,
                'crowd_level' => 'High',
                'has_vip_darshan' => true,
                'instant_price' => 150,
                'hold_token' => 75,
                'description' => 'The newly constructed Ram Mandir is one of the most significant temples in India, dedicated to Lord Rama. This grand structure showcases exquisite architecture and is a pilgrimage destination for millions.',
                'amenities' => [
                    'Darshan Available',
                    'Guided Tours',
                    'Temple Store',
                    'Prasad Distribution',
                ],
                'timings' => [
                    [
                        'name' => 'Morning Aarti',
                        'time' => '06:00 - 07:00',
                        'type' => 'Regular'
                    ],
                    [
                        'name' => 'Evening Aarti',
                        'time' => '18:00 - 19:00',
                        'type' => 'Regular'
                    ],
                ],
                'facilities' => [
                    'Parking',
                    'Restrooms',
                    'Food Courts',
                    'Accommodation',
                    'Wheelchair Access',
                ],
                'status' => 'active',
            ],
            [
                'name' => 'Tirupati Balaji',
                'location' => 'Tirupati, Andhra Pradesh',
                'image' => '/banner/tirupati-balaji.jpg',
                'rating' => 4.7,
                'crowd_level' => 'High',
                'has_vip_darshan' => true,
                'instant_price' => 200,
                'hold_token' => 100,
                'description' => 'One of the richest temples in the world, Tirupati Balaji is dedicated to Lord Venkateswara. It attracts millions of pilgrims annually and is known for its elaborate rituals and spiritual significance.',
                'amenities' => [
                    'Darshan Available',
                    'VIP Darshan',
                    'Special Pooja Services',
                    'Temple Store',
                    'Prasad Distribution',
                ],
                'timings' => [
                    [
                        'name' => 'Morning Darshan',
                        'time' => '06:00 - 09:00',
                        'type' => 'Regular'
                    ],
                    [
                        'name' => 'Afternoon Darshan',
                        'time' => '12:00 - 16:00',
                        'type' => 'Regular'
                    ],
                    [
                        'name' => 'Evening Darshan',
                        'time' => '17:00 - 21:00',
                        'type' => 'Regular'
                    ],
                ],
                'facilities' => [
                    'Parking',
                    'Restrooms',
                    'Food Courts',
                    'Accommodation',
                    'Lost & Found',
                    'Wheelchair Access',
                ],
                'status' => 'active',
            ],
            [
                'name' => 'Mahakaleswar Jyotirling',
                'location' => 'Ujjain, Madhya Pradesh',
                'image' => '/banner/mahakaleshwar.jpg',
                'rating' => 4.6,
                'crowd_level' => 'Moderate',
                'has_vip_darshan' => false,
                'instant_price' => 80,
                'hold_token' => 40,
                'description' => 'Mahakaleswar Jyotirling is one of the 12 sacred Jyotirlinga temples dedicated to Lord Shiva. The temple has been a major pilgrimage center for centuries and holds immense spiritual significance.',
                'amenities' => [
                    'Darshan Available',
                    'Special Pooja Services',
                    'Temple Store',
                    'Prasad Distribution',
                ],
                'timings' => [
                    [
                        'name' => 'Morning Aarti',
                        'time' => '04:00 - 05:00',
                        'type' => 'Regular'
                    ],
                    [
                        'name' => 'Evening Aarti',
                        'time' => '20:00 - 21:00',
                        'type' => 'Regular'
                    ],
                ],
                'facilities' => [
                    'Parking',
                    'Restrooms',
                    'Food Courts',
                    'Lost & Found',
                ],
                'status' => 'active',
            ],
            [
                'name' => 'Vaishno Devi',
                'location' => 'Katra, Jammu & Kashmir',
                'image' => '/banner/vaishano-devi-1.png',
                'rating' => 4.8,
                'crowd_level' => 'Low',
                'has_vip_darshan' => true,
                'instant_price' => 120,
                'hold_token' => 60,
                'description' => 'Vaishno Devi shrine is one of the most visited pilgrimage sites in India, dedicated to Goddess Vaishno Devi. The temple is located in a cave and is accessible through a scenic trekking route.',
                'amenities' => [
                    'Darshan Available',
                    'Guided Tours',
                    'Temple Store',
                    'Prasad Distribution',
                ],
                'timings' => [
                    [
                        'name' => 'Morning Darshan',
                        'time' => '06:00 - 12:00',
                        'type' => 'Regular'
                    ],
                    [
                        'name' => 'Evening Darshan',
                        'time' => '14:00 - 21:00',
                        'type' => 'Regular'
                    ],
                ],
                'facilities' => [
                    'Parking',
                    'Restrooms',
                    'Food Courts',
                    'Accommodation',
                    'Lost & Found',
                    'First Aid',
                ],
                'status' => 'active',
            ],
        ];

        foreach ($temples as $temple) {
            Temple::create($temple);
        }
    }
}
