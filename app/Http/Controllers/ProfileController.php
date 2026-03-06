<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile.
     */
    public function show(Request $request): Response
    {
        return Inertia::render('Profile/Index');
    }

    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    /**
     * Upload profile image.
     */
    public function uploadImage(Request $request): RedirectResponse
    {
        $request->validate([
            'profile_image' => ['required', 'image', 'max:5120'], // 5MB max
        ]);

        $user = $request->user();

        // Delete old image if exists
        if ($user->profile_image) {
            $oldImagePath = public_path('assets/profile_images/' . $user->profile_image);
            if (file_exists($oldImagePath)) {
                unlink($oldImagePath);
            }
        }

        // Create directory if it doesn't exist
        $uploadDir = public_path('assets/profile_images');
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        // Store new image with unique filename
        $file = $request->file('profile_image');
        $filename = time() . '_' . $user->id . '.' . $file->getClientOriginalExtension();
        $file->move($uploadDir, $filename);
        
        $user->update([
            'profile_image' => $filename,
        ]);

        return Redirect::back();
    }
}
