<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'profile_image',
        'last_login',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'last_login' => 'datetime',
    ];

    public function wallet()
    {
        return $this->hasOne(Wallet::class);
    }

    public function vendorKyc()
    {
        return $this->hasOne(VendorKyc::class);
    }

    public function holds()
    {
        return $this->hasMany(Hold::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    // Vendor relationships
    public function experiences()
    {
        return $this->hasMany(Experience::class, 'vendor_id');
    }

    public function vendorBookings()
    {
        return $this->hasManyThrough(Booking::class, Experience::class, 'vendor_id', 'experience_id');
    }

    public function isVendor()
    {
        return $this->role === 'vendor';
    }

    public function isApprovedVendor()
    {
        return $this->isVendor() && $this->vendor_status === 'approved';
    }
}

