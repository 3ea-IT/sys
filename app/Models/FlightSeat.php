<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FlightSeat extends Model
{
    protected $fillable = [
        'flight_id',
        'seat_number',
        'seat_type',
        'price_addon',
    ];

    protected $casts = [
        'price_addon' => 'decimal:2',
    ];

    public function flight()
    {
        return $this->belongsTo(Flight::class);
    }

    public function travelers()
    {
        return $this->hasMany(FlightTraveler::class, 'seat_id');
    }
}
