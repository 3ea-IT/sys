<?php

namespace App\Http\Controllers;

use App\Models\Experience;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ExploreController extends Controller
{
    /**
     * Display the explore page with experiences and categories
     */
    public function index()
    {
        // Fetch distinct categories from the 'experiences' table (only approved experiences)
        $categories = Experience::where('approval_status', 'approved')
            ->where('status', 'active')
            ->select('category')
            ->distinct()
            ->orderBy('category')
            ->get();

        // Fetch ALL active experiences ordered by priority_score DESC (highest first)
        $experiences = Experience::available() // Use model scope
            ->withCount(['activeHolds', 'bookings as instant_bookings_count']) // Eager count for holds and instant bookings
            ->orderBy('priority_score', 'desc')
            ->get()
            ->map(function ($exp) {
                $user = Auth::user();
                $userHold = $user ? $user->holds()
                    ->where('experience_id', $exp->id)
                    ->where('status', 'active')
                    ->first() : null;
                
                // NEW: Check if user has confirmed booking
                $userBooking = $user ? $user->bookings()
                    ->where('experience_id', $exp->id)
                    ->where('status', 'confirmed')
                    ->first() : null;

                return [
                    'id' => $exp->id,
                    'title' => $exp->title,
                    'category' => $exp->category,
                    'location' => $exp->location,
                    'date' => $exp->date ?? now()->format('M d, Y'), // Fallback date if not available
                    'price' => $exp->price,
                    'hold_token' => $exp->hold_token,
                    'hold_duration' => $exp->hold_duration,
                    'instant_price' => $exp->instant_price,             // New: Instant price
                    'instant_availability' => $exp->instant_availability, // New: Instant availability
                    'booking_mode' => $exp->booking_mode,               // New: Booking mode
                    'supports_instant' => $exp->supportsInstantBooking(), // New: Supports instant booking
                    'supports_hold' => $exp->supportsHoldBooking(),      // New: Supports hold booking
                    'image' => $exp->image,
                    'priority_score' => $exp->priority_score,
                    'capacity' => $exp->capacity,
                    'total_capacity' => $exp->total_capacity,           // New: Total capacity
                    'active_holds_count' => $exp->active_holds_count,   // New: Active holds count
                    'instant_bookings_count' => $exp->instant_bookings_count, // New: Instant bookings count
                    'is_secured' => $userHold !== null,
                    'hold_id' => $userHold?->id ?? null,
                    'is_booked' => $userBooking !== null,  // NEW: User has confirmed booking
                    'booking_id' => $userBooking?->id ?? null,  // NEW: Link to booking
                    'seats_full' => $exp->areAllSeatsFull(),  // NEW: Check if all seats are booked
                    'badge' => $exp->priority_score > 80 ? 'PRIORITY ACCESS' : null, // New: Priority badge
                ];
            });

        return Inertia::render('Explore', [
            'categories' => $categories,
            'experiences' => $experiences
        ]);
    }

    /**
     * Show the experiences of a specific category
     */
    public function showCategory($category)
    {
        $user = Auth::user();
        
        // Fetch experiences filtered by category (active only)
        $experiences = Experience::where('category', $category)
            ->available() // Use model scope
            ->withCount(['activeHolds', 'bookings as instant_bookings_count'])
            ->orderBy('priority_score', 'desc')
            ->get()
            ->map(function ($exp) use ($user) {
                // Check if user has an active hold on this experience
                $userHold = $user ? $user->holds()
                    ->where('experience_id', $exp->id)
                    ->where('status', 'active')
                    ->first() : null;
                
                // NEW: Check if user has confirmed booking
                $userBooking = $user ? $user->bookings()
                    ->where('experience_id', $exp->id)
                    ->where('status', 'confirmed')
                    ->first() : null;
                
                return [
                    'id' => $exp->id,
                    'title' => $exp->title,
                    'category' => $exp->category,
                    'location' => $exp->location,
                    'date' => $exp->date ?? now()->format('M d, Y'), // Fallback date if not available
                    'price' => $exp->price,
                    'hold_token' => $exp->hold_token,
                    'hold_duration' => $exp->hold_duration,
                    'instant_price' => $exp->instant_price,             // New: Instant price
                    'instant_availability' => $exp->instant_availability, // New: Instant availability
                    'booking_mode' => $exp->booking_mode,               // New: Booking mode
                    'supports_instant' => $exp->supportsInstantBooking(), // New: Supports instant booking
                    'supports_hold' => $exp->supportsHoldBooking(),      // New: Supports hold booking
                    'image' => $exp->image,
                    'priority_score' => $exp->priority_score,
                    'capacity' => $exp->capacity,
                    'total_capacity' => $exp->total_capacity,           // New: Total capacity
                    'active_holds_count' => $exp->active_holds_count,   // New: Active holds count
                    'instant_bookings_count' => $exp->instant_bookings_count, // New: Instant bookings count
                    'is_secured' => $userHold !== null,
                    'hold_id' => $userHold?->id ?? null,
                    'is_booked' => $userBooking !== null,  // NEW: User has confirmed booking
                    'booking_id' => $userBooking?->id ?? null,  // NEW: Link to booking
                    'seats_full' => $exp->areAllSeatsFull(),  // NEW: Check if all seats are booked
                    'badge' => $exp->priority_score > 80 ? 'PRIORITY ACCESS' : null, // New: Priority badge
                ];
            });

        return Inertia::render('CategoryExplore', [
            'category' => $category,
            'experiences' => $experiences
        ]);
    }
}
