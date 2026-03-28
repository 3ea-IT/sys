<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    protected $fillable = ['name', 'logo'];

    public function homeMatchesAsTeam1()
    {
        return $this->hasMany(IplMatch::class, 'team1_id');
    }

    public function homeMatchesAsTeam2()
    {
        return $this->hasMany(IplMatch::class, 'team2_id');
    }
}
