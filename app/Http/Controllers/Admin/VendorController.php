<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\VendorKyc;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VendorController extends Controller
{
    public function index()
    {
        $search = request()->query('search', '');
        $filter = request()->query('filter', 'all');
        
        $query = User::where('role', 'vendor')
            ->with('vendorKyc');

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($filter !== 'all') {
            $query->whereHas('vendorKyc', function($q) use ($filter) {
                $q->where('status', $filter);
            });
        }

        $vendors = $query->orderBy('created_at', 'desc')->paginate(15);

        return Inertia::render('Admin/Vendors/Index', [
            'vendors' => $vendors,
            'search' => $search,
            'filter' => $filter,
        ]);
    }

    public function show($id)
    {
        $user = User::findOrFail($id);
        
        if ($user->role !== 'vendor') {
            abort(404);
        }

        $user->load(['vendorKyc', 'experiences' => function($q) {
            $q->latest()->limit(10);
        }]);

        return Inertia::render('Admin/Vendors/Show', [
            'vendor' => $user,
            'user' => auth()->user(),
        ]);
    }

    public function edit($id)
    {
        $user = User::findOrFail($id);
        
        if ($user->role !== 'vendor') {
            abort(404);
        }

        $user->load(['vendorKyc', 'experiences' => function($q) {
            $q->latest()->limit(10);
        }]);

        return Inertia::render('Admin/Vendors/Edit', [
            'vendor' => $user,
            'user' => auth()->user(),
        ]);
    }

    public function verifyKyc($id): RedirectResponse
    {
        $user = User::findOrFail($id);
        
        if ($user->role !== 'vendor') {
            abort(404);
        }

        $kyc = $user->vendorKyc;
        if (!$kyc) {
            return back()->with('error', 'No KYC found');
        }

        $kyc->update([
            'status' => 'approved',
            'approved_at' => now(),
        ]);

        return redirect()->route('admin.vendors.index')
            ->with('success', 'Vendor KYC approved successfully');
    }

    public function rejectKyc($id, Request $request): RedirectResponse
    {
        $user = User::findOrFail($id);
        
        if ($user->role !== 'vendor') {
            abort(404);
        }

        $request->validate([
            'rejection_reason' => 'required|string|max:500',
        ]);

        $kyc = $user->vendorKyc;
        if (!$kyc) {
            return back()->with('error', 'No KYC found');
        }

        $kyc->update([
            'status' => 'rejected',
            'rejection_reason' => $request->rejection_reason,
        ]);

        return redirect()->route('admin.vendors.index')
            ->with('success', 'Vendor KYC rejected successfully');
    }
}
