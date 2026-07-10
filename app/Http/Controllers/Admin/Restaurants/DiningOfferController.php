<?php

namespace App\Http\Controllers\Admin\Restaurants;

use App\Http\Controllers\Controller;
use App\Models\DiningOffer;
use App\Models\Restaurant;
use Inertia\Inertia;

class DiningOfferController extends Controller
{
    public function index()
    {
        $search = request()->query('search', '');
        $status = request()->query('status', 'all');

        $query = DiningOffer::with('restaurant');

        if ($search) {
            $query->where('title', 'like', "%{$search}%");
        }

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $offers = $query->orderBy('created_at', 'desc')->paginate(15);

        return Inertia::render('Admin/Restaurants/Offers/Index', [
            'offers' => $offers,
            'search' => $search,
            'status' => $status,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Restaurants/Offers/Create', [
            'restaurants' => Restaurant::where('status', 'active')->get(),
        ]);
    }

    public function store()
    {
        $validated = request()->validate([
            'restaurant_id' => 'required|exists:restaurants,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'discount_percent' => 'nullable|integer|min:0|max:100',
            'valid_until' => 'nullable|date',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'status' => 'required|in:active,inactive',
        ]);

        if (request()->hasFile('image')) {
            $file = request()->file('image');
            $filename = time() . '-' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('banner'), $filename);
            $validated['image'] = $filename;
        }

        DiningOffer::create($validated);

        return redirect()->route('admin.dining-offers.index')
            ->with('success', 'Offer created successfully.');
    }

    public function show(DiningOffer $diningOffer)
    {
        return Inertia::render('Admin/Restaurants/Offers/Show', [
            'offer' => $diningOffer->load('restaurant'),
        ]);
    }

    public function edit(DiningOffer $diningOffer)
    {
        return Inertia::render('Admin/Restaurants/Offers/Edit', [
            'offer' => $diningOffer->load('restaurant'),
            'restaurants' => Restaurant::where('status', 'active')->get(),
        ]);
    }

    public function update(DiningOffer $diningOffer)
    {
        $validated = request()->validate([
            'restaurant_id' => 'required|exists:restaurants,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'discount_percent' => 'nullable|integer|min:0|max:100',
            'valid_until' => 'nullable|date',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'status' => 'required|in:active,inactive',
        ]);

        if (request()->hasFile('image')) {
            if ($diningOffer->image && file_exists(public_path('banner/' . $diningOffer->image))) {
                unlink(public_path('banner/' . $diningOffer->image));
            }

            $file = request()->file('image');
            $filename = time() . '-' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('banner'), $filename);
            $validated['image'] = $filename;
        }

        $diningOffer->update($validated);

        return redirect()->route('admin.dining-offers.index')
            ->with('success', 'Offer updated successfully.');
    }

    public function destroy(DiningOffer $diningOffer)
    {
        $diningOffer->delete();

        return redirect()->route('admin.dining-offers.index')
            ->with('success', 'Offer deleted successfully.');
    }

    public function toggleStatus(DiningOffer $diningOffer)
    {
        $diningOffer->update([
            'status' => $diningOffer->status === 'active' ? 'inactive' : 'active',
        ]);

        return redirect()->back()->with('success', 'Offer status updated successfully.');
    }
}
