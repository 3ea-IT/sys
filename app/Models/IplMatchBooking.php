<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IplMatchBooking extends Model
{
    protected $fillable = [
        'user_id',
        'ipl_match_id',
        'quantity',
        'seat_numbers',
        'total_amount',
        'amount_per_ticket',
        'status',
        'booking_reference',
        'razorpay_order_id',
        'razorpay_payment_id',
        'razorpay_signature',
        'payment_status',
        'payment_details',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'total_amount' => 'decimal:2',
        'amount_per_ticket' => 'decimal:2',
        'seat_numbers' => 'array',
        'payment_details' => 'array',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (!$model->booking_reference) {
                $model->booking_reference = 'IMB-' . strtoupper(uniqid());
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function iplMatch()
    {
        return $this->belongsTo(IplMatch::class, 'ipl_match_id');
    }
}
