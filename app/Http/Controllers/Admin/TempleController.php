<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\TempleFormRequest;
use App\Models\Temple;
use Inertia\Inertia;

class TempleController extends Controller
{
    /**
     * Display a listing of temples
     */
    public function index()
    {
        $search = request()->query('search', '');
        $status = request()->query('status', 'all');
        $crowdLevel = request()->query('crowd_level', 'all');

        $query = Temple::query();

        if ($search) {
            $query->search($search);
        }

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        if ($crowdLevel !== 'all') {
            $query->where('crowd_level', $crowdLevel);
        }

        $temples = $query->orderBy('created_at', 'desc')->paginate(15);

        $temples->getCollection()->transform(function ($temple) {
            return [
                'id' => $temple->id,
                'name' => $temple->name,
                'location' => $temple->location,
                'image' => $temple->image,
                'image_url' => $temple->image_url,
                'rating' => $temple->rating,
                'crowd_level' => $temple->crowd_level,
                'has_vip_darshan' => $temple->has_vip_darshan,
                'instant_price' => $temple->instant_price,
                'status' => $temple->status,
                'created_at' => $temple->created_at->format('Y-m-d H:i'),
            ];
        });

        return Inertia::render('Admin/Temples/Index', [
            'temples' => $temples,
            'search' => $search,
            'status' => $status,
            'crowd_level' => $crowdLevel,
            'crowdLevels' => ['Low', 'Moderate', 'High', 'Very High', 'Extreme'],
        ]);
    }

    /**
     * Show the form for creating a new temple
     */
    public function create()
    {
        return Inertia::render('Admin/Temples/Create', [
            'crowdLevels' => ['Low', 'Moderate', 'High', 'Very High', 'Extreme'],
        ]);
    }

    /**
     * Store a newly created temple in storage
     */
    public function store(TempleFormRequest $request)
    {
        $data = $request->validated();

        Temple::create($data);

        return redirect()->route('admin.temples.index')
            ->with('success', 'Temple created successfully.');
    }

    /**
     * Display the specified temple
     */
    public function show(Temple $temple)
    {
        return Inertia::render('Admin/Temples/Show', [
            'temple' => [
                'id' => $temple->id,
                'list_no' => $temple->list_no,
                'name' => $temple->name,
                'location' => $temple->location,
                'city' => $temple->city,
                'state' => $temple->state,
                'main_deity' => $temple->main_deity,
                'established' => $temple->established,
                'significance' => $temple->significance,
                'online_booking' => $temple->online_booking,
                'booking_url' => $temple->booking_url,
                'image' => $temple->image,
                'image_url' => $temple->image_url,
                'rating' => $temple->rating,
                'crowd_level' => $temple->crowd_level,
                'has_vip_darshan' => $temple->has_vip_darshan,
                'instant_price' => $temple->instant_price,
                'hold_token' => $temple->hold_token,
                'description' => $temple->description,
                'amenities' => $temple->amenities ?? [],
                'timings' => $temple->timings ?? [],
                'facilities' => $temple->facilities ?? [],
                'status' => $temple->status,
                'created_at' => $temple->created_at->format('Y-m-d H:i'),
                'updated_at' => $temple->updated_at->format('Y-m-d H:i'),
            ],
        ]);
    }

    /**
     * Show the form for editing the specified temple
     */
    public function edit(Temple $temple)
    {
        return Inertia::render('Admin/Temples/Edit', [
            'temple' => [
                'id' => $temple->id,
                'list_no' => $temple->list_no,
                'name' => $temple->name,
                'location' => $temple->location,
                'city' => $temple->city,
                'state' => $temple->state,
                'main_deity' => $temple->main_deity,
                'established' => $temple->established,
                'significance' => $temple->significance,
                'online_booking' => $temple->online_booking,
                'booking_url' => $temple->booking_url,
                'image' => $temple->image,
                'rating' => $temple->rating,
                'crowd_level' => $temple->crowd_level,
                'has_vip_darshan' => $temple->has_vip_darshan,
                'instant_price' => $temple->instant_price,
                'hold_token' => $temple->hold_token,
                'description' => $temple->description,
                'amenities' => $temple->amenities ?? [],
                'timings' => $temple->timings ?? [],
                'facilities' => $temple->facilities ?? [],
                'status' => $temple->status,
            ],
            'crowdLevels' => ['Low', 'Moderate', 'High', 'Very High', 'Extreme'],
        ]);
    }

    /**
     * Update the specified temple in storage
     */
    public function update(TempleFormRequest $request, Temple $temple)
    {
        $data = $request->validated();

        $temple->update($data);

        return redirect()->route('admin.temples.show', $temple->id)
            ->with('success', 'Temple updated successfully.');
    }

    /**
     * Remove the specified temple from storage
     */
    public function destroy(Temple $temple)
    {
        $temple->delete();

        return redirect()->route('admin.temples.index')
            ->with('success', 'Temple deleted successfully.');
    }

    /**
     * Toggle the status of a temple
     */
    public function toggleStatus(Temple $temple)
    {
        $temple->update([
            'status' => $temple->status === 'active' ? 'inactive' : 'active'
        ]);

        return redirect()->back()
            ->with('success', 'Temple status updated successfully.');
    }
}
