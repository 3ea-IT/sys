<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Restaurant;
use Inertia\Inertia;

class RestaurantController extends Controller
{
    public function index()
    {
        $search = request()->query('search', '');
        $status = request()->query('status', 'all');

        $query = Restaurant::query();

        if ($search) {
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('location', 'like', "%{$search}%");
        }

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $restaurants = $query->orderBy('created_at', 'desc')->paginate(15);

        return Inertia::render('Admin/Restaurants/Index', [
            'restaurants' => $restaurants,
            'search' => $search,
            'status' => $status,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Restaurants/Create');
    }

    public function store()
    {
        $validated = request()->validate([
            'name' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'cuisine' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'price_range' => 'required|in:budget,mid,premium',
            'rating' => 'nullable|numeric|between:0,5',
            'table_capacity' => 'required|integer|min:1',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'status' => 'required|in:active,inactive',
        ]);

        if (request()->hasFile('image')) {
            $file = request()->file('image');
            $filename = time() . '-' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('banner'), $filename);
            $validated['image'] = $filename;
        }

        Restaurant::create($validated);

        return redirect()->route('admin.restaurants.index')
            ->with('success', 'Restaurant created successfully.');
    }

    public function show(Restaurant $restaurant)
    {
        return Inertia::render('Admin/Restaurants/Show', [
            'restaurant' => $restaurant->load('offers'),
        ]);
    }

    public function edit(Restaurant $restaurant)
    {
        return Inertia::render('Admin/Restaurants/Edit', [
            'restaurant' => $restaurant,
        ]);
    }

    public function update(Restaurant $restaurant)
    {
        $validated = request()->validate([
            'name' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'cuisine' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'price_range' => 'required|in:budget,mid,premium',
            'rating' => 'nullable|numeric|between:0,5',
            'table_capacity' => 'required|integer|min:1',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'status' => 'required|in:active,inactive',
        ]);

        if (request()->hasFile('image')) {
            if ($restaurant->image && file_exists(public_path('banner/' . $restaurant->image))) {
                unlink(public_path('banner/' . $restaurant->image));
            }

            $file = request()->file('image');
            $filename = time() . '-' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('banner'), $filename);
            $validated['image'] = $filename;
        }

        $restaurant->update($validated);

        return redirect()->route('admin.restaurants.index')
            ->with('success', 'Restaurant updated successfully.');
    }

    public function destroy(Restaurant $restaurant)
    {
        $restaurant->delete();

        return redirect()->route('admin.restaurants.index')
            ->with('success', 'Restaurant deleted successfully.');
    }

    public function toggleStatus(Restaurant $restaurant)
    {
        $restaurant->update([
            'status' => $restaurant->status === 'active' ? 'inactive' : 'active',
        ]);

        return redirect()->back()->with('success', 'Restaurant status updated successfully.');
    }
}
