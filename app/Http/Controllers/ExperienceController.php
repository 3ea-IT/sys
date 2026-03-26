<?php

namespace App\Http\Controllers;

use App\Models\Experience;
use App\Models\Hold;
use App\Models\Booking;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

use Illuminate\Support\Facades\File;

class ExperienceController extends Controller
{
    /**
     * Display the list of experiences
     */
    public function index()
    {
        return Inertia::render('Experience/Index', [
            'experiences' => Experience::available()->latest()->paginate(10)
        ]);
    }

    /**
     * Show the experience creation form
     */
    public function create()
    {
        return Inertia::render('Experience/Create');
    }

    /**
     * Store a new experience
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // 2MB
            'category' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'description' => 'nullable|string',
            'highlights' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'hold_token' => 'required|numeric|min:0',
            'hold_duration' => 'required|integer|min:1',
            'capacity' => 'required|integer|min:1',
            'priority_score' => 'integer|min:0|max:100',
            'status' => 'in:active,inactive',
            'booking_mode' => 'required|in:instant,both', // Dual booking modes supported
            'instant_price' => 'nullable|numeric|min:0',
            'instant_availability' => 'required|integer|min:0',
        ]);

        // Ensure the upload path exists
        $uploadPath = public_path('assets/experiences');
        if (!File::exists($uploadPath)) {
            File::makeDirectory($uploadPath, 0755, true);
        }

        // Handle image upload
        if ($request->hasFile('image')) {
            $imageName = time() . '_' . uniqid() . '.' . $request->image->getClientOriginalExtension();
            $request->image->move($uploadPath, $imageName);
            $data['image'] = $imageName;  // Store FILENAME ONLY
        }

        // Create the experience
        Experience::create($data);

        return redirect()->route('experiences.index')
            ->with('success', 'Experience created successfully!');
    }

    /**
     * Show the details of a specific experience
     */
    public function show(Experience $experience)
    {
        $user = auth()->user();
        $holdId = null;
        $isSecured = false;
        $bookingId = null;
        $isBooked = false;
        
        if ($user) {
            // Fetch fresh hold from database - avoid session caching issues
            $userHold = Hold::where('user_id', $user->id)
                ->where('experience_id', $experience->id)
                ->where('status', 'active')
                ->where('expires_at', '>', Carbon::now())
                ->latest('id')
                ->first();
            
            if ($userHold) {
                $isSecured = true;
                $holdId = $userHold->id;
            }
            
            // Fetch fresh booking from database
            $userBooking = Booking::where('user_id', $user->id)
                ->where('experience_id', $experience->id)
                ->where('status', 'confirmed')
                ->latest('id')
                ->first();
            
            if ($userBooking) {
                $isBooked = true;
                $bookingId = $userBooking->id;
            }
        }
        
        $data = [
            'experience' => $experience->load(['holds']),
            'isSecured' => $isSecured,
            'holdId' => $holdId,
            'isBooked' => $isBooked,
            'bookingId' => $bookingId,
            'supportsInstant' => $experience->supportsInstantBooking(),
            'supportsHold' => $experience->supportsHoldBooking(),
        ];
        
        // Calculate instant booking stats - count booked seats from confirmed bookings
        $instantBookedCount = Booking::where('experience_id', $experience->id)
            ->where('booking_type', 'instant')
            ->where('status', 'confirmed')
            ->sum('party_size'); // Sum party_size to get total booked seats
        
        $instantTotalAvailability = $experience->instant_availability;
        
        // Add instant_availability explicitly to data for real-time updates
        $data['instant_availability'] = $instantTotalAvailability;
        $data['instant_booked_count'] = $instantBookedCount;
        $data['instant_remaining_count'] = $instantTotalAvailability - $instantBookedCount;
        
        // Return JSON for AJAX requests, Inertia for page loads
        if (request()->expectsJson()) {
            return response()->json($data);
        }
        
        return Inertia::render('Experience/Show', $data);
    }

    /**
     * Show the form for editing the specified experience
     */
    public function edit(Experience $experience)
    {
        return Inertia::render('Experience/Edit', compact('experience'));
    }

    /**
     * Update the specified experience
     */
    public function update(Request $request, Experience $experience)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // 2MB
            'category' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'description' => 'nullable|string',
            'highlights' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'hold_token' => 'required|numeric|min:0',
            'hold_duration' => 'required|integer|min:1',
            'capacity' => 'required|integer|min:1',
            'priority_score' => 'integer|min:0|max:100',
            'status' => 'in:active,inactive',
            'booking_mode' => 'required|in:instant,both', // Dual booking modes supported
            'instant_price' => 'nullable|numeric|min:0',
            'instant_availability' => 'required|integer|min:0',
        ]);

        $uploadPath = public_path('assets/experiences');

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image safely
            if ($experience->image && File::exists($uploadPath . '/' . $experience->image)) {
                File::delete($uploadPath . '/' . $experience->image);
            }
            
            $imageName = time() . '_' . uniqid() . '.' . $request->image->getClientOriginalExtension();
            $request->image->move($uploadPath, $imageName);
            $data['image'] = $imageName;
        }

        // Update the experience
        $experience->update($data);

        return redirect()->route('experiences.index')
            ->with('success', 'Experience updated successfully!');
    }

    /**
     * Remove the specified experience
     */
    public function destroy(Experience $experience)
    {
        $uploadPath = public_path('assets/experiences');
        
        // Delete image safely
        if ($experience->image && File::exists($uploadPath . '/' . $experience->image)) {
            File::delete($uploadPath . '/' . $experience->image);
        }

        // Delete the experience
        $experience->delete();

        return redirect()->route('experiences.index')
            ->with('success', 'Experience deleted successfully!');
    }
}
