<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\VendorKyc;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;
use Inertia\Response;

class KYCController extends Controller
{
    public function __construct()
    {
        // Ensure only vendors can access KYC routes
        $this->middleware(function ($request, $next) {
            if ($request->user()?->role !== 'vendor') {
                abort(403, 'You must be a vendor to access this page.');
            }
            return $next($request);
        });
    }

    /**
     * Show the KYC form for vendor.
     */
    public function show(): Response
    {
        $vendor = Auth::user();
        $vendorKyc = $vendor->vendorKyc ?? new VendorKyc();

        // If KYC is already submitted or pending approval, show the pending approval page
        if ($vendorKyc->id && in_array($vendorKyc->status, ['submitted', 'approved'])) {
            return Inertia::render('Vendor/PendingApproval');
        }

        return Inertia::render('Vendor/KYC', [
            'vendor' => $vendor,
            'kyc' => $vendorKyc,
        ]);
    }

    /**
     * Show pending approval page.
     */
    public function showPendingApproval(): Response
    {
        return Inertia::render('Vendor/PendingApproval');
    }

    /**
     * Update vendor KYC information.
     */
    public function update(Request $request): RedirectResponse
    {
        $vendor = Auth::user();
        $vendorKyc = $vendor->vendorKyc ?? new VendorKyc(['user_id' => $vendor->id]);

        $validated = $request->validate([
            'business_name' => 'required|string|max:255',
            'business_type' => 'required|string|in:Entertainment,Professional Events,Religious & Wellness,Dining Access,Travel & Attractions',
            'business_description' => 'required|string|max:1000',
            'phone' => 'required|regex:/^\d{10}$/|numeric',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'state' => 'required|string|max:100',
            'postal_code' => 'required|string|max:20',
            'country' => 'required|string|max:100',
            'business_license_number' => 'required|string|max:255',
            'tax_id' => 'required|string|max:255',
            'account_number' => 'required|digits_between:9,18',
            'ifsc_code' => 'required|string|regex:/^[A-Z]{4}0[A-Z0-9]{6}$/',
            'bank_document' => ($vendorKyc->bank_document_path ? 'nullable' : 'required') . '|file|mimes:pdf,jpg,jpeg,png|max:5120', // 5MB max
        ], [
            'phone.regex' => 'Phone number must be exactly 10 digits.',
            'phone.numeric' => 'Phone number must contain only numbers.',
            'phone.required' => 'Phone number is required.',
            'account_number.digits_between' => 'Account number must be between 9 and 18 digits.',
            // 'ifsc_code.regex' => 'IFSC code format is invalid. Use format: AAAA0XXXXXX (e.g., SBIN0001234).',
            'bank_document.required' => 'Bank document (passbook or cancelled cheque) is required.',
        ]);

        // Handle bank document upload
        if ($request->hasFile('bank_document')) {
            // Create directory if it doesn't exist
            $docsDir = public_path('assets/vendor_docs');
            if (!File::isDirectory($docsDir)) {
                File::makeDirectory($docsDir, 0755, true, true);
            }

            // Delete old file if exists
            if ($vendorKyc->bank_document_path) {
                $oldFilePath = public_path($vendorKyc->bank_document_path);
                if (File::exists($oldFilePath)) {
                    File::delete($oldFilePath);
                }
            }

            // Store new file
            $file = $request->file('bank_document');
            $filename = 'vendor_' . $vendor->id . '_' . time() . '.' . $file->getClientOriginalExtension();
            $file->move($docsDir, $filename);
            $validated['bank_document_path'] = 'assets/vendor_docs/' . $filename;
        }

        // Set status to submitted
        $validated['status'] = 'submitted';
        $validated['submitted_at'] = now();

        $vendorKyc->fill($validated);
        $vendorKyc->save();

        return redirect('/vendor/pending-approval')->with('success', 'KYC information submitted successfully!');
    }
}
