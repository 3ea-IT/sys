<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class VendorMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Check if user is authenticated
        if (!$user) {
            return redirect()->route('login');
        }

        // If user is not a vendor, redirect to their respective dashboard
        if ($user->role !== 'vendor') {
            if ($user->role === 'admin') {
                return redirect('/admin/dashboard');
            } elseif ($user->role === 'user') {
                return redirect('/dashboard');
            }
            
            return redirect('/');
        }

        // Check vendor KYC status
        $kyc = $user->vendorKyc;
        if (!$kyc) {
            return redirect('/vendor/kyc');
        }

        // Block if KYC is incomplete
        if ($kyc->status === 'incomplete') {
            return redirect('/vendor/kyc');
        }

        // Block if KYC is submitted (pending approval)
        if ($kyc->status === 'submitted') {
            return redirect('/vendor/pending-approval');
        }

        // Block if rejected
        if ($kyc->status === 'rejected') {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            
            return redirect('/login')->withErrors([
                'vendor_rejected' => 'Your account has been rejected. Reason: ' . ($kyc->rejection_reason ?? 'No reason provided')
            ]);
        }

        // Only approved vendors can access dashboard
        if ($kyc->status !== 'approved') {
            return redirect('/vendor/pending-approval');
        }

        return $next($request);
    }
}
