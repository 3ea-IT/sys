<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Experience;
use App\Models\Hold;

class Booking extends Model
{
    protected $fillable = [
        'user_id', 'experience_id', 'booking_type', 'status',
        'total_amount', 'paid_amount', 'hold_token_paid',
        'confirmed_at', 'cancelled_at', 'validated_at'
    ];

    public function user() { return $this->belongsTo(User::class); }
    public function experience() { return $this->belongsTo(Experience::class); }
    public function hold() { return $this->hasOne(Hold::class); }
}
