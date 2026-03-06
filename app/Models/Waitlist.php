<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Waitlist extends Model
{
    protected $fillable = [
        'user_id',
        'experience_id',
        'hold_id',
        'position',
        'status', // waiting, offered, accepted, rejected, expired
        'offered_at',
        'offer_expires_at',
        'notes',
    ];

    protected $casts = [
        'offered_at' => 'datetime',
        'offer_expires_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function experience()
    {
        return $this->belongsTo(Experience::class);
    }

    public function hold()
    {
        return $this->belongsTo(Hold::class);
    }

    /**
     * Add user to waitlist
     */
    public static function addToWaitlist($userId, $experienceId, $holdId = null)
    {
        $lastPosition = self::where('experience_id', $experienceId)
            ->where('status', 'waiting')
            ->max('position') ?? 0;

        return self::create([
            'user_id' => $userId,
            'experience_id' => $experienceId,
            'hold_id' => $holdId,
            'position' => $lastPosition + 1,
            'status' => 'waiting',
        ]);
    }

    /**
     * Get next user in waitlist for an experience
     */
    public static function getNextInQueue($experienceId)
    {
        return self::where('experience_id', $experienceId)
            ->where('status', 'waiting')
            ->orderBy('position', 'asc')
            ->first();
    }

    /**
     * Offer slot to user
     */
    public function makeOffer($durationMinutes = 10)
    {
        $this->update([
            'status' => 'offered',
            'offered_at' => Carbon::now(),
            'offer_expires_at' => Carbon::now()->addMinutes($durationMinutes),
        ]);

        // TODO: Send notification to user
    }

    /**
     * Check if offer has expired
     */
    public function isOfferExpired()
    {
        return $this->status === 'offered' && $this->offer_expires_at < Carbon::now();
    }

    /**
     * Accept waitlist offer
     */
    public function accept()
    {
        $this->update(['status' => 'accepted']);
        
        // Create a new hold for this user
        $hold = Hold::create([
            'user_id' => $this->user_id,
            'experience_id' => $this->experience_id,
            'expires_at' => Carbon::now()->addMinutes(
                Experience::find($this->experience_id)->hold_duration
            ),
            'status' => 'active',
            'source' => 'waitlist', // Track that this came from waitlist
        ]);

        $this->update(['hold_id' => $hold->id]);

        return $hold;
    }

    /**
     * Reject waitlist offer
     */
    public function reject()
    {
        $this->update(['status' => 'rejected']);
    }

    /**
     * Requeue user (move to end of queue)
     */
    public function requeue()
    {
        $lastPosition = self::where('experience_id', $this->experience_id)
            ->where('status', 'waiting')
            ->max('position') ?? 0;

        $this->update([
            'position' => $lastPosition + 1,
            'status' => 'waiting',
        ]);
    }
}
