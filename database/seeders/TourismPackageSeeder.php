<?php

namespace Database\Seeders;

use App\Models\TourismPackage;
use Illuminate\Database\Seeder;

class TourismPackageSeeder extends Seeder
{
    public function run(): void
    {
        $packages = [
            [
                'name' => 'Rishikesh Yoga & Ganga Aarti Retreat',
                'location' => 'Rishikesh, Uttarakhand',
                'image' => 'Kashi-temple-copy.jpg',
                'price' => 4999,
                'duration' => '3 Days / 2 Nights',
                'rating' => 4.7,
                'description' => 'A peaceful spiritual retreat combining daily yoga and meditation sessions with the mesmerizing evening Ganga Aarti at Triveni Ghat.',
                'itinerary' => [
                    'Arrival in Rishikesh, evening Ganga Aarti at Triveni Ghat',
                    'Sunrise yoga session, visit Laxman Jhula and Ram Jhula, ashram meditation',
                    'Morning meditation, Neelkanth Mahadev temple visit, departure',
                ],
                'capacity' => 20,
                'available_slots' => 20,
                'status' => 'active',
            ],
            [
                'name' => 'Char Dham Yatra Package',
                'location' => 'Uttarakhand',
                'image' => null,
                'price' => 15999,
                'duration' => '7 Days / 6 Nights',
                'rating' => 4.8,
                'description' => 'Complete pilgrimage covering the four sacred shrines — Yamunotri, Gangotri, Kedarnath, and Badrinath — with comfortable stays and guided darshan.',
                'itinerary' => [
                    'Arrival in Haridwar, briefing and rest',
                    'Drive to Yamunotri, darshan and return',
                    'Travel to Gangotri, evening aarti',
                    'Trek to Kedarnath, darshan',
                    'Travel to Badrinath',
                    'Badrinath darshan, Mana village visit',
                    'Return journey to Haridwar',
                ],
                'capacity' => 15,
                'available_slots' => 15,
                'status' => 'active',
            ],
            [
                'name' => 'Puri Jagannath Spiritual Tour',
                'location' => 'Puri, Odisha',
                'image' => 'Jagannath-Puri.jpg',
                'price' => 6499,
                'duration' => '4 Days / 3 Nights',
                'rating' => 4.6,
                'description' => 'Experience the divine energy of Jagannath Puri with temple darshan, beach visits, and traditional Odia cuisine.',
                'itinerary' => [
                    'Arrival, evening at Puri beach',
                    'Jagannath Temple darshan, Gundicha Temple visit',
                    'Konark Sun Temple excursion',
                    'Local market visit, departure',
                ],
                'capacity' => 25,
                'available_slots' => 25,
                'status' => 'active',
            ],
            [
                'name' => 'Shirdi Sai Baba Darshan Trip',
                'location' => 'Shirdi, Maharashtra',
                'image' => 'sai-baba.jpg',
                'price' => 3499,
                'duration' => '2 Days / 1 Night',
                'rating' => 4.5,
                'description' => 'A short and serene pilgrimage to Shirdi for Sai Baba darshan, including visits to Dwarkamai and Chavadi.',
                'itinerary' => [
                    'Arrival, Sai Baba Samadhi Mandir darshan, evening aarti',
                    'Dwarkamai and Chavadi visit, departure',
                ],
                'capacity' => 30,
                'available_slots' => 30,
                'status' => 'active',
            ],
            [
                'name' => 'Amarnath Yatra Package',
                'location' => 'Jammu & Kashmir',
                'image' => null,
                'price' => 22999,
                'duration' => '6 Days / 5 Nights',
                'rating' => 4.9,
                'description' => 'Guided trek to the holy Amarnath cave shrine with medical support, porter assistance, and camp accommodation en route.',
                'itinerary' => [
                    'Arrival in Jammu, transfer to Pahalgam',
                    'Trek to Chandanwari and Sheshnag',
                    'Trek to Panchtarni',
                    'Amarnath cave darshan, return to Panchtarni',
                    'Trek back to Pahalgam',
                    'Return to Jammu',
                ],
                'capacity' => 10,
                'available_slots' => 10,
                'status' => 'active',
            ],
        ];

        foreach ($packages as $package) {
            TourismPackage::create($package);
        }
    }
}
