<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Movie extends Model
{
    protected $fillable = [
        'title',
        'language',
        'format',
        'description',
        'image',
        'duration',
        'genre',
        'rating',
        'status',
    ];

    protected $casts = [
        'duration' => 'integer',
    ];

    public function showSlots()
    {
        return $this->hasMany(MovieShowSlot::class);
    }

    public function activeShowSlots()
    {
        return $this->showSlots()
            ->where('status', '!=', 'sold_out')
            ->where('show_date', '>=', now()->toDateString())
            ->orderBy('show_date')
            ->orderBy('show_time');
    }
}
