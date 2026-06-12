<?php

namespace App\Http\Controllers;

use App\Models\Parking;
use Inertia\Inertia;

class ParkingController extends Controller
{
    public function index()
    {
        // Fetch active parkings from database
        $parkings = Parking::whereRelation('temple', 'status', 'active')
                          ->where('status', 'active')
                          ->with('temple')
                          ->get()
                          ->map(function ($parking) {
                              return [
                                  'id' => $parking->id,
                                  'name' => $parking->name,
                                  'location' => $parking->location,
                                  'distance' => rand(100, 1200) . 'm',
                                  'image' => '/banner/' . ($parking->image ?? 'park1.jpg'),
                                  'rating' => $parking->temple?->rating ?? 4.5,
                                  'vehicleType' => 'All',
                                  'availableSpots' => rand(50, 400),
                                  'totalSpots' => $parking->capacity,
                                  'hourlyRate' => $parking->price,
                                  'amenities' => ['CCTV', 'Security', 'Covered'],
                              ];
                          })
                          ->toArray();

        return Inertia::render('Temple/Parking', [
            'parkings' => $parkings,
        ]);
    }

    public function show($id)
    {
        $parking = Parking::where('status', 'active')
                         ->whereRelation('temple', 'status', 'active')
                         ->with('temple')
                         ->findOrFail($id);

        return Inertia::render('Temple/ParkingDetail', [
            'parking' => [
                'id' => $parking->id,
                'name' => $parking->name,
                'location' => $parking->location,
                'distance' => rand(100, 1200) . 'm',
                'image' => '/banner/' . ($parking->image ?? 'park1.jpg'),
                'gallery' => ['/banner/' . ($parking->image ?? 'park1.jpg')],
                'rating' => $parking->temple?->rating ?? 4.5,
                'reviewCount' => rand(50, 500),
                'vehicleType' => 'All',
                'availableSpots' => rand(50, 400),
                'totalSpots' => $parking->capacity,
                'hourlyRate' => $parking->price,
                'dailyRate' => $parking->price * 8,
                'amenities' => ['CCTV', 'Security', 'Covered', 'EV Charging'],
                'operatingHours' => '24/7 Available',
                'phone' => '+91 9876 543 210',
                'email' => 'contact@parking.com',
                'description' => $parking->description ?? 'Secure and convenient parking facility with modern amenities.',
                'reviews' => [],
            ],
        ]);
    }
}
