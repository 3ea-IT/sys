<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Experience;
use App\Models\Hold;
use App\Enums\ExperienceStatus;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ExperienceController extends Controller
{
    /**
     * Convert line-by-line highlights to HTML list format
     */
    private function formatHighlights($highlights)
    {
        if (!$highlights) {
            return '';
        }

        // Split by newlines and filter out empty lines
        $lines = array_filter(
            array_map('trim', explode("\n", $highlights)),
            fn($line) => !empty($line)
        );

        if (empty($lines)) {
            return '';
        }

        // Create HTML list
        $htmlItems = array_map(
            fn($line) => '<li>' . htmlspecialchars($line) . '</li>',
            $lines
        );

        return '<ul>' . implode('', $htmlItems) . '</ul>';
    }

    /**
     * Display all vendor's experiences
     */
    public function index()
    {
        $vendor = Auth::user();

        $experiences = $vendor->experiences()
            ->withCount([
                'bookings' => function ($q) {
                    $q->where('status', 'confirmed');
                },
                'holds' => function ($q) {
                    $q->where('status', 'active')
                      ->where('expires_at', '>', now());
                }
            ])
            ->with(['bookings' => function ($q) {
                $q->select('id', 'experience_id', 'status');
            }])
            ->paginate(5)
            ->through(function ($exp) {
                $confirmedCount = $exp->bookings_count ?? 0;
                $holdsCount = $exp->holds_count ?? 0;
                $totalOccupied = $confirmedCount + $holdsCount;
                $capacity = $exp->capacity ?? 1;
                $availableSeats = $capacity - $totalOccupied;

                $exp->confirmedBookings = $confirmedCount;
                $exp->activeHolds = $holdsCount;
                $exp->bookedSeats = $totalOccupied;
                $exp->availableSeats = $availableSeats;
                $exp->confirmedPercent = round(($confirmedCount / $capacity) * 100, 0);
                $exp->holdsPercent = round(($holdsCount / $capacity) * 100, 0);
                $exp->totalPercent = round(($totalOccupied / $capacity) * 100, 0);

                return $exp;
            });

        return Inertia::render('Vendor/Experiences/Index', [
            'user' => $vendor,
            'experiences' => $experiences,
        ]);
    }

    /**
     * Show create experience form
     */
    public function create()
    {
        // Always provide all available categories
        $categories = [
            'Movies' => 'Movies',
            'Sports' => 'Sports',
            'Music Shows' => 'Music Shows',
            'TATA IPL 2026' => 'TATA IPL 2026',
            'Comedy Shows' => 'Comedy Shows',
        ];

        return Inertia::render('Vendor/Experiences/Create', [
            'user' => Auth::user(),
            'categories' => $categories,
            'bookingModes' => [
                'instant' => 'Instant Booking (Full Payment)',
                'both' => 'Both Instant & Reservation',
            ],
        ]);
    }

    /**
     * Store a new experience
     */
    public function store()
    {
        $vendor = Auth::user();

        $validated = request()->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'location' => 'required|string|max:255',
            'start_date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'end_time' => 'nullable|date_format:H:i',
            'description' => 'required|string|max:5000',
            'highlights' => 'required|string|max:1000',
            'booking_mode' => 'required|in:instant,both',
            'price' => 'required_if:booking_mode,instant,both|numeric|min:0',
            'hold_token' => 'required_if:booking_mode,both|numeric|min:0',
            'instant_price' => 'required_if:booking_mode,instant,both|numeric|min:0',
            'hold_duration' => 'required_if:booking_mode,both|integer|in:10,60,360,1440',
            'capacity' => 'required|integer|min:1',
            'instant_availability' => 'required_if:booking_mode,instant,both|integer|min:0',
            'priority_score' => 'nullable|integer|between:0,100',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Handle image upload
        if (request()->hasFile('image')) {
            $image = request()->file('image');
            
            // Create assets/experiences directory if it doesn't exist
            $destinationPath = public_path('assets/experiences');
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }
            
            // Generate unique filename
            $filename = time() . '_' . $image->getClientOriginalName();
            
            // Move file to public/assets/experiences
            $image->move($destinationPath, $filename);
            
            // Store path as /assets/experiences/filename.jpg
            $validated['image'] = '/assets/experiences/' . $filename;
        }

        // Convert highlights to HTML list format
        $validated['highlights'] = $this->formatHighlights($validated['highlights']);

        $validated['vendor_id'] = $vendor->id;
        $validated['status'] = 'active';
        $validated['approval_status'] = 'pending';

        $experience = Experience::create($validated);

        return redirect()->route('vendor.experiences.show', $experience->id)
            ->with('success', 'Experience created successfully. It is pending admin approval.');
    }

    /**
     * Show experience details
     */
    public function show(Experience $experience)
    {
        $this->authorize('update', $experience);

        $bookings = $experience->bookings()
            ->with('user')
            ->latest()
            ->paginate(15);

        $holds = $experience->holds()
            ->with('user')
            ->latest()
            ->paginate(15);

        $confirmedBookings = $experience->bookings()->where('status', 'confirmed')->count();
        $activeHolds = $experience->holds()->where('status', 'active')->where('expires_at', '>', now())->count();
        $totalOccupied = $confirmedBookings + $activeHolds;

        $confirmedPercent = round(($confirmedBookings / $experience->capacity) * 100, 2);
        $holdsPercent = round(($activeHolds / $experience->capacity) * 100, 2);
        $totalPercent = round(($totalOccupied / $experience->capacity) * 100, 2);

        return Inertia::render('Vendor/Experiences/Show', [
            'user' => Auth::user(),
            'experience' => $experience,
            'bookings' => $bookings,
            'holds' => $holds,
            'stats' => [
                'confirmedBookings' => $confirmedBookings,
                'activeHolds' => $activeHolds,
                'totalBookings' => $confirmedBookings + $activeHolds,
                'totalHolds' => $activeHolds,
                'totalCapacity' => $experience->capacity,
                'occupancyRate' => $totalPercent,
                'confirmedPercent' => $confirmedPercent,
                'holdsPercent' => $holdsPercent,
            ],
        ]);
    }

    /**
     * Show edit form
     */
    public function edit(Experience $experience)
    {
        $this->authorize('update', $experience);

        return Inertia::render('Vendor/Experiences/Edit', [
            'user' => Auth::user(),
            'experience' => $experience,
            'categories' => [
                'Movies' => 'Movies',
                'Sports' => 'Sports',
                'Music Shows' => 'Music Shows',
                'TATA IPL 2026' => 'TATA IPL 2026',
                'Comedy Shows' => 'Comedy Shows',
            ],
            'bookingModes' => [
                'instant' => 'Instant Booking (Full Payment)',
                'both' => 'Both Instant & Reservation',
            ],
        ]);
    }

    /**
     * Update experience
     */
    public function update(Experience $experience)
    {
        $this->authorize('update', $experience);

        $validated = request()->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'location' => 'required|string|max:255',
            'start_date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'end_time' => 'nullable|date_format:H:i',
            'description' => 'required|string|max:5000',
            'highlights' => 'required|string|max:1000',
            'booking_mode' => 'required|in:instant,both',
            'price' => 'required_if:booking_mode,instant,both|numeric|min:0',
            'hold_token' => 'required_if:booking_mode,both|numeric|min:0',
            'instant_price' => 'required_if:booking_mode,instant,both|numeric|min:0',
            'hold_duration' => 'required_if:booking_mode,both|integer|in:10,60,360,1440',
            'capacity' => 'required|integer|min:1',
            'instant_availability' => 'required_if:booking_mode,instant,both|integer|min:0',
            'priority_score' => 'nullable|integer|between:0,100',
            'status' => 'required|in:active,inactive',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Handle image upload
        if (request()->hasFile('image')) {
            // Delete old image if exists
            if ($experience->image) {
                $oldImagePath = public_path($experience->image);
                if (file_exists($oldImagePath)) {
                    unlink($oldImagePath);
                }
            }

            $image = request()->file('image');
            
            // Create assets/experiences directory if it doesn't exist
            $destinationPath = public_path('assets/experiences');
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }
            
            // Generate unique filename
            $filename = time() . '_' . $image->getClientOriginalName();
            
            // Move file to public/assets/experiences
            $image->move($destinationPath, $filename);
            
            // Store path as /assets/experiences/filename.jpg
            $validated['image'] = '/assets/experiences/' . $filename;
        }

        // Convert highlights to HTML list format
        $validated['highlights'] = $this->formatHighlights($validated['highlights']);

        $experience->update($validated);

        return back()->with('success', 'Experience updated successfully.');
    }

    /**
     * Delete experience
     */
    public function destroy(Experience $experience)
    {
        $this->authorize('delete', $experience);

        // Check if there are active bookings
        if ($experience->bookings()->exists()) {
            return back()->with('error', 'Cannot delete experience with existing bookings.');
        }

        // Delete image if exists
        if ($experience->image) {
            $imagePath = public_path($experience->image);
            if (file_exists($imagePath)) {
                unlink($imagePath);
            }
        }

        $experience->delete();

        return redirect()->route('vendor.experiences.index')
            ->with('success', 'Experience deleted successfully.');
    }

    /**
     * Get bookings for experience
     */
    public function bookings(Experience $experience)
    {
        $this->authorize('update', $experience);

        $bookings = $experience->bookings()
            ->with('user')
            ->when(request('status'), function ($query) {
                $query->where('status', request('status'));
            })
            ->when(request('search'), function ($query) {
                $query->whereHas('user', function ($q) {
                    $q->where('name', 'like', '%' . request('search') . '%')
                      ->orWhere('email', 'like', '%' . request('search') . '%');
                });
            })
            ->latest()
            ->paginate(20);

        return Inertia::render('Vendor/Experiences/Bookings', [
            'experience' => $experience,
            'bookings' => $bookings,
        ]);
    }

    /**
     * Get holds for experience
     */
    public function holds(Experience $experience)
    {
        $this->authorize('update', $experience);

        $holds = $experience->holds()
            ->with('user')
            ->when(request('status'), function ($query) {
                $query->where('status', request('status'));
            })
            ->when(request('search'), function ($query) {
                $query->whereHas('user', function ($q) {
                    $q->where('name', 'like', '%' . request('search') . '%')
                      ->orWhere('email', 'like', '%' . request('search') . '%');
                });
            })
            ->latest()
            ->paginate(20);

        return Inertia::render('Vendor/Experiences/Holds', [
            'experience' => $experience,
            'holds' => $holds,
        ]);
    }

    /**
     * Validate entry (scan QR code or manual entry)
     */
    public function validateEntry(Experience $experience)
    {
        $this->authorize('update', $experience);

        $validated = request()->validate([
            'booking_reference' => 'required|string',
        ]);

        $booking = Booking::where('reference_number', $validated['booking_reference'])
            ->where('experience_id', $experience->id)
            ->first();

        if (!$booking) {
            return back()->with('error', 'Booking not found.');
        }

        if ($booking->status === 'validated') {
            return back()->with('warning', 'This booking has already been validated.');
        }

        $booking->update(['status' => 'validated']);

        return back()->with('success', 'Booking validated successfully.');
    }

    /**
     * Toggle experience status between active and inactive
     */
    public function toggle(Experience $experience)
    {
        $this->authorize('update', $experience);

        // Toggle status: if active -> inactive, if inactive -> active
        $experience->status = $experience->status === ExperienceStatus::ACTIVE 
            ? ExperienceStatus::INACTIVE 
            : ExperienceStatus::ACTIVE;
        
        $experience->save();

        $statusLabel = $experience->status === ExperienceStatus::ACTIVE ? 'active' : 'inactive';

        return back()->with('success', 'Experience status changed to ' . $statusLabel . '.');
    }
}
