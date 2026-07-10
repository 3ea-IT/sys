<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FlightBooking extends Model
{
    protected $fillable = [
        'user_id',
        'flight_id',
        'passenger_count',
        'fare_tier',
        'fare_label',
        'baggage_checked_kg',
        'baggage_cabin_kg',
        'seat_selection_included',
        'refundable',
        'change_fee',
        'amount_per_seat',
        'total_amount',
        'fare_total',
        'seats_total',
        'addons_total',
        'contact_email',
        'contact_phone',
        'status',
        'booking_reference',
    ];

    protected $casts = [
        'amount_per_seat' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'fare_total' => 'decimal:2',
        'seats_total' => 'decimal:2',
        'addons_total' => 'decimal:2',
        'change_fee' => 'decimal:2',
        'passenger_count' => 'integer',
        'baggage_checked_kg' => 'integer',
        'baggage_cabin_kg' => 'integer',
        'seat_selection_included' => 'boolean',
        'refundable' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (!$model->booking_reference) {
                $model->booking_reference = 'FL-' . strtoupper(uniqid());
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function flight()
    {
        return $this->belongsTo(Flight::class);
    }

    public function travelers()
    {
        return $this->hasMany(FlightTraveler::class);
    }

    public function addons()
    {
        return $this->hasMany(FlightBookingAddon::class);
    }

    /**
     * Refund respects the fare tier's rules as they were at booking time —
     * full refund on a refundable fare, otherwise total minus the change/cancellation fee.
     */
    public function refundAmount(): float
    {
        if ($this->refundable) {
            return (float) $this->total_amount;
        }

        return max(0, (float) $this->total_amount - (float) $this->change_fee);
    }

    public function cancel()
    {
        if ($this->status === 'confirmed') {
            $this->flight()->increment('seats_available', $this->passenger_count);
            $this->update(['status' => 'cancelled']);
            return true;
        }

        return false;
    }
}
