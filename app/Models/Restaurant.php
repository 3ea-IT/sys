<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Restaurant extends Model
{
    protected $fillable = [
        'name',
        'location',
        'cuisine',
        'image',
        'price_range',
        'rating',
        'description',
        'opening_hours',
        'table_capacity',
        'status',
    ];

    protected $casts = [
        'rating' => 'decimal:1',
        'opening_hours' => 'array',
        'table_capacity' => 'integer',
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

    public function offers()
    {
        return $this->hasMany(DiningOffer::class);
    }

    public function bookings()
    {
        return $this->hasMany(RestaurantBooking::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('location', 'like', "%{$search}%")
              ->orWhere('cuisine', 'like', "%{$search}%");
        });
    }
}
