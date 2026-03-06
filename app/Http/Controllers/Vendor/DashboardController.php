<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Experience;
use App\Models\Hold;
use App\Models\VendorKyc;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Show vendor dashboard with key metrics and real-time charts
     */
    public function index()
    {
        $vendor = Auth::user();
        
        // Get vendor's experiences
        $experiences = $vendor->experiences()->count();
        
        // Get total bookings for vendor's experiences
        $totalBookings = Booking::whereHas('experience', function ($query) use ($vendor) {
            $query->where('vendor_id', $vendor->id);
        })->count();

        // Get active holds for vendor's experiences
        $activeHolds = Hold::whereHas('experience', function ($query) use ($vendor) {
            $query->where('vendor_id', $vendor->id);
        })->where('status', 'active')
          ->where('expires_at', '>', now())
          ->count();

        // Get revenue metrics
        $totalRevenue = Booking::whereHas('experience', function ($query) use ($vendor) {
            $query->where('vendor_id', $vendor->id);
        })->sum('paid_amount');

        // Get pending experiences (awaiting approval)
        $pendingExperiences = $vendor->experiences()
            ->where('approval_status', 'pending')
            ->count();

        // Recent bookings
        $recentBookings = Booking::whereHas('experience', function ($query) use ($vendor) {
            $query->where('vendor_id', $vendor->id);
        })->with(['user', 'experience'])
         ->latest()
         ->limit(10)
         ->get();

        // Capacity stats
        $totalCapacity = $vendor->experiences()
            ->where('status', 'active')
            ->sum('capacity');

        $bookedSeats = Booking::whereHas('experience', function ($query) use ($vendor) {
            $query->where('vendor_id', $vendor->id)
                  ->where('status', 'active');
        })->count();

        // Real-time chart data: Revenue trend (last 30 days)
        $revenueTrend = $this->getRevenueTrendData($vendor);

        // Real-time chart data: Bookings trend (last 30 days)
        $bookingsTrend = $this->getBookingsTrendData($vendor);

        // Real-time chart data: Top performing experiences
        $topExperiences = $this->getTopExperiencesData($vendor);

        // Real-time chart data: Occupancy rates
        $occupancyRates = $this->getOccupancyRatesData($vendor);

        // Booking status distribution
        $bookingStatusDistribution = $this->getBookingStatusDistribution($vendor);

        // Active holds expiring soon (next 24 hours)
        $expiringHoldsSoon = Hold::whereHas('experience', function ($query) use ($vendor) {
            $query->where('vendor_id', $vendor->id);
        })->where('status', 'active')
          ->whereBetween('expires_at', [now(), now()->addHours(24)])
          ->count();

        // Get detailed expiring holds for real-time alerts
        $expiringHolds = Hold::whereHas('experience', function ($query) use ($vendor) {
            $query->where('vendor_id', $vendor->id);
        })->where('status', 'active')
          ->whereBetween('expires_at', [now(), now()->addHours(24)])
          ->with(['user', 'experience'])
          ->get()
          ->map(function ($hold) {
              return [
                  'id' => $hold->id,
                  'user_name' => $hold->user?->name,
                  'experience_title' => $hold->experience?->title,
                  'expires_at' => $hold->expires_at,
                  'created_at' => $hold->created_at,
              ];
          });

        // Live experiences
        $liveInventory = $vendor->experiences()
            ->where('status', 'active')
            ->where('approval_status', 'approved')
            ->with('bookings', 'holds')
            ->limit(5)
            ->get()
            ->map(function ($exp) {
                $confirmedBookings = $exp->bookings()->where('status', 'confirmed')->count();
                $activeHolds = $exp->holds()->where('status', 'active')->where('expires_at', '>', now())->count();
                $totalOccupied = $confirmedBookings + $activeHolds;
                
                $confirmedPercent = $exp->capacity > 0 ? round(($confirmedBookings / $exp->capacity) * 100) : 0;
                $holdsPercent = $exp->capacity > 0 ? round(($activeHolds / $exp->capacity) * 100) : 0;
                $occupancyPercent = $exp->capacity > 0 ? round(($totalOccupied / $exp->capacity) * 100) : 0;
                
                return [
                    'id' => $exp->id,
                    'title' => $exp->title,
                    'status' => $exp->status->value,
                    'seatsBooked' => $confirmedBookings + $activeHolds,
                    'confirmedBookings' => $confirmedBookings,
                    'activeHolds' => $activeHolds,
                    'confirmedPercent' => $confirmedPercent,
                    'holdsPercent' => $holdsPercent,
                    'totalSeats' => $exp->capacity,
                    'occupancyPercent' => $occupancyPercent,
                    'image' => $exp->image,
                ];
            });

        // Critical alerts
        $criticalAlerts = [];
        
        // Add detailed alerts for each expiring hold
        foreach ($expiringHolds as $hold) {
            $criticalAlerts[] = [
                'id' => 'hold_' . $hold['id'],
                'type' => 'hold_expiration',
                'title' => 'Hold Expiring Soon',
                'message' => "Hold for {$hold['experience_title']} by {$hold['user_name']} expires soon",
                'expiresAt' => $hold['expires_at'],
                'userData' => $hold['user_name'],
                'experienceTitle' => $hold['experience_title'],
            ];
        }

        if ($pendingExperiences > 0) {
            $criticalAlerts[] = [
                'id' => 'pending_' . $pendingExperiences,
                'type' => 'pending_approval',
                'title' => 'Pending Approval',
                'message' => "You have {$pendingExperiences} experience(s) awaiting approval.",
            ];
        }

        return Inertia::render('Vendor/Dashboard', [
            'user' => $vendor,
            'stats' => [
                'totalExperiences' => $experiences,
                'totalBookings' => $totalBookings,
                'activeHolds' => $activeHolds,
                'totalRevenue' => (float) $totalRevenue,
                'pendingExperiences' => $pendingExperiences,
                'totalCapacity' => $totalCapacity,
                'bookedSeats' => $bookedSeats,
                'availableSeats' => $totalCapacity - $bookedSeats,
                'occupancyPercent' => $totalCapacity > 0 ? round(($bookedSeats / $totalCapacity) * 100) : 0,
                'expiringHoldsSoon' => $expiringHoldsSoon,
            ],
            'recentBookings' => $recentBookings->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'user_name' => $booking->user?->name,
                    'experience_title' => $booking->experience?->title,
                    'amount' => (float) $booking->paid_amount,
                    'status' => $booking->status,
                    'created_at' => $booking->created_at,
                ];
            }),
            'vendorStatus' => $vendor->vendorKyc?->status ?? 'incomplete',
            'chartData' => [
                'revenueTrend' => $revenueTrend,
                'bookingsTrend' => $bookingsTrend,
                'topExperiences' => $topExperiences,
                'occupancyRates' => $occupancyRates,
                'bookingStatusDistribution' => $bookingStatusDistribution,
            ],
            'liveInventory' => $liveInventory,
            'criticalAlerts' => $criticalAlerts,
        ]);
    }

    /**
     * Get revenue trend data for the last 30 days
     */
    private function getRevenueTrendData($vendor)
    {
        $data = [];
        $startDate = Carbon::now()->subDays(30);

        for ($i = 29; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $revenue = Booking::whereHas('experience', function ($query) use ($vendor) {
                $query->where('vendor_id', $vendor->id);
            })->whereDate('created_at', $date->toDateString())
              ->sum('paid_amount');

            $data[] = [
                'date' => $date->format('M d'),
                'fullDate' => $date->format('Y-m-d'),
                'revenue' => (float) $revenue,
            ];
        }

        return $data;
    }

    /**
     * Get bookings trend data for the last 30 days
     */
    private function getBookingsTrendData($vendor)
    {
        $data = [];

        for ($i = 29; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $count = Booking::whereHas('experience', function ($query) use ($vendor) {
                $query->where('vendor_id', $vendor->id);
            })->whereDate('created_at', $date->toDateString())
              ->count();

            $data[] = [
                'date' => $date->format('M d'),
                'fullDate' => $date->format('Y-m-d'),
                'bookings' => $count,
                'holds' => Hold::whereHas('experience', function ($query) use ($vendor) {
                    $query->where('vendor_id', $vendor->id);
                })->whereDate('created_at', $date->toDateString())
                  ->where('status', 'active')
                  ->count(),
            ];
        }

        return $data;
    }

    /**
     * Get top performing experiences
     */
    private function getTopExperiencesData($vendor)
    {
        return $vendor->experiences()
            ->with(['bookings' => function ($query) {
                $query->where('status', 'confirmed');
            }])
            ->get()
            ->map(function ($exp) {
                return [
                    'title' => $exp->title,
                    'bookings' => $exp->bookings->count(),
                    'revenue' => (float) $exp->bookings->sum('paid_amount'),
                ];
            })
            ->sortByDesc('revenue')
            ->take(5)
            ->values();
    }

    /**
     * Get occupancy rate data
     */
    private function getOccupancyRatesData($vendor)
    {
        return $vendor->experiences()
            ->where('status', 'active')
            ->with(['bookings' => function ($query) {
                $query->where('status', 'confirmed');
            }, 'holds' => function ($query) {
                $query->where('status', 'active')
                      ->where('expires_at', '>', now());
            }])
            ->get()
            ->map(function ($exp) {
                $confirmedCount = $exp->bookings->count();
                $holdsCount = $exp->holds->count();
                $totalOccupied = $confirmedCount + $holdsCount;
                
                $confirmedPercent = $exp->capacity > 0 ? round(($confirmedCount / $exp->capacity) * 100) : 0;
                $holdsPercent = $exp->capacity > 0 ? round(($holdsCount / $exp->capacity) * 100) : 0;
                $occupancyPercent = $exp->capacity > 0 ? round(($totalOccupied / $exp->capacity) * 100) : 0;
                
                return [
                    'experience' => $exp->title,
                    'confirmed' => $confirmedCount,
                    'holds' => $holdsCount,
                    'occupancy' => $occupancyPercent,
                    'confirmedPercent' => $confirmedPercent,
                    'holdsPercent' => $holdsPercent,
                    'booked' => $totalOccupied,
                    'capacity' => $exp->capacity,
                ];
            })
            ->sortByDesc('occupancy')
            ->values();
    }

    /**
     * Get booking status distribution
     */
    private function getBookingStatusDistribution($vendor)
    {
        try {
            $statuses = DB::table('bookings')
                ->join('experiences', 'bookings.experience_id', '=', 'experiences.id')
                ->where('experiences.vendor_id', $vendor->id)
                ->select('bookings.status', DB::raw('COUNT(*) as count'))
                ->groupBy('bookings.status')
                ->get();

            if ($statuses->isEmpty()) {
                return [];
            }

            return $statuses->map(function ($status) {
                return [
                    'name' => ucfirst($status->status),
                    'value' => (int) $status->count,
                ];
            })->toArray();
        } catch (\Exception $e) {
            return [];
        }
    }

    /**
     * Show vendor profile
     */
    public function profile()
    {
        $vendor = Auth::user();
        $vendorKyc = VendorKyc::where('user_id', $vendor->id)->first();

        return Inertia::render('Vendor/Profile', [
            'user' => $vendor,
            'vendor' => [
                'id' => $vendor->id,
                'name' => $vendor->name,
                'email' => $vendor->email,
                'business_name' => $vendor->business_name,
                'business_type' => $vendor->business_type,
                'business_description' => $vendor->business_description,
                'phone' => $vendor->phone,
                'address' => $vendor->address,
                'city' => $vendor->city,
                'state' => $vendor->state,
                'postal_code' => $vendor->postal_code,
                'country' => $vendor->country,
                'business_license_number' => $vendor->business_license_number,
                'tax_id' => $vendor->tax_id,
                'vendor_status' => $vendor->vendor_status,
                'vendor_approved_at' => $vendor->vendor_approved_at,
                'vendor_rejection_reason' => $vendor->vendor_rejection_reason,
            ],
            'vendorKyc' => $vendorKyc ? [
                'status' => $vendorKyc->status,
                'business_name' => $vendorKyc->business_name,
                'business_type' => $vendorKyc->business_type,
                'business_description' => $vendorKyc->business_description,
                'business_license_number' => $vendorKyc->business_license_number,
                'tax_id' => $vendorKyc->tax_id,
                'phone' => $vendorKyc->phone,
                'address' => $vendorKyc->address,
                'city' => $vendorKyc->city,
                'state' => $vendorKyc->state,
                'postal_code' => $vendorKyc->postal_code,
                'country' => $vendorKyc->country,
                'account_number' => $vendorKyc->account_number,
                'ifsc_code' => $vendorKyc->ifsc_code,
                'bank_document_path' => $vendorKyc->bank_document_path,
                'submitted_at' => $vendorKyc->submitted_at,
                'approved_at' => $vendorKyc->approved_at,
                'rejection_reason' => $vendorKyc->rejection_reason,
            ] : null,
        ]);
    }

    /**
     * Update vendor profile
     */
    public function updateProfile()
    {
        $vendor = Auth::user();
        $data = request()->validate([
            'phone' => 'required|string|max:20',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'state' => 'required|string|max:100',
            'postal_code' => 'required|string|max:20',
            'country' => 'required|string|max:100',
            'business_description' => 'nullable|string|max:1000',
        ]);

        $vendor->update($data);

        return back()->with('success', 'Profile updated successfully.');
    }

    /**
     * Show personal information section
     */
    public function personalInformation()
    {
        $vendor = Auth::user();
        $vendorKyc = VendorKyc::where('user_id', $vendor->id)->first();

        return Inertia::render('Vendor/Profile/PersonalInformation', [
            'user' => $vendor,
            'vendor' => [
                'id' => $vendor->id,
                'name' => $vendor->name,
                'email' => $vendor->email,
                'phone' => $vendor->phone,
                'address' => $vendor->address,
                'city' => $vendor->city,
                'state' => $vendor->state,
                'postal_code' => $vendor->postal_code,
                'country' => $vendor->country,
                'role' => $vendor->role,
                'last_login' => $vendor->last_login,
            ],
            'vendorKyc' => $vendorKyc,
        ]);
    }

    /**
     * Show business information section
     */
    public function businessInformation()
    {
        $vendor = Auth::user();
        $vendorKyc = VendorKyc::where('user_id', $vendor->id)->first();

        return Inertia::render('Vendor/Profile/BusinessInformation', [
            'user' => $vendor,
            'vendor' => [
                'id' => $vendor->id,
                'business_name' => $vendor->business_name,
                'business_type' => $vendor->business_type,
                'business_description' => $vendor->business_description,
                'business_license_number' => $vendor->business_license_number,
                'tax_id' => $vendor->tax_id,
            ],
            'vendorKyc' => $vendorKyc,
        ]);
    }

    /**
     * Show KYC verification section
     */
    public function kycVerification()
    {
        $vendor = Auth::user();
        $vendorKyc = VendorKyc::where('user_id', $vendor->id)->first();

        return Inertia::render('Vendor/Profile/KYCVerification', [
            'user' => $vendor,
            'vendor' => [
                'id' => $vendor->id,
                'vendor_status' => $vendor->vendor_status,
                'vendor_approved_at' => $vendor->vendor_approved_at,
                'vendor_rejection_reason' => $vendor->vendor_rejection_reason,
            ],
            'vendorKyc' => $vendorKyc ? [
                'status' => $vendorKyc->status,
                'submitted_at' => $vendorKyc->submitted_at,
                'approved_at' => $vendorKyc->approved_at,
                'rejection_reason' => $vendorKyc->rejection_reason,
            ] : null,
        ]);
    }

    /**
     * Show bank and financial section
     */
    public function bankFinancial()
    {
        $vendor = Auth::user();
        $vendorKyc = VendorKyc::where('user_id', $vendor->id)->first();

        return Inertia::render('Vendor/Profile/BankFinancial', [
            'user' => $vendor,
            'vendor' => [
                'id' => $vendor->id,
            ],
            'vendorKyc' => $vendorKyc ? [
                'account_number' => $vendorKyc->account_number,
                'ifsc_code' => $vendorKyc->ifsc_code,
                'bank_document_path' => $vendorKyc->bank_document_path,
            ] : null,
        ]);
    }

    /**
     * Show contact and location section (editable)
     */
    public function contactLocation()
    {
        $vendor = Auth::user();
        $vendorKyc = VendorKyc::where('user_id', $vendor->id)->first();

        return Inertia::render('Vendor/Profile/ContactLocation', [
            'user' => $vendor,
            'vendor' => [
                'id' => $vendor->id,
                'phone' => $vendor->phone,
                'address' => $vendor->address,
                'city' => $vendor->city,
                'state' => $vendor->state,
                'postal_code' => $vendor->postal_code,
                'country' => $vendor->country,
                'business_description' => $vendor->business_description,
            ],
            'vendorKyc' => $vendorKyc,
        ]);
    }

    /**
     * Show analytics/performance page
     */
    public function analytics()
    {
        $vendor = Auth::user();

        $bookingsByStatus = Booking::whereHas('experience', function ($query) use ($vendor) {
            $query->where('vendor_id', $vendor->id);
        })->selectRaw('status, count(*) as count')
         ->groupBy('status')
         ->get();

        $bookingsByCategory = Booking::whereHas('experience', function ($query) use ($vendor) {
            $query->where('vendor_id', $vendor->id);
        })->with('experience')
         ->selectRaw('experiences.category, count(*) as count')
         ->join('experiences', 'bookings.experience_id', '=', 'experiences.id')
         ->groupBy('experiences.category')
         ->get();

        $dailyRevenue = Booking::whereHas('experience', function ($query) use ($vendor) {
            $query->where('vendor_id', $vendor->id);
        })->selectRaw('DATE(created_at) as date, SUM(paid_amount) as revenue')
         ->where('created_at', '>=', now()->subDays(30))
         ->groupBy('date')
         ->get();

        return Inertia::render('Vendor/Analytics', [
            'user' => $vendor,
            'bookingsByStatus' => $bookingsByStatus,
            'bookingsByCategory' => $bookingsByCategory,
            'dailyRevenue' => $dailyRevenue,
        ]);
    }

    /**
     * Get real-time metrics via API
     */
    public function getMetrics()
    {
        $vendor = Auth::user();

        $totalBookings = Booking::whereHas('experience', function ($query) use ($vendor) {
            $query->where('vendor_id', $vendor->id);
        })->count();

        $activeHolds = Hold::whereHas('experience', function ($query) use ($vendor) {
            $query->where('vendor_id', $vendor->id);
        })->where('status', 'active')
          ->where('expires_at', '>', now())
          ->count();

        $totalRevenue = Booking::whereHas('experience', function ($query) use ($vendor) {
            $query->where('vendor_id', $vendor->id);
        })->sum('paid_amount');

        $totalCapacity = $vendor->experiences()
            ->where('status', 'active')
            ->sum('capacity');

        $bookedSeats = Booking::whereHas('experience', function ($query) use ($vendor) {
            $query->where('vendor_id', $vendor->id)
                  ->where('status', 'active');
        })->count();

        // Get detailed expiring holds for real-time alerts
        $expiringHolds = Hold::whereHas('experience', function ($query) use ($vendor) {
            $query->where('vendor_id', $vendor->id);
        })->where('status', 'active')
          ->whereBetween('expires_at', [now(), now()->addHours(24)])
          ->with(['user', 'experience'])
          ->get()
          ->map(function ($hold) {
              return [
                  'id' => $hold->id,
                  'user_name' => $hold->user?->name,
                  'experience_title' => $hold->experience?->title,
                  'expires_at' => $hold->expires_at,
              ];
          });

        $expiringHoldsSoon = $expiringHolds->count();

        return response()->json([
            'stats' => [
                'totalBookings' => $totalBookings,
                'activeHolds' => $activeHolds,
                'totalRevenue' => (float) $totalRevenue,
                'totalCapacity' => $totalCapacity,
                'bookedSeats' => $bookedSeats,
                'availableSeats' => $totalCapacity - $bookedSeats,
                'occupancyPercent' => $totalCapacity > 0 ? round(($bookedSeats / $totalCapacity) * 100) : 0,
                'expiringHoldsSoon' => $expiringHoldsSoon,
            ],
            'expiringHolds' => $expiringHolds,
            'timestamp' => now(),
        ]);
    }

    /**
     * Get chart data via API
     */
    public function getChartData()
    {
        $vendor = Auth::user();

        return response()->json([
            'chartData' => [
                'revenueTrend' => $this->getRevenueTrendData($vendor),
                'bookingsTrend' => $this->getBookingsTrendData($vendor),
                'topExperiences' => $this->getTopExperiencesData($vendor),
                'occupancyRates' => $this->getOccupancyRatesData($vendor),
                'bookingStatusDistribution' => $this->getBookingStatusDistribution($vendor),
            ],
            'timestamp' => now(),
        ]);
    }
}

