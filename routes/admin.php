<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\VendorController;
use App\Http\Controllers\Admin\QueryController;
use App\Http\Controllers\Admin\ExperienceController;
use App\Http\Controllers\Admin\BookingsController;
use App\Http\Controllers\Admin\TempleController;
use App\Http\Controllers\Admin\Temples\StayController;
use App\Http\Controllers\Admin\Temples\TransportController;
use App\Http\Controllers\Admin\Temples\VipController;
use App\Http\Controllers\Admin\Temples\ParkingController;
use App\Http\Controllers\Admin\Temples\GuideController;
use App\Http\Controllers\Admin\Temples\FestivalShowController;
use App\Http\Controllers\Admin\Temples\AssistanceController;
use App\Http\Controllers\Admin\TourismPackageController;
use App\Http\Controllers\Admin\FlightController;
use App\Http\Controllers\Admin\RestaurantController;
use App\Http\Controllers\Admin\Restaurants\DiningOfferController;
use App\Http\Controllers\Admin\PropertyController;
use App\Http\Controllers\Admin\Properties\RoomTypeController;
use App\Http\Controllers\Admin\Properties\PropertyBookingController;

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
|
| Routes for admin panel management
|
*/

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/api/dashboard-stats', [DashboardController::class, 'getStats'])->name('stats');

    // Users Management
    Route::resource('users', UserController::class);
    Route::post('/users/{user}/toggle-status', [UserController::class, 'toggleStatus'])->name('users.toggle-status');
    Route::post('/users/{user}/suspend', [UserController::class, 'suspend'])->name('users.suspend');

    // Vendors Management
    Route::get('/vendors', [VendorController::class, 'index'])->name('vendors.index');
    Route::get('/vendors/{id}', [VendorController::class, 'show'])->name('vendors.show');
    Route::get('/vendors/{id}/edit', [VendorController::class, 'edit'])->name('vendors.edit');
    Route::post('/vendors/{id}/verify-kyc', [VendorController::class, 'verifyKyc'])->name('vendors.verify-kyc');
    Route::post('/vendors/{id}/reject-kyc', [VendorController::class, 'rejectKyc'])->name('vendors.reject-kyc');

    // Queries Management
    Route::resource('queries', QueryController::class)->only(['index', 'show', 'update', 'destroy']);
    Route::post('/queries/{query}/assign', [QueryController::class, 'assign'])->name('queries.assign');
    Route::post('/queries/{query}/resolve', [QueryController::class, 'resolve'])->name('queries.resolve');

    // Experiences Management
    Route::resource('experiences', ExperienceController::class)->only(['index', 'show']);
    Route::get('/experiences/{experience}/edit', [ExperienceController::class, 'edit'])->name('experiences.edit');
    Route::post('/experiences/{experience}/approve', [ExperienceController::class, 'approve'])->name('experiences.approve');
    Route::post('/experiences/{experience}/reject', [ExperienceController::class, 'reject'])->name('experiences.reject');

    // Bookings Management
    Route::get('/bookings', [BookingsController::class, 'index'])->name('bookings.index');
    Route::get('/bookings/{booking}', [BookingsController::class, 'show'])->name('bookings.show');

    // Temples Management
    Route::resource('temples', TempleController::class);
    Route::post('/temples/{temple}/toggle-status', [TempleController::class, 'toggleStatus'])->name('temples.toggle-status');
    
    // Temples Sub-resources (Standalone Routes)
    Route::resource('stays', StayController::class);
    Route::post('/stays/{stay}/toggle-status', [StayController::class, 'toggleStatus'])->name('stays.toggle-status');
    
    Route::resource('transports', TransportController::class);
    Route::post('/transports/{transport}/toggle-status', [TransportController::class, 'toggleStatus'])->name('transports.toggle-status');
    
    Route::resource('vips', VipController::class);
    Route::post('/vips/{vip}/toggle-status', [VipController::class, 'toggleStatus'])->name('vips.toggle-status');
    
    Route::resource('parkings', ParkingController::class);
    Route::post('/parkings/{parking}/toggle-status', [ParkingController::class, 'toggleStatus'])->name('parkings.toggle-status');
    
    Route::resource('guides', GuideController::class);
    Route::post('/guides/{guide}/toggle-status', [GuideController::class, 'toggleStatus'])->name('guides.toggle-status');
    
    Route::resource('festival-shows', FestivalShowController::class);
    Route::post('/festival-shows/{festivalShow}/toggle-status', [FestivalShowController::class, 'toggleStatus'])->name('festival-shows.toggle-status');
    
    Route::resource('assistance', AssistanceController::class);
    Route::post('/assistance/{assistance}/toggle-status', [AssistanceController::class, 'toggleStatus'])->name('assistance.toggle-status');

    // Tourism Packages Management (Spiritual Tourism)
    Route::resource('tourism-packages', TourismPackageController::class);
    Route::post('/tourism-packages/{tourismPackage}/toggle-status', [TourismPackageController::class, 'toggleStatus'])->name('tourism-packages.toggle-status');

    // Flights Management (Air Booking)
    Route::resource('flights', FlightController::class);
    Route::post('/flights/{flight}/toggle-status', [FlightController::class, 'toggleStatus'])->name('flights.toggle-status');

    // Restaurants Management (Dining & Restaurants)
    Route::resource('restaurants', RestaurantController::class);
    Route::post('/restaurants/{restaurant}/toggle-status', [RestaurantController::class, 'toggleStatus'])->name('restaurants.toggle-status');

    Route::resource('dining-offers', DiningOfferController::class);
    Route::post('/dining-offers/{diningOffer}/toggle-status', [DiningOfferController::class, 'toggleStatus'])->name('dining-offers.toggle-status');

    // Properties Management (Accommodation)
    Route::resource('properties', PropertyController::class);
    Route::post('/properties/{property}/toggle-status', [PropertyController::class, 'toggleStatus'])->name('properties.toggle-status');
    Route::delete('/properties/{property}/images/{image}', [PropertyController::class, 'destroyImage'])->name('properties.images.destroy');

    Route::resource('room-types', RoomTypeController::class);
    Route::post('/room-types/{roomType}/toggle-status', [RoomTypeController::class, 'toggleStatus'])->name('room-types.toggle-status');

    Route::get('/property-bookings', [PropertyBookingController::class, 'index'])->name('property-bookings.index');
    Route::get('/property-bookings/{propertyBooking}', [PropertyBookingController::class, 'show'])->name('property-bookings.show');
    Route::post('/property-bookings/{propertyBooking}/status', [PropertyBookingController::class, 'updateStatus'])->name('property-bookings.update-status');
});
