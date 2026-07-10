<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Models\PropertyBooking;
use App\Models\RoomType;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AccommodationController extends Controller
{
    protected function amenityOptions(): array
    {
        return ['Wi-Fi', 'Parking', 'Air Conditioning', 'Swimming Pool', 'Restaurant', 'Breakfast Available'];
    }

    public function index(Request $request)
    {
        $search = $request->get('search');
        $type = $request->get('type');
        $amenities = array_filter((array) $request->get('amenities', []));
        $minRating = $request->get('min_rating');
        $sort = $request->get('sort', 'popular');

        $query = Property::active()->withCount([
            'bookings as popularity' => fn ($q) => $q->where('property_bookings.status', 'confirmed'),
        ]);

        if ($search) {
            $query->search($search);
        }

        if ($type) {
            $query->where('type', $type);
        }

        if (!empty($amenities)) {
            $query->hasAmenities($amenities);
        }

        if ($minRating) {
            $query->minRating($minRating);
        }

        $query = match ($sort) {
            'price_low' => $query->orderBy('price_per_night'),
            'price_high' => $query->orderByDesc('price_per_night'),
            'rating' => $query->orderByDesc('rating'),
            default => $query->orderByDesc('popularity')->orderByDesc('rating'), // popular = most confirmed bookings
        };

        $properties = $query->get()->map(function ($property) {
            return [
                'id' => $property->id,
                'name' => $property->name,
                'type' => $property->type,
                'location' => $property->location,
                'image_url' => $property->image_url,
                'price_per_night' => (float) $property->price_per_night,
                'rating' => $property->rating,
            ];
        });

        return Inertia::render('Accommodation/Index', [
            'properties' => $properties,
            'search' => $search ?? '',
            'type' => $type ?? '',
            'amenities' => array_values($amenities),
            'min_rating' => $minRating ?? '',
            'sort' => $sort,
            'amenityOptions' => $this->amenityOptions(),
        ]);
    }

    public function show($id)
    {
        $property = Property::findOrFail($id);

        if ($property->status !== 'active' && (!Auth::check() || Auth::user()->role !== 'admin')) {
            abort(403);
        }

        $roomTypes = $property->roomTypes()->where('status', 'active')->get();

        return Inertia::render('Accommodation/Show', [
            'property' => [
                'id' => $property->id,
                'name' => $property->name,
                'type' => $property->type,
                'location' => $property->location,
                'image_url' => $property->image_url,
                'price_per_night' => (float) $property->price_per_night,
                'rating' => $property->rating,
                'description' => $property->description,
                'amenities' => $property->amenities ?? [],
                'gallery' => $property->images->isNotEmpty()
                    ? $property->images->map(fn ($img) => $img->image_url)->values()
                    : $property->apiGalleryUrls(),
            ],
            'roomTypes' => $roomTypes->map(fn ($rt) => [
                'id' => $rt->id,
                'name' => $rt->name,
                'price' => (float) $rt->price,
                'capacity' => $rt->capacity,
                'amenities' => $rt->amenities ?? [],
                'image_url' => $rt->image_url,
            ]),
        ]);
    }

    public function book(Request $request, $id)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $roomType = RoomType::where('status', 'active')->findOrFail($id);

        $validated = $request->validate([
            'check_in' => 'required|date|after_or_equal:today',
            'check_out' => 'required|date|after:check_in',
            'guest_count' => 'required|integer|min:1',
        ]);

        $nights = Carbon::parse($validated['check_in'])->diffInDays(Carbon::parse($validated['check_out']));

        $bookedCount = $roomType->overlappingBookingsCount($validated['check_in'], $validated['check_out']);
        if ($bookedCount >= $roomType->room_count) {
            return back()->with('error', 'No rooms of this type are available for the selected dates.');
        }

        return DB::transaction(function () use ($user, $roomType, $validated, $nights) {
            $totalAmount = $roomType->price * $nights;

            $wallet = $user->wallet ?? $user->wallet()->create(['balance' => 0]);
            if ($wallet->balance < $totalAmount) {
                return back()->with('error', 'Insufficient wallet balance.');
            }

            $booking = PropertyBooking::create([
                'user_id' => $user->id,
                'room_type_id' => $roomType->id,
                'check_in' => $validated['check_in'],
                'check_out' => $validated['check_out'],
                'guest_count' => $validated['guest_count'],
                'amount_per_night' => $roomType->price,
                'total_amount' => $totalAmount,
                'status' => 'confirmed',
            ]);

            $wallet->decrement('balance', $totalAmount);

            WalletTransaction::create([
                'wallet_id' => $wallet->id,
                'amount' => $totalAmount,
                'type' => 'debit',
                'description' => "Accommodation booking #{$booking->id} - {$roomType->name} ({$nights} night(s))",
            ]);

            return redirect()->route('accommodation.booking', $booking)
                ->with('success', 'Room booked successfully!');
        });
    }

    public function showBooking(PropertyBooking $booking)
    {
        if (Auth::id() !== $booking->user_id) {
            abort(403);
        }

        $roomType = $booking->roomType;
        $property = $roomType->property;

        return Inertia::render('Accommodation/Booking', [
            'booking' => [
                'id' => $booking->id,
                'booking_reference' => $booking->booking_reference,
                'check_in' => $booking->check_in->format('M d, Y'),
                'check_out' => $booking->check_out->format('M d, Y'),
                'guest_count' => $booking->guest_count,
                'total_amount' => (float) $booking->total_amount,
                'status' => $booking->status,
            ],
            'roomType' => [
                'name' => $roomType->name,
            ],
            'property' => [
                'id' => $property->id,
                'name' => $property->name,
                'location' => $property->location,
                'image_url' => $property->image_url,
            ],
        ]);
    }

    public function cancelBooking(PropertyBooking $booking)
    {
        $user = Auth::user();

        if (!$user || $booking->user_id !== $user->id) {
            abort(403);
        }

        if ($booking->status !== 'confirmed') {
            return back()->with('error', 'Cannot cancel this booking.');
        }

        return DB::transaction(function () use ($booking, $user) {
            $wallet = $user->wallet;
            $wallet->increment('balance', $booking->total_amount);

            WalletTransaction::create([
                'wallet_id' => $wallet->id,
                'amount' => $booking->total_amount,
                'type' => 'credit',
                'description' => "Accommodation booking cancellation #{$booking->id}",
            ]);

            $booking->cancel();

            return redirect()->route('accommodation.booking', $booking)
                ->with('success', 'Booking cancelled and refunded.');
        });
    }
}
