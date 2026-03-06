<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Booking;
use App\Models\ContactQuery;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Get statistics
        $totalUsers = User::where('role', 'user')->count();
        $totalVendors = User::where('role', 'vendor')->count();
        $totalBookings = Booking::count();
        $totalRevenue = Booking::where('status', 'confirmed')->sum('total_amount');
        $pendingQueries = ContactQuery::where('status', 'open')->count();
        $totalQueries = ContactQuery::count();

        // Get recent bookings
        $recentBookings = Booking::with(['user', 'experience'])
            ->latest()
            ->limit(10)
            ->get();

        // Get recent queries
        $recentQueries = ContactQuery::latest()
            ->limit(5)
            ->get();

        // Get vendor KYC stats
        $vendorKycStats = DB::table('vendor_kyc')
            ->select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get()
            ->keyBy('status');

        // Booking status chart data
        $bookingsByStatus = Booking::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get();

        // Daily revenue (last 30 days)
        $dailyRevenue = Booking::where('status', 'confirmed')
            ->whereBetween('created_at', [now()->subDays(30), now()])
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('sum(total_amount) as revenue'))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalUsers' => $totalUsers,
                'totalVendors' => $totalVendors,
                'totalBookings' => $totalBookings,
                'totalRevenue' => $totalRevenue,
                'pendingQueries' => $pendingQueries,
                'totalQueries' => $totalQueries,
            ],
            'recentBookings' => $recentBookings,
            'recentQueries' => $recentQueries,
            'vendorKycStats' => $vendorKycStats,
            'bookingsByStatus' => $bookingsByStatus,
            'dailyRevenue' => $dailyRevenue,
        ]);
    }

    public function getStats()
    {
        $totalUsers = User::where('role', 'user')->count();
        $totalVendors = User::where('role', 'vendor')->count();
        $totalBookings = Booking::count();
        $totalRevenue = Booking::where('status', 'confirmed')->sum('total_amount');

        return response()->json([
            'totalUsers' => $totalUsers,
            'totalVendors' => $totalVendors,
            'totalBookings' => $totalBookings,
            'totalRevenue' => $totalRevenue,
        ]);
    }
}
