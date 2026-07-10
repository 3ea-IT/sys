<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\PropertyImage;
use Inertia\Inertia;

class PropertyController extends Controller
{
    public function index()
    {
        $search = request()->query('search', '');
        $status = request()->query('status', 'all');
        $type = request()->query('type', 'all');

        $query = Property::query();

        if ($search) {
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('location', 'like', "%{$search}%");
        }

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        if ($type !== 'all') {
            $query->where('type', $type);
        }

        $properties = $query->orderBy('created_at', 'desc')->paginate(15);

        return Inertia::render('Admin/Properties/Index', [
            'properties' => $properties,
            'search' => $search,
            'status' => $status,
            'type' => $type,
            'types' => ['Hotel', 'Resort', 'Homestay', 'Guest House', 'Vacation Rental'],
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Properties/Create', [
            'types' => ['Hotel', 'Resort', 'Homestay', 'Guest House', 'Vacation Rental'],
            'amenityOptions' => $this->amenityOptions(),
        ]);
    }

    protected function amenityOptions(): array
    {
        return ['Wi-Fi', 'Parking', 'Air Conditioning', 'Swimming Pool', 'Restaurant', 'Breakfast Available'];
    }

    protected function storeGalleryImages(Property $property)
    {
        if (!request()->hasFile('gallery')) {
            return;
        }

        $nextOrder = (int) $property->images()->max('sort_order');

        foreach (request()->file('gallery') as $file) {
            $nextOrder++;
            $filename = time() . '-' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('banner'), $filename);

            PropertyImage::create([
                'property_id' => $property->id,
                'image' => $filename,
                'sort_order' => $nextOrder,
            ]);
        }
    }

    public function store()
    {
        $validated = request()->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:Hotel,Resort,Homestay,Guest House,Vacation Rental',
            'location' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price_per_night' => 'required|numeric|min:0',
            'rating' => 'nullable|numeric|between:0,5',
            'amenities' => 'nullable|array',
            'amenities.*' => 'string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'gallery' => 'nullable|array',
            'gallery.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'status' => 'required|in:active,inactive',
        ]);

        unset($validated['gallery']);

        if (request()->hasFile('image')) {
            $file = request()->file('image');
            $filename = time() . '-' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('banner'), $filename);
            $validated['image'] = $filename;
        }

        $property = Property::create($validated);
        $this->storeGalleryImages($property);

        return redirect()->route('admin.properties.index')
            ->with('success', 'Property created successfully.');
    }

    public function show(Property $property)
    {
        return Inertia::render('Admin/Properties/Show', [
            'property' => $property->load(['roomTypes', 'images']),
        ]);
    }

    public function edit(Property $property)
    {
        return Inertia::render('Admin/Properties/Edit', [
            'property' => $property->load('images'),
            'types' => ['Hotel', 'Resort', 'Homestay', 'Guest House', 'Vacation Rental'],
            'amenityOptions' => $this->amenityOptions(),
        ]);
    }

    public function update(Property $property)
    {
        $validated = request()->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:Hotel,Resort,Homestay,Guest House,Vacation Rental',
            'location' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price_per_night' => 'required|numeric|min:0',
            'rating' => 'nullable|numeric|between:0,5',
            'amenities' => 'nullable|array',
            'amenities.*' => 'string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'gallery' => 'nullable|array',
            'gallery.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'status' => 'required|in:active,inactive',
        ]);

        unset($validated['gallery']);

        if (request()->hasFile('image')) {
            if ($property->image && file_exists(public_path('banner/' . $property->image))) {
                unlink(public_path('banner/' . $property->image));
            }

            $file = request()->file('image');
            $filename = time() . '-' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('banner'), $filename);
            $validated['image'] = $filename;
        }

        $property->update($validated);
        $this->storeGalleryImages($property);

        return redirect()->route('admin.properties.index')
            ->with('success', 'Property updated successfully.');
    }

    public function destroyImage(Property $property, PropertyImage $image)
    {
        if ($image->property_id !== $property->id) {
            abort(404);
        }

        if ($image->image && file_exists(public_path('banner/' . $image->image))) {
            unlink(public_path('banner/' . $image->image));
        }

        $image->delete();

        return redirect()->back()->with('success', 'Image removed.');
    }

    public function destroy(Property $property)
    {
        $property->delete();

        return redirect()->route('admin.properties.index')
            ->with('success', 'Property deleted successfully.');
    }

    public function toggleStatus(Property $property)
    {
        $property->update([
            'status' => $property->status === 'active' ? 'inactive' : 'active',
        ]);

        return redirect()->back()->with('success', 'Property status updated successfully.');
    }
}
