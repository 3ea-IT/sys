import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function CinemaSelection() {
    const { movie, cinemas } = usePage().props;
    const [apiCinemas, setApiCinemas] = useState([]);
    const [cinemasLoading, setCinemasLoading] = useState(true);
    const [cinemasError, setCinemasError] = useState(null);
    const [cinemasFallback, setCinemasFallback] = useState(false);
    const [filmDetails, setFilmDetails] = useState(null);
    const [filmDetailsLoading, setFilmDetailsLoading] = useState(false);
    const [filmDetailsError, setFilmDetailsError] = useState(null);
    const [descriptionExpanded, setDescriptionExpanded] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        const loadCinemasNearby = async () => {
            setCinemasLoading(true);
            try {
                const response = await fetch('/api/cinemas-nearby?n=10', {
                    headers: { Accept: 'application/json' },
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error(`Failed to load cinemas (${response.status})`);
                }

                const payload = await response.json();
                const isFallback = payload.fallback === true;
                setApiCinemas(payload.cinemas ?? payload.data ?? []);
                setCinemasFallback(isFallback);
                setCinemasError(!isFallback && payload.error ? payload.error : null);
            } catch (error) {
                if (error.name !== 'AbortError') {
                    setCinemasError(error.message);
                }
            } finally {
                setCinemasLoading(false);
            }
        };

        loadCinemasNearby();
        return () => controller.abort();
    }, []);

    const movieFilmId = movie.film_id ?? movie.id ?? movie.movie_id ?? movie.uid ?? movie.filmCode ?? null;

    useEffect(() => {
        if (!movieFilmId) {
            setFilmDetailsLoading(false);
            return;
        }

        const controller = new AbortController();
        const loadFilmDetails = async () => {
            setFilmDetailsLoading(true);
            setFilmDetailsError(null);

            try {
                const response = await fetch(`/api/filmDetails?film_id=${encodeURIComponent(movieFilmId)}`, {
                    headers: { Accept: 'application/json' },
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error(`Failed to load film details (${response.status})`);
                }

                const payload = await response.json();
                const details = payload.film ?? payload.data ?? payload;
                setFilmDetails(details);
            } catch (error) {
                if (error.name !== 'AbortError') {
                    setFilmDetailsError(error.message);
                }
            } finally {
                setFilmDetailsLoading(false);
            }
        };

        loadFilmDetails();
        return () => controller.abort();
    }, [movieFilmId]);

    const normalizeFilmDetails = (details) => {
        details = details || {};
        const normalized = {};
        const title = details.film_name ?? details.title ?? details.name ?? details.other_titles?.EN;
        if (title) normalized.title = title;

        const image =
            details.images?.poster?.[1]?.medium?.film_image ??
            details.images?.poster?.['1']?.medium?.film_image ??
            details.poster ??
            details.image ??
            details.artwork ??
            details.film_image ??
            null;
        if (image) normalized.image = image;

        const language = details.language ?? details.lang ?? details.original_language;
        if (language) normalized.language = language;

        const genre = Array.isArray(details.genres)
            ? details.genres.map((genre) => genre.genre_name || genre).filter(Boolean).join(', ')
            : details.genre ?? details.category ?? details.other_titles?.EN;
        if (genre) normalized.genre = genre;

        const duration = details.duration_mins ?? details.length ?? details.duration ?? details.runtime ?? details.running_time ?? null;
        if (duration !== null && duration !== undefined) normalized.duration = duration;

        const format = details.version_type ?? details.format ?? (Array.isArray(details.age_rating) ? details.age_rating[0]?.rating : details.age_rating);
        if (format) normalized.format = format;

        const rating = Array.isArray(details.age_rating) ? details.age_rating[0]?.rating : details.rating ?? null;
        if (rating) normalized.rating = rating;

        const releaseDate = Array.isArray(details.release_dates) && details.release_dates.length > 0
            ? details.release_dates[0]?.release_date
            : details.release_date ?? null;
        if (releaseDate) normalized.releaseDate = releaseDate;

        const castArray = Array.isArray(details.cast)
            ? details.cast
                .map((actor) => actor.cast_name ?? actor.name ?? '')
                .filter((name) => name)
            : [];
        if (castArray.length > 0) normalized.castArray = castArray;

        const producersArray = Array.isArray(details.producers)
            ? details.producers
                .map((producer) => producer.producer_name ?? producer.name ?? '')
                .filter((name) => name)
            : [];
        if (producersArray.length > 0) normalized.producersArray = producersArray;

        const description = details.synopsis_long ?? details.synopsis ?? details.description ?? details.storyline;
        if (description) normalized.description = description;

        return normalized;
    };

    const fallbackCinemaImage = '/assets/cinemas/cinepolis.jpg';

    const getCinemaImage = (cinema) => {
        const maybeImage = cinema.image ?? cinema.logo_url;
        if (typeof maybeImage === 'string' && maybeImage.trim().length > 0) {
            return maybeImage;
        }
        return fallbackCinemaImage;
    };

    const normalizeCinema = (cinema) => {
        const id = cinema.id ?? cinema.cinema_id;
        const name = cinema.name ?? cinema.cinema_name ?? 'Unknown Cinema';
        const locationParts = [cinema.location, cinema.address, cinema.address2, cinema.city, cinema.state]
            .filter((part) => typeof part === 'string' && part.trim().length > 0);
        const location = cinema.location ?? locationParts.join(', ');
        const image = getCinemaImage(cinema);

        return {
            ...cinema,
            id,
            name,
            location,
            image,
        };
    };

    const displayedCinemas = (apiCinemas.length > 0 ? apiCinemas : cinemas).map(normalizeCinema);
    const displayedMovie = {
        ...movie,
        ...normalizeFilmDetails(filmDetails),
    };

    // Convert minutes to HH:MM format
    const formatDuration = (minutes) => {
        if (!minutes) return '0h 0m';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    const handleCinemaClick = (cinema) => {
        const filmId = movie.film_id ?? movie.id;
        const params = new URLSearchParams({ film_id: filmId });

        if (cinema.cinema_id) {
            params.set('cinema_id', cinema.cinema_id);
        }
        if (cinema.name) {
            params.set('cinema_name', cinema.name);
        }
        if (cinema.location) {
            params.set('cinema_location', cinema.location);
        }
        if (cinema.type) {
            params.set('cinema_type', cinema.type);
        }

        if (movie.title) {
            params.set('movie_title', movie.title);
        }
        if (movie.image) {
            params.set('movie_image', movie.image);
        }
        if (movie.language) {
            params.set('movie_language', movie.language);
        }
        if (movie.format) {
            params.set('movie_format', movie.format);
        }
        if (movie.genre) {
            params.set('movie_genre', movie.genre);
        }
        if (movie.duration) {
            params.set('movie_duration', movie.duration);
        }
        if (movie.rating) {
            params.set('movie_rating', movie.rating);
        }

        window.location.href = `/movies/${movie.id}/cinemas/${cinema.id}/slots?${params.toString()}`;
    };

    const handleBackClick = () => {
        window.location.href = '/dashboard';
    };

    return (
        <AppLayout>
            <div className="container mx-auto py-0 max-w-7xl">
                {/* Movie Header */}
                <div className="mb-6 sm:mb-8">
                    <button
                        onClick={handleBackClick}
                        className="mb-3 sm:mb-4 text-orange-600 hover:text-orange-700 flex items-center gap-2 font-medium text-sm sm:text-base active:opacity-70"
                    >
                        ← Back to Dashboard
                    </button>
                    
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6 bg-white rounded-lg p-3 sm:p-4">
                        <div className="flex-shrink-0">
                            <img 
                                src={displayedMovie.image} 
                                alt={displayedMovie.title}
                                className="w-20 sm:w-24 h-28 sm:h-32 object-cover rounded-lg shadow-md"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-2">{displayedMovie.title}</h1>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-gray-600 mb-2 sm:mb-3">
                                <div className="flex items-center gap-1">
                                    <span className="text-xs sm:text-sm font-medium">Format:</span>
                                    <span className="text-xs sm:text-sm">{displayedMovie.format}</span>
                                </div>
                                {displayedMovie.duration ? (
                                    <div className="flex items-center gap-1">
                                        <span className="text-xs sm:text-sm font-medium">Duration:</span>
                                        <span className="text-xs sm:text-sm">{formatDuration(displayedMovie.duration)}</span>
                                    </div>
                                ) : null}
                                {displayedMovie.rating ? (
                                    <div className="flex items-center gap-1">
                                        <span className="text-xs sm:text-sm font-medium">Rating:</span>
                                        <span className="text-xs sm:text-sm">{displayedMovie.rating}</span>
                                    </div>
                                ) : null}
                                {displayedMovie.releaseDate ? (
                                    <div className="flex items-center gap-1">
                                        <span className="text-xs sm:text-sm font-medium">Release:</span>
                                        <span className="text-xs sm:text-sm">{displayedMovie.releaseDate}</span>
                                    </div>
                                ) : null}
                                {displayedMovie.genre ? (
                                    <div className="sm:col-span-2 flex items-center gap-1">
                                        <span className="text-xs sm:text-sm font-medium">Genre:</span>
                                        <span className="text-xs sm:text-sm">{displayedMovie.genre}</span>
                                    </div>
                                ) : null}
                            </div>
                            {filmDetailsError && (
                                <p className="text-sm text-orange-600 mb-2">{filmDetailsError}</p>
                            )}
                            <p className={`text-gray-700 text-xs sm:text-sm ${descriptionExpanded ? '' : 'line-clamp-2'}`}>{displayedMovie.description}</p>
                            {displayedMovie.description ? (
                                <button
                                    type="button"
                                    onClick={() => setDescriptionExpanded((prev) => !prev)}
                                    className="mt-2 text-orange-600 hover:text-orange-700 text-xs font-semibold"
                                >
                                    {descriptionExpanded ? 'Read Less' : 'Read More'}
                                </button>
                            ) : null}
                        </div>
                    </div>

                    {(displayedMovie.castArray?.length > 0 || displayedMovie.producersArray?.length > 0) && (
                        <div className="mb-6 space-y-4">
                            {displayedMovie.castArray?.length > 0 && (
                                <div className="bg-white rounded-lg p-4">
                                    <h2 className="text-lg font-bold text-gray-900 mb-3">Cast</h2>
                                    <div className="flex gap-2 overflow-x-auto pb-2">
                                        {displayedMovie.castArray.map((castName, index) => (
                                            <span
                                                key={`${castName}-${index}`}
                                                className="min-w-max rounded-full border border-gray-200 bg-gray-50 px-3 py-2 text-xs sm:text-sm text-gray-700 whitespace-nowrap"
                                            >
                                                {castName}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {displayedMovie.producersArray?.length > 0 && (
                                <div className="bg-white rounded-lg p-4">
                                    <h2 className="text-lg font-bold text-gray-900 mb-3">Producers</h2>
                                    <div className="flex gap-2 overflow-x-auto pb-2">
                                        {displayedMovie.producersArray.map((producerName, index) => (
                                            <span
                                                key={`${producerName}-${index}`}
                                                className="min-w-max rounded-full border border-gray-200 bg-gray-50 px-3 py-2 text-xs sm:text-sm text-gray-700 whitespace-nowrap"
                                            >
                                                {producerName}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Cinema Selection */}
                <div>
                    <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-4">Select Cinema</h2>
                    
                    {cinemasLoading ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-base sm:text-lg">Loading nearby cinemas...</p>
                        </div>
                    ) : cinemasError ? (
                        <div className="text-center py-12">
                            <p className="text-red-500 text-base sm:text-lg">{cinemasError}</p>
                        </div>
                    ) : (
                        <>
                            {cinemasFallback && !cinemasError ? (
                                <div className="text-center pb-4">
                                    <p className="text-sm text-orange-600">Showing local cinemas because nearby MovieGlu theaters could not be loaded.</p>
                                </div>
                            ) : null}

                            {displayedCinemas.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 text-base sm:text-lg">No nearby cinemas found.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                                    {displayedCinemas.map((cinema) => (
                                        <div
                                            key={cinema.id}
                                            onClick={() => handleCinemaClick(cinema)}
                                            className="bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl shadow-sm hover:shadow-lg hover:border-orange-600 active:border-orange-600 transition-all cursor-pointer overflow-hidden group"
                                        >
                                            {/* Cinema Image */}
                                            <div className="relative h-32 sm:h-40 overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
                                                <img 
                                                    src={cinema.image}
                                                    alt={cinema.name}
                                                    onError={(event) => {
                                                        event.currentTarget.onerror = null;
                                                        event.currentTarget.src = fallbackCinemaImage;
                                                    }}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>

                                            {/* Cinema Info */}
                                            <div className="p-3 sm:p-4">
                                                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 line-clamp-2">{cinema.name}</h3>
                                                
                                                <div className="flex items-start gap-2 text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">
                                                    <span className="text-base">📍</span>
                                                    <span className="flex-1 line-clamp-2">{cinema.location}</span>
                                                </div>

                                                <div className="flex gap-2 mb-3 flex-wrap">
                                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                                        cinema.type === 'Multiplex' 
                                                            ? 'bg-blue-100 text-blue-700' 
                                                            : 'bg-purple-100 text-purple-700'
                                                    }`}>
                                                        {cinema.type}
                                                    </span>
                                                    <span className="text-xs text-gray-500 px-2 py-1 bg-gray-50 rounded">
                                                        {cinema.upcomingShows === 1 ? '1 slot' : `${cinema.upcomingShows} slots`}
                                                    </span>
                                                </div>

                                                <button className="w-full bg-orange-600 text-white py-2.5 sm:py-2 rounded-lg font-semibold hover:bg-orange-700 active:bg-orange-800 transition-colors text-sm sm:text-base">
                                                    Select Cinema
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
