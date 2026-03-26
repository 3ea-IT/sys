<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MovieTicketBooking extends Model
{
    protected $fillable = [
        'user_id',
        'movie_show_slot_id',
        'quantity',
        'total_amount',
        'amount_per_ticket',
        'status',
        'booking_reference',
        'valid_until',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'amount_per_ticket' => 'decimal:2',
        'quantity' => 'integer',
        'valid_until' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (!$model->booking_reference) {
                $model->booking_reference = 'MTB-' . strtoupper(uniqid());
            }
            
            if (!$model->valid_until && $model->status === 'confirmed') {
                $model->valid_until = now()->addHours(2); // 2 hours to confirm payment
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function movieShowSlot()
    {
        return $this->belongsTo(MovieShowSlot::class);
    }

    public function isExpired()
    {
        return $this->status === 'confirmed' && $this->valid_until && $this->valid_until->isPast();
    }

    public function cancel()
    {
        if ($this->status === 'confirmed') {
            // Restore available seats
            $this->movieShowSlot()->increment('available_seats', $this->quantity);
            
            // Update slot status if needed
            if ($this->movieShowSlot->status === 'sold_out') {
                $this->movieShowSlot->update(['status' => 'active']);
            }
            
            $this->update(['status' => 'cancelled']);
            return true;
        }
        
        return false;
    }
}
