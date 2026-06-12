<?php

namespace App\Http\Controllers\Admin\Temples;

use App\Http\Controllers\Controller;
use App\Models\Stay;
use App\Models\Temple;
use Inertia\Inertia;

class StayController extends Controller
{
    /**
     * Display a listing of stays
     */
    public function index()
    {
        $search = request()->query('search', '');
        $status = request()->query('status', 'all');

        $query = Stay::with('temple');

        if ($search) {
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
        }

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $stays = $query->orderBy('created_at', 'desc')->paginate(15);

        return Inertia::render('Admin/Temples/Stays/Index', [
            'stays' => $stays,
            'search' => $search,
            'status' => $status,
        ]);
    }

    /**
     * Show the form for creating a new stay
     */
    public function create()
    {
        return Inertia::render('Admin/Temples/Stays/Create', [
            'temples' => Temple::where('status', 'active')->get(),
        ]);
    }

    /**
     * Store a newly created stay in storage
     */
    public function store()
    {
        $validated = request()->validate([
            'temple_id' => 'required|exists:temples,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'rating' => 'nullable|numeric|between:0,5',
            'status' => 'required|in:active,inactive',
        ]);

        // Handle image upload
        if (request()->hasFile('image')) {
            $file = request()->file('image');
            $filename = time() . '-' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('banner'), $filename);
            $validated['image'] = $filename;
        }

        Stay::create($validated);

        return redirect()->route('admin.stays.index')
            ->with('success', 'Stay created successfully.');
    }

    /**
     * Display the specified stay
     */
    public function show(Stay $stay)
    {
        return Inertia::render('Admin/Temples/Stays/Show', [
            'stay' => $stay->load('temple'),
        ]);
    }

    /**
     * Show the form for editing the specified stay
     */
    public function edit(Stay $stay)
    {
        return Inertia::render('Admin/Temples/Stays/Edit', [
            'stay' => $stay->load('temple'),
            'temples' => Temple::where('status', 'active')->get(),
        ]);
    }

    /**
     * Update the specified stay in storage
     */
    public function update(Stay $stay)
    {
        $validated = request()->validate([
            'temple_id' => 'required|exists:temples,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'rating' => 'nullable|numeric|between:0,5',
            'status' => 'required|in:active,inactive',
        ]);

        // Handle image upload
        if (request()->hasFile('image')) {
            // Delete old image if exists
            if ($stay->image && file_exists(public_path('banner/' . $stay->image))) {
                unlink(public_path('banner/' . $stay->image));
            }
            
            $file = request()->file('image');
            $filename = time() . '-' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('banner'), $filename);
            $validated['image'] = $filename;
        }

        $stay->update($validated);

        return redirect()->route('admin.stays.index')
            ->with('success', 'Stay updated successfully.');
    }

    /**
     * Remove the specified stay from storage
     */
    public function destroy(Stay $stay)
    {
        $stay->delete();

        return redirect()->route('admin.stays.index')
            ->with('success', 'Stay deleted successfully.');
    }

    /**
     * Toggle status of a stay
     */
    public function toggleStatus(Stay $stay)
    {
        $stay->update([
            'status' => $stay->status === 'active' ? 'inactive' : 'active'
        ]);

        return redirect()->back()
            ->with('success', 'Stay status updated successfully.');
    }
}
