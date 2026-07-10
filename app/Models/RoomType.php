<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoomType extends Model
{
    protected $fillable = [
        'property_id',
        'name',
        'price',
        'capacity',
        'amenities',
        'image',
        'room_count',
        'status',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'capacity' => 'integer',
        'amenities' => 'array',
        'room_count' => 'integer',
    ];

    public function getImageUrlAttribute()
    {
        if ($this->image) {
            if (str_starts_with($this->image, '/')) {
                return $this->image;
            }

            return '/banner/' . $this->image;
        }

        // No upload — fall back to a stable, keyless-API photo (locked by id, so it's consistent).
        return "https://loremflickr.com/640/480/bedroom?lock={$this->id}";
    }

    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    public function bookings()
    {
        return $this->hasMany(PropertyBooking::class);
    }

    /**
     * Count of rooms already booked for any night within [checkIn, checkOut)
     */
    public function overlappingBookingsCount(string $checkIn, string $checkOut): int
    {
        return $this->bookings()
            ->where('status', 'confirmed')
            ->where('check_in', '<', $checkOut)
            ->where('check_out', '>', $checkIn)
            ->count();
    }
}
