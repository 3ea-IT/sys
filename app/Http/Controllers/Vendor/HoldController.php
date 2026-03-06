<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Hold;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HoldController extends Controller
{
    /**
     * Show a specific hold for vendor (from their experience)
     */
    public function show(Hold $hold)
    {
        $vendor = Auth::user();

        // Verify vendor owns this hold's experience
        if ($hold->experience->vendor_id !== $vendor->id) {
            abort(403, 'Unauthorized');
        }

        return Inertia::render('Vendor/Holds/Show', [
            'hold' => $hold->load(['user', 'experience']),
        ]);
    }
}
