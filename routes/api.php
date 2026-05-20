<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Vendor\DashboardController;
use App\Http\Controllers\IplController;
use App\Http\Controllers\MovieTicketController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Vendor Dashboard Real-time API endpoints
Route::middleware(['auth:sanctum', 'auth'])->prefix('vendor')->group(function () {
    Route::get('/dashboard-metrics', [DashboardController::class, 'getMetrics'])->name('api.vendor.dashboard-metrics');
    Route::get('/dashboard-charts', [DashboardController::class, 'getChartData'])->name('api.vendor.dashboard-charts');
});

Route::get('/ipl-matches', [IplController::class, 'apiIplMatches']);
Route::get('/ipl-matches/{id}', [IplController::class, 'apiIplMatchDetails']);

Route::get('/movies', [MovieTicketController::class, 'moviesApi']);
Route::get('/movies/top', [MovieTicketController::class, 'topMoviesApi']);
Route::get('/movies/coming-soon', [MovieTicketController::class, 'comingSoonMoviesApi']);
Route::get('/cinemas-nearby', [MovieTicketController::class, 'cinemasNearbyApi']);
Route::get('/cinema-details', [MovieTicketController::class, 'cinemaDetailsApi']);
Route::get('/cinemaDetails', [MovieTicketController::class, 'cinemaDetailsApi']);
Route::get('/filmDetails', [MovieTicketController::class, 'filmDetailsApi']);
Route::get('/cinema-live-search', [MovieTicketController::class, 'cinemaLiveSearchApi']);
Route::get('/cinemaLiveSearch', [MovieTicketController::class, 'cinemaLiveSearchApi']);

