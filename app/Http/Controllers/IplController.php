<?php

namespace App\Http\Controllers;

use App\Models\IplMatch;
use App\Models\Team;
use App\Models\Venue;
use Illuminate\Http\Request;

class IplController extends Controller
{
    // API endpoint for JSON data
    public function apiIplMatches()
    {
        $matches = IplMatch::with(['team1', 'team2', 'venue'])
            ->where('match_date', '>=', now())
            ->orderBy('match_date')
            ->get();
        return response()->json($matches);
    }

    // Inertia page endpoint for UI
    public function index()
    {
        return inertia('Ipl/Index');
    }
    //Match Detail Page
    public function apiIplMatchDetails($id)
    {
        $match = IplMatch::with(['team1', 'team2', 'venue'])
            ->where('id', $id)
            ->first();

        if (!$match) {
            return response()->json(['error' => 'Match not found'], 404);
        }

        return response()->json($match);
    }
}