<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Experience;
use App\Models\Hold;
use App\Models\WalletTransaction;
use App\Models\Booking;
use App\Models\Movie;
use App\Models\MovieTicketBooking;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // ── Unauthenticated: return public experience list with no hold/booking state ──
        if (!$user) {
            $movies = Movie::whereHas('showSlots', function ($query) {
                $query->where('movie_show_slots.status', '!=', 'sold_out')
                    ->where('show_date', '>=', now()->toDateString())
                    ->where('available_seats', '>', 0);
            })
            ->limit(5)
            ->get()
            ->map(function ($movie) {
                return [
                    'id'                   => $movie->id,
                    'title'                => $movie->title,
                    'image'                => $movie->image,
                    'category'             => $movie->genre ?? 'Movie',
                    'language'             => $movie->language,
                    'format'               => $movie->format,
                    'description'          => $movie->description,
                    'rating'               => $movie->rating,
                    'duration'             => $movie->duration,
                    'distance'             => number_format(mt_rand(1, 10) / 10, 1) . ' mi',
                    'booking_mode'         => 'instant',
                ];
            });

            return Inertia::render('Dashboard', [
                'nearby' => Experience::available()
                    ->orderBy('priority_score', 'desc')
                    ->limit(5)
                    ->get()
                    ->map(function ($exp) {
                        return [
                            'id'                   => $exp->id,
                            'title'                => $exp->title,
                            'image'                => $exp->image,
                            'category'             => $exp->category,
                            'location'             => $exp->location,
                            'price'                => $exp->price,
                            'hold_token'           => $exp->hold_token,
                            'instant_price'        => $exp->instant_price,
                            'instant_availability' => $exp->instant_availability,
                            'booking_mode'         => $exp->booking_mode,
                            'distance'             => number_format(mt_rand(1, 10) / 10, 1) . ' mi',
                            'is_secured'           => false,
                            'hold_id'              => null,
                            'is_booked'            => false,
                            'booking_id'           => null,
                            'seats_full'           => $exp->areAllSeatsFull(),
                        ];
                    }),
                'movies' => $movies,
                'expiring' => [],
                'activity' => [
                    ['title' => 'Welcome', 'subtitle' => 'Sign in to see your activity', 'time' => 'Now'],
                ],
                'wallet' => ['id' => null, 'balance' => 0, 'user_id' => null],
            ]);
        }

        // ── Wallet (create if missing) ────────────────────────────────────────────
        $wallet = $user->wallet ?? $user->wallet()->create(['balance' => 0.00]);

        // ── Expire stale holds in bulk ────────────────────────────────────────────
        Hold::where('expires_at', '<', now())
            ->where('status', 'active')
            ->update(['status' => 'expired']);

        // ── Pre-fetch active holds for this user (2 bulk queries, no N+1) ─────────
        // Keyed by experience_id so map lookups are O(1) instead of N queries.
        $activeHolds = Hold::where('user_id', $user->id)
            ->where('status', 'active')
            ->where('expires_at', '>', Carbon::now())
            ->pluck('id', 'experience_id'); // [experience_id => hold_id]

        // ── Pre-fetch confirmed bookings for this user ────────────────────────────
        $confirmedBookings = Booking::where('user_id', $user->id)
            ->where('status', 'confirmed')
            ->pluck('id', 'experience_id'); // [experience_id => booking_id]

        // ── Nearby experiences ────────────────────────────────────────────────────
        $nearby = Experience::available()
            ->orderBy('priority_score', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($exp) use ($activeHolds, $confirmedBookings) {
                return [
                    'id'                   => $exp->id,
                    'title'                => $exp->title,
                    'image'                => $exp->image,
                    'category'             => $exp->category,
                    'location'             => $exp->location,
                    'price'                => $exp->price,
                    'hold_token'           => $exp->hold_token,
                    'instant_price'        => $exp->instant_price,
                    'instant_availability' => $exp->instant_availability,
                    'booking_mode'         => $exp->booking_mode,
                    'supports_instant'     => $exp->supportsInstantBooking(),
                    'supports_hold'        => $exp->supportsHoldBooking(),
                    'distance'             => number_format(mt_rand(1, 10) / 10, 1) . ' mi',
                    // Resolved via collection lookup — zero extra DB queries
                    'is_secured'           => $activeHolds->has($exp->id),
                    'hold_id'              => $activeHolds->get($exp->id),
                    'is_booked'            => $confirmedBookings->has($exp->id),
                    'booking_id'           => $confirmedBookings->get($exp->id),
                    'seats_full'           => $exp->areAllSeatsFull(),
                ];
            });

        // ── Expiring holds (within 24h) ───────────────────────────────────────────
        $expiring = Hold::where('user_id', $user->id)
            ->where('status', 'active')
            ->where('expires_at', '>', now())
            ->where('expires_at', '<=', now()->copy()->addDay())
            ->with('experience')
            ->orderBy('expires_at')
            ->get()
            ->map(function ($hold) {
                $expires = Carbon::parse($hold->expires_at);
                $now = Carbon::now();

                return [
                    'id'            => $hold->id,
                    'hold_id'       => $hold->id,
                    'experience_id' => $hold->experience->id,
                    'title'         => $hold->experience->title,
                    'location'      => $hold->experience->location,
                    'image'         => $hold->experience->image,
                    'hold_token'    => $hold->experience->hold_token,
                    'instant_price' => $hold->experience->instant_price,
                    'time_left'     => $expires->diffForHumans($now, ['parts' => 1]),
                    'seats_left'    => mt_rand(1, 5),
                    'date'          => $expires->format('M d, h:i A'),
                ];
            });

        // ── Recent activity (wallet transactions) ─────────────────────────────────
        $activity = $wallet->transactions()
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($trans) {
                return [
                    'title'    => ucfirst($trans->type) . ' Completed',
                    'subtitle' => $trans->description ?: 'Wallet transaction',
                    'time'     => $trans->created_at?->diffForHumans(['parts' => 1]) ?? 'Just now',
                ];
            });

        // Mock activity if no transactions yet
        if ($activity->isEmpty()) {
            $activity = collect([
                ['title' => 'Wallet Created', 'subtitle' => 'Your account is ready', 'time' => 'Today'],
                ['title' => 'Profile Updated', 'subtitle' => 'Personal details saved', 'time' => 'Yesterday'],
            ]);
        }

        // ── Wallet data ───────────────────────────────────────────────────────────
        $walletData = [
            'id'      => $wallet->id,
            'balance' => (float) $wallet->balance,
            'user_id' => $wallet->user_id,
        ];

        // ── Movie tickets (unique movies with upcoming shows) ──────────────
        $bookedMovieIds = MovieTicketBooking::where('user_id', $user->id)
            ->where('movie_ticket_bookings.status', '!=', 'cancelled')
            ->join('movie_show_slots', 'movie_ticket_bookings.movie_show_slot_id', '=', 'movie_show_slots.id')
            ->pluck('movie_show_slots.movie_id')
            ->unique();

        $movies = Movie::whereHas('showSlots', function ($query) {
            $query->where('movie_show_slots.status', '!=', 'sold_out')
                ->where('show_date', '>=', now()->toDateString())
                ->where('available_seats', '>', 0);
        })
        ->limit(5)
        ->get()
        ->map(function ($movie) use ($bookedMovieIds) {
            return [
                'id'                   => $movie->id,
                'title'                => $movie->title,
                'image'                => $movie->image,
                'category'             => $movie->genre ?? 'Movie',
                'language'             => $movie->language,
                'format'               => $movie->format,
                'description'          => $movie->description,
                'rating'               => $movie->rating,
                'duration'             => $movie->duration,
                'distance'             => number_format(mt_rand(1, 10) / 10, 1) . ' mi',
                'is_booked'            => $bookedMovieIds->contains($movie->id),
                'booking_mode'         => 'instant',
            ];
        });

        return Inertia::render('Dashboard', compact('nearby', 'expiring', 'activity', 'movies') + ['wallet' => $walletData]);
    }
}