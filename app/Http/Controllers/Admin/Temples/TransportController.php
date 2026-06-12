<?php

namespace App\Http\Controllers\Admin\Temples;

use App\Http\Controllers\Controller;
use App\Models\Transport;
use App\Models\Temple;
use Inertia\Inertia;

class TransportController extends Controller
{
    /**
     * Display a listing of transports
     */
    public function index()
    {
        $search = request()->query('search', '');
        $status = request()->query('status', 'all');

        $query = Transport::with('temple');

        if ($search) {
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
        }

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $transports = $query->orderBy('created_at', 'desc')->paginate(15);

        return Inertia::render('Admin/Temples/Transports/Index', [
            'transports' => $transports,
            'search' => $search,
            'status' => $status,
        ]);
    }

    /**
     * Show the form for creating a new transport
     */
    public function create()
    {
        return Inertia::render('Admin/Temples/Transports/Create', [
            'temples' => Temple::where('status', 'active')->get(),
            'types' => ['Car', 'Bus', 'Auto', 'Taxi', 'Bike', 'Van'],
        ]);
    }

    /**
     * Store a newly created transport in storage
     */
    public function store()
    {
        $validated = request()->validate([
            'temple_id' => 'required|exists:temples,id',
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:100',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'price' => 'required|numeric|min:0',
            'status' => 'required|in:active,inactive',
        ]);

        // Handle image upload
        if (request()->hasFile('image')) {
            $file = request()->file('image');
            $filename = time() . '-' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('banner'), $filename);
            $validated['image'] = $filename;
        }

        Transport::create($validated);

        return redirect()->route('admin.transports.index')
            ->with('success', 'Transport created successfully');
    }

    /**
     * Display the specified transport
     */
    public function show(Transport $transport)
    {
        return Inertia::render('Admin/Temples/Transports/Show', [
            'transport' => $transport->load('temple'),
        ]);
    }

    /**
     * Show the form for editing the specified transport
     */
    public function edit(Transport $transport)
    {
        return Inertia::render('Admin/Temples/Transports/Edit', [
            'transport' => $transport->load('temple'),
            'temples' => Temple::where('status', 'active')->get(),
            'types' => ['Car', 'Bus', 'Auto', 'Taxi', 'Bike', 'Van'],
        ]);
    }

    /**
     * Update the specified transport in storage
     */
    public function update(Transport $transport)
    {
        $validated = request()->validate([
            'temple_id' => 'required|exists:temples,id',
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:100',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'price' => 'required|numeric|min:0',
            'status' => 'required|in:active,inactive',
        ]);

        // Handle image upload
        if (request()->hasFile('image')) {
            // Delete old image if exists
            if ($transport->image && file_exists(public_path('banner/' . $transport->image))) {
                unlink(public_path('banner/' . $transport->image));
            }
            
            $file = request()->file('image');
            $filename = time() . '-' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('banner'), $filename);
            $validated['image'] = $filename;
        }

        $transport->update($validated);

        return redirect()->route('admin.transports.index')
            ->with('success', 'Transport updated successfully.');
    }

    /**
     * Remove the specified transport from storage
     */
    public function destroy(Transport $transport)
    {
        $transport->delete();

        return redirect()->route('admin.transports.index')
            ->with('success', 'Transport deleted successfully.');
    }

    /**
     * Toggle status of a transport
     */
    public function toggleStatus(Transport $transport)
    {
        $transport->update([
            'status' => $transport->status === 'active' ? 'inactive' : 'active'
        ]);

        return redirect()->back()
            ->with('success', 'Transport status updated successfully.');
    }
}
