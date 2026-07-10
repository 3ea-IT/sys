<?php

namespace App\Http\Controllers;

use App\Models\TourismPackage;
use App\Models\TourismPackageBooking;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TourismController extends Controller
{
    /**
     * Spiritual Tourism listing
     */
    public function index(Request $request)
    {
        $search = $request->get('search');

        $query = TourismPackage::active();

        if ($search) {
            $query->search($search);
        }

        $packages = $query->orderBy('name')->get()->map(function ($package) {
            return [
                'id' => $package->id,
                'name' => $package->name,
                'location' => $package->location,
                'image_url' => $package->image_url,
                'price' => (float) $package->price,
                'duration' => $package->duration,
                'rating' => $package->rating,
                'available_slots' => $package->available_slots,
                'sold_out' => $package->available_slots <= 0,
            ];
        });

        return Inertia::render('Tourism/Index', [
            'packages' => $packages,
            'search' => $search ?? '',
        ]);
    }

    public function show($id)
    {
        $package = TourismPackage::findOrFail($id);

        if ($package->status !== 'active' && (!Auth::check() || Auth::user()->role !== 'admin')) {
            abort(403);
        }

        $user = Auth::user();
        $existingBooking = $user
            ? TourismPackageBooking::where('user_id', $user->id)
                ->where('tourism_package_id', $package->id)
                ->where('status', 'confirmed')
                ->first()
            : null;

        return Inertia::render('Tourism/Show', [
            'package' => [
                'id' => $package->id,
                'name' => $package->name,
                'location' => $package->location,
                'image_url' => $package->image_url,
                'price' => (float) $package->price,
                'duration' => $package->duration,
                'rating' => $package->rating,
                'description' => $package->description,
                'itinerary' => $package->itinerary ?? [],
                'available_slots' => $package->available_slots,
                'sold_out' => $package->available_slots <= 0,
                'existing_booking' => $existingBooking ? [
                    'id' => $existingBooking->id,
                    'booking_reference' => $existingBooking->booking_reference,
                ] : null,
            ],
        ]);
    }

    /**
     * Book a spiritual tourism package (wallet-debited, same pattern as instant experience bookings)
     */
    public function book(Request $request, $id)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $package = TourismPackage::where('status', 'active')->findOrFail($id);

        $validated = $request->validate([
            'party_size' => 'required|integer|min:1',
            'travel_date' => 'nullable|date|after_or_equal:today',
        ]);

        $partySize = (int) $validated['party_size'];

        if ($package->available_slots < $partySize) {
            return back()->with('error', "Only {$package->available_slots} slot(s) available for this package.");
        }

        return DB::transaction(function () use ($user, $package, $partySize, $validated) {
            $totalAmount = $package->price * $partySize;

            $wallet = $user->wallet ?? $user->wallet()->create(['balance' => 0]);
            if ($wallet->balance < $totalAmount) {
                return back()->with('error', 'Insufficient wallet balance.');
            }

            $booking = TourismPackageBooking::create([
                'user_id' => $user->id,
                'tourism_package_id' => $package->id,
                'party_size' => $partySize,
                'amount_per_person' => $package->price,
                'total_amount' => $totalAmount,
                'travel_date' => $validated['travel_date'] ?? null,
                'status' => 'confirmed',
            ]);

            $package->decrement('available_slots', $partySize);
            $wallet->decrement('balance', $totalAmount);

            WalletTransaction::create([
                'wallet_id' => $wallet->id,
                'amount' => $totalAmount,
                'type' => 'debit',
                'description' => "Tourism booking #{$booking->id} for {$partySize} traveller(s) - {$package->name}",
            ]);

            return redirect()->route('tourism.spiritual.booking', $booking)
                ->with('success', 'Package booked successfully!');
        });
    }

    public function showBooking(TourismPackageBooking $booking)
    {
        if (Auth::id() !== $booking->user_id) {
            abort(403);
        }

        $package = $booking->tourismPackage;

        return Inertia::render('Tourism/Booking', [
            'booking' => [
                'id' => $booking->id,
                'booking_reference' => $booking->booking_reference,
                'party_size' => $booking->party_size,
                'amount_per_person' => (float) $booking->amount_per_person,
                'total_amount' => (float) $booking->total_amount,
                'travel_date' => $booking->travel_date?->format('M d, Y'),
                'status' => $booking->status,
                'created_at' => $booking->created_at->format('M d, Y h:i A'),
            ],
            'package' => [
                'id' => $package->id,
                'name' => $package->name,
                'location' => $package->location,
                'image_url' => $package->image_url,
                'duration' => $package->duration,
            ],
        ]);
    }

    public function cancelBooking(TourismPackageBooking $booking)
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
                'description' => "Tourism booking cancellation #{$booking->id}",
            ]);

            $booking->cancel();

            return redirect()->route('tourism.spiritual.booking', $booking)
                ->with('success', 'Booking cancelled and refunded.');
        });
    }
}
