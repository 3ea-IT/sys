<?php

namespace App\Http\Controllers\Admin\Properties;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\RoomType;
use Inertia\Inertia;

class RoomTypeController extends Controller
{
    public function index()
    {
        $search = request()->query('search', '');
        $status = request()->query('status', 'all');

        $query = RoomType::with('property');

        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $roomTypes = $query->orderBy('created_at', 'desc')->paginate(15);

        return Inertia::render('Admin/Properties/RoomTypes/Index', [
            'roomTypes' => $roomTypes,
            'search' => $search,
            'status' => $status,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Properties/RoomTypes/Create', [
            'properties' => Property::where('status', 'active')->get(),
        ]);
    }

    public function store()
    {
        $validated = request()->validate([
            'property_id' => 'required|exists:properties,id',
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'capacity' => 'required|integer|min:1',
            'room_count' => 'required|integer|min:1',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'status' => 'required|in:active,inactive',
        ]);

        if (request()->hasFile('image')) {
            $file = request()->file('image');
            $filename = time() . '-' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('banner'), $filename);
            $validated['image'] = $filename;
        }

        RoomType::create($validated);

        return redirect()->route('admin.room-types.index')
            ->with('success', 'Room type created successfully.');
    }

    public function show(RoomType $roomType)
    {
        return Inertia::render('Admin/Properties/RoomTypes/Show', [
            'roomType' => $roomType->load('property'),
        ]);
    }

    public function edit(RoomType $roomType)
    {
        return Inertia::render('Admin/Properties/RoomTypes/Edit', [
            'roomType' => $roomType->load('property'),
            'properties' => Property::where('status', 'active')->get(),
        ]);
    }

    public function update(RoomType $roomType)
    {
        $validated = request()->validate([
            'property_id' => 'required|exists:properties,id',
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'capacity' => 'required|integer|min:1',
            'room_count' => 'required|integer|min:1',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'status' => 'required|in:active,inactive',
        ]);

        if (request()->hasFile('image')) {
            if ($roomType->image && file_exists(public_path('banner/' . $roomType->image))) {
                unlink(public_path('banner/' . $roomType->image));
            }

            $file = request()->file('image');
            $filename = time() . '-' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('banner'), $filename);
            $validated['image'] = $filename;
        }

        $roomType->update($validated);

        return redirect()->route('admin.room-types.index')
            ->with('success', 'Room type updated successfully.');
    }

    public function destroy(RoomType $roomType)
    {
        $roomType->delete();

        return redirect()->route('admin.room-types.index')
            ->with('success', 'Room type deleted successfully.');
    }

    public function toggleStatus(RoomType $roomType)
    {
        $roomType->update([
            'status' => $roomType->status === 'active' ? 'inactive' : 'active',
        ]);

        return redirect()->back()->with('success', 'Room type status updated successfully.');
    }
}
