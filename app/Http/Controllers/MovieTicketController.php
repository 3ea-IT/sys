<?php

namespace App\Http\Controllers;

use App\Models\Movie;
use App\Models\Cinema;
use App\Models\MovieShowSlot;
use App\Models\MovieTicketBooking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MovieTicketController extends Controller
{
    /**
     * Show cinemas where a movie is playing
     */
    public function showCinemas(Movie $movie)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect('/login');
        }

        // Get all cinemas with upcoming shows for this movie
        $cinemas = Cinema::whereHas('movieShowSlots', function ($query) use ($movie) {
            $query->where('movie_id', $movie->id)
                ->where('movie_show_slots.status', '!=', 'sold_out')
                ->where('show_date', '>=', now()->toDateString())
                ->where('available_seats', '>', 0);
        })
        ->with(['movieShowSlots' => function ($query) use ($movie) {
            $query->where('movie_id', $movie->id)
                ->where('movie_show_slots.status', '!=', 'sold_out')
                ->where('show_date', '>=', now()->toDateString())
                ->where('available_seats', '>', 0)
                ->orderBy('show_date');
        }])
        ->get()
        ->map(function ($cinema) use ($movie) {
            $upcomingShows = $cinema->movieShowSlots->count();
            return [
                'id' => $cinema->id,
                'name' => $cinema->name,
                'location' => $cinema->location,
                'type' => $cinema->type,
                'image' => $cinema->image,
                'description' => $cinema->description,
                'upcomingShows' => $upcomingShows,
            ];
        });

        return Inertia::render('MovieTickets/CinemaSelection', [
            'movie' => [
                'id' => $movie->id,
                'title' => $movie->title,
                'image' => $movie->image,
                'language' => $movie->language,
                'format' => $movie->format,
                'genre' => $movie->genre,
                'duration' => $movie->duration,
                'rating' => $movie->rating,
                'description' => $movie->description,
            ],
            'cinemas' => $cinemas,
        ]);
    }

    /**
     * Show show slots for a movie in a specific cinema
     */
    public function showSlots(Movie $movie, Cinema $cinema)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect('/login');
        }

        // Get all show slots for this movie in this cinema
        $showSlots = MovieShowSlot::where('movie_id', $movie->id)
            ->where('cinema_id', $cinema->id)
            ->where('status', '!=', 'sold_out')
            ->where('show_date', '>=', now()->toDateString())
            ->where('available_seats', '>', 0)
            ->orderBy('show_date')
            ->orderBy('show_time')
            ->get()
            ->map(function ($slot) use ($user) {
                $userBookedThisSlot = MovieTicketBooking::where('user_id', $user->id)
                    ->where('movie_show_slot_id', $slot->id)
                    ->where('status', '!=', 'cancelled')
                    ->exists();

                return [
                    'id' => $slot->id,
                    'show_date' => $slot->show_date->format('M d, Y'),
                    'show_time' => \Carbon\Carbon::parse($slot->show_time)->format('h:i A'),
                    'screen_name' => $slot->screen_name,
                    'price' => (float) $slot->price,
                    'available_seats' => $slot->available_seats,
                    'total_seats' => $slot->total_seats,
                    'is_booked' => $userBookedThisSlot,
                    'is_sold_out' => $slot->available_seats <= 0,
                ];
            });

        return Inertia::render('MovieTickets/ShowSlots', [
            'movie' => [
                'id' => $movie->id,
                'title' => $movie->title,
                'image' => $movie->image,
                'language' => $movie->language,
                'format' => $movie->format,
                'genre' => $movie->genre,
                'duration' => $movie->duration,
                'rating' => $movie->rating,
            ],
            'cinema' => [
                'id' => $cinema->id,
                'name' => $cinema->name,
                'location' => $cinema->location,
                'type' => $cinema->type,
            ],
            'showSlots' => $showSlots,
        ]);
    }
    
    /**
     * Show movie tickets list
     */
    public function index()
    {
        $user = Auth::user();

        $showSlots = MovieShowSlot::upcomingShows()
            ->paginate(15);

        $userBookedSlotIds = $user 
            ? MovieTicketBooking::where('user_id', $user->id)
                ->where('status', '!=', 'cancelled')
                ->pluck('movie_show_slot_id')
                ->toArray()
            : [];

        return Inertia::render('MovieTickets/Index', [
            'movies' => $showSlots->map(function ($slot) use ($userBookedSlotIds) {
                return [
                    'id' => $slot->id,
                    'title' => $slot->movie->title,
                    'image' => $slot->movie->image,
                    'cinema' => $slot->cinema->name,
                    'cinema_location' => $slot->cinema->location,
                    'price' => (float) $slot->price,
                    'available_seats' => $slot->available_seats,
                    'total_seats' => $slot->total_seats,
                    'show_date' => $slot->show_date->format('M d, Y'),
                    'show_time' => $slot->show_time->format('h:i A'),
                    'language' => $slot->movie->language,
                    'format' => $slot->movie->format,
                    'screen_name' => $slot->screen_name,
                    'is_booked' => in_array($slot->id, $userBookedSlotIds),
                    'seats_full' => $slot->available_seats <= 0,
                ];
            }),
        ]);
    }

    /**
     * Show movie ticket details and booking form
     */
    public function show(MovieShowSlot $movie)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect('/login');
        }

        $existingBooking = MovieTicketBooking::where('user_id', $user->id)
            ->where('movie_show_slot_id', $movie->id)
            ->where('status', '!=', 'cancelled')
            ->first();

        return Inertia::render('MovieTickets/Show', [
            'movie' => [
                'id' => $movie->id,
                'title' => $movie->movie->title,
                'image' => $movie->movie->image,
                'cinema' => $movie->cinema->name,
                'cinema_location' => $movie->cinema->location,
                'price' => (float) $movie->price,
                'available_seats' => $movie->available_seats,
                'total_seats' => $movie->total_seats,
                'show_date' => $movie->show_date->format('M d, Y'),
                'show_time' => $movie->show_time->format('h:i A'),
                'language' => $movie->movie->language,
                'format' => $movie->movie->format,
                'screen_name' => $movie->screen_name,
                'description' => $movie->movie->description,
                'genre' => $movie->movie->genre,
                'duration' => $movie->movie->duration,
                'rating' => $movie->movie->rating,
                'existing_booking' => $existingBooking ? [
                    'id' => $existingBooking->id,
                    'quantity' => $existingBooking->quantity,
                    'total_amount' => (float) $existingBooking->total_amount,
                    'booking_reference' => $existingBooking->booking_reference,
                    'status' => $existingBooking->status,
                    'valid_until' => $existingBooking->valid_until?->format('M d, h:i A'),
                ] : null,
                'seats_full' => $movie->available_seats <= 0,
            ],
        ]);
    }

    /**
     * Store movie ticket booking
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $request->validate([
            'movie_show_slot_id' => 'required|exists:movie_show_slots,id',
            'quantity' => 'required|integer|min:1|max:10',
        ]);

        $slot = MovieShowSlot::findOrFail($request->movie_show_slot_id);

        // Check if show slot is available
        if (!$slot->isAvailable()) {
            return response()->json(['error' => 'Show is sold out'], 400);
        }

        // Check if user already has a booking for this slot
        $existingBooking = MovieTicketBooking::where('user_id', $user->id)
            ->where('movie_show_slot_id', $slot->id)
            ->where('status', '!=', 'cancelled')
            ->first();

        if ($existingBooking) {
            return response()->json(['error' => 'You already have a booking for this show'], 400);
        }

        // Check if enough seats are available
        if ($request->quantity > $slot->available_seats) {
            return response()->json(['error' => "Only {$slot->available_seats} seats available"], 400);
        }

        // Create booking
        $totalAmount = $slot->price * $request->quantity;

        $booking = MovieTicketBooking::create([
            'user_id' => $user->id,
            'movie_show_slot_id' => $slot->id,
            'quantity' => $request->quantity,
            'total_amount' => $totalAmount,
            'amount_per_ticket' => $slot->price,
            'status' => 'confirmed',
        ]);

        // Update available seats
        $slot->updateAvailableSeats($request->quantity);

        return response()->json([
            'success' => true,
            'booking_id' => $booking->id,
            'booking_reference' => $booking->booking_reference,
            'message' => 'Booking confirmed! Proceed to payment.'
        ]);
    }

    /**
     * Show booking details
     */
    public function showBooking(MovieTicketBooking $booking)
    {
        $user = Auth::user();

        if (!$user || $booking->user_id !== $user->id) {
            return redirect('/dashboard');
        }

        $slot = $booking->movieShowSlot;

        return Inertia::render('MovieTickets/Booking', [
            'booking' => [
                'id' => $booking->id,
                'reference' => $booking->booking_reference,
                'quantity' => $booking->quantity,
                'total_amount' => (float) $booking->total_amount,
                'amount_per_ticket' => (float) $booking->amount_per_ticket,
                'status' => $booking->status,
                'valid_until' => $booking->valid_until?->format('M d, h:i A'),
                'created_at' => $booking->created_at->format('M d, Y h:i A'),
            ],
            'movie' => [
                'title' => $slot->movie->title,
                'image' => $slot->movie->image,
                'cinema' => $slot->cinema->name,
                'cinema_location' => $slot->cinema->location,
                'show_date' => $slot->show_date->format('M d, Y'),
                'show_time' => $slot->show_time->format('h:i A'),
                'language' => $slot->movie->language,
                'format' => $slot->movie->format,
                'screen_name' => $slot->screen_name,
                'genre' => $slot->movie->genre,
                'duration' => $slot->movie->duration,
                'rating' => $slot->movie->rating,
            ],
        ]);
    }

    /**
     * Cancel booking
     */
    public function cancel(MovieTicketBooking $booking)
    {
        $user = Auth::user();

        if (!$user || $booking->user_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        if ($booking->cancel()) {
            return response()->json(['success' => true, 'message' => 'Booking cancelled and seats released.']);
        }

        return response()->json(['error' => 'Cannot cancel this booking'], 400);
    }
}
