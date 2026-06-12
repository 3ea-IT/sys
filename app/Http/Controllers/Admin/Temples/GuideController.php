<?php

namespace App\Http\Controllers\Admin\Temples;

use App\Http\Controllers\Controller;
use App\Models\Guide;
use App\Models\Temple;
use Inertia\Inertia;

class GuideController extends Controller
{
    /**
     * Display a listing of guides
     */
    public function index()
    {
        $search = request()->query('search', '');
        $status = request()->query('status', 'all');

        $query = Guide::with('temple');

        if ($search) {
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('language', 'like', "%{$search}%");
        }

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $guides = $query->orderBy('created_at', 'desc')->paginate(15);

        return Inertia::render('Admin/Temples/Guides/Index', [
            'guides' => $guides,
            'search' => $search,
            'status' => $status,
        ]);
    }

    /**
     * Show the form for creating a new guide
     */
    public function create()
    {
        return Inertia::render('Admin/Temples/Guides/Create', [
            'temples' => Temple::where('status', 'active')->get(),
            'languages' => ['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Marathi', 'Gujarati', 'Bengali'],
        ]);
    }

    /**
     * Store a newly created guide in storage
     */
    public function store()
    {
        $validated = request()->validate([
            'temple_id' => 'required|exists:temples,id',
            'name' => 'required|string|max:255',
            'language' => 'required|string|max:100',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'price' => 'nullable|numeric|min:0',
            'rating' => 'nullable|numeric|between:0,5',
            'experience' => 'nullable|string',
            'status' => 'required|in:active,inactive',
        ]);

        // Handle image upload
        if (request()->hasFile('image')) {
            $file = request()->file('image');
            $filename = time() . '-' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('banner'), $filename);
            $validated['image'] = $filename;
        }

        Guide::create($validated);

        return redirect()->route('admin.guides.index')
            ->with('success', 'Guide created successfully.');
    }

    /**
     * Display the specified guide
     */
    public function show(Guide $guide)
    {
        return Inertia::render('Admin/Temples/Guides/Show', [
            'guide' => $guide->load('temple'),
        ]);
    }

    /**
     * Show the form for editing the specified guide
     */
    public function edit(Guide $guide)
    {
        return Inertia::render('Admin/Temples/Guides/Edit', [
            'guide' => $guide->load('temple'),
            'temples' => Temple::where('status', 'active')->get(),
            'languages' => ['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Marathi', 'Gujarati', 'Bengali'],
        ]);
    }

    /**
     * Update the specified guide in storage
     */
    public function update(Guide $guide)
    {
        $validated = request()->validate([
            'temple_id' => 'required|exists:temples,id',
            'name' => 'required|string|max:255',
            'language' => 'required|string|max:100',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'price' => 'nullable|numeric|min:0',
            'rating' => 'nullable|numeric|between:0,5',
            'experience' => 'nullable|string',
            'status' => 'required|in:active,inactive',
        ]);

        // Handle image upload
        if (request()->hasFile('image')) {
            // Delete old image if exists
            if ($guide->image && file_exists(public_path('banner/' . $guide->image))) {
                unlink(public_path('banner/' . $guide->image));
            }
            
            $file = request()->file('image');
            $filename = time() . '-' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('banner'), $filename);
            $validated['image'] = $filename;
        }

        $guide->update($validated);

        return redirect()->route('admin.guides.index')
            ->with('success', 'Guide updated successfully.');
    }

    /**
     * Remove the specified guide from storage
     */
    public function destroy(Guide $guide)
    {
        $guide->delete();

        return redirect()->route('admin.guides.index')
            ->with('success', 'Guide deleted successfully.');
    }

    /**
     * Toggle status of a guide
     */
    public function toggleStatus(Guide $guide)
    {
        $guide->update([
            'status' => $guide->status === 'active' ? 'inactive' : 'active'
        ]);

        return redirect()->back()
            ->with('success', 'Guide status updated successfully.');
    }
}
