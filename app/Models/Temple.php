<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Temple extends Model
{
    protected $fillable = [
        'list_no',
        'name',
        'location',
        'city',
        'state',
        'main_deity',
        'image',
        'rating',
        'crowd_level',
        'has_vip_darshan',
        'online_booking',
        'booking_url',
        'instant_price',
        'hold_token',
        'description',
        'established',
        'significance',
        'amenities',
        'timings',
        'facilities',
        'status',
    ];

    protected $casts = [
        'list_no' => 'integer',
        'rating' => 'decimal:1',
        'instant_price' => 'decimal:2',
        'hold_token' => 'decimal:2',
        'has_vip_darshan' => 'boolean',
        'online_booking' => 'boolean',
        'amenities' => 'array',
        'timings' => 'array',
        'facilities' => 'array',
    ];

    /**
     * Get the image URL for the temple
     */
    public function getImageUrlAttribute()
    {
        if (!$this->image) {
            return null;
        }

        // External URLs and public paths are used as-is
        if (preg_match('#^(https?:)?//#i', $this->image) || str_starts_with($this->image, '/')) {
            return $this->image;
        }

        // Otherwise, assume it's stored in public/banner
        return '/banner/' . $this->image;
    }

    /**
     * Scope to filter active temples
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope to filter by crowd level
     */
    public function scopeByCrowdLevel($query, $crowdLevel)
    {
        return $query->where('crowd_level', $crowdLevel);
    }

    /**
     * Scope to filter temples with VIP darshan
     */
    public function scopeWithVipDarshan($query)
    {
        return $query->where('has_vip_darshan', true);
    }

    /**
     * Scope to search temples
     */
    public function scopeSearch($query, $search)
    {
        return $query->where(function($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('location', 'like', "%{$search}%");
        });
    }
}
