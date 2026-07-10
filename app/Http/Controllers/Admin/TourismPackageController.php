<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TourismPackage;
use Inertia\Inertia;

class TourismPackageController extends Controller
{
    public function index()
    {
        $search = request()->query('search', '');
        $status = request()->query('status', 'all');

        $query = TourismPackage::query();

        if ($search) {
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('location', 'like', "%{$search}%");
        }

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $packages = $query->orderBy('created_at', 'desc')->paginate(15);

        return Inertia::render('Admin/TourismPackages/Index', [
            'packages' => $packages,
            'search' => $search,
            'status' => $status,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/TourismPackages/Create');
    }

    public function store()
    {
        $validated = request()->validate([
            'name' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'duration' => 'nullable|string|max:255',
            'rating' => 'nullable|numeric|between:0,5',
            'capacity' => 'required|integer|min:1',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'status' => 'required|in:active,inactive',
        ]);

        if (request()->hasFile('image')) {
            $file = request()->file('image');
            $filename = time() . '-' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('banner'), $filename);
            $validated['image'] = $filename;
        }

        $validated['available_slots'] = $validated['capacity'];

        TourismPackage::create($validated);

        return redirect()->route('admin.tourism-packages.index')
            ->with('success', 'Tourism package created successfully.');
    }

    public function show(TourismPackage $tourismPackage)
    {
        return Inertia::render('Admin/TourismPackages/Show', [
            'package' => $tourismPackage,
        ]);
    }

    public function edit(TourismPackage $tourismPackage)
    {
        return Inertia::render('Admin/TourismPackages/Edit', [
            'package' => $tourismPackage,
        ]);
    }

    public function update(TourismPackage $tourismPackage)
    {
        $validated = request()->validate([
            'name' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'duration' => 'nullable|string|max:255',
            'rating' => 'nullable|numeric|between:0,5',
            'capacity' => 'required|integer|min:1',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'status' => 'required|in:active,inactive',
        ]);

        if (request()->hasFile('image')) {
            if ($tourismPackage->image && file_exists(public_path('banner/' . $tourismPackage->image))) {
                unlink(public_path('banner/' . $tourismPackage->image));
            }

            $file = request()->file('image');
            $filename = time() . '-' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('banner'), $filename);
            $validated['image'] = $filename;
        }

        // Keep available_slots in sync when capacity changes, without undoing existing bookings.
        $capacityDelta = $validated['capacity'] - $tourismPackage->capacity;
        $validated['available_slots'] = max(0, $tourismPackage->available_slots + $capacityDelta);

        $tourismPackage->update($validated);

        return redirect()->route('admin.tourism-packages.index')
            ->with('success', 'Tourism package updated successfully.');
    }

    public function destroy(TourismPackage $tourismPackage)
    {
        $tourismPackage->delete();

        return redirect()->route('admin.tourism-packages.index')
            ->with('success', 'Tourism package deleted successfully.');
    }

    public function toggleStatus(TourismPackage $tourismPackage)
    {
        $tourismPackage->update([
            'status' => $tourismPackage->status === 'active' ? 'inactive' : 'active',
        ]);

        return redirect()->back()->with('success', 'Tourism package status updated successfully.');
    }
}
