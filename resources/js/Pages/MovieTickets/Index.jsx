import { useEffect, useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Link, usePage, router } from "@inertiajs/react";
import { Clock, MapPin, ArrowLeft } from "lucide-react";

export default function MovieTicketsIndex({ movies = [] }) {
  const { auth } = usePage().props;
  const user = auth?.user;
  const [movieList, setMovieList] = useState(movies);
  const [topMovies, setTopMovies] = useState([]);
  const [comingSoonMovies, setComingSoonMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(movies.length === 0);
  const [isTopLoading, setIsTopLoading] = useState(true);
  const [isComingSoonLoading, setIsComingSoonLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [topFetchError, setTopFetchError] = useState(null);
  const [comingSoonFetchError, setComingSoonFetchError] = useState(null);

  const normalizeMovies = (rawMovies) => {
    if (!Array.isArray(rawMovies)) {
      return [];
    }

    return rawMovies.map((movie) => {
      const posterImage =
        movie.images?.poster?.[1]?.medium?.film_image ??
        movie.images?.poster?.['1']?.medium?.film_image ??
        movie.poster ??
        movie.image ??
        movie.artwork ??
        movie.film_image ??
        movie.poster_image ??
        movie.thumbnail ??
        null;

      const genre =
        Array.isArray(movie.genres) && movie.genres.length
          ? movie.genres.join(', ')
          : movie.genre ?? movie.category ?? movie.other_titles?.EN ?? 'N/A';

      return {
        id:
          movie.film_id ??
          movie.id ??
          movie.movie_id ??
          movie.uid ??
          movie.filmCode ??
          movie.slug ??
          movie.title ??
          movie.name,
        title: movie.film_name ?? movie.title ?? movie.name ?? 'Untitled',
        image: posterImage,
        language: movie.language ?? movie.lang ?? movie.original_language ?? 'N/A',
        genre,
        category: genre,
        duration:
          movie.length ?? movie.duration ?? movie.runtime ?? movie.running_time ?? null,
        description:
          movie.synopsis_long ??
          movie.synopsis ??
          movie.description ??
          movie.details ??
          movie.storyline ??
          '',
        format: movie.format ?? movie.age_rating?.[0]?.rating ?? 'MOVIE',
      };
    });
  };

  useEffect(() => {
    const controller = new AbortController();

    const loadMovies = async () => {
      setIsLoading(true);

      try {
        const response = await fetch("/api/movies", {
          headers: {
            Accept: "application/json",
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to load movies (${response.status})`);
        }

        const payload = await response.json();
        const remoteMovies = payload.movies ?? payload.films ?? payload.data ?? [];
        setMovieList(normalizeMovies(remoteMovies));
        setFetchError(null);
      } catch (error) {
        if (error.name !== "AbortError") {
          setFetchError(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    const loadTopMovies = async () => {
      setIsTopLoading(true);

      try {
        const response = await fetch('/api/movies/top', {
          headers: {
            Accept: 'application/json',
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to load top movies (${response.status})`);
        }

        const payload = await response.json();
        const remoteMovies = payload.movies ?? payload.films ?? payload.data ?? [];
        setTopMovies(normalizeMovies(remoteMovies));
        setTopFetchError(null);
      } catch (error) {
        if (error.name !== 'AbortError') {
          setTopFetchError(error.message);
        }
      } finally {
        setIsTopLoading(false);
      }
    };

    const loadComingSoonMovies = async () => {
      setIsComingSoonLoading(true);

      try {
        const response = await fetch('/api/movies/coming-soon?n=10', {
          headers: {
            Accept: 'application/json',
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to load coming soon movies (${response.status})`);
        }

        const payload = await response.json();
        const remoteMovies = payload.movies ?? payload.films ?? payload.data ?? [];
        setComingSoonMovies(normalizeMovies(remoteMovies));
        setComingSoonFetchError(null);
      } catch (error) {
        if (error.name !== 'AbortError') {
          setComingSoonFetchError(error.message);
        }
      } finally {
        setIsComingSoonLoading(false);
      }
    };

    loadMovies();
    loadTopMovies();
    loadComingSoonMovies();

    return () => controller.abort();
  }, []);

  // Format minutes to HH:MM format
  const formatDuration = (minutes) => {
    if (!minutes) return '0h 0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleMovieClick = (movie) => {
    if (!user) {
      router.visit('/login');
      return;
    }
    // Go to cinema selection page for this movie via preview route
    router.post('/movies/preview/cinemas', { movie });
  };

  const renderMovieCard = (movie) => {
    const posterSrc = movie.image
      ? movie.image.startsWith('http')
        ? movie.image
        : movie.image.startsWith('/')
        ? movie.image
        : `/assets/movies/${movie.image}`
      : 'https://images.unsplash.com/photo-1489599849228-ed304dbb6b38?w=400&h=160&fit=crop';

    return (
      <div
        key={movie.id}
        onClick={() => handleMovieClick(movie)}
        className="rounded-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all mb-2"
      >
        <div className="rounded-lg relative h-52 overflow-hidden bg-gray-200 dark:bg-gray-700">
          <img
            src={posterSrc}
            alt={movie.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src =
                'https://images.unsplash.com/photo-1489599849228-ed304dbb6b38?w=400&h=160&fit=crop';
            }}
          />
        </div>
        <div className="dark:bg-gray-900 px-0 py-1 text-left border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm font-semibold text-brand-primary dark:text-gray-100 whitespace-normal break-words m-0">
            {movie.title}
          </p>
        </div>
      </div>
    );
  };

  return (
    <AppLayout>
      {/* Header */}
      {/* <div className="mb-6"> */}
        {/* <button
          onClick={() => router.visit('/dashboard')}
          className="flex items-center gap-2 text-brand-primary hover:text-brand-primary/80 transition-colors mb-2 -mt-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button> */}
        {/* <h1 className="text-3xl md:text-4xl font-bold text-brand-primary dark:text-gray-100">
          Movies
        </h1> */}
        {/* <p className="text-sm md:text-base text-brand-secondary dark:text-gray-400 mt-2">
          {movieList.length} movies available
        </p> */}
      {/* </div> */}

      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-brand-primary dark:text-gray-100">
              Top Movies
            </h2>
            {/* <p className="text-sm text-brand-secondary dark:text-gray-400 mt-1">
              {topMovies.length} titles
            </p> */}
          </div>
          {isTopLoading ? (
            <p className="text-sm text-brand-secondary dark:text-gray-400">
              Loading top movies...
            </p>
          ) : topFetchError ? (
            <p className="text-sm text-red-500">{topFetchError}</p>
          ) : null}
        </div>

        <div className="lg:hidden grid grid-cols-2 gap-3">
          {isTopLoading ? (
            <div className="col-span-2 text-center py-12">
              <p className="text-brand-secondary dark:text-gray-400">Loading top movies...</p>
            </div>
          ) : topFetchError ? (
            <div className="col-span-2 text-center py-12">
              <p className="text-red-500">Unable to load top movies: {topFetchError}</p>
            </div>
          ) : topMovies.length === 0 ? (
            <div className="col-span-2 text-center py-12">
              <p className="text-brand-secondary dark:text-gray-400">No top movies available</p>
            </div>
          ) : (
            topMovies.map(renderMovieCard)
          )}
        </div>

        <div className="hidden lg:grid lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {isTopLoading ? (
            <div className="col-span-4 xl:col-span-5 text-center py-12">
              <p className="text-brand-secondary dark:text-gray-400">Loading top movies...</p>
            </div>
          ) : topFetchError ? (
            <div className="col-span-4 xl:col-span-5 text-center py-12">
              <p className="text-red-500">Unable to load top movies: {topFetchError}</p>
            </div>
          ) : topMovies.length === 0 ? (
            <div className="col-span-4 xl:col-span-5 text-center py-12">
              <p className="text-brand-secondary dark:text-gray-400">No top movies available</p>
            </div>
          ) : (
            topMovies.map(renderMovieCard)
          )}
        </div>
      </div>

      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-brand-primary dark:text-gray-100">
              Coming Soon
            </h2>
            {/* <p className="text-sm text-brand-secondary dark:text-gray-400 mt-1">
              {comingSoonMovies.length} titles
            </p> */}
          </div>
          {isComingSoonLoading ? (
            <p className="text-sm text-brand-secondary dark:text-gray-400">
              Loading coming soon movies...
            </p>
          ) : comingSoonFetchError ? (
            <p className="text-sm text-red-500">{comingSoonFetchError}</p>
          ) : null}
        </div>

        <div className="lg:hidden grid grid-cols-2 gap-3">
          {isComingSoonLoading ? (
            <div className="col-span-2 text-center py-12">
              <p className="text-brand-secondary dark:text-gray-400">Loading coming soon movies...</p>
            </div>
          ) : comingSoonFetchError ? (
            <div className="col-span-2 text-center py-12">
              <p className="text-red-500">Unable to load coming soon movies: {comingSoonFetchError}</p>
            </div>
          ) : comingSoonMovies.length === 0 ? (
            <div className="col-span-2 text-center py-12">
              <p className="text-brand-secondary dark:text-gray-400">No coming soon movies available</p>
            </div>
          ) : (
            comingSoonMovies.map(renderMovieCard)
          )}
        </div>

        <div className="hidden lg:grid lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {isComingSoonLoading ? (
            <div className="col-span-4 xl:col-span-5 text-center py-12">
              <p className="text-brand-secondary dark:text-gray-400">Loading coming soon movies...</p>
            </div>
          ) : comingSoonFetchError ? (
            <div className="col-span-4 xl:col-span-5 text-center py-12">
              <p className="text-red-500">Unable to load coming soon movies: {comingSoonFetchError}</p>
            </div>
          ) : comingSoonMovies.length === 0 ? (
            <div className="col-span-4 xl:col-span-5 text-center py-12">
              <p className="text-brand-secondary dark:text-gray-400">No coming soon movies available</p>
            </div>
          ) : (
            comingSoonMovies.map(renderMovieCard)
          )}
        </div>
      </div>

      {/* <div className="mb-6 mt-8 border-t border-brand-secondary/10 pt-6">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <h2 className="text-2xl font-semibold text-brand-primary dark:text-gray-100">
              All Movies
            </h2> */}
            {/* <p className="text-sm text-brand-secondary dark:text-gray-400 mt-1">
              {movieList.length} titles
            </p> */}
          {/* </div>
        </div>
      </div> */}

      {/* Mobile/Tablet: 2 columns */}
      {/* <div className="lg:hidden grid grid-cols-2 gap-3">
        {isLoading ? (
          <div className="col-span-2 text-center py-12">
            <p className="text-brand-secondary dark:text-gray-400">Loading movies...</p>
          </div>
        ) : fetchError ? (
          <div className="col-span-2 text-center py-12">
            <p className="text-red-500">Unable to load movies: {fetchError}</p>
          </div>
        ) : movieList.length === 0 ? (
          <div className="col-span-2 text-center py-12">
            <p className="text-brand-secondary dark:text-gray-400">No movies available</p>
          </div>
        ) : (
          movieList.map(renderMovieCard)
        )}
      </div> */}

      {/* Desktop/Tablet: 3-4 columns grid */}
      {/* <div className="hidden lg:grid lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {isLoading ? (
          <div className="col-span-4 xl:col-span-5 text-center py-12">
            <p className="text-brand-secondary dark:text-gray-400">Loading movies...</p>
          </div>
        ) : fetchError ? (
          <div className="col-span-4 xl:col-span-5 text-center py-12">
            <p className="text-red-500">Unable to load movies: {fetchError}</p>
          </div>
        ) : movieList.length === 0 ? (
          <div className="col-span-4 xl:col-span-5 text-center py-12">
            <p className="text-brand-secondary dark:text-gray-400">No movies available</p>
          </div>
        ) : (
          movieList.map(renderMovieCard)
        )}
      </div> */}
    </AppLayout>
  );
}
