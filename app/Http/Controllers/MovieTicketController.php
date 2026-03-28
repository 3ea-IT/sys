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

        $movies = Movie::where('status', 'active')
            ->orderBy('title')
            ->get();

        return Inertia::render('MovieTickets/Index', [
            'movies' => $movies->map(function ($movie) {
                return [
                    'id' => $movie->id,
                    'title' => $movie->title,
                    'image' => $movie->image,
                    'language' => $movie->language,
                    'format' => $movie->format,
                    'genre' => $movie->genre,
                    'duration' => $movie->duration,
                    'description' => $movie->description,
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
            'seat_numbers' => 'required|array|min:1',
            'seat_numbers.*' => 'required|string|regex:/^[A-O]\d+$/',
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

        // Validate seat count matches quantity
        $seatNumbers = $request->input('seat_numbers', []);
        if (count($seatNumbers) !== $request->quantity) {
            return response()->json(['error' => 'Number of seats must match quantity'], 400);
        }

        // Check if enough seats are available
        if ($request->quantity > $slot->available_seats) {
            return response()->json(['error' => "Only {$slot->available_seats} seats available"], 400);
        }

        // Create booking with seat numbers
        $totalAmount = $slot->price * $request->quantity;

        $booking = MovieTicketBooking::create([
            'user_id' => $user->id,
            'movie_show_slot_id' => $slot->id,
            'quantity' => $request->quantity,
            'seat_numbers' => $seatNumbers,
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

    /**
     * Show seating selection page
     */
    public function seatingPage(Movie $movie, Cinema $cinema, MovieShowSlot $slot)
    {
        return Inertia::render('MovieTickets/SeatingSelection', [
            'movie' => $movie,
            'cinema' => $cinema,
            'selectedSlot' => [
                'id' => $slot->id,
                'price' => (float) $slot->price,
                'available_seats' => $slot->available_seats,
                'show_date' => $slot->show_date->format('M d, Y'),
                'show_time' => $slot->show_time->format('h:i A'),
                'screen_name' => $slot->screen_name,
            ],
            'quantity' => request('quantity', 1),
            'razorpayKey' => config('services.razorpay.key'),
        ]);
    }

    /**
     * Create Razorpay order for payment
     */
    public function createRazorpayOrder(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $request->validate([
            'movie_show_slot_id' => 'required|exists:movie_show_slots,id',
            'quantity' => 'required|integer|min:1|max:10',
            'seat_numbers' => 'required|array|min:1',
            'seat_numbers.*' => 'required|string|regex:/^[A-O]\d+$/',
        ]);

        $slot = MovieShowSlot::findOrFail($request->movie_show_slot_id);

        // Validate booking before creating order
        if (!$slot->isAvailable()) {
            return response()->json(['error' => 'Show is sold out'], 400);
        }

        $existingBooking = MovieTicketBooking::where('user_id', $user->id)
            ->where('movie_show_slot_id', $slot->id)
            ->where('status', '!=', 'cancelled')
            ->first();

        if ($existingBooking) {
            return response()->json(['error' => 'You already have a booking for this show'], 400);
        }

        $seatNumbers = $request->input('seat_numbers', []);
        if (count($seatNumbers) !== $request->quantity) {
            return response()->json(['error' => 'Number of seats must match quantity'], 400);
        }

        if ($request->quantity > $slot->available_seats) {
            return response()->json(['error' => "Only {$slot->available_seats} seats available"], 400);
        }

        // Create Razorpay order
        $totalAmount = $slot->price * $request->quantity;

        try {
            $razorpay = new \Razorpay\Api\Api(
                config('services.razorpay.key'),
                config('services.razorpay.secret')
            );

            $order = $razorpay->order->create([
                'amount' => $totalAmount * 100, // Amount in paise
                'currency' => 'INR',
                'receipt' => 'booking_' . uniqid(),
                'notes' => [
                    'movie_show_slot_id' => $slot->id,
                    'user_id' => $user->id,
                    'quantity' => $request->quantity,
                    'seat_numbers' => json_encode($seatNumbers),
                ]
            ]);

            return response()->json([
                'success' => true,
                'orderId' => $order->id,
                'amount' => $totalAmount,
                'currency' => 'INR',
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create payment order: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Verify Razorpay payment and create booking
     */
    public function verifyAndCreateBooking(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        try {
            $validated = $request->validate([
                'razorpay_order_id' => 'required|string',
                'razorpay_payment_id' => 'required|string',
                'razorpay_signature' => 'required|string',
                'movie_show_slot_id' => 'required|exists:movie_show_slots,id',
                'quantity' => 'required|integer|min:1|max:10',
                'seat_numbers' => 'required|array|min:1',
                'seat_numbers.*' => 'required|string|regex:/^[A-O]\d+$/',
            ]);
            \Log::info('Verify payment validation passed', ['validated' => $validated]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::warning('Verify payment validation failed', ['errors' => $e->errors(), 'request_data' => $request->all()]);
            return response()->json(['error' => 'Validation failed', 'details' => $e->errors()], 422);
        }

        // Verify Razorpay signature
        $razorpay = new \Razorpay\Api\Api(
            config('services.razorpay.key'),
            config('services.razorpay.secret')
        );

        try {
            $attributes = [
                'razorpay_order_id' => $request->razorpay_order_id,
                'razorpay_payment_id' => $request->razorpay_payment_id,
                'razorpay_signature' => $request->razorpay_signature
            ];

            $razorpay->utility->verifyPaymentSignature($attributes);
            \Log::info('Razorpay signature verification passed');
        } catch (\Exception $e) {
            \Log::error('Razorpay signature verification failed', [
                'error' => $e->getMessage(),
                'order_id' => $request->razorpay_order_id,
                'payment_id' => $request->razorpay_payment_id,
            ]);
            return response()->json(['error' => 'Payment verification failed: ' . $e->getMessage()], 400);
        }

        // Verify slot availability again
        $slot = MovieShowSlot::findOrFail($request->movie_show_slot_id);

        if (!$slot->isAvailable() || $request->quantity > $slot->available_seats) {
            return response()->json(['error' => 'Seats no longer available'], 400);
        }

        // Check if user already has a booking
        $existingBooking = MovieTicketBooking::where('user_id', $user->id)
            ->where('movie_show_slot_id', $slot->id)
            ->where('status', '!=', 'cancelled')
            ->first();

        if ($existingBooking) {
            return response()->json(['error' => 'You already have a booking for this show'], 400);
        }

        // Create booking record
        $seatNumbers = $request->input('seat_numbers', []);
        $totalAmount = $slot->price * $request->quantity;

        $booking = MovieTicketBooking::create([
            'user_id' => $user->id,
            'movie_show_slot_id' => $slot->id,
            'quantity' => $request->quantity,
            'seat_numbers' => $seatNumbers,
            'total_amount' => $totalAmount,
            'amount_per_ticket' => $slot->price,
            'status' => 'completed',
            'booking_reference' => 'BOOK' . strtoupper(uniqid()),
        ]);

        // Update available seats
        $slot->updateAvailableSeats($request->quantity);

        return response()->json([
            'success' => true,
            'booking_id' => $booking->id,
            'booking_reference' => $booking->booking_reference,
            'message' => 'Payment successful! Your booking is confirmed.'
        ]);
    }

    /**
     * Show booking confirmation page with all details
     */
    public function showBookingConfirmation(MovieTicketBooking $booking)
    {
        $user = Auth::user();

        if (!$user || $booking->user_id !== $user->id) {
            return redirect('/login')->with('error', 'Unauthorized access');
        }

        // Get all related data
        $slot = $booking->movieShowSlot;
        $movie = $slot->movie;
        $cinema = $slot->cinema;

        return Inertia::render('MovieTickets/BookingConfirmation', [
            'booking' => [
                'id' => $booking->id,
                'booking_reference' => $booking->booking_reference,
                'quantity' => $booking->quantity,
                'seat_numbers' => is_array($booking->seat_numbers) ? $booking->seat_numbers : json_decode($booking->seat_numbers, true),
                'total_amount' => $booking->total_amount,
                'amount_per_ticket' => $booking->amount_per_ticket,
                'status' => $booking->status,
                'created_at' => $booking->created_at->format('M d, Y h:i A'),
            ],
            'movie' => [
                'id' => $movie->id,
                'title' => $movie->title,
                'image' => $movie->image,
                'category' => $movie->category ?? $movie->genre,
                'genre' => $movie->genre,
                'language' => $movie->language,
                'format' => $movie->format,
                'duration' => $movie->duration,
                'rating' => $movie->rating,
                'description' => $movie->description,
            ],
            'cinema' => [
                'id' => $cinema->id,
                'name' => $cinema->name,
                'location' => $cinema->location,
                'type' => $cinema->type,
                'image' => $cinema->image,
            ],
            'slot' => [
                'id' => $slot->id,
                'show_date' => $slot->show_date->format('Y-m-d'),
                'show_time' => $slot->show_time,
                'screen_name' => $slot->screen_name,
                'price' => $slot->price,
            ],
        ]);
    }
}

