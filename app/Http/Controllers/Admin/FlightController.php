<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Flight;
use Inertia\Inertia;

class FlightController extends Controller
{
    public function index()
    {
        $search = request()->query('search', '');
        $status = request()->query('status', 'all');

        $query = Flight::query();

        if ($search) {
            $query->where('airline', 'like', "%{$search}%")
                  ->orWhere('flight_number', 'like', "%{$search}%")
                  ->orWhere('origin', 'like', "%{$search}%")
                  ->orWhere('destination', 'like', "%{$search}%");
        }

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $flights = $query->orderBy('departure_time', 'desc')->paginate(15);

        return Inertia::render('Admin/Flights/Index', [
            'flights' => $flights,
            'search' => $search,
            'status' => $status,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Flights/Create');
    }

    public function store()
    {
        $validated = request()->validate([
            'airline' => 'required|string|max:255',
            'flight_number' => 'required|string|max:255',
            'origin' => 'required|string|max:255',
            'destination' => 'required|string|max:255',
            'departure_time' => 'required|date',
            'arrival_time' => 'required|date|after:departure_time',
            'duration_minutes' => 'required|integer|min:1',
            'seat_class' => 'required|in:economy,business,first',
            'price' => 'required|numeric|min:0',
            'capacity' => 'required|integer|min:1',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'status' => 'required|in:active,inactive',
        ]);

        if (request()->hasFile('image')) {
            $file = request()->file('image');
            $filename = time() . '-' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('banner'), $filename);
            $validated['image'] = $filename;
        }

        $validated['seats_available'] = $validated['capacity'];

        Flight::create($validated);

        return redirect()->route('admin.flights.index')
            ->with('success', 'Flight created successfully.');
    }

    public function show(Flight $flight)
    {
        return Inertia::render('Admin/Flights/Show', [
            'flight' => $flight,
        ]);
    }

    public function edit(Flight $flight)
    {
        return Inertia::render('Admin/Flights/Edit', [
            'flight' => $flight,
        ]);
    }

    public function update(Flight $flight)
    {
        $validated = request()->validate([
            'airline' => 'required|string|max:255',
            'flight_number' => 'required|string|max:255',
            'origin' => 'required|string|max:255',
            'destination' => 'required|string|max:255',
            'departure_time' => 'required|date',
            'arrival_time' => 'required|date|after:departure_time',
            'duration_minutes' => 'required|integer|min:1',
            'seat_class' => 'required|in:economy,business,first',
            'price' => 'required|numeric|min:0',
            'capacity' => 'required|integer|min:1',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'status' => 'required|in:active,inactive',
        ]);

        if (request()->hasFile('image')) {
            if ($flight->image && file_exists(public_path('banner/' . $flight->image))) {
                unlink(public_path('banner/' . $flight->image));
            }

            $file = request()->file('image');
            $filename = time() . '-' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('banner'), $filename);
            $validated['image'] = $filename;
        }

        $capacityDelta = $validated['capacity'] - $flight->capacity;
        $validated['seats_available'] = max(0, $flight->seats_available + $capacityDelta);

        $flight->update($validated);

        return redirect()->route('admin.flights.index')
            ->with('success', 'Flight updated successfully.');
    }

    public function destroy(Flight $flight)
    {
        $flight->delete();

        return redirect()->route('admin.flights.index')
            ->with('success', 'Flight deleted successfully.');
    }

    public function toggleStatus(Flight $flight)
    {
        $flight->update([
            'status' => $flight->status === 'active' ? 'inactive' : 'active',
        ]);

        return redirect()->back()->with('success', 'Flight status updated successfully.');
    }
}
