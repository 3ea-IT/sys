<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DiningOffer extends Model
{
    protected $fillable = [
        'restaurant_id',
        'title',
        'description',
        'discount_percent',
        'valid_until',
        'image',
        'status',
    ];

    protected $casts = [
        'discount_percent' => 'integer',
        'valid_until' => 'date',
    ];

    public function getImageUrlAttribute()
    {
        if (!$this->image) {
            return null;
        }

        if (str_starts_with($this->image, '/')) {
            return $this->image;
        }

        return '/banner/' . $this->image;
    }

    public function restaurant()
    {
        return $this->belongsTo(Restaurant::class);
    }
}
