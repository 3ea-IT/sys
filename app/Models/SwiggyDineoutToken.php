<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SwiggyDineoutToken extends Model
{
    protected $fillable = [
        'user_id',
        'client_id',
        'access_token',
        'token_type',
        'scope',
        'expires_in',
        'obtained_at',
        'expires_at',
    ];

    protected $casts = [
        'obtained_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Whether this token is still valid (with a 60s safety buffer,
     * mirroring the original Node client's proactive refresh window).
     */
    public function isValid(): bool
    {
        if (!$this->access_token || !$this->expires_at) {
            return false;
        }

        return now()->addSeconds(60)->lt($this->expires_at);
    }
}
