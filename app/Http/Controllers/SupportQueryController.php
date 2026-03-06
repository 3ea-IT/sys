<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ContactQuery;
use Inertia\Inertia;

class SupportQueryController extends Controller
{
    public function store(Request $request)
    {
        // Validate the incoming request
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|in:booking,payment,account,hold,refund,technical,other website related issue',
            'subject' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'required|string|min:10|max:20',
            'description' => 'required|string|max:1000',
            'priority' => 'required|string|in:low,medium,high,urgent',
        ]);

        // Optionally add user_id if authenticated
        if (auth()->check()) {
            $validated['user_id'] = auth()->id();
        }

        // Store the query in the database
        ContactQuery::create($validated);

        // Return success response for Inertia
        return back()->with('success', 'Query submitted successfully');
    }
}
