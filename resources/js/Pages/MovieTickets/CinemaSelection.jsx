import React from 'react';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function CinemaSelection() {
    const { movie, cinemas } = usePage().props;

    const handleCinemaClick = (cinema) => {
        window.location.href = `/movies/${movie.id}/cinemas/${cinema.id}/slots`;
    };

    const handleBackClick = () => {
        window.location.href = '/';
    };

    return (
        <AppLayout>
            <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-7xl">
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
                                src={movie.image} 
                                alt={movie.title}
                                className="w-20 sm:w-24 h-28 sm:h-32 object-cover rounded-lg shadow-md"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-2">{movie.title}</h1>
                            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3 text-gray-600 mb-2 sm:mb-3">
                                <div className="flex items-center gap-1">
                                    <span className="text-xs sm:text-sm font-medium">Rating:</span>
                                    <span className="text-xs sm:text-sm">{movie.rating}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="text-xs sm:text-sm font-medium">Language:</span>
                                    <span className="text-xs sm:text-sm">{movie.language}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="text-xs sm:text-sm font-medium">Format:</span>
                                    <span className="text-xs sm:text-sm">{movie.format}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="text-xs sm:text-sm font-medium">Dur:</span>
                                    <span className="text-xs sm:text-sm">⏱️ {movie.duration}m</span>
                                </div>
                            </div>
                            <p className="text-gray-700 text-xs sm:text-sm line-clamp-2">{movie.description}</p>
                        </div>
                    </div>
                </div>

                {/* Cinema Selection */}
                <div>
                    <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-4">Select Cinema</h2>
                    
                    {cinemas.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-base sm:text-lg">No cinemas available for this movie</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                            {cinemas.map((cinema) => (
                                <div
                                    key={cinema.id}
                                    onClick={() => handleCinemaClick(cinema)}
                                    className="bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl shadow-sm hover:shadow-lg hover:border-orange-600 active:border-orange-600 transition-all cursor-pointer overflow-hidden group"
                                >
                                    {/* Cinema Image */}
                                    <div className="relative h-32 sm:h-40 overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
                                        {cinema.image ? (
                                            <img 
                                                src={cinema.image} 
                                                alt={cinema.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <span className="text-3xl sm:text-4xl">🎬</span>
                                            </div>
                                        )}
                                        {/* Show Count Badge */}
                                        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-orange-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                                            {cinema.upcomingShows}
                                        </div>
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
                </div>
            </div>
        </AppLayout>
    );
}
