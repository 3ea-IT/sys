<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TourismPackage extends Model
{
    protected $fillable = [
        'name',
        'location',
        'image',
        'price',
        'duration',
        'rating',
        'description',
        'itinerary',
        'capacity',
        'available_slots',
        'status',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'rating' => 'decimal:1',
        'itinerary' => 'array',
        'capacity' => 'integer',
        'available_slots' => 'integer',
    ];

    public function getImageUrlAttribute()
    {
        if (!$this->image) {
            return null;
        }

        if (str_starts_with($this->image, '/')) {
            return $this->image;
        }

        return '/banner/' . $this->image;
    }

    public function bookings()
    {
        return $this->hasMany(TourismPackageBooking::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('location', 'like', "%{$search}%");
        });
    }
}
