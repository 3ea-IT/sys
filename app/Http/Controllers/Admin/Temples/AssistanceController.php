<?php

namespace App\Http\Controllers\Admin\Temples;

use App\Http\Controllers\Controller;
use App\Models\Assistance;
use App\Models\Temple;
use Inertia\Inertia;

class AssistanceController extends Controller
{
    /**
     * Display a listing of assistance services
     */
    public function index()
    {
        $search = request()->query('search', '');
        $status = request()->query('status', 'all');

        $query = Assistance::with('temple');

        if ($search) {
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
        }

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $assistances = $query->orderBy('created_at', 'desc')->paginate(15);

        return Inertia::render('Admin/Temples/Assistance/Index', [
            'assistances' => $assistances,
            'search' => $search,
            'status' => $status,
        ]);
    }

    /**
     * Show the form for creating a new assistance
     */
    public function create()
    {
        return Inertia::render('Admin/Temples/Assistance/Create', [
            'temples' => Temple::where('status', 'active')->get(),
            'types' => ['Medical', 'Security', 'Information', 'Wheelchair', 'Lost & Found', 'Other'],
        ]);
    }

    /**
     * Store a newly created assistance in storage
     */
    public function store()
    {
        $validated = request()->validate([
            'temple_id' => 'required|exists:temples,id',
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:100',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'price' => 'nullable|numeric|min:0',
            'availability' => 'nullable|string|max:100',
            'status' => 'required|in:active,inactive',
        ]);

        // Handle image upload
        if (request()->hasFile('image')) {
            $file = request()->file('image');
            $filename = time() . '-' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('banner'), $filename);
            $validated['image'] = $filename;
        }

        Assistance::create($validated);

        return redirect()->route('admin.assistances.index')
            ->with('success', 'Assistance created successfully');
    }

    /**
     * Display the specified assistance
     */
    public function show(Assistance $assistance)
    {
        return Inertia::render('Admin/Temples/Assistance/Show', [
            'assistance' => $assistance->load('temple'),
        ]);
    }

    /**
     * Show the form for editing the specified assistance
     */
    public function edit(Assistance $assistance)
    {
        return Inertia::render('Admin/Temples/Assistance/Edit', [
            'assistance' => $assistance->load('temple'),
            'temples' => Temple::where('status', 'active')->get(),
            'types' => ['Medical', 'Security', 'Information', 'Wheelchair', 'Lost & Found', 'Other'],
        ]);
    }

    /**
     * Update the specified assistance in storage
     */
    public function update(Assistance $assistance)
    {
        $validated = request()->validate([
            'temple_id' => 'required|exists:temples,id',
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:100',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'price' => 'nullable|numeric|min:0',
            'availability' => 'nullable|string|max:100',
            'status' => 'required|in:active,inactive',
        ]);

        // Handle image upload
        if (request()->hasFile('image')) {
            // Delete old image if exists
            if ($assistance->image && file_exists(public_path('banner/' . $assistance->image))) {
                unlink(public_path('banner/' . $assistance->image));
            }
            
            $file = request()->file('image');
            $filename = time() . '-' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('banner'), $filename);
            $validated['image'] = $filename;
        }

        $assistance->update($validated);

        return redirect()->route('admin.assistance.index')
            ->with('success', 'Assistance service updated successfully.');
    }

    /**
     * Remove the specified assistance from storage
     */
    public function destroy(Assistance $assistance)
    {
        $assistance->delete();

        return redirect()->route('admin.assistance.index')
            ->with('success', 'Assistance service deleted successfully.');
    }

    /**
     * Toggle status of an assistance
     */
    public function toggleStatus(Assistance $assistance)
    {
        $assistance->update([
            'status' => $assistance->status === 'active' ? 'inactive' : 'active'
        ]);

        return redirect()->back()
            ->with('success', 'Assistance service status updated successfully.');
    }
}
