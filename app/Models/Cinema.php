<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cinema extends Model
{
    protected $fillable = [
        'name',
        'location',
        'type',
        'total_screens',
        'latitude',
        'longitude',
        'image',
        'description',
        'status',
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'total_screens' => 'integer',
    ];

    public function movieTickets()
    {
        return $this->hasMany(MovieTicket::class);
    }

    public function movieShowSlots()
    {
        return $this->hasMany(MovieShowSlot::class);
    }

    public function activeMovieTickets()
    {
        return $this->movieTickets()
            ->where('status', '!=', 'sold_out')
            ->where('show_date', '>=', now()->toDateString())
            ->orderBy('show_date')
            ->orderBy('show_time');
    }
}
