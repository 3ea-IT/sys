<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IplMatch extends Model
{
    protected $fillable = [
        'team1_id', 'team2_id', 'venue_id', 'match_date', 'match_time', 'status', 'location', 'banner_image'
    ];

    /**
     * Relationship with the first team (team1).
     */
    public function team1()
    {
        return $this->belongsTo(Team::class, 'team1_id');
    }

    /**
     * Relationship with the second team (team2).
     */
    public function team2()
    {
        return $this->belongsTo(Team::class, 'team2_id');
    }

    /**
     * Relationship with the venue.
     */
    public function venue()
    {
        return $this->belongsTo(Venue::class, 'venue_id');  // Add this relationship
    }
}