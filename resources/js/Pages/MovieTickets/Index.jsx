import AppLayout from "@/Layouts/AppLayout";
import { Link, usePage, router } from "@inertiajs/react";
import { Clock, MapPin, ArrowLeft } from "lucide-react";

export default function MovieTicketsIndex({ movies = [] }) {
  const { auth } = usePage().props;
  const user = auth?.user;

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
    // Go to cinema selection page for this movie
    router.visit(`/movies/${movie.id}/cinemas`);
  };

  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-6">
        {/* <button
          onClick={() => router.visit('/dashboard')}
          className="flex items-center gap-2 text-brand-primary hover:text-brand-primary/80 transition-colors mb-2 -mt-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button> */}
        <h1 className="text-3xl md:text-4xl font-bold text-brand-primary dark:text-gray-100">
          Movies
        </h1>
        <p className="text-sm md:text-base text-brand-secondary dark:text-gray-400 mt-2">
          {movies.length} movies available
        </p>
      </div>

      {/* Mobile/Tablet: 2 columns */}
      <div className="lg:hidden grid grid-cols-2 gap-3">
        {movies.length === 0 ? (
          <div className="col-span-2 text-center py-12">
            <p className="text-brand-secondary dark:text-gray-400">No movies available</p>
          </div>
        ) : (
          movies.map((movie) => (
            <div
              key={movie.id}
              onClick={() => handleMovieClick(movie)}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-card overflow-hidden flex flex-col cursor-pointer hover:shadow-xl transition-all relative"
            >
              {/* Movie Poster */}
              <div className="relative h-40 overflow-hidden bg-gray-200 dark:bg-gray-700">
                <img
                  src={
                    movie.image
                      ? movie.image.startsWith('/')
                        ? movie.image
                        : `/assets/movies/${movie.image}`
                      : 'https://images.unsplash.com/photo-1489599849228-ed304dbb6b38?w=400&h=160&fit=crop'
                  }
                  alt={movie.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      'https://images.unsplash.com/photo-1489599849228-ed304dbb6b38?w=400&h=160&fit=crop';
                  }}
                />

                {/* Format Badge */}
                <span className="absolute top-2 left-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded">
                  {movie.format || 'MOVIE'}
                </span>
              </div>

              {/* Content */}
              <div className="p-3 flex-1 flex flex-col">
                {/* Movie Title */}
                <h3 className="text-sm font-semibold line-clamp-2 dark:text-gray-100 mb-1">
                  {movie.title}
                </h3>

                {/* Language & Category */}
                <p className="text-xs text-brand-secondary dark:text-gray-400 mb-1">
                  {movie.language} • {movie.genre}
                </p>

                {/* Duration */}
                <p className="text-xs text-brand-secondary dark:text-gray-400 mb-3">
                  ⏱️ {formatDuration(movie.duration || 150)}
                </p>

                {/* Select Cinema Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMovieClick(movie);
                  }}
                  className="mt-auto w-full bg-orange-600 text-white py-2 rounded-lg text-xs font-semibold hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-800 transition-all"
                >
                  🎭 Select Cinema
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop/Tablet: 3-4 columns grid */}
      <div className="hidden lg:grid lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {movies.length === 0 ? (
          <div className="col-span-4 xl:col-span-5 text-center py-12">
            <p className="text-brand-secondary dark:text-gray-400">No movies available</p>
          </div>
        ) : (
          movies.map((movie) => (
            <div
              key={movie.id}
              onClick={() => handleMovieClick(movie)}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-card overflow-hidden flex flex-col cursor-pointer hover:shadow-xl transition-all relative"
            >
              {/* Movie Poster */}
              <div className="relative h-32 overflow-hidden bg-gray-200 dark:bg-gray-700">
                <img
                  src={
                    movie.image
                      ? movie.image.startsWith('/')
                        ? movie.image
                        : `/assets/movies/${movie.image}`
                      : 'https://images.unsplash.com/photo-1489599849228-ed304dbb6b38?w=400&h=160&fit=crop'
                  }
                  alt={movie.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      'https://images.unsplash.com/photo-1489599849228-ed304dbb6b38?w=400&h=160&fit=crop';
                  }}
                />

                {/* Format Badge */}
                <span className="absolute top-2 left-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded">
                  {movie.format || 'MOVIE'}
                </span>
              </div>

              {/* Content */}
              <div className="p-3 flex-1 flex flex-col">
                {/* Movie Title */}
                <h3 className="text-sm font-semibold line-clamp-2 dark:text-gray-100 mb-1">
                  {movie.title}
                </h3>

                {/* Language & Category */}
                <p className="text-xs text-brand-secondary dark:text-gray-400 mb-1">
                  {movie.language} • {movie.category}
                </p>

                {/* Duration */}
                <p className="text-xs text-brand-secondary dark:text-gray-400 mb-3">
                  ⏱️ {formatDuration(movie.duration || 150)}
                </p>

                {/* Select Cinema Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMovieClick(movie);
                  }}
                  className="mt-auto w-full bg-orange-600 text-white py-2 rounded-lg text-xs font-semibold hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-800 transition-all"
                >
                  🎭 Select Cinema
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </AppLayout>
  );
}
