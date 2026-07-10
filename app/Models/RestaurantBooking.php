<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RestaurantBooking extends Model
{
    protected $fillable = [
        'user_id',
        'restaurant_id',
        'party_size',
        'reservation_date',
        'reservation_time',
        'status',
        'booking_reference',
    ];

    protected $casts = [
        'party_size' => 'integer',
        'reservation_date' => 'date',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (!$model->booking_reference) {
                $model->booking_reference = 'RB-' . strtoupper(uniqid());
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function restaurant()
    {
        return $this->belongsTo(Restaurant::class);
    }

    public function cancel()
    {
        if ($this->status === 'confirmed') {
            $this->update(['status' => 'cancelled']);
            return true;
        }

        return false;
    }
}
