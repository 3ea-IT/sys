<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Assistance extends Model
{
    use HasFactory;

    protected $fillable = [
        'temple_id',
        'name',
        'type',
        'description',
        'image',
        'price',
        'availability',
        'status',
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    public function temple()
    {
        return $this->belongsTo(Temple::class);
    }
}
