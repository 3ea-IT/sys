<?php

namespace App\Http\Controllers;

use App\Models\Stay;
use Inertia\Inertia;

class StayController extends Controller
{
    public function index()
    {
        // Fetch active stays from database
        $stays = Stay::whereRelation('temple', 'status', 'active')
                     ->where('status', 'active')
                     ->with('temple')
                     ->get()
                     ->map(function ($stay) {
                         return [
                             'id' => $stay->id,
                             'name' => $stay->name,
                             'location' => $stay->temple?->location ? '0.' . rand(1, 9) . ' km from ' . $stay->temple->name : 'Near temple',
                             'distance' => '0.' . rand(1, 9) . ' km',
                             'temple' => $stay->temple?->name,
                             'image' => '/banner/' . ($stay->image ?? 'room-1.jpg'),
                             'rating' => rand(40, 50) / 10,
                             'reviews' => rand(100, 2000),
                             'type' => 'Accommodation',
                             'price' => $stay->price,
                             'amenities' => ['WiFi', 'Parking', 'Security'],
                             'roomTypes' => 3,
                             'available' => true,
                             'badge' => 'Available',
                         ];
                     })
                     ->toArray();

        return Inertia::render('Temple/Stay', [
            'stays' => $stays,
        ]);
    }

    public function show($id)
    {
        $stay = Stay::where('status', 'active')
                   ->whereRelation('temple', 'status', 'active')
                   ->with('temple')
                   ->findOrFail($id);

        return Inertia::render('Temple/StayDetail', [
            'stay' => [
                'id' => $stay->id,
                'name' => $stay->name,
                'location' => $stay->temple?->location ? '0.' . rand(1, 9) . ' km from ' . $stay->temple->name : 'Near temple',
                'distance' => '0.' . rand(1, 9) . ' km',
                'image' => '/banner/' . ($stay->image ?? 'room-1.jpg'),
                'gallery' => ['/banner/' . ($stay->image ?? 'room-1.jpg')],
                'rating' => rand(40, 50) / 10,
                'reviewCount' => rand(100, 2000),
                'roomTypes' => 3,
                'price' => $stay->price,
                'description' => $stay->description ?? 'Comfortable and convenient stay with all modern amenities near the temple.',
                'amenities' => ['WiFi', 'Parking', 'Security', 'AC', 'Restaurant', '24/7 Service'],
                'rooms' => rand(10, 50),
                'available' => rand(1, 10),
                'operatingHours' => '24/7 Available',
                'phone' => '+91 9876 543 210',
                'email' => 'contact@stay.com',
                'temple' => $stay->temple?->name,
                'reviews' => [],
            ],
        ]);
    }
}
