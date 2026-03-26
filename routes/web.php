<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ExperienceController;
use App\Http\Controllers\HoldController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ExploreController;
use App\Http\Controllers\WalletController;
use App\Http\Controllers\SupportQueryController;
use App\Http\Controllers\MovieTicketController;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

Route::get('/login', function () {
    return Inertia::render('Auth/Login', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile/edit', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/profile/upload-image', [ProfileController::class, 'uploadImage'])->name('profile.upload-image');
    Route::get('/profile', [ProfileController::class, 'show'])->name('profile');
    Route::get('/profile/language', function () {
        return Inertia::render('Profile/Language');
    })->name('profile.language');
});

// User bookings
Route::middleware('auth')->group(function () {
    Route::get('/bookings', [BookingController::class, 'index'])->name('bookings.index');
    Route::get('/bookings/{booking}', [BookingController::class, 'show'])->name('bookings.show');
    Route::post('/bookings/instant', [BookingController::class, 'instantStore'])->name('bookings.instant');
    Route::post('/bookings/{booking}/cancel', [BookingController::class, 'cancel'])->name('bookings.cancel');
});

// Movie Ticket routes
Route::middleware('auth')->group(function () {
    Route::get('/movie-tickets', [MovieTicketController::class, 'index'])->name('movie-tickets.index');
    Route::get('/movie-tickets/{movie}', [MovieTicketController::class, 'show'])->name('movie-tickets.show');
    Route::post('/movie-tickets', [MovieTicketController::class, 'store'])->name('movie-tickets.store');
    Route::get('/movie-tickets/booking/{booking}', [MovieTicketController::class, 'showBooking'])->name('movie-tickets.booking');
    Route::post('/movie-tickets/{booking}/cancel', [MovieTicketController::class, 'cancel'])->name('movie-tickets.cancel');
    
    // Movie cinema and slot selection
    Route::get('/movies/{movie}/cinemas', [MovieTicketController::class, 'showCinemas'])->name('movies.cinemas');
    Route::get('/movies/{movie}/cinemas/{cinema}/slots', [MovieTicketController::class, 'showSlots'])->name('movies.slots');
});

Route::group([], function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->middleware(['auth', 'user'])->name('dashboard');
    Route::get('/experience/{experience}', [ExperienceController::class, 'show'])->name('experience.show');
    Route::get('/explore', [ExploreController::class, 'index'])->name('explore.index');
    Route::get('/explore/{category}', [ExploreController::class, 'showCategory'])->name('explore.category');
    Route::get('/movies', [MovieTicketController::class, 'index'])->name('movies.index');
    Route::post('/holds', [HoldController::class, 'store'])->name('holds.store');
    Route::get('/holds', [HoldController::class, 'index'])->name('holds.index');
    Route::get('/holds/{hold}', [HoldController::class, 'active'])->name('holds.active');
    Route::post('/holds/{hold}/release', [HoldController::class, 'release']);
    Route::post('/holds/{hold}/confirm', [HoldController::class, 'confirm']);
    Route::get('/wallet', [WalletController::class, 'index']);
    
    // Payment Routes
    Route::prefix('api/payment')->group(function () {
        Route::post('/instant-booking-order', [PaymentController::class, 'instantBookingOrder'])->name('payment.instant-booking-order');
        Route::post('/hold-token-order', [PaymentController::class, 'holdTokenOrder'])->name('payment.hold-token-order');
        Route::post('/hold-confirm-order', [PaymentController::class, 'holdConfirmOrder'])->name('payment.hold-confirm-order');
        Route::post('/verify', [PaymentController::class, 'verifyPayment'])->name('payment.verify');
    });
    
    Route::get('/notifications', function () {
        return Inertia::render('Notifications');
    })->name('notifications');
    Route::get('/help', function () {
        return Inertia::render('Help/Index');
    })->name('help');
    Route::get('/user-guide', function () {
        return Inertia::render('Help/UserGuide');
    })->name('user-guide');
    Route::get('/raise-query', function () {
        return Inertia::render('Help/RaiseQuery');
    })->name('raise-query');
    Route::post('/support-query', [SupportQueryController::class, 'store'])->name('support-query');
    Route::get('/faqs', function () {
        return Inertia::render('FAQ/Index');
    })->name('faqs');
});

require __DIR__.'/auth.php';
