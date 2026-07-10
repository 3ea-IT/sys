<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FlightTraveler extends Model
{
    protected $fillable = [
        'flight_booking_id',
        'type',
        'title',
        'first_name',
        'last_name',
        'dob',
        'passport_number',
        'passport_expiry',
        'passport_country',
        'special_assistance',
        'meal_preference',
        'seat_id',
    ];

    protected $casts = [
        'dob' => 'date',
        'passport_expiry' => 'date',
    ];

    public function booking()
    {
        return $this->belongsTo(FlightBooking::class, 'flight_booking_id');
    }

    public function seat()
    {
        return $this->belongsTo(FlightSeat::class, 'seat_id');
    }
}
