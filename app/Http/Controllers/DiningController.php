<?php

namespace App\Http\Controllers;

use App\Models\Restaurant;
use App\Models\RestaurantBooking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use Inertia\Inertia;

class DiningController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->get('search');
        $cuisine = $request->get('cuisine');

        $query = Restaurant::active();

        if ($search) {
            $query->search($search);
        }

        if ($cuisine) {
            $query->where('cuisine', $cuisine);
        }

        $restaurants = $query->orderBy('name')->get()->map(function ($restaurant) {
            return [
                'id' => $restaurant->id,
                'name' => $restaurant->name,
                'location' => $restaurant->location,
                'cuisine' => $restaurant->cuisine,
                'image_url' => $restaurant->image_url,
                'price_range' => $restaurant->price_range,
                'rating' => $restaurant->rating,
                'has_offers' => $restaurant->offers()->where('status', 'active')->exists(),
            ];
        });

        return Inertia::render('Dining/Index', [
            'restaurants' => $restaurants,
            'search' => $search ?? '',
            'cuisine' => $cuisine ?? '',
        ]);
    }

    public function show($id)
    {
        $restaurant = Restaurant::findOrFail($id);

        if ($restaurant->status !== 'active' && (!Auth::check() || Auth::user()->role !== 'admin')) {
            abort(403);
        }

        $offers = $restaurant->offers()->where('status', 'active')->get();

        return Inertia::render('Dining/Show', [
            'restaurant' => [
                'id' => $restaurant->id,
                'name' => $restaurant->name,
                'location' => $restaurant->location,
                'cuisine' => $restaurant->cuisine,
                'image_url' => $restaurant->image_url,
                'price_range' => $restaurant->price_range,
                'rating' => $restaurant->rating,
                'description' => $restaurant->description,
                'opening_hours' => $restaurant->opening_hours ?? [],
            ],
            'offers' => $offers->map(fn ($offer) => [
                'id' => $offer->id,
                'title' => $offer->title,
                'description' => $offer->description,
                'discount_percent' => $offer->discount_percent,
                'valid_until' => $offer->valid_until?->format('M d, Y'),
                'image_url' => $offer->image_url,
            ]),
        ]);
    }

    /**
     * Reserve a table (free, Dineout-style — no payment, confirmed instantly)
     */
    public function book(Request $request, $id)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $restaurant = Restaurant::where('status', 'active')->findOrFail($id);

        $validated = $request->validate([
            'party_size' => 'required|integer|min:1|max:20',
            'reservation_date' => 'required|date|after_or_equal:today',
            'reservation_time' => 'required|string',
        ]);

        $existingReservations = $restaurant->bookings()
            ->where('reservation_date', $validated['reservation_date'])
            ->where('status', 'confirmed')
            ->sum('party_size');

        if ($existingReservations + $validated['party_size'] > $restaurant->table_capacity) {
            return back()->with('error', 'This restaurant is fully booked for the selected date.');
        }

        $booking = RestaurantBooking::create([
            'user_id' => $user->id,
            'restaurant_id' => $restaurant->id,
            'party_size' => $validated['party_size'],
            'reservation_date' => $validated['reservation_date'],
            'reservation_time' => $validated['reservation_time'],
            'status' => 'confirmed',
        ]);

        return redirect()->route('dining.booking', $booking)
            ->with('success', 'Table reserved successfully!');
    }

    public function showBooking(RestaurantBooking $booking)
    {
        if (Auth::id() !== $booking->user_id) {
            abort(403);
        }

        $restaurant = $booking->restaurant;

        return Inertia::render('Dining/Booking', [
            'booking' => [
                'id' => $booking->id,
                'booking_reference' => $booking->booking_reference,
                'party_size' => $booking->party_size,
                'reservation_date' => $booking->reservation_date->format('M d, Y'),
                'reservation_time' => $booking->reservation_time,
                'status' => $booking->status,
            ],
            'restaurant' => [
                'id' => $restaurant->id,
                'name' => $restaurant->name,
                'location' => $restaurant->location,
                'image_url' => $restaurant->image_url,
            ],
        ]);
    }

    public function cancelBooking(RestaurantBooking $booking)
    {
        if (Auth::id() !== $booking->user_id) {
            abort(403);
        }

        if ($booking->status !== 'confirmed') {
            return back()->with('error', 'Cannot cancel this reservation.');
        }

        $booking->cancel();

        return redirect()->route('dining.booking', $booking)
            ->with('success', 'Reservation cancelled.');
    }
}
