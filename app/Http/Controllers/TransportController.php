<?php

namespace App\Http\Controllers;

use App\Models\Transport;
use Inertia\Inertia;

class TransportController extends Controller
{
    public function index()
    {
        // Fetch active transports from database
        $transports = Transport::whereRelation('temple', 'status', 'active')
                               ->where('status', 'active')
                               ->with('temple')
                               ->get()
                               ->map(function ($transport) {
                                   return [
                                       'id' => $transport->id,
                                       'name' => $transport->name,
                                       'location' => $transport->temple?->name,
                                       'type' => $transport->type,
                                       'image' => '/banner/' . ($transport->image ?? 'bus-1.jpg'),
                                       'from' => $transport->temple?->location ?? 'Starting Point',
                                       'to' => $transport->temple?->name . ' Temple',
                                       'duration' => rand(5, 60) . ' min',
                                       'seats' => rand(3, 50),
                                       'frequency' => 'On demand',
                                       'price' => $transport->price,
                                       'amenities' => ['GPS Tracking', 'Safe Travel'],
                                       'status' => 'Available Now',
                                       'available' => true,
                                   ];
                               })
                               ->toArray();

        return Inertia::render('Temple/Transport', [
            'transports' => $transports,
        ]);
    }
}
