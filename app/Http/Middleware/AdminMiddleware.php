<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
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

        // Check if user is an admin
        if ($user->role !== 'admin') {
            // Redirect to appropriate dashboard based on role
            if ($user->role === 'vendor') {
                return redirect('/vendor/dashboard');
            } elseif ($user->role === 'user') {
                return redirect('/dashboard');
            }
            
            // If somehow a user has an unknown role, redirect to home
            return redirect('/');
        }

        return $next($request);
    }
}
