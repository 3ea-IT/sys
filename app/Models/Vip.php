<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Vip extends Model
{
    use HasFactory;

    protected $fillable = [
        'temple_id',
        'name',
        'description',
        'image',
        'price',
        'duration',
        'benefits',
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
