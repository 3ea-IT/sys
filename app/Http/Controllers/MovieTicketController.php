<?php

namespace App\Http\Controllers;

use App\Models\Movie;
use App\Models\Cinema;
use App\Models\MovieShowSlot;
use App\Models\MovieTicketBooking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Inertia\Inertia;

class MovieTicketController extends Controller
{
    /**
     * Show cinemas where a movie is playing
     */
    public function showCinemas(Movie $movie)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect('/login');
        }

        // Get all cinemas with upcoming shows for this movie
        $cinemas = Cinema::whereHas('movieShowSlots', function ($query) use ($movie) {
            $query->where('movie_id', $movie->id)
                ->where('movie_show_slots.status', '!=', 'sold_out')
                ->where('show_date', '>=', now()->toDateString())
                ->where('available_seats', '>', 0);
        })
        ->with(['movieShowSlots' => function ($query) use ($movie) {
            $query->where('movie_id', $movie->id)
                ->where('movie_show_slots.status', '!=', 'sold_out')
                ->where('show_date', '>=', now()->toDateString())
                ->where('available_seats', '>', 0)
                ->orderBy('show_date');
        }])
        ->get()
        ->map(function ($cinema) use ($movie) {
            $upcomingShows = $cinema->movieShowSlots->count();
            return [
                'id' => $cinema->id,
                'name' => $cinema->name,
                'location' => $cinema->location,
                'type' => $cinema->type,
                'image' => $cinema->image,
                'description' => $cinema->description,
                'upcomingShows' => $upcomingShows,
            ];
        });

        return Inertia::render('MovieTickets/CinemaSelection', [
            'movie' => [
                'id' => $movie->id,
                'title' => $movie->title,
                'image' => $movie->image,
                'language' => $movie->language,
                'format' => $movie->format,
                'genre' => $movie->genre,
                'duration' => $movie->duration,
                'rating' => $movie->rating,
                'description' => $movie->description,
            ],
            'cinemas' => $cinemas,
        ]);
    }

    public function previewCinemas(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect('/login');
        }

        $movie = $request->input('movie', []);
        if (!is_array($movie)) {
            return redirect()->route('movies.index');
        }

        $movieData = [
            'id' => $movie['id'] ?? null,
            'title' => $movie['title'] ?? ($movie['film_name'] ?? 'Untitled'),
            'image' => $movie['image'] ?? ($movie['images']['poster']['1']['medium']['film_image'] ?? null),
            'language' => $movie['language'] ?? $movie['lang'] ?? $movie['original_language'] ?? 'N/A',
            'format' => $movie['format'] ?? ($movie['age_rating'][0]['rating'] ?? 'MOVIE'),
            'genre' => $movie['genre'] ?? $movie['category'] ?? $movie['other_titles']['EN'] ?? 'N/A',
            'duration' => $movie['duration'] ?? $movie['length'] ?? $movie['runtime'] ?? null,
            'rating' => $movie['rating'] ?? null,
            'description' => $movie['description'] ?? $movie['synopsis_long'] ?? $movie['synopsis'] ?? '',
        ];

        return Inertia::render('MovieTickets/CinemaSelection', [
            'movie' => $movieData,
            'cinemas' => [],
        ]);
    }

    /**
     * Show show slots for a movie in a specific cinema
     */
    public function showSlots(Request $request, Movie $movie, Cinema $cinema)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect('/login');
        }

        $movieGlu = config('services.movieglu');
        $filmId = trim($request->query('film_id', '') ?: $movie->film_id ?? $movie->id);
        $remoteCinemaId = trim($request->query('cinema_id', '') ?: $request->input('cinema_id', ''));
        $date = trim($request->query('date', '') ?: now()->toDateString());
        $sort = trim($request->query('sort', '') ?: 'popularity');
        $n = (int) $request->query('n', 10);
        if ($n <= 0) {
            $n = 10;
        }

        $showSlots = collect();
        if ($filmId && !empty($movieGlu['client']) && !empty($movieGlu['api_key']) && !empty($movieGlu['authorization'])) {
            $remoteQuery = ['film_id' => $filmId, 'date' => $date, 'n' => $n];
            $endpoint = $movieGlu['showtimes_endpoint'] ?? 'filmShowTimes';

            if ($remoteCinemaId !== '') {
                $remoteQuery['cinema_id'] = $remoteCinemaId;
                $remoteQuery['sort'] = $sort;
                $endpoint = $movieGlu['cinema_showtimes_endpoint'] ?? 'cinemaShowTimes';
            }

            $remoteResponse = $this->fetchMovieGluResource(
                $endpoint,
                $remoteQuery,
                'showtimes'
            );

            $remotePayload = $remoteResponse->getData(true);
            $remoteShowtimes = [];
            $metaPayload = $remotePayload['meta'] ?? [];

            if (!empty($remotePayload['showtimes']) && is_array($remotePayload['showtimes'])) {
                $remoteShowtimes = $remotePayload['showtimes'];
            } elseif (!empty($remotePayload['data']['showtimes']) && is_array($remotePayload['data']['showtimes'])) {
                $remoteShowtimes = $remotePayload['data']['showtimes'];
            } elseif (!empty($remotePayload['cinema_showtimes']) && is_array($remotePayload['cinema_showtimes'])) {
                $remoteShowtimes = $remotePayload['cinema_showtimes'];
            } elseif (!empty($remotePayload['film_showtimes']) && is_array($remotePayload['film_showtimes'])) {
                $remoteShowtimes = $remotePayload['film_showtimes'];
            } elseif (!empty($remotePayload['shows']) && is_array($remotePayload['shows'])) {
                $remoteShowtimes = $remotePayload['shows'];
            } elseif (!empty($remotePayload['results']) && is_array($remotePayload['results'])) {
                $remoteShowtimes = $remotePayload['results'];
            } elseif (!empty($metaPayload['showtimes']) && is_array($metaPayload['showtimes'])) {
                $remoteShowtimes = $metaPayload['showtimes'];
            } elseif (!empty($metaPayload['data']['showtimes']) && is_array($metaPayload['data']['showtimes'])) {
                $remoteShowtimes = $metaPayload['data']['showtimes'];
            } elseif (!empty($metaPayload['cinema_showtimes']) && is_array($metaPayload['cinema_showtimes'])) {
                $remoteShowtimes = $metaPayload['cinema_showtimes'];
            } elseif (!empty($metaPayload['film_showtimes']) && is_array($metaPayload['film_showtimes'])) {
                $remoteShowtimes = $metaPayload['film_showtimes'];
            } elseif (!empty($metaPayload['shows']) && is_array($metaPayload['shows'])) {
                $remoteShowtimes = $metaPayload['shows'];
            } elseif (!empty($metaPayload['results']) && is_array($metaPayload['results'])) {
                $remoteShowtimes = $metaPayload['results'];
            }

            if (!empty($remoteShowtimes)) {
                $showSlots = collect($remoteShowtimes)->map(function ($slot, $index) {
                    $showDate = $slot['show_date'] ?? $slot['date'] ?? $slot['session_date'] ?? null;
                    $showTime = $slot['show_time'] ?? $slot['time'] ?? $slot['schedule_time'] ?? $slot['session_time'] ?? null;
                    return [
                        'id' => $slot['showtime_id'] ?? $slot['id'] ?? $slot['show_id'] ?? $index,
                        'show_date' => $showDate ? \Carbon\Carbon::parse($showDate)->format('M d, Y') : now()->format('M d, Y'),
                        'show_time' => $showTime ? \Carbon\Carbon::parse($showTime)->format('h:i A') : '',
                        'screen_name' => $slot['screen_name'] ?? $slot['screen'] ?? $slot['screen_name'] ?? null,
                        'price' => isset($slot['price']) ? (float) $slot['price'] : (float) ($slot['ticket_price'] ?? 0),
                        'available_seats' => $slot['available_seats'] ?? $slot['available'] ?? $slot['seats_available'] ?? 0,
                        'total_seats' => $slot['total_seats'] ?? $slot['seats'] ?? null,
                        'is_booked' => false,
                        'is_sold_out' => ($slot['available_seats'] ?? $slot['available'] ?? $slot['seats_available'] ?? 0) <= 0,
                    ];
                })->values()->all();
            }
        }

        if ($showSlots->isEmpty()) {
            $showSlots = MovieShowSlot::where('movie_id', $movie->id)
                ->where('cinema_id', $cinema->id)
                ->where('status', '!=', 'sold_out')
                ->where('show_date', '>=', now()->toDateString())
                ->where('available_seats', '>', 0)
                ->orderBy('show_date')
                ->orderBy('show_time')
                ->get()
                ->map(function ($slot) use ($user) {
                    $userBookedThisSlot = MovieTicketBooking::where('user_id', $user->id)
                        ->where('movie_show_slot_id', $slot->id)
                        ->where('status', '!=', 'cancelled')
                        ->exists();

                    return [
                        'id' => $slot->id,
                        'show_date' => $slot->show_date->format('M d, Y'),
                        'show_time' => \Carbon\Carbon::parse($slot->show_time)->format('h:i A'),
                        'screen_name' => $slot->screen_name,
                        'price' => (float) $slot->price,
                        'available_seats' => $slot->available_seats,
                        'total_seats' => $slot->total_seats,
                        'is_booked' => $userBookedThisSlot,
                        'is_sold_out' => $slot->available_seats <= 0,
                    ];
                })->values()->all();
        }

        return Inertia::render('MovieTickets/ShowSlots', [
            'movie' => [
                'id' => $movie->id,
                'film_id' => $filmId,
                'title' => $movie->title,
                'image' => $movie->image,
                'language' => $movie->language,
                'format' => $movie->format,
                'genre' => $movie->genre,
                'duration' => $movie->duration,
                'rating' => $movie->rating,
            ],
            'cinema' => [
                'id' => $cinema->id,
                'name' => $cinema->name,
                'location' => $cinema->location,
                'type' => $cinema->type,
            ],
            'showSlots' => $showSlots,
        ]);
    }
    
    /**
     * Show movie tickets list
     */
    public function index()
    {
        $user = Auth::user();

        $movies = Movie::where('status', 'active')
            ->orderBy('title')
            ->get();

        return Inertia::render('MovieTickets/Index', [
            'movies' => $movies->map(function ($movie) {
                return [
                    'id' => $movie->id,
                    'title' => $movie->title,
                    'image' => $movie->image,
                    'language' => $movie->language,
                    'format' => $movie->format,
                    'genre' => $movie->genre,
                    'duration' => $movie->duration,
                    'description' => $movie->description,
                ];
            }),
        ]);
    }

    /**
     * Return movies from the MovieGlu API.
     */
    public function moviesApi(Request $request)
    {
        $movieGlu = config('services.movieglu');

        if (empty($movieGlu['client']) || empty($movieGlu['api_key']) || empty($movieGlu['authorization'])) {
            return response()->json([
                'movies' => [],
                'error' => 'MovieGlu credentials are not configured.',
            ], 500);
        }

        $endpoint = $movieGlu['movies_endpoint'] ?? 'filmsInTheaters';

        return $this->fetchMovieGluMovies($endpoint);
    }

    public function topMoviesApi(Request $request)
    {
        $movieGlu = config('services.movieglu');

        if (empty($movieGlu['client']) || empty($movieGlu['api_key']) || empty($movieGlu['authorization'])) {
            return response()->json([
                'movies' => [],
                'error' => 'MovieGlu credentials are not configured.',
            ], 500);
        }

        $n = (int) $request->query('n', 10);
        if ($n <= 0) {
            $n = 10;
        }

        $endpoint = $movieGlu['top_movies_endpoint'] ?? 'filmsNowShowing';

        return $this->fetchMovieGluMovies($endpoint, ['n' => $n]);
    }

    public function comingSoonMoviesApi(Request $request)
    {
        $movieGlu = config('services.movieglu');

        if (empty($movieGlu['client']) || empty($movieGlu['api_key']) || empty($movieGlu['authorization'])) {
            return response()->json([
                'movies' => [],
                'error' => 'MovieGlu credentials are not configured.',
            ], 500);
        }

        $n = (int) $request->query('n', 10);
        if ($n <= 0) {
            $n = 10;
        }

        $endpoint = $movieGlu['coming_soon_endpoint'] ?? 'filmsComingSoon';

        return $this->fetchMovieGluMovies($endpoint, ['n' => $n]);
    }

    public function cinemasNearbyApi(Request $request)
    {
        $movieGlu = config('services.movieglu');

        if (empty($movieGlu['client']) || empty($movieGlu['api_key']) || empty($movieGlu['authorization'])) {
            return response()->json([
                'cinemas' => [],
                'error' => 'MovieGlu credentials are not configured.',
            ], 500);
        }

        $n = (int) $request->query('n', 10);
        if ($n <= 0) {
            $n = 10;
        }

        $territory = trim($request->query('territory', $movieGlu['territory'] ?? 'IN'));
        $geolocation = trim($request->query('geolocation', $movieGlu['geolocation'] ?? '0;0'));

        if ($territory === 'XX' || $geolocation === '0;0' || $geolocation === '') {
            $territory = 'IN';
            $geolocation = '28.6139;77.2090';
        }

        $remoteResponse = $this->fetchMovieGluResource(
            $movieGlu['cinemas_nearby_endpoint'] ?? 'cinemasNearby',
            ['n' => $n],
            'cinemas',
            ['territory' => $territory, 'geolocation' => $geolocation]
        );

        $remotePayload = $remoteResponse->getData(true);
        if ($remoteResponse->status() !== 200 || empty($remotePayload['cinemas'])) {
            $fallbackCinemas = $this->getFallbackNearbyCinemas($n);
            return response()->json([
                'cinemas' => $fallbackCinemas,
                'fallback' => true,
                'fallback_reason' => 'Unable to load MovieGlu nearby cinemas. Showing local cinemas instead.',
                'details' => $remotePayload['details'] ?? $remotePayload,
            ], 200);
        }

        return $remoteResponse;
    }

    public function cinemaDetailsApi(Request $request)
    {
        $movieGlu = config('services.movieglu');

        if (empty($movieGlu['client']) || empty($movieGlu['api_key']) || empty($movieGlu['authorization'])) {
            return response()->json([
                'cinema' => null,
                'error' => 'MovieGlu credentials are not configured.',
            ], 500);
        }

        $cinemaId = trim($request->query('cinema_id', '') ?: $request->input('cinema_id', ''));
        if ($cinemaId === '') {
            return response()->json([
                'cinema' => null,
                'error' => 'cinema_id is required.',
            ], 400);
        }

        return $this->fetchMovieGluResource(
            $movieGlu['cinema_details_endpoint'] ?? 'cinemaDetails',
            ['cinema_id' => $cinemaId],
            'cinema'
        );
    }

    public function filmDetailsApi(Request $request)
    {
        $movieGlu = config('services.movieglu');

        if (empty($movieGlu['client']) || empty($movieGlu['api_key']) || empty($movieGlu['authorization'])) {
            return response()->json([
                'film' => null,
                'error' => 'MovieGlu credentials are not configured.',
            ], 500);
        }

        $filmId = trim($request->query('film_id', '') ?: $request->input('film_id', ''));
        if ($filmId === '') {
            return response()->json([
                'film' => null,
                'error' => 'film_id is required.',
            ], 400);
        }

        return $this->fetchMovieGluResource(
            $movieGlu['film_details_endpoint'] ?? 'filmDetails',
            ['film_id' => $filmId],
            'film'
        );
    }

    public function cinemaLiveSearchApi(Request $request)
    {
        $movieGlu = config('services.movieglu');

        if (empty($movieGlu['client']) || empty($movieGlu['api_key']) || empty($movieGlu['authorization'])) {
            return response()->json([
                'cinemas' => [],
                'error' => 'MovieGlu credentials are not configured.',
            ], 500);
        }

        $query = trim($request->query('query', '') ?: $request->input('query', ''));
        if ($query === '') {
            return response()->json([
                'cinemas' => [],
                'error' => 'query is required.',
            ], 400);
        }

        $n = (int) $request->query('n', 10);
        if ($n <= 0) {
            $n = 10;
        }

        $territory = trim($request->query('territory', $movieGlu['territory'] ?? 'IN'));
        $geolocation = trim($request->query('geolocation', $movieGlu['geolocation'] ?? '0;0'));
        if ($territory === 'XX' || $geolocation === '0;0' || $geolocation === '') {
            $territory = 'IN';
            $geolocation = '28.6139;77.2090';
        }

        $remoteResponse = $this->fetchMovieGluResource(
            $movieGlu['cinema_live_search_endpoint'] ?? 'cinemaLiveSearch',
            ['query' => $query, 'n' => $n],
            'cinemas',
            ['territory' => $territory, 'geolocation' => $geolocation]
        );

        $remotePayload = $remoteResponse->getData(true);
        if ($remoteResponse->status() !== 200 || empty($remotePayload['cinemas'])) {
            $fallbackCinemas = $this->getFallbackCinemaSearchResults($query, $n);
            return response()->json([
                'cinemas' => $fallbackCinemas,
                'fallback' => true,
                'fallback_reason' => 'MovieGlu cinema search unavailable. Showing local cinema matches.',
                'details' => $remotePayload,
            ], 200);
        }

        return $remoteResponse;
    }

    protected function getFallbackNearbyCinemas(int $limit = 10)
    {
        return Cinema::withCount(['movieShowSlots as upcomingShows' => function ($query) {
            $query->where('status', '!=', 'sold_out')
                ->where('show_date', '>=', now()->toDateString())
                ->where('available_seats', '>', 0);
        }])
        ->orderByDesc('upcomingShows')
        ->limit($limit)
        ->get()
        ->map(function ($cinema) {
            return [
                'id' => $cinema->id,
                'name' => $cinema->name,
                'location' => $cinema->location,
                'type' => $cinema->type,
                'image' => $cinema->image,
                'description' => $cinema->description,
                'upcomingShows' => (int) $cinema->upcomingShows,
            ];
        });
    }

    protected function getFallbackCinemaSearchResults(string $query, int $limit = 10)
    {
        return Cinema::where(function ($search) use ($query) {
            $search->where('name', 'like', "%{$query}%")
                ->orWhere('location', 'like', "%{$query}%")
                ->orWhere('description', 'like', "%{$query}%");
        })
        ->limit($limit)
        ->get()
        ->map(function ($cinema) {
            return [
                'id' => $cinema->id,
                'name' => $cinema->name,
                'location' => $cinema->location,
                'type' => $cinema->type,
                'image' => $cinema->image,
                'description' => $cinema->description,
            ];
        });
    }

    protected function fetchMovieGluMovies(string $endpoint, array $queryParams = [])
    {
        return $this->fetchMovieGluResource($endpoint, $queryParams, 'movies');
    }

    protected function fetchMovieGluResource(string $endpoint, array $queryParams = [], string $resourceKey = 'movies', array $overrideHeaders = [])
    {
        $movieGlu = config('services.movieglu');

        if (strpos($endpoint, '?') !== false) {
            [$endpoint, $queryString] = explode('?', $endpoint, 2);
            parse_str($queryString, $parsedParams);
            $queryParams = array_merge($queryParams, $parsedParams);
        }

        if (Str::startsWith($endpoint, ['http://', 'https://'])) {
            $endpoint = rtrim($endpoint, '/');
        } else {
            $endpoint = rtrim($movieGlu['base_url'], '/') . '/' . trim($endpoint, '/');
        }

        $authorization = trim($movieGlu['authorization'] ?? '');

        if ($authorization !== '' && !Str::startsWith($authorization, ['Basic ', 'basic '])) {
            $authorization = 'Basic ' . $authorization;
        }

        $headers = array_merge([
            'client' => $movieGlu['client'],
            'x-api-key' => $movieGlu['api_key'],
            'Authorization' => $authorization,
            'territory' => $movieGlu['territory'] ?? 'IN',
            'api-version' => $movieGlu['api_version'] ?? 'v201',
            'geolocation' => $movieGlu['geolocation'] ?? '0;0',
            'device-datetime' => now()->utc()->format('Y-m-d\TH:i:s.v\Z'),
            'Accept' => 'application/json',
        ], $overrideHeaders);

        $cacheKey = 'movieglu:' . sha1($endpoint . ':' . json_encode($queryParams) . ':' . json_encode($headers));
        $cachedPayload = Cache::get($cacheKey);

        if ($cachedPayload) {
            return response()->json(array_merge($cachedPayload, [
                'cached' => true,
            ]));
        }

        $response = Http::withHeaders($headers)->get($endpoint, $queryParams);

        if ($response->failed() || $response->status() !== 200) {
            $details = $response->json();
            if (empty($details) && strlen($response->body()) > 0) {
                $details = $response->body();
            }
            if (is_string($details)) {
                $details = ['message' => $details];
            }
            $mgMessage = $response->header('MG-message');
            if ($mgMessage) {
                $details = array_merge(is_array($details) ? $details : ['message' => $details], [
                    'mg_message' => $mgMessage,
                ]);
            }

            if ($cachedPayload) {
                return response()->json(array_merge($cachedPayload, [
                    'cached' => true,
                    'warning' => 'Serving cached MovieGlu data because the remote API request failed.',
                ]));
            }

            return response()->json([
                $resourceKey => [],
                'error' => 'MovieGlu request failed.',
                'details' => $details,
                'status' => $response->status(),
            ], $response->status() ?: 500);
        }

        $payload = $response->json();
        if (!is_array($payload)) {
            $payload = [];
        }

        if (is_array($payload)) {
            Cache::put($cacheKey, $payload, now()->addMinutes(15));
        }

        $data = [];
        if ($resourceKey === 'movies') {
            if (isset($payload['films']) && is_array($payload['films'])) {
                $data = $payload['films'];
            } elseif (isset($payload['movies']) && is_array($payload['movies'])) {
                $data = $payload['movies'];
            } elseif (isset($payload['data']) && is_array($payload['data'])) {
                $data = $payload['data'];
            } elseif (isset($payload['response']['films']) && is_array($payload['response']['films'])) {
                $data = $payload['response']['films'];
            } elseif (is_array($payload)) {
                $data = $payload;
            }
        } else {
            if (isset($payload[$resourceKey]) && is_array($payload[$resourceKey])) {
                $data = $payload[$resourceKey];
            } elseif (isset($payload['data']) && is_array($payload['data'])) {
                $data = $payload['data'];
            } elseif (is_array($payload)) {
                $data = $payload;
            }
        }

        return response()->json([
            $resourceKey => $data,
            'meta' => $payload,
        ]);
    }

    /**
     * Show movie ticket details and booking form
     */
    public function show(MovieShowSlot $movie)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect('/login');
        }

        $existingBooking = MovieTicketBooking::where('user_id', $user->id)
            ->where('movie_show_slot_id', $movie->id)
            ->where('status', '!=', 'cancelled')
            ->first();

        return Inertia::render('MovieTickets/Show', [
            'movie' => [
                'id' => $movie->id,
                'title' => $movie->movie->title,
                'image' => $movie->movie->image,
                'cinema' => $movie->cinema->name,
                'cinema_location' => $movie->cinema->location,
                'price' => (float) $movie->price,
                'available_seats' => $movie->available_seats,
                'total_seats' => $movie->total_seats,
                'show_date' => $movie->show_date->format('M d, Y'),
                'show_time' => $movie->show_time->format('h:i A'),
                'language' => $movie->movie->language,
                'format' => $movie->movie->format,
                'screen_name' => $movie->screen_name,
                'description' => $movie->movie->description,
                'genre' => $movie->movie->genre,
                'duration' => $movie->movie->duration,
                'rating' => $movie->movie->rating,
                'existing_booking' => $existingBooking ? [
                    'id' => $existingBooking->id,
                    'quantity' => $existingBooking->quantity,
                    'total_amount' => (float) $existingBooking->total_amount,
                    'booking_reference' => $existingBooking->booking_reference,
                    'status' => $existingBooking->status,
                    'valid_until' => $existingBooking->valid_until?->format('M d, h:i A'),
                ] : null,
                'seats_full' => $movie->available_seats <= 0,
            ],
        ]);
    }

    /**
     * Store movie ticket booking
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $request->validate([
            'movie_show_slot_id' => 'required|exists:movie_show_slots,id',
            'quantity' => 'required|integer|min:1|max:10',
            'seat_numbers' => 'required|array|min:1',
            'seat_numbers.*' => 'required|string|regex:/^[A-O]\d+$/',
        ]);

        $slot = MovieShowSlot::findOrFail($request->movie_show_slot_id);

        // Check if show slot is available
        if (!$slot->isAvailable()) {
            return response()->json(['error' => 'Show is sold out'], 400);
        }

        // Check if user already has a booking for this slot
        $existingBooking = MovieTicketBooking::where('user_id', $user->id)
            ->where('movie_show_slot_id', $slot->id)
            ->where('status', '!=', 'cancelled')
            ->first();

        if ($existingBooking) {
            return response()->json(['error' => 'You already have a booking for this show'], 400);
        }

        // Validate seat count matches quantity
        $seatNumbers = $request->input('seat_numbers', []);
        if (count($seatNumbers) !== $request->quantity) {
            return response()->json(['error' => 'Number of seats must match quantity'], 400);
        }

        // Check if enough seats are available
        if ($request->quantity > $slot->available_seats) {
            return response()->json(['error' => "Only {$slot->available_seats} seats available"], 400);
        }

        // Create booking with seat numbers
        $totalAmount = $slot->price * $request->quantity;

        $booking = MovieTicketBooking::create([
            'user_id' => $user->id,
            'movie_show_slot_id' => $slot->id,
            'quantity' => $request->quantity,
            'seat_numbers' => $seatNumbers,
            'total_amount' => $totalAmount,
            'amount_per_ticket' => $slot->price,
            'status' => 'confirmed',
        ]);

        // Update available seats
        $slot->updateAvailableSeats($request->quantity);

        return response()->json([
            'success' => true,
            'booking_id' => $booking->id,
            'booking_reference' => $booking->booking_reference,
            'message' => 'Booking confirmed! Proceed to payment.'
        ]);
    }

    /**
     * Show booking details
     */
    public function showBooking(MovieTicketBooking $booking)
    {
        $user = Auth::user();

        if (!$user || $booking->user_id !== $user->id) {
            return redirect('/dashboard');
        }

        $slot = $booking->movieShowSlot;

        return Inertia::render('MovieTickets/Booking', [
            'booking' => [
                'id' => $booking->id,
                'reference' => $booking->booking_reference,
                'quantity' => $booking->quantity,
                'total_amount' => (float) $booking->total_amount,
                'amount_per_ticket' => (float) $booking->amount_per_ticket,
                'status' => $booking->status,
                'valid_until' => $booking->valid_until?->format('M d, h:i A'),
                'created_at' => $booking->created_at->format('M d, Y h:i A'),
            ],
            'movie' => [
                'title' => $slot->movie->title,
                'image' => $slot->movie->image,
                'cinema' => $slot->cinema->name,
                'cinema_location' => $slot->cinema->location,
                'show_date' => $slot->show_date->format('M d, Y'),
                'show_time' => $slot->show_time->format('h:i A'),
                'language' => $slot->movie->language,
                'format' => $slot->movie->format,
                'screen_name' => $slot->screen_name,
                'genre' => $slot->movie->genre,
                'duration' => $slot->movie->duration,
                'rating' => $slot->movie->rating,
            ],
        ]);
    }

    /**
     * Cancel booking
     */
    public function cancel(MovieTicketBooking $booking)
    {
        $user = Auth::user();

        if (!$user || $booking->user_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        if ($booking->cancel()) {
            return response()->json(['success' => true, 'message' => 'Booking cancelled and seats released.']);
        }

        return response()->json(['error' => 'Cannot cancel this booking'], 400);
    }

    /**
     * Show seating selection page
     */
    public function seatingPage(Movie $movie, Cinema $cinema, MovieShowSlot $slot)
    {
        return Inertia::render('MovieTickets/SeatingSelection', [
            'movie' => $movie,
            'cinema' => $cinema,
            'selectedSlot' => [
                'id' => $slot->id,
                'price' => (float) $slot->price,
                'available_seats' => $slot->available_seats,
                'show_date' => $slot->show_date->format('M d, Y'),
                'show_time' => $slot->show_time->format('h:i A'),
                'screen_name' => $slot->screen_name,
            ],
            'quantity' => request('quantity', 1),
            'razorpayKey' => config('services.razorpay.key'),
        ]);
    }

    /**
     * Create Razorpay order for payment
     */
    public function createRazorpayOrder(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $request->validate([
            'movie_show_slot_id' => 'required|exists:movie_show_slots,id',
            'quantity' => 'required|integer|min:1|max:10',
            'seat_numbers' => 'required|array|min:1',
            'seat_numbers.*' => 'required|string|regex:/^[A-O]\d+$/',
        ]);

        $slot = MovieShowSlot::findOrFail($request->movie_show_slot_id);

        // Validate booking before creating order
        if (!$slot->isAvailable()) {
            return response()->json(['error' => 'Show is sold out'], 400);
        }

        $existingBooking = MovieTicketBooking::where('user_id', $user->id)
            ->where('movie_show_slot_id', $slot->id)
            ->where('status', '!=', 'cancelled')
            ->first();

        if ($existingBooking) {
            return response()->json(['error' => 'You already have a booking for this show'], 400);
        }

        $seatNumbers = $request->input('seat_numbers', []);
        if (count($seatNumbers) !== $request->quantity) {
            return response()->json(['error' => 'Number of seats must match quantity'], 400);
        }

        if ($request->quantity > $slot->available_seats) {
            return response()->json(['error' => "Only {$slot->available_seats} seats available"], 400);
        }

        // Create Razorpay order
        $totalAmount = $slot->price * $request->quantity;

        try {
            $razorpay = new \Razorpay\Api\Api(
                config('services.razorpay.key'),
                config('services.razorpay.secret')
            );

            $order = $razorpay->order->create([
                'amount' => $totalAmount * 100, // Amount in paise
                'currency' => 'INR',
                'receipt' => 'booking_' . uniqid(),
                'notes' => [
                    'movie_show_slot_id' => $slot->id,
                    'user_id' => $user->id,
                    'quantity' => $request->quantity,
                    'seat_numbers' => json_encode($seatNumbers),
                ]
            ]);

            return response()->json([
                'success' => true,
                'orderId' => $order->id,
                'amount' => $totalAmount,
                'currency' => 'INR',
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create payment order: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Verify Razorpay payment and create booking
     */
    public function verifyAndCreateBooking(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        try {
            $validated = $request->validate([
                'razorpay_order_id' => 'required|string',
                'razorpay_payment_id' => 'required|string',
                'razorpay_signature' => 'required|string',
                'movie_show_slot_id' => 'required|exists:movie_show_slots,id',
                'quantity' => 'required|integer|min:1|max:10',
                'seat_numbers' => 'required|array|min:1',
                'seat_numbers.*' => 'required|string|regex:/^[A-O]\d+$/',
            ]);
            \Log::info('Verify payment validation passed', ['validated' => $validated]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::warning('Verify payment validation failed', ['errors' => $e->errors(), 'request_data' => $request->all()]);
            return response()->json(['error' => 'Validation failed', 'details' => $e->errors()], 422);
        }

        // Verify Razorpay signature
        $razorpay = new \Razorpay\Api\Api(
            config('services.razorpay.key'),
            config('services.razorpay.secret')
        );

        try {
            $attributes = [
                'razorpay_order_id' => $request->razorpay_order_id,
                'razorpay_payment_id' => $request->razorpay_payment_id,
                'razorpay_signature' => $request->razorpay_signature
            ];

            $razorpay->utility->verifyPaymentSignature($attributes);
            \Log::info('Razorpay signature verification passed');
        } catch (\Exception $e) {
            \Log::error('Razorpay signature verification failed', [
                'error' => $e->getMessage(),
                'order_id' => $request->razorpay_order_id,
                'payment_id' => $request->razorpay_payment_id,
            ]);
            return response()->json(['error' => 'Payment verification failed: ' . $e->getMessage()], 400);
        }

        // Verify slot availability again
        $slot = MovieShowSlot::findOrFail($request->movie_show_slot_id);

        if (!$slot->isAvailable() || $request->quantity > $slot->available_seats) {
            return response()->json(['error' => 'Seats no longer available'], 400);
        }

        // Check if user already has a booking
        $existingBooking = MovieTicketBooking::where('user_id', $user->id)
            ->where('movie_show_slot_id', $slot->id)
            ->where('status', '!=', 'cancelled')
            ->first();

        if ($existingBooking) {
            return response()->json(['error' => 'You already have a booking for this show'], 400);
        }

        // Create booking record
        $seatNumbers = $request->input('seat_numbers', []);
        $totalAmount = $slot->price * $request->quantity;

        $booking = MovieTicketBooking::create([
            'user_id' => $user->id,
            'movie_show_slot_id' => $slot->id,
            'quantity' => $request->quantity,
            'seat_numbers' => $seatNumbers,
            'total_amount' => $totalAmount,
            'amount_per_ticket' => $slot->price,
            'status' => 'completed',
            'booking_reference' => 'BOOK' . strtoupper(uniqid()),
        ]);

        // Update available seats
        $slot->updateAvailableSeats($request->quantity);

        return response()->json([
            'success' => true,
            'booking_id' => $booking->id,
            'booking_reference' => $booking->booking_reference,
            'message' => 'Payment successful! Your booking is confirmed.'
        ]);
    }

    /**
     * Show booking confirmation page with all details
     */
    public function showBookingConfirmation(MovieTicketBooking $booking)
    {
        $user = Auth::user();

        if (!$user || $booking->user_id !== $user->id) {
            return redirect('/login')->with('error', 'Unauthorized access');
        }

        // Get all related data
        $slot = $booking->movieShowSlot;
        $movie = $slot->movie;
        $cinema = $slot->cinema;

        return Inertia::render('MovieTickets/BookingConfirmation', [
            'booking' => [
                'id' => $booking->id,
                'booking_reference' => $booking->booking_reference,
                'quantity' => $booking->quantity,
                'seat_numbers' => is_array($booking->seat_numbers) ? $booking->seat_numbers : json_decode($booking->seat_numbers, true),
                'total_amount' => $booking->total_amount,
                'amount_per_ticket' => $booking->amount_per_ticket,
                'status' => $booking->status,
                'created_at' => $booking->created_at->format('M d, Y h:i A'),
            ],
            'movie' => [
                'id' => $movie->id,
                'title' => $movie->title,
                'image' => $movie->image,
                'category' => $movie->category ?? $movie->genre,
                'genre' => $movie->genre,
                'language' => $movie->language,
                'format' => $movie->format,
                'duration' => $movie->duration,
                'rating' => $movie->rating,
                'description' => $movie->description,
            ],
            'cinema' => [
                'id' => $cinema->id,
                'name' => $cinema->name,
                'location' => $cinema->location,
                'type' => $cinema->type,
                'image' => $cinema->image,
            ],
            'slot' => [
                'id' => $slot->id,
                'show_date' => $slot->show_date->format('Y-m-d'),
                'show_time' => $slot->show_time,
                'screen_name' => $slot->screen_name,
                'price' => $slot->price,
            ],
        ]);
    }
}

