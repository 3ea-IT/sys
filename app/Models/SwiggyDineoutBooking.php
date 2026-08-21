<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SwiggyDineoutBooking extends Model
{
    protected $fillable = [
        'user_id',
        'restaurant_id',
        'restaurant_name',
        'reservation_date',
        'reservation_time',
        'guest_count',
        'slot_id',
        'item_id',
        'latitude',
        'longitude',
        'status',
        'booking_reference',
        'swiggy_response',
    ];

    protected $casts = [
        'reservation_date' => 'date',
        'guest_count' => 'integer',
        'slot_id' => 'integer',
        'latitude' => 'float',
        'longitude' => 'float',
        'swiggy_response' => 'array',
    ];

    protected static function booted(): void
    {
        static::creating(function (self $booking) {
            $booking->booking_reference ??= 'SW-' . strtoupper(uniqid());
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
