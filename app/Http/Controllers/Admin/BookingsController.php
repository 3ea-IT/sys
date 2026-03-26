<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookingsController extends Controller
{
    public function index()
    {
        $search = request()->query('search', '');
        $booking_type = request()->query('booking_type', 'all');
        $status = request()->query('status', 'all');

        $query = Booking::with(['user', 'experience']);

        if ($search) {
            $query->whereHas('user', function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            })
            ->orWhereHas('experience', function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%");
            });
        }

        if ($booking_type !== 'all') {
            $query->where('booking_type', $booking_type);
        }

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $bookings = $query->orderBy('created_at', 'desc')->paginate(15);

        // Map the bookings to format data
        $bookings->getCollection()->transform(function ($booking) {
            return [
                'id' => $booking->id,
                'user' => $booking->user ? [
                    'id' => $booking->user->id,
                    'name' => $booking->user->name,
                    'email' => $booking->user->email,
                ] : null,
                'experience' => $booking->experience ? [
                    'id' => $booking->experience->id,
                    'title' => $booking->experience->title,
                ] : null,
                'booking_type' => $booking->booking_type,
                'status' => $booking->status,
                'total_amount' => $booking->total_amount,
                'paid_amount' => $booking->paid_amount,
                'confirmed_at' => $booking->confirmed_at,
                'created_at' => $booking->created_at,
            ];
        });

        return Inertia::render('Admin/Bookings/Index', [
            'bookings' => $bookings,
            'search' => $search,
            'booking_type' => $booking_type,
            'status' => $status,
        ]);
    }

    public function show(Booking $booking)
    {
        $booking->load(['user', 'experience']);

        return Inertia::render('Admin/Bookings/Show', [
            'booking' => [
                'id' => $booking->id,
                'booking_type' => $booking->booking_type,
                'status' => $booking->status,
                'total_amount' => $booking->total_amount,
                'paid_amount' => $booking->paid_amount,
                'hold_token_paid' => $booking->hold_token_paid,
                'confirmed_at' => $booking->confirmed_at,
                'created_at' => $booking->created_at,
                'updated_at' => $booking->updated_at,
                'user' => $booking->user ? [
                    'id' => $booking->user->id,
                    'name' => $booking->user->name,
                    'email' => $booking->user->email,
                    'phone' => $booking->user->phone,
                    'city' => $booking->user->city,
                    'state' => $booking->user->state,
                    'country' => $booking->user->country,
                ] : null,
                'experience' => $booking->experience ? [
                    'id' => $booking->experience->id,
                    'title' => $booking->experience->title,
                    'description' => $booking->experience->description,
                    'location' => $booking->experience->location,
                    'price' => $booking->experience->price,
                    'instant_price' => $booking->experience->instant_price,
                    'hold_token' => $booking->experience->hold_token,
                ] : null,
            ],
        ]);
    }
}