<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Experience;
use App\Enums\ExperienceStatus;
use Inertia\Inertia;

class ExperienceController extends Controller
{
    public function index()
    {
        $search = request()->query('search', '');
        $approval_status = request()->query('approval_status', 'all');
        
        $query = Experience::with('vendor');

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('location', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%");
            });
        }

        if ($approval_status !== 'all') {
            $query->where('approval_status', $approval_status);
        }

        $experiences = $query->orderBy('created_at', 'asc')->paginate(15);

        // Map the experiences to include image_url
        $experiences->getCollection()->transform(function ($experience) {
            return [
                'id' => $experience->id,
                'title' => $experience->title,
                'image' => $experience->image,
                'image_url' => $experience->image_url,
                'category' => $experience->category,
                'location' => $experience->location,
                'instant_price' => $experience->instant_price,
                'status' => $experience->status,
                'approval_status' => $experience->approval_status,
                'vendor' => $experience->vendor,
            ];
        });

        return Inertia::render('Admin/Experiences/Index', [
            'experiences' => $experiences,
            'search' => $search,
            'approval_status' => $approval_status,
        ]);
    }

    public function show(Experience $experience)
    {
        $experience->load('vendor.vendorKyc');

        return Inertia::render('Admin/Experiences/Show', [
            'experience' => [
                'id' => $experience->id,
                'title' => $experience->title,
                'image' => $experience->image,
                'image_url' => $experience->image_url,
                'category' => $experience->category,
                'location' => $experience->location,
                'description' => $experience->description,
                'highlights' => $experience->highlights,
                'price' => $experience->price,
                'instant_price' => $experience->instant_price,
                'booking_mode' => $experience->booking_mode,
                'hold_token' => $experience->hold_token,
                'hold_duration' => $experience->hold_duration,
                'capacity' => $experience->capacity,
                'instant_availability' => $experience->instant_availability,
                'priority_score' => $experience->priority_score,
                'status' => $experience->status,
                'approval_status' => $experience->approval_status,
                'rejection_reason' => $experience->rejection_reason,
                'start_date' => $experience->start_date,
                'vendor' => $experience->vendor ? [
                    'id' => $experience->vendor->id,
                    'name' => $experience->vendor->name,
                    'vendor_kyc' => $experience->vendor->vendorKyc ? [
                        'business_type' => $experience->vendor->vendorKyc->business_type,
                    ] : null,
                ] : null,
            ],
        ]);
    }

    public function edit(Experience $experience)
    {
        $experience->load('vendor.vendorKyc');

        return Inertia::render('Admin/Experiences/Edit', [
            'experience' => [
                'id' => $experience->id,
                'title' => $experience->title,
                'category' => $experience->category,
                'location' => $experience->location,
                'description' => $experience->description,
                'highlights' => $experience->highlights,
                'price' => $experience->price,
                'instant_price' => $experience->instant_price,
                'booking_mode' => $experience->booking_mode,
                'hold_token' => $experience->hold_token,
                'hold_duration' => $experience->hold_duration,
                'capacity' => $experience->capacity,
                'instant_availability' => $experience->instant_availability,
                'priority_score' => $experience->priority_score,
                'approval_status' => $experience->approval_status,
                'rejection_reason' => $experience->rejection_reason,
                'start_date' => $experience->start_date,
                'vendor' => $experience->vendor ? [
                    'id' => $experience->vendor->id,
                    'name' => $experience->vendor->name,
                    'email' => $experience->vendor->email,
                ] : null,
            ],
        ]);
    }

    public function approve(Experience $experience)
    {
        $experience->update([
            'approval_status' => 'approved',
            'rejection_reason' => null,
        ]);

        return redirect()->back()->with('success', 'Experience approved successfully');
    }

    public function reject(Experience $experience)
    {
        $experience->update([
            'approval_status' => 'rejected',
            'rejection_reason' => request('rejection_reason'),
        ]);

        return redirect()->back()->with('success', 'Experience rejected successfully');
    }
}
