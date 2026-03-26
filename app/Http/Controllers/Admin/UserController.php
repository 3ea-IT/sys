<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $search = request()->query('search', '');
        $filter = request()->query('filter', 'all');
        
        $query = User::where('role', 'user');

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($filter === 'suspended') {
            $query->where('is_suspended', true);
        } elseif ($filter === 'active') {
            $query->where('is_suspended', false);
        }

        $users = $query->orderBy('created_at', 'desc')->paginate(15);

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'search' => $search,
            'filter' => $filter,
        ]);
    }

    public function show(User $user)
    {
        if ($user->role !== 'user') {
            abort(404);
        }

        $user->load(['wallet', 'bookings' => function($q) {
            $q->latest()->limit(10);
        }]);

        return Inertia::render('Admin/Users/Show', [
            'viewedUser' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'city' => $user->city,
                'state' => $user->state,
                'country' => $user->country,
                'role' => $user->role,
                'is_suspended' => $user->is_suspended,
                'email_verified_at' => $user->email_verified_at,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ],
        ]);
    }

    public function suspend(User $user): RedirectResponse
    {
        if ($user->role !== 'user') {
            abort(404);
        }

        $user->update(['is_suspended' => true]);

        return redirect()->route('admin.users.show', $user)
            ->with('success', 'User suspended successfully');
    }

    public function toggleStatus(User $user): RedirectResponse
    {
        if ($user->role !== 'user') {
            abort(404);
        }

        $user->update(['is_suspended' => !$user->is_suspended]);

        $status = $user->is_suspended ? 'suspended' : 'activated';
        return redirect()->route('admin.users.index')
            ->with('success', 'User ' . $status . ' successfully');
    }
}
