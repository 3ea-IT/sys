<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class StayController extends Controller
{
    public function index()
    {
        $stays = [
            [
                'id' => 1,
                'name' => 'Shri Ram Dharamshala',
                'location' => '0.2 km from Ram Mandir',
                'distance' => '0.2 km',
                'temple' => 'Ram Mandir',
                'image' => '/banner/room-1.jpg',
                'rating' => 4.2,
                'reviews' => 584,
                'type' => 'Dharamshala',
                'price' => 300,
                'amenities' => ['WiFi', 'Parking', 'Security'],
                'roomTypes' => 3,
                'available' => true,
                'badge' => 'Dharamshala',
            ],
            [
                'id' => 2,
                'name' => 'Hotel Saket Palace',
                'location' => '1.5 km from Ram Mandir',
                'distance' => '1.5 km',
                'temple' => 'Ram Mandir',
                'image' => 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&h=300&fit=crop',
                'rating' => 4.8,
                'reviews' => 892,
                'type' => 'Premium',
                'price' => 2500,
                'amenities' => ['AC', 'WiFi', 'Restaurant'],
                'roomTypes' => 3,
                'available' => true,
                'badge' => 'Premium Hotel',
            ],
            [
                'id' => 3,
                'name' => 'Kashi Vishwanath Dharamshala',
                'location' => '0.2 km from Kashi Vishwanath',
                'distance' => '0.2 km',
                'temple' => 'Kashi Vishwanath',
                'image' => '/banner/room-3.jpg',
                'rating' => 4.3,
                'reviews' => 762,
                'type' => 'Dharamshala',
                'price' => 250,
                'amenities' => ['Parking', 'WiFi', 'Security'],
                'roomTypes' => 3,
                'available' => true,
                'badge' => 'Dharamshala',
            ],
            [
                'id' => 4,
                'name' => 'Ganga View Resort',
                'location' => '2.8 km from Kashi Vishwanath',
                'distance' => '2.8 km',
                'temple' => 'Kashi Vishwanath',
                'image' => '/banner/room-4.jpg',
                'rating' => 4.8,
                'reviews' => 1456,
                'type' => 'Resort',
                'price' => 5500,
                'amenities' => ['AC', 'WiFi', 'Restaurant'],
                'roomTypes' => 3,
                'available' => true,
                'badge' => 'Resort',
            ],
            [
                'id' => 5,
                'name' => 'TTD Guest House',
                'location' => '0.5 km from Tirupati Balaji',
                'distance' => '0.5 km',
                'temple' => 'Tirupati Balaji',
                'image' => '/banner/room-5.jpg',
                'rating' => 4.3,
                'reviews' => 762,
                'type' => 'Guesthouse',
                'price' => 600,
                'amenities' => 'WiFi, Parking, Restaurant',
                'roomTypes' => 3,
                'available' => true,
                'badge' => 'Guesthouse',
            ],
            [
                'id' => 6,
                'name' => 'Fortune Fences Hotel',
                'location' => '3.0 km from Tirupati Balaji',
                'distance' => '3.0 km',
                'temple' => 'Tirupati Balaji',
                'image' => '/banner/room-6.jpg',
                'rating' => 4.5,
                'reviews' => 2678,
                'type' => 'Premium',
                'price' => 4500,
                'amenities' => ['AC', 'WiFi', 'Restaurant'],
                'roomTypes' => 3,
                'available' => true,
                'badge' => 'Premium Hotel',
            ],
        ];

        return Inertia::render('Temple/Stay', [
            'stays' => $stays,
        ]);
    }
}
