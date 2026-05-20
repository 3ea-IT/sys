<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Hold;
use App\Models\Experience;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BookingController extends Controller
{
    /**
     * Display all bookings and holds for vendor's experiences
     */
    public function index()
    {
        $vendor = Auth::user();

        $bookings = Booking::whereHas('experience', function ($query) use ($vendor) {
            $query->where('vendor_id', $vendor->id);
        })->with(['user', 'experience'])
         ->when(request('status'), function ($query) {
             $query->where('status', request('status'));
         })
         ->when(request('search'), function ($query) {
             $query->whereHas('user', function ($q) {
                 $q->where('name', 'like', '%' . request('search') . '%')
                   ->orWhere('email', 'like', '%' . request('search') . '%');
             })->orWhereHas('experience', function ($q) {
                 $q->where('title', 'like', '%' . request('search') . '%');
             });
         })
         ->latest()
         ->get();

        // Get active holds for vendor's experiences
        $holds = Hold::whereHas('experience', function ($query) use ($vendor) {
            $query->where('vendor_id', $vendor->id);
        })->with(['user', 'experience'])
         ->where('status', 'active')
         ->when(request('search'), function ($query) {
            $query->whereHas('user', function ($q) {
                $q->where('name', 'like', '%' . request('search') . '%')
                  ->orWhere('email', 'like', '%' . request('search') . '%');
            })->orWhereHas('experience', function ($q) {
                $q->where('title', 'like', '%' . request('search') . '%');
            });
         })
         ->get()
         ->map(function ($hold) {
             return [
                 'id' => 'hold-' . $hold->id,
                 'hold_id' => $hold->id,
                 'user_id' => $hold->user_id,
                 'experience_id' => $hold->experience_id,
                 'user' => $hold->user,
                 'experience' => $hold->experience,
                 'status' => 'on_hold',
                 'booking_type' => 'hold',
                 'paid_amount' => $hold->experience->hold_token ?? 0,
                 'created_at' => $hold->created_at,
                 'expires_at' => $hold->expires_at,
                 'is_hold' => true,
             ];
         });

        // Transform bookings to same format for consistency
        $transformedBookings = collect($bookings)->map(function ($booking) {
            return [
                'id' => 'booking-' . $booking->id,
                'hold_id' => null,
                'user_id' => $booking->user_id,
                'experience_id' => $booking->experience_id,
                'user' => $booking->user,
                'experience' => $booking->experience,
                'status' => $booking->status,
                'booking_type' => $booking->booking_type,
                'paid_amount' => $booking->paid_amount,
                'created_at' => $booking->created_at,
                'expires_at' => null,
                'is_hold' => false,
            ];
        });

        // Combine and filter
        $allItems = $transformedBookings->concat($holds);

        // Apply status filter
        if (request('status') && request('status') !== 'all') {
            $allItems = $allItems->filter(function ($item) {
                return $item['status'] === request('status');
            });
        }

        // Sort by created_at descending
        $allItems = $allItems->sortByDesc('created_at')->values();

        // Paginate manually
        $page = request('page', 1);
        $perPage = 20;
        $paginated = $allItems->forPage($page, $perPage);

        // Count stats
        $totalBookings = $transformedBookings->count();
        $totalHolds = $holds->count();
        $confirmedBookings = $transformedBookings->where('status', 'confirmed')->count();
        $cancelledBookings = $transformedBookings->where('status', 'cancelled')->count();


        return Inertia::render('Vendor/Bookings/Index', [
            'user' => $vendor,
            'bookings' => [
                'data' => $paginated->values(),
                'total' => $allItems->count(),
                'per_page' => $perPage,
                'current_page' => $page,
            ],
            'stats' => [
                'totalBookings' => $totalBookings,
                'totalHolds' => $totalHolds,
                'confirmedBookings' => $confirmedBookings,
                'cancelledBookings' => $cancelledBookings,
            ],
        ]);
    }

    /**
     * Show booking details
     */
    public function show(Booking $booking)
    {
        // Verify vendor owns this booking's experience
        if ($booking->experience->vendor_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('Vendor/Bookings/Show', [
            'booking' => $booking->load(['user', 'experience', 'hold']),
        ]);
    }



    /**
     * Cancel a booking
     */
    public function cancel(Booking $booking)
    {
        if ($booking->experience->vendor_id !== Auth::id()) {
            abort(403);
        }

        if ($booking->status === 'cancelled') {
            return back()->with('warning', 'This booking is already cancelled.');
        }

        $booking->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
        ]);

        // TODO: Process refund based on cancellation policy

        return back()->with('success', 'Booking cancelled successfully.');
    }

    /**
     * Get settlement/payment information for vendor
     */
    public function settlements()
    {
        $vendor = Auth::user();

        // Calculate total earnings
        $totalEarnings = Booking::whereHas('experience', function ($query) use ($vendor) {
            $query->where('vendor_id', $vendor->id);
        })->where('status', '!=', 'cancelled')
         ->sum('paid_amount');

        // Get settlement history
        $settlements = Booking::whereHas('experience', function ($query) use ($vendor) {
            $query->where('vendor_id', $vendor->id);
        })->with('experience')
         ->where('status', 'confirmed')
         ->selectRaw('DATE(confirmed_at) as settlement_date, COUNT(*) as booking_count, SUM(paid_amount) as amount')
         ->groupBy('settlement_date')
         ->latest('settlement_date')
         ->paginate(20);

        return Inertia::render('Vendor/Settlements', [
            'user' => $vendor,
            'totalEarnings' => $totalEarnings,
            'settlements' => $settlements,
        ]);
    }

    /**
     * Check in / validate a booking
     */
    public function checkIn(Booking $booking)
    {
        if ($booking->experience->vendor_id !== Auth::id()) {
            abort(403);
        }

        if ($booking->status !== 'confirmed') {
            return back()->with('error', 'Only confirmed bookings can be checked in.');
        }

        $booking->update([
            'validated_at' => now(),
        ]);

        return back()->with('success', 'Booking validated successfully.');
    }

    /**
     * Export bookings to CSV
     */
    public function export()
    {
        $vendor = Auth::user();

        $bookings = Booking::whereHas('experience', function ($query) use ($vendor) {
            $query->where('vendor_id', $vendor->id);
        })->with(['user', 'experience'])
         ->get(['id', 'user_id', 'experience_id', 'booking_type', 'status', 'paid_amount', 'created_at']);

        $csv = "Booking ID,User Name,User Email,Experience,Booking Type,Status,Amount,Date\n";

        foreach ($bookings as $booking) {
            $csv .= "{$booking->id},";
            $csv .= "{$booking->user->name},";
            $csv .= "{$booking->user->email},";
            $csv .= "{$booking->experience->title},";
            $csv .= "{$booking->booking_type},";
            $csv .= "{$booking->status},";
            $csv .= "{$booking->paid_amount},";
            $csv .= "{$booking->created_at->format('Y-m-d H:i:s')}\n";
        }

        return response($csv, 200)->header('Content-Type', 'text/csv')->header(
            'Content-Disposition',
            'attachment; filename="bookings-' . now()->format('Y-m-d') . '.csv"'
        );
    }
}
