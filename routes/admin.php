<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\VendorController;
use App\Http\Controllers\Admin\QueryController;

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

});
