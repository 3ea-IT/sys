<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Vendor\DashboardController;
use App\Http\Controllers\Vendor\ExperienceController;
use App\Http\Controllers\Vendor\BookingController;
use App\Http\Controllers\Vendor\KYCController;
use App\Http\Controllers\Vendor\HoldController;
use App\Http\Controllers\Vendor\SupportQueryController;

/*
|--------------------------------------------------------------------------
| Vendor Routes
|--------------------------------------------------------------------------
|
| Routes for vendor panel management
|
*/

// KYC routes - for newly registered vendors (without strict approval check)
Route::middleware(['auth'])->group(function () {
    Route::get('/vendor/kyc', [KYCController::class, 'show'])->name('vendor.kyc.show');
    Route::post('/vendor/kyc', [KYCController::class, 'update'])->name('vendor.kyc.update');
    Route::get('/vendor/pending-approval', [KYCController::class, 'showPendingApproval'])->name('vendor.pending-approval');
});

Route::middleware(['auth', 'vendor'])->prefix('vendor')->name('vendor.')->group(function () {
    
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/profile', [DashboardController::class, 'profile'])->name('profile');
    Route::post('/profile', [DashboardController::class, 'updateProfile'])->name('profile.update');
    
    // Profile sections
    Route::get('/profile/personal-information', [DashboardController::class, 'personalInformation'])->name('profile.personal-information');
    Route::get('/profile/business-information', [DashboardController::class, 'businessInformation'])->name('profile.business-information');
    Route::get('/profile/kyc-verification', [DashboardController::class, 'kycVerification'])->name('profile.kyc-verification');
    Route::get('/profile/bank-financial', [DashboardController::class, 'bankFinancial'])->name('profile.bank-financial');
    Route::get('/profile/contact-location', [DashboardController::class, 'contactLocation'])->name('profile.contact-location');
    
    Route::get('/analytics', [DashboardController::class, 'analytics'])->name('analytics');
    
    // Help & Support
    Route::get('/help', function () { return inertia('Vendor/Help/Index'); })->name('help');
    Route::get('/help/guides', function () { return inertia('Vendor/Help/VendorGuide'); })->name('help.guides');
    Route::get('/help/faq', function () { return inertia('Vendor/Help/FAQ'); })->name('help.faq');
    Route::get('/help/raise-query', function () { return inertia('Vendor/Help/RaiseQuery'); })->name('help.raise-query');

    // Experiences
    Route::resource('experiences', ExperienceController::class);
    Route::post('experiences/{experience}/toggle', [ExperienceController::class, 'toggle'])->name('experiences.toggle');
    Route::get('experiences/{experience}/bookings', [ExperienceController::class, 'bookings'])->name('experiences.bookings');
    Route::get('experiences/{experience}/holds', [ExperienceController::class, 'holds'])->name('experiences.holds');
    Route::post('experiences/{experience}/validate-entry', [ExperienceController::class, 'validateEntry'])->name('experiences.validate-entry');

    // Bookings
    Route::get('/bookings', [BookingController::class, 'index'])->name('bookings.index');
    Route::get('/bookings/{booking}', [BookingController::class, 'show'])->name('bookings.show');
    Route::post('/bookings/{booking}/cancel', [BookingController::class, 'cancel'])->name('bookings.cancel');
    Route::post('/bookings/{booking}/check-in', [BookingController::class, 'checkIn'])->name('bookings.check-in');
    Route::get('/bookings/export', [BookingController::class, 'export'])->name('bookings.export');

    // Holds
    Route::get('/holds/{hold}', [HoldController::class, 'show'])->name('holds.show');

    // Settlements & Payments
    Route::get('/settlements', [BookingController::class, 'settlements'])->name('settlements');
});

// Vendor Support Query Route (outside vendor prefix for correct URL)
Route::middleware(['auth', 'vendor'])->post('/vendor-support-query', [SupportQueryController::class, 'store'])->name('vendor.support-query.store');
