<?php

namespace App\Http\Controllers;

use App\Models\FestivalShow;
use App\Models\Temple;
use App\Models\Vip;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TempleController extends Controller
{
    /**
     * Display full temple listing (all seeded temples, with search)
     */
    public function all(Request $request)
    {
        $search = $request->get('search');
        $crowdLevel = $request->get('crowd_level');

        $query = Temple::where('status', 'active');

        if ($search) {
            $query->search($search);
        }

        if ($crowdLevel) {
            $query->where('crowd_level', $crowdLevel);
        }

        $temples = $query->orderByDesc('rating')
            ->get()
            ->map(function ($temple) {
                return [
                    'id' => $temple->id,
                    'name' => $temple->name,
                    'location' => $temple->location,
                    'image' => $temple->image,
                    'image_url' => $temple->image_url,
                    'rating' => $temple->rating,
                    'crowd_level' => $temple->crowd_level,
                    'has_vip_darshan' => $temple->has_vip_darshan,
                ];
            })
            ->toArray();

        return Inertia::render('Temple/All', [
            'temples' => $temples,
        ]);
    }

    /**
     * Display temple listing (user-facing index)
     */
    public function index(Request $request)
    {
        $search = $request->get('search');
        $crowdLevel = $request->get('crowd_level');
        $vipOnly = $request->get('vip_only');

        // Build query for active temples
        $query = Temple::where('status', 'active');

        // Apply search filter
        if ($search) {
            $query->search($search);
        }

        // Apply crowd level filter
        if ($crowdLevel) {
            $query->where('crowd_level', $crowdLevel);
        }

        // Apply VIP filter
        if ($vipOnly) {
            $query->where('has_vip_darshan', true);
        }

        // Get temples and map to array format
        $temples = $query->get()->map(function ($temple) {
            return [
                'id' => $temple->id,
                'name' => $temple->name,
                'location' => $temple->location,
                'image' => $temple->image,
                'image_url' => $temple->image_url,
                'rating' => $temple->rating,
                'crowd_level' => $temple->crowd_level,
                'has_vip_darshan' => $temple->has_vip_darshan,
                'avg_wait' => rand(15, 180) . ' min',
                'regular_price' => $temple->instant_price,
                'opening_info' => 'Open Daily',
            ];
        })->toArray();

        return Inertia::render('Temple/Index', [
            'temples' => $temples,
            'userLocation' => 'Lucknow, UP', // TODO: Get from user location
        ]);
    }

    /**
     * Display a specific temple details
     */
    public function show($id)
    {
        $temple = Temple::findOrFail($id);

        // If temple is inactive, only show to admins
        if ($temple->status === 'inactive' && !auth()->user()?->isAdmin()) {
            abort(403, 'This temple is not available.');
        }

        return Inertia::render('Temple/Show', [
            'temple' => $temple->toArray(),
        ]);
    }

    /**
     * Display festival shows listing
     */
    public function festivals()
    {
        // Fetch active festival shows from database
        $festivalShows = FestivalShow::whereRelation('temple', 'status', 'active')
                                    ->where('status', 'active')
                                    ->with('temple')
                                    ->get()
                                    ->map(function ($show) {
                                        return [
                                            'id' => $show->id,
                                            'name' => $show->name,
                                            'temple_name' => $show->temple?->name,
                                            'temple_id' => $show->temple_id,
                                            'description' => $show->description,
                                            'date' => $show->date,
                                            'time' => $show->time,
                                            'capacity' => $show->capacity,
                                            'image' => '/banner/' . ($show->image ?? 'festival-1.jpeg'),
                                            'price' => rand(200, 500),
                                            'rating' => $show->temple?->rating ?? 4.5,
                                        ];
                                    })
                                    ->toArray();

        return Inertia::render('Temple/Festivals', [
            'festivals' => $festivalShows,
        ]);
    }

    /**
     * Display festival show details
     */
    public function festivalShow($id)
    {
        $festival = FestivalShow::where('status', 'active')
                               ->whereRelation('temple', 'status', 'active')
                               ->with('temple')
                               ->findOrFail($id);

        return Inertia::render('Temple/FestivalDetail', [
            'festival' => [
                'id' => $festival->id,
                'name' => $festival->name,
                'temple_name' => $festival->temple?->name,
                'temple_id' => $festival->temple_id,
                'description' => $festival->description,
                'date' => $festival->date,
                'time' => $festival->time,
                'capacity' => $festival->capacity,
                'image' => '/banner/' . ($festival->image ?? 'festival-1.jpeg'),
                'price' => rand(200, 500),
                'rating' => $festival->temple?->rating ?? 4.5,
                'reviews' => rand(50, 500),
                'amenities' => ['Seating', 'Refreshments', 'Parking'],
            ],
        ]);
    }

    /**
     * Display temple booking page (list of temples)
     */
    public function book()
    {
        $temples = Temple::where('status', 'active')->get()->map(function ($temple) {
            return [
                'id' => $temple->id,
                'name' => $temple->name,
                'location' => $temple->location,
                'image' => $temple->image,
                'image_url' => $temple->image_url,
                'rating' => $temple->rating,
                'crowd_level' => $temple->crowd_level,
                'has_vip_darshan' => $temple->has_vip_darshan,
                'avg_wait' => rand(15, 180) . ' min',
                'regular_price' => $temple->instant_price,
                'opening_info' => 'Open Daily',
            ];
        })->toArray();

        return Inertia::render('Temple/Book', [
            'temples' => $temples,
        ]);
    }

    /**
     * Display VIP packages listing
     */
    public function vip(Request $request)
    {
        $search = $request->get('search');

        // Build query for active VIP packages
        $query = Vip::whereRelation('temple', 'status', 'active');

        // Apply search filter
        if ($search) {
            $query->where('name', 'like', "%$search%")
                  ->orWhere('description', 'like', "%$search%");
        }

        // Get VIPs with temple relationships
        $vips = $query->with('temple')
                      ->orderBy('price')
                      ->get()
                      ->map(function ($vip) {
                          return [
                              'id' => $vip->id,
                              'name' => $vip->name,
                              'temple_name' => $vip->temple?->name,
                              'temple_id' => $vip->temple_id,
                              'description' => $vip->description,
                              'price' => $vip->price,
                              'duration' => $vip->duration,
                              'benefits' => $vip->benefits,
                              'rating' => $vip->temple?->rating ?? 0,
                          ];
                      })
                      ->toArray();

        return Inertia::render('Temple/Vip', [
            'vips' => $vips,
        ]);
    }

    /**
     * Get VIP darshan details for a specific temple
     */
    public function vipDetail($templeId)
    {
        $temple = Temple::findOrFail($templeId);

        if (!$temple->has_vip_darshan || $temple->status !== 'active') {
            abort(404, 'VIP darshan not available for this temple.');
        }

        return response()->json([
            'id' => $temple->id,
            'temple_id' => $temple->id,
            'temple_name' => $temple->name,
            'description' => 'VIP Priority Access - Skip Regular Queue',
            'image' => $temple->image,
            'price' => $temple->instant_price * 2.5,
            'benefits' => [
                'Priority queuing',
                'Direct darshan access',
                'Separate VIP line',
                'Premium seating area',
            ],
        ]);
    }
}