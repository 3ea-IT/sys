<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Guide extends Model
{
    use HasFactory;

    protected $fillable = [
        'temple_id',
        'name',
        'language',
        'description',
        'image',
        'price',
        'rating',
        'experience',
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
