<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class ParkingController extends Controller
{
    public function index()
    {
        $parkings = [
            [
                'id' => 1,
                'name' => 'Ram Mandir Main Parking',
                'location' => 'NH-27, Near Ram Janmabhoomi Gate, Ayodhya',
                'distance' => '300m',
                'image' => '/banner/p1.jpg',
                'rating' => 4.5,
                'vehicleType' => 'All',
                'availableSpots' => 187,
                'totalSpots' => 500,
                'hourlyRate' => 30,
                'amenities' => ['CCTV', 'Security', 'Covered'],
            ],
            [
                'id' => 2,
                'name' => 'Ayodhya Pilgrim Parking Zone',
                'location' => 'Sector 5, Naya Ghat Road, Ayodhya',
                'distance' => '800m',
                'image' => '/banner/p2.png',
                'rating' => 4.2,
                'vehicleType' => '4-Wheeler',
                'availableSpots' => 423,
                'totalSpots' => 500,
                'hourlyRate' => 20,
                'amenities' => ['Security', 'EV Charging'],
            ],
            [
                'id' => 3,
                'name' => 'Two-Wheeler Stand Gate 2',
                'location' => 'Near Gate 2, Ram Path, Ayodhya',
                'distance' => '150m',
                'image' => '/banner/p3.png',
                'rating' => 4.3,
                'vehicleType' => '2-Wheeler',
                'availableSpots' => 134,
                'totalSpots' => 200,
                'hourlyRate' => 10,
                'amenities' => ['CCTV', 'Covered'],
            ],
            [
                'id' => 4,
                'name' => 'Mahakal Parking Complex',
                'location' => 'Mahakal Lok, Ujjain Bypass Road',
                'distance' => '450m',
                'image' => '/banner/p4.png',
                'rating' => 4.6,
                'vehicleType' => 'All',
                'availableSpots' => 256,
                'totalSpots' => 400,
                'hourlyRate' => 25,
                'amenities' => ['CCTV', 'Security', 'EV Charging', 'Covered'],
            ],
            [
                'id' => 5,
                'name' => 'Vaishno Devi Base Camp Parking',
                'location' => 'Katra Bus Stand Area, Jammu',
                'distance' => '1.2km',
                'image' => '/banner/p-5.jpg',
                'rating' => 4.1,
                'vehicleType' => 'All',
                'availableSpots' => 89,
                'totalSpots' => 200,
                'hourlyRate' => 40,
                'amenities' => ['CCTV', 'Security'],
            ],
            [
                'id' => 6,
                'name' => 'Katra Bike Stand',
                'location' => 'Near Banganga Chowk, Katra',
                'distance' => '600m',
                'image' => '/banner/p-6.jpg',
                'rating' => 3.9,
                'vehicleType' => '2-Wheeler',
                'availableSpots' => 98,
                'totalSpots' => 150,
                'hourlyRate' => 15,
                'amenities' => ['Security'],
            ],
        ];

        return Inertia::render('Temple/Parking', [
            'parkings' => $parkings,
        ]);
    }
}
