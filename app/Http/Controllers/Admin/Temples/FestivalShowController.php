<?php

namespace App\Http\Controllers\Admin\Temples;

use App\Http\Controllers\Controller;
use App\Models\FestivalShow;
use App\Models\Temple;
use Inertia\Inertia;

class FestivalShowController extends Controller
{
    /**
     * Display a listing of festival shows
     */
    public function index()
    {
        $search = request()->query('search', '');
        $status = request()->query('status', 'all');

        $query = FestivalShow::with('temple');

        if ($search) {
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
        }

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $festivalShows = $query->orderBy('created_at', 'desc')->paginate(15);

        return Inertia::render('Admin/Temples/FestivalShows/Index', [
            'festivalShows' => $festivalShows,
            'search' => $search,
            'status' => $status,
        ]);
    }

    /**
     * Show the form for creating a new festival show
     */
    public function create()
    {
        return Inertia::render('Admin/Temples/FestivalShows/Create', [
            'temples' => Temple::where('status', 'active')->get(),
        ]);
    }

    /**
     * Store a newly created festival show in storage
     */
    public function store()
    {
        $validated = request()->validate([
            'temple_id' => 'required|exists:temples,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'date' => 'nullable|date',
            'time' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'capacity' => 'nullable|integer|min:1',
            'status' => 'required|in:active,inactive',
        ]);

        // Handle image upload
        if (request()->hasFile('image')) {
            $file = request()->file('image');
            $filename = time() . '-' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('banner'), $filename);
            $validated['image'] = $filename;
        }

        FestivalShow::create($validated);

        return redirect()->route('admin.festival-shows.index')
            ->with('success', 'Festival show created successfully.');
    }

    /**
     * Display the specified festival show
     */
    public function show(FestivalShow $festivalShow)
    {
        return Inertia::render('Admin/Temples/FestivalShows/Show', [
            'festivalShow' => $festivalShow->load('temple'),
        ]);
    }

    /**
     * Show the form for editing the specified festival show
     */
    public function edit(FestivalShow $festivalShow)
    {
        return Inertia::render('Admin/Temples/FestivalShows/Edit', [
            'festivalShow' => $festivalShow->load('temple'),
            'temples' => Temple::where('status', 'active')->get(),
        ]);
    }

    /**
     * Update the specified festival show in storage
     */
    public function update(FestivalShow $festivalShow)
    {
        $validated = request()->validate([
            'temple_id' => 'required|exists:temples,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'date' => 'nullable|date',
            'time' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'capacity' => 'nullable|integer|min:1',
            'status' => 'required|in:active,inactive',
        ]);

        // Handle image upload
        if (request()->hasFile('image')) {
            // Delete old image if exists
            if ($festivalShow->image && file_exists(public_path('banner/' . $festivalShow->image))) {
                unlink(public_path('banner/' . $festivalShow->image));
            }
            
            $file = request()->file('image');
            $filename = time() . '-' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('banner'), $filename);
            $validated['image'] = $filename;
        }

        $festivalShow->update($validated);

        return redirect()->route('admin.festival-shows.index')
            ->with('success', 'Festival show updated successfully.');
    }

    /**
     * Remove the specified festival show from storage
     */
    public function destroy(FestivalShow $festivalShow)
    {
        $festivalShow->delete();

        return redirect()->route('admin.festival-shows.index')
            ->with('success', 'Festival show deleted successfully.');
    }

    /**
     * Toggle status of a festival show
     */
    public function toggleStatus(FestivalShow $festivalShow)
    {
        $festivalShow->update([
            'status' => $festivalShow->status === 'active' ? 'inactive' : 'active'
        ]);

        return redirect()->back()
            ->with('success', 'Festival show status updated successfully.');
    }
}
