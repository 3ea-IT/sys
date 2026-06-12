<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class FestivalShow extends Model
{
    use HasFactory;

    protected $table = 'festival_shows';

    protected $fillable = [
        'temple_id',
        'name',
        'description',
        'image',
        'date',
        'time',
        'price',
        'capacity',
        'status',
    ];

    protected $casts = [
        'date' => 'date',
        'price' => 'decimal:2',
        'capacity' => 'integer',
    ];

    public function temple()
    {
        return $this->belongsTo(Temple::class);
    }
}
