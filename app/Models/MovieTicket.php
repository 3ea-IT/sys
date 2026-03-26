<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MovieTicket extends Model
{
    protected $fillable = [
        'cinema_id',
        'movie_title',
        'language',
        'format',
        'show_date',
        'show_time',
        'show_end_time',
        'total_seats',
        'available_seats',
        'price',
        'screen_name',
        'movie_description',
        'movie_image',
        'status',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'show_date' => 'date',
        'show_time' => 'datetime',
        'show_end_time' => 'datetime',
        'total_seats' => 'integer',
        'available_seats' => 'integer',
    ];

    public function cinema()
    {
        return $this->belongsTo(Cinema::class);
    }

    public function bookings()
    {
        return $this->hasMany(MovieTicketBooking::class);
    }

    public function confirmedBookings()
    {
        return $this->bookings()
            ->where('status', 'confirmed')
            ->orWhere('status', 'completed');
    }

    public function isAvailable()
    {
        return $this->status === 'active' && $this->available_seats > 0;
    }

    public function updateAvailableSeats($quantity)
    {
        $this->available_seats = max(0, $this->available_seats - $quantity);
        
        if ($this->available_seats === 0) {
            $this->status = 'sold_out';
        }
        
        $this->save();
    }

    public static function upcomingMovies()
    {
        return static::where('status', '!=', 'sold_out')
            ->where('show_date', '>=', now()->toDateString())
            ->where('available_seats', '>', 0)
            ->with('cinema')
            ->orderBy('show_date')
            ->orderBy('show_time');
    }
}
