<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FlightBookingAddon extends Model
{
    protected $fillable = [
        'flight_booking_id',
        'type',
        'quantity',
        'unit_price',
        'total_price',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'unit_price' => 'decimal:2',
        'total_price' => 'decimal:2',
    ];

    public function booking()
    {
        return $this->belongsTo(FlightBooking::class, 'flight_booking_id');
    }
}
