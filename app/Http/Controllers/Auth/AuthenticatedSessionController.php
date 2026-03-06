<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        // Redirect based on user role and status
        $user = Auth::user();
        
        if ($user->role === 'vendor') {
            // Get vendor KYC information
            $vendorKyc = $user->vendorKyc;

            // Vendor rejected
            if ($vendorKyc && $vendorKyc->status === 'rejected') {
                Auth::guard('web')->logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();
                
                $reason = $vendorKyc->rejection_reason ?? 'No reason provided';
                return redirect('login')->withErrors([
                    'vendor_rejected' => "Your account has been rejected by the admin. Reason: {$reason}"
                ])->onlyInput('email');
            }

            // Vendor with incomplete KYC
            if (!$vendorKyc || $vendorKyc->status === 'incomplete') {
                return redirect()->intended('/vendor/kyc');
            }

            // Vendor with submitted KYC (pending approval)
            if ($vendorKyc->status === 'submitted') {
                return redirect()->intended('/vendor/pending-approval');
            }

            // Vendor approved or any other status
            return redirect()->intended('/vendor/dashboard');
        }

        // Regular user - only if role is 'user'
        if ($user->role === 'user') {
            return redirect()->intended(RouteServiceProvider::HOME);
        }

        // Admin users
        if ($user->role === 'admin') {
            return redirect()->intended('/admin/dashboard');
        }

        // Default fallback for other roles
        return redirect('/');
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect()->guest(route('login'));
    }
}
