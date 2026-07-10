<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TourismPackageBooking extends Model
{
    protected $fillable = [
        'user_id',
        'tourism_package_id',
        'party_size',
        'amount_per_person',
        'total_amount',
        'travel_date',
        'status',
        'booking_reference',
    ];

    protected $casts = [
        'amount_per_person' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'party_size' => 'integer',
        'travel_date' => 'date',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (!$model->booking_reference) {
                $model->booking_reference = 'TP-' . strtoupper(uniqid());
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function tourismPackage()
    {
        return $this->belongsTo(TourismPackage::class);
    }

    public function cancel()
    {
        if ($this->status === 'confirmed') {
            $this->tourismPackage()->increment('available_slots', $this->party_size);
            $this->update(['status' => 'cancelled']);
            return true;
        }

        return false;
    }
}
