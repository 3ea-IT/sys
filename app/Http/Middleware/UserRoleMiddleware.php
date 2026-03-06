<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class UserRoleMiddleware
{
    /**
     * Handle an incoming request - allow only regular users (role='user').
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Allow unauthenticated users to view public content
        if (!$user) {
            return $next($request);
        }

        // Only users with role='user' can access dashboard
        if ($user->role !== 'user') {
            // Redirect to appropriate dashboard based on role
            if ($user->role === 'vendor') {
                return redirect('/vendor/dashboard');
            } elseif ($user->role === 'admin') {
                return redirect('/admin/dashboard');
            }
            
            return redirect('/');
        }

        return $next($request);
    }
}
