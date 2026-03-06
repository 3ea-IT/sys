<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactQuery extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'subject',
        'email',
        'phone',
        'description',
        'priority',
        'status',
        'admin_notes',
        'user_id',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
