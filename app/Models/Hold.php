<?php
// app/Models/Hold.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Hold extends Model
{
    protected $fillable = [
        'user_id',
        'experience_id', 
        'expires_at',
        'party_size',
        'per_person_amount',
        'status',
        'source', // 'direct' or 'waitlist'
        'confirmed_at',
        'released_at',
        'expired_at',
        'release_reason',
        'expire_reason',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'confirmed_at' => 'datetime',
        'released_at' => 'datetime',
        'expired_at' => 'datetime',
    ];

    // FIXED: Prevent expires_at auto-updating
    const UPDATED_AT = null;

    /**
     * Status Constants
     */
    const STATUS_ACTIVE = 'active';
    const STATUS_CONFIRMED = 'confirmed';
    const STATUS_RELEASED = 'released';
    const STATUS_EXPIRED = 'expired';

    const SOURCE_DIRECT = 'direct';
    const SOURCE_WAITLIST = 'waitlist';

    const RELEASE_REASONS = [
        'user_requested',
        'payment_failed',
        'expired',
        'admin_released',
    ];

    public function experience()
    {
        return $this->belongsTo(Experience::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function waitlist()
    {
        return $this->hasOne(Waitlist::class);
    }

    /**
     * Get time remaining in seconds
     */
    public function getTimeRemainingAttribute()
    {
        if ($this->status !== self::STATUS_ACTIVE) {
            return 0;
        }

        $remaining = $this->expires_at->diffInSeconds(Carbon::now());
        return max(0, $remaining);
    }

    /**
     * Check if hold is expiring soon (within 5 minutes)
     */
    public function isExpiringSoon($minutesThreshold = 5)
    {
        if ($this->status !== self::STATUS_ACTIVE) {
            return false;
        }

        return $this->time_remaining <= ($minutesThreshold * 60);
    }

    /**
     * Check if hold has expired
     */
    public function hasExpired()
    {
        return $this->expires_at < Carbon::now();
    }

    /**
     * Confirm the hold (convert to booking)
     */
    public function confirm($bookingId = null)
    {
        return $this->update([
            'status' => self::STATUS_CONFIRMED,
            'confirmed_at' => Carbon::now(),
        ]);
    }

    /**
     * Release the hold
     */
    public function release($reason = 'user_requested')
    {
        return $this->update([
            'status' => self::STATUS_RELEASED,
            'released_at' => Carbon::now(),
            'release_reason' => $reason,
        ]);
    }

    /**
     * Auto-expire the hold
     */
    public function autoExpire($reason = 'expired')
    {
        return $this->update([
            'status' => self::STATUS_EXPIRED,
            'expired_at' => Carbon::now(),
            'expire_reason' => $reason,
        ]);
    }

    /**
     * Get scope for active holds
     */
    public function scopeActive($query)
    {
        return $query->where('status', self::STATUS_ACTIVE)
                     ->where('expires_at', '>', Carbon::now());
    }

    /**
     * Get scope for expired holds
     */
    public function scopeExpired($query)
    {
        return $query->where('expires_at', '<=', Carbon::now())
                     ->where('status', self::STATUS_ACTIVE);
    }

    /**
     * Get scope for expiring soon
     */
    public function scopeExpiringSoon($query, $minutes = 5)
    {
        return $query->where('status', self::STATUS_ACTIVE)
                     ->whereRaw('TIMESTAMPDIFF(MINUTE, NOW(), expires_at) <= ?', [$minutes])
                     ->where('expires_at', '>', Carbon::now());
    }
}
