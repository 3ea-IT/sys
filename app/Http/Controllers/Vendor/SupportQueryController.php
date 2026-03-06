<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ContactQuery;

class SupportQueryController extends Controller
{
    public function store(Request $request)
    {
        // Validate the incoming request
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|in:experience,booking,payment,account,customer,technical,other vendor related issue',
            'subject' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'required|string|min:10|max:20',
            'description' => 'required|string|max:1000',
            'priority' => 'required|string|in:low,medium,high,urgent',
        ]);

        // Add user_id (vendor must be authenticated to access this route)
        $validated['user_id'] = auth()->id();

        // Store the query in the database
        ContactQuery::create($validated);

        // Return success response
        return back()->with('success', 'Query submitted successfully');
    }
}
