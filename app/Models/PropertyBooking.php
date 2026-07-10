<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PropertyBooking extends Model
{
    protected $fillable = [
        'user_id',
        'room_type_id',
        'check_in',
        'check_out',
        'guest_count',
        'amount_per_night',
        'total_amount',
        'status',
        'booking_reference',
    ];

    protected $casts = [
        'check_in' => 'date',
        'check_out' => 'date',
        'guest_count' => 'integer',
        'amount_per_night' => 'decimal:2',
        'total_amount' => 'decimal:2',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (!$model->booking_reference) {
                $model->booking_reference = 'PB-' . strtoupper(uniqid());
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function roomType()
    {
        return $this->belongsTo(RoomType::class);
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
