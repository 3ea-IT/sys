<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        Auth::login($user);

        // Redirect based on user role
        if ($user->role === 'vendor') {
            return redirect('/vendor/dashboard');
        }

        return redirect(RouteServiceProvider::HOME);
    }

    /**
     * Display the vendor registration view.
     */
    public function createVendor(): Response
    {
        return Inertia::render('Auth/VendorRegister');
    }

    /**
     * Handle an incoming vendor registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function storeVendor(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'business_name' => 'required|string|max:255',
            'business_type' => 'required|string|in:Entertainment,Professional Events,Religious & Wellness,Dining Access,Travel & Attractions',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'vendor',
        ]);

        // Create initial KYC record with registration data
        $user->vendorKyc()->create([
            'business_name' => $request->business_name,
            'business_type' => $request->business_type,
            'status' => 'incomplete', // Not yet submitted
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect('/vendor/kyc'); // Redirect to KYC form for profile completion
    }
}
