<?php

namespace App\Providers;

use App\Models\Cinema;
use App\Models\Movie;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * The path to your application's "home" route.
     *
     * Typically, users are redirected here after authentication.
     *
     * @var string
     */
    public const HOME = '/dashboard';

    /**
     * Define your route model bindings, pattern filters, and other route configuration.
     */
    public function boot(): void
    {
        Route::bind('cinema', function ($value) {
            $cinema = Cinema::find($value);
            if ($cinema) {
                return $cinema;
            }

            $placeholder = new Cinema();
            $placeholder->exists = false;
            $placeholder->id = $value;
            $placeholder->name = request()->query('cinema_name', 'Selected Cinema');
            $placeholder->location = request()->query('cinema_location', '');
            $placeholder->type = request()->query('cinema_type', 'Cinema');

            return $placeholder;
        });

        Route::bind('movie', function ($value) {
            $movie = Movie::find($value);
            if ($movie) {
                return $movie;
            }

            $placeholder = new Movie();
            $placeholder->exists = false;
            $placeholder->id = $value;
            $placeholder->title = request()->query('movie_title', 'Selected Movie');
            $placeholder->image = request()->query('movie_image', '');
            $placeholder->language = request()->query('movie_language', '');
            $placeholder->format = request()->query('movie_format', '');
            $placeholder->genre = request()->query('movie_genre', '');
            $placeholder->duration = request()->query('movie_duration', null);
            $placeholder->rating = request()->query('movie_rating', '');

            return $placeholder;
        });

        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        $this->routes(function () {
            Route::middleware('api')
                ->prefix('api')
                ->group(base_path('routes/api.php'));

            Route::middleware('web')
                ->group(base_path('routes/web.php'));

            Route::middleware('web')
                ->group(base_path('routes/vendor.php'));

            Route::middleware('web')
                ->group(base_path('routes/admin.php'));
        });
    }
}
