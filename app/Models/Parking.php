<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Parking extends Model
{
    use HasFactory;

    protected $fillable = [
        'temple_id',
        'name',
        'location',
        'image',
        'capacity',
        'price',
        'description',
        'status',
    ];

    protected $casts = [
        'capacity' => 'integer',
        'price' => 'decimal:2',
    ];

    public function temple()
    {
        return $this->belongsTo(Temple::class);
    }
}
