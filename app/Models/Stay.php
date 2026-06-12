<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Stay extends Model
{
    use HasFactory;

    protected $fillable = [
        'temple_id',
        'name',
        'description',
        'price',
        'image',
        'rating',
        'status',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'rating' => 'decimal:2',
    ];

    public function temple()
    {
        return $this->belongsTo(Temple::class);
    }
}
