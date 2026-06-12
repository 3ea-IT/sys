<?php

namespace App\Http\Controllers\Admin\Temples;

use App\Http\Controllers\Controller;
use App\Models\Parking;
use App\Models\Temple;
use Inertia\Inertia;

class ParkingController extends Controller
{
    /**
     * Display a listing of parkings
     */
    public function index()
    {
        $search = request()->query('search', '');
        $status = request()->query('status', 'all');

        $query = Parking::with('temple');

        if ($search) {
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('location', 'like', "%{$search}%");
        }

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $parkings = $query->orderBy('created_at', 'desc')->paginate(15);

        return Inertia::render('Admin/Temples/Parkings/Index', [
            'parkings' => $parkings,
            'search' => $search,
            'status' => $status,
        ]);
    }

    /**
     * Show the form for creating a new parking
     */
    public function create()
    {
        return Inertia::render('Admin/Temples/Parkings/Create', [
            'temples' => Temple::where('status', 'active')->get(),
        ]);
    }

    /**
     * Store a newly created parking in storage
     */
    public function store()
    {
        $validated = request()->validate([
            'temple_id' => 'required|exists:temples,id',
            'name' => 'required|string|max:255',
            'location' => 'nullable|string',
            'capacity' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'description' => 'nullable|string',
            'status' => 'required|in:active,inactive',
        ]);

        // Handle image upload
        if (request()->hasFile('image')) {
            $file = request()->file('image');
            $filename = time() . '-' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('banner'), $filename);
            $validated['image'] = $filename;
        }

        Parking::create($validated);

        return redirect()->route('admin.parkings.index')
            ->with('success', 'Parking created successfully');
    }

    /**
     * Display the specified parking
     */
    public function show(Parking $parking)
    {
        return Inertia::render('Admin/Temples/Parkings/Show', [
            'parking' => $parking->load('temple'),
        ]);
    }

    /**
     * Show the form for editing the specified parking
     */
    public function edit(Parking $parking)
    {
        return Inertia::render('Admin/Temples/Parkings/Edit', [
            'parking' => $parking->load('temple'),
            'temples' => Temple::where('status', 'active')->get(),
        ]);
    }

    /**
     * Update the specified parking in storage
     */
    public function update(Parking $parking)
    {
        $validated = request()->validate([
            'temple_id' => 'required|exists:temples,id',
            'name' => 'required|string|max:255',
            'location' => 'nullable|string',
            'capacity' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'description' => 'nullable|string',
            'status' => 'required|in:active,inactive',
        ]);

        // Handle image upload
        if (request()->hasFile('image')) {
            // Delete old image if exists
            if ($parking->image && file_exists(public_path('banner/' . $parking->image))) {
                unlink(public_path('banner/' . $parking->image));
            }
            
            $file = request()->file('image');
            $filename = time() . '-' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('banner'), $filename);
            $validated['image'] = $filename;
        }

        $parking->update($validated);

        return redirect()->route('admin.parkings.index')
            ->with('success', 'Parking updated successfully.');
    }

    /**
     * Remove the specified parking from storage
     */
    public function destroy(Parking $parking)
    {
        $parking->delete();

        return redirect()->route('admin.parkings.index')
            ->with('success', 'Parking deleted successfully.');
    }

    /**
     * Toggle status of a parking
     */
    public function toggleStatus(Parking $parking)
    {
        $parking->update([
            'status' => $parking->status === 'active' ? 'inactive' : 'active'
        ]);

        return redirect()->back()
            ->with('success', 'Parking status updated successfully.');
    }
}
