<?php

namespace App\Http\Controllers\Admin\Temples;

use App\Http\Controllers\Controller;
use App\Models\Vip;
use App\Models\Temple;
use Inertia\Inertia;

class VipController extends Controller
{
    /**
     * Display a listing of VIP packages
     */
    public function index()
    {
        $search = request()->query('search', '');
        $status = request()->query('status', 'all');

        $query = Vip::with('temple');

        if ($search) {
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
        }

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $vips = $query->orderBy('created_at', 'desc')->paginate(15);

        return Inertia::render('Admin/Temples/Vips/Index', [
            'vips' => $vips,
            'search' => $search,
            'status' => $status,
        ]);
    }

    /**
     * Show the form for creating a new VIP package
     */
    public function create()
    {
        return Inertia::render('Admin/Temples/Vips/Create', [
            'temples' => Temple::where('status', 'active')->get(),
        ]);
    }

    /**
     * Store a newly created VIP package in storage
     */
    public function store()
    {
        $validated = request()->validate([
            'temple_id' => 'required|exists:temples,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'price' => 'required|numeric|min:0',
            'duration' => 'nullable|string|max:100',
            'benefits' => 'nullable|string',
            'status' => 'required|in:active,inactive',
        ]);

        // Handle image upload
        if (request()->hasFile('image')) {
            $file = request()->file('image');
            $filename = time() . '-' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('banner'), $filename);
            $validated['image'] = $filename;
        }

        Vip::create($validated);

        return redirect()->route('admin.vips.index')
            ->with('success', 'VIP package created successfully.');
    }

    /**
     * Display the specified VIP package
     */
    public function show(Vip $vip)
    {
        return Inertia::render('Admin/Temples/Vips/Show', [
            'vip' => $vip->load('temple'),
        ]);
    }

    /**
     * Show the form for editing the specified VIP package
     */
    public function edit(Vip $vip)
    {
        return Inertia::render('Admin/Temples/Vips/Edit', [
            'vip' => $vip->load('temple'),
            'temples' => Temple::where('status', 'active')->get(),
        ]);
    }

    /**
     * Update the specified VIP package in storage
     */
    public function update(Vip $vip)
    {
        $validated = request()->validate([
            'temple_id' => 'required|exists:temples,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'price' => 'required|numeric|min:0',
            'duration' => 'nullable|string|max:100',
            'benefits' => 'nullable|string',
            'status' => 'required|in:active,inactive',
        ]);

        // Handle image upload
        if (request()->hasFile('image')) {
            // Delete old image if exists
            if ($vip->image && file_exists(public_path('banner/' . $vip->image))) {
                unlink(public_path('banner/' . $vip->image));
            }
            
            $file = request()->file('image');
            $filename = time() . '-' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('banner'), $filename);
            $validated['image'] = $filename;
        }

        $vip->update($validated);

        return redirect()->route('admin.vips.index')
            ->with('success', 'VIP package updated successfully.');
    }

    /**
     * Remove the specified VIP package from storage
     */
    public function destroy(Vip $vip)
    {
        $vip->delete();

        return redirect()->route('admin.vips.index')
            ->with('success', 'VIP package deleted successfully.');
    }

    /**
     * Toggle status of a VIP package
     */
    public function toggleStatus(Vip $vip)
    {
        $vip->update([
            'status' => $vip->status === 'active' ? 'inactive' : 'active'
        ]);

        return redirect()->back()
            ->with('success', 'VIP package status updated successfully.');
    }
}
