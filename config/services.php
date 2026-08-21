<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
        'scheme' => 'https',
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'razorpay' => [
        'key' => env('RAZORPAY_KEY'),
        'secret' => env('RAZORPAY_SECRET'),
    ],

    'swiggy' => [
        'base_url' => env('SWIGGY_BASE_URL', 'https://mcp.swiggy.com'),
        'redirect_uri' => env('SWIGGY_REDIRECT_URI'),
        'scope' => env('SWIGGY_SCOPE', 'mcp:tools mcp:resources mcp:prompts'),
        'default_address_id' => env('SWIGGY_DEFAULT_ADDRESS_ID'),
    ],

    'movieglu' => [
        'base_url' => env('MOVIEGLU_BASE_URL', 'https://api-gate2.movieglu.com'),
        'client' => env('MOVIEGLU_CLIENT'),
        'api_key' => env('MOVIEGLU_API_KEY'),
        'authorization' => env('MOVIEGLU_AUTHORIZATION'),
        'territory' => env('MOVIEGLU_TERRITORY', 'IN'),
        'api_version' => env('MOVIEGLU_API_VERSION', 'v201'),
        'geolocation' => env('MOVIEGLU_GEOLOCATION', '0;0'),
        'movies_endpoint' => env('MOVIEGLU_MOVIES_ENDPOINT', 'filmsInTheaters'),
        'top_movies_endpoint' => env('MOVIEGLU_TOP_MOVIES_ENDPOINT', 'filmsNowShowing'),
        'coming_soon_endpoint' => env('MOVIEGLU_COMING_SOON_ENDPOINT', 'filmsComingSoon'),
        'cinemas_nearby_endpoint' => env('MOVIEGLU_CINEMAS_NEARBY_ENDPOINT', 'cinemasNearby'),
        'cinema_details_endpoint' => env('MOVIEGLU_CINEMA_DETAILS_ENDPOINT', 'cinemaDetails'),
        'film_details_endpoint' => env('MOVIEGLU_FILM_DETAILS_ENDPOINT', 'filmDetails'),
        'cinema_live_search_endpoint' => env('MOVIEGLU_CINEMA_LIVE_SEARCH_ENDPOINT', 'cinemaLiveSearch'),
        'showtimes_endpoint' => env('MOVIEGLU_SHOWTIMES_ENDPOINT', 'filmShowTimes'),
        'cinema_showtimes_endpoint' => env('MOVIEGLU_CINEMA_SHOWTIMES_ENDPOINT', 'cinemaShowTimes'),
    ],

];
