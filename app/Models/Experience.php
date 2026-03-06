<?php

namespace App\Models;

use App\Enums\ExperienceStatus;
use Illuminate\Database\Eloquent\Model;

class Experience extends Model
{
    protected $fillable = [
        'vendor_id',
        'title',
        'image',
        'category',
        'location',
        'start_date',
        'start_time',
        'description',
        'highlights',
        'price',
        'hold_token',
        'hold_duration',
        'capacity',
        'priority_score',
        'status',
        // NEW dual-mode fields
        'booking_mode',           // 'instant', 'both'
        'instant_price',          // full instant booking price
        'instant_availability',   // instant seats count
        'approval_status',
        'rejection_reason',
    ];

    protected $casts = [
        'hold_token' => 'decimal:2',
        'price' => 'decimal:2',
        'instant_price' => 'decimal:2',
        'hold_duration' => 'integer', // minutes
        'instant_availability' => 'integer',
        'priority_score' => 'integer',
        'status' => ExperienceStatus::class,
        'start_date' => 'date',
        'start_time' => 'string',
    ];

    // Existing image accessor
    public function getImageUrlAttribute()
    {
        if (!$this->image) return null;
        
        // Extract filename if full path is stored (e.g., /assets/experiences/azure-sky.jpg -> azure-sky.jpg)
        $filename = basename($this->image);
        
        $fullPath = public_path("assets/experiences/{$filename}");
        $relativePath = "assets/experiences/{$filename}";
        
        return file_exists($fullPath) ? asset($relativePath) : null;
    }

    // NEW: Check if supports instant booking
    public function supportsInstantBooking()
    {
        return in_array($this->booking_mode, ['instant', 'both']) 
            && $this->instant_availability > 0;
    }

    // NEW: Check if supports hold booking
    public function supportsHoldBooking()
    {
        return $this->booking_mode === 'both';
    }

    // NEW: Available instant seats
    public function getAvailableInstantSeatsAttribute()
    {
        return max(0, $this->instant_availability);
    }

    // Relationships
    public function vendor()
    {
        return $this->belongsTo(User::class, 'vendor_id');
    }

    public function holds()
    {
        return $this->hasMany(Hold::class);
    }

    // NEW: Confirmed instant bookings
    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    // NEW: Active holds (not expired/converted)
    public function activeHolds()
    {
        return $this->holds()
            ->where('status', 'active')
            ->where('expires_at', '>', now());
    }

    // NEW: Total capacity (hold + instant)
    public function getTotalCapacityAttribute()
    {
        return $this->capacity + ($this->instant_availability ?? 0);
    }

    // Scope for available experiences
    public function scopeAvailable($query)
    {
        return $query->where('status', 'active')
                     ->where('approval_status', 'approved')
                     ->where(function ($q) {
                         $q->where('capacity', '>', 0)
                           ->orWhere('instant_availability', '>', 0);
                     });
    }

    // Scope for priority experiences
    public function scopePriority($query, $score = 80)
    {
        return $query->where('priority_score', '>', $score);
    }
}
