import React, { useState, useRef } from 'react';
import { usePage, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import BookingSummaryModal from '@/Components/BookingSummaryModal';

export default function ShowSlots() {
    const { movie, cinema, showSlots } = usePage().props;
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    const handleBackClick = () => {
        window.history.back();
    };

    const handleSlotSelect = (slot) => {
        if (slot.is_sold_out || slot.is_booked) {
            return;
        }
        setSelectedSlot(slot);
        setQuantity(1);
        setIsSummaryModalOpen(true);
    };

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value);
        if (selectedSlot && value > 0 && value <= Math.min(selectedSlot.available_seats, 10)) {
            setQuantity(value);
        }
    };

    const handleOpenSeatingPlan = () => {
        if (selectedSlot && quantity > 0) {
            // Navigate to seating page
            router.visit(`/movies/${movie.id}/cinemas/${cinema.id}/slots/${selectedSlot.id}/seats?quantity=${quantity}`);
            setIsSummaryModalOpen(false);
        }
    };

    // Group slots by date
    const slotsByDate = showSlots.reduce((acc, slot) => {
        const date = slot.show_date;
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(slot);
        return acc;
    }, {});

    // Sort dates chronologically
    const sortedDates = Object.keys(slotsByDate).sort((a, b) => {
        return new Date(a) - new Date(b);
    });

    // Default selectedDate to first date
    const activeDateKey = selectedDate ?? sortedDates[0] ?? null;

    // Convert minutes to HH:MM format
    const formatDuration = (minutes) => {
        if (!minutes) return '0h 0m';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    // Determine if a slot is premium based on screen name
    const isPremiumSlot = (slot) => {
        if (!slot.screen_name) return false;
        const name = slot.screen_name.toUpperCase();
        return (
            name.includes('LUXE') ||
            name.includes('IMAX') ||
            name.includes('4DX') ||
            name.includes('GOLD') ||
            name.includes('PRIME') ||
            name.includes('DIRECTOR')
        );
    };

    return (
        <AppLayout>
            <div className="container mx-auto py-0 max-w-7xl">

                {/* Back Button */}
                <button
                    onClick={handleBackClick}
                    className="mb-3 sm:mb-4 text-orange-600 hover:text-orange-700 flex items-center gap-2 font-medium text-sm sm:text-base active:opacity-70"
                >
                    ← Select Another Cinema
                </button>

                {/* Movie and Cinema Info */}
                <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 md:p-6 mb-6 sm:mb-8">
                    <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
                        <div className="flex-shrink-0">
                            <img
                                src={movie.image}
                                alt={movie.title}
                                className="w-16 sm:w-20 h-24 sm:h-28 object-cover rounded-lg shadow-md"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-lg sm:text-3xl font-bold text-gray-900 mb-2">{movie.title}</h1>
                            <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-3 text-gray-600 mb-2 sm:mb-3 text-xs sm:text-sm">
                                <span className="flex items-center gap-1">
                                    <span className="font-medium">Language:</span>
                                    <span>{movie.language}</span>
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="font-medium">Format:</span>
                                    <span>{movie.format}</span>
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="font-medium">Duration:</span>
                                    <span>⏱️ {formatDuration(movie.duration)}</span>
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="font-medium">Genre:</span>
                                    <span>{movie.genre}</span>
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="font-medium">Rating:</span>
                                    <span>{movie.rating}</span>
                                </span>
                            </div>
                        </div>
                        <div className="md:flex-shrink-0 border-t md:border-t-0 md:border-l md:pl-4 pt-4 md:pt-0 text-left md:text-right">
                            <p className="text-gray-600 font-medium text-xs sm:text-sm mb-1">Cinema</p>
                            <p className="text-base sm:text-lg font-bold text-gray-900">{cinema.name}</p>
                            <p className="text-xs sm:text-sm text-gray-600 flex md:flex-col items-center md:items-end gap-1 mt-1">
                                <span>📍</span>
                                <span className="line-clamp-2">{cinema.location}</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div>
                    {/* ── DATES SECTION - BookMyShow style ── */}
                    <div className="mb-6">
                        <div className="flex overflow-x-auto no-scrollbar border-b border-gray-200 dark:border-gray-700">
                            {sortedDates.map((date) => {
                                const d = new Date(date);
                                const weekday = d.toLocaleDateString('en-IN', { weekday: 'short' }).toUpperCase();
                                const day = d.getDate();
                                const month = d.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase();
                                const isActive = date === activeDateKey;

                                return (
                                    <button
                                        key={date}
                                        onClick={() => setSelectedDate(date)}
                                        className={`flex-shrink-0 flex flex-col items-center justify-center px-5 py-3 min-w-[72px] transition-all focus:outline-none
                                            ${isActive
                                                ? 'bg-brand-primary text-white'
                                                : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                                            }`}
                                    >
                                        <span className={`text-[10px] font-semibold tracking-wider ${isActive ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`}>
                                            {weekday}
                                        </span>
                                        <span className={`text-2xl font-bold leading-tight ${isActive ? 'text-white' : 'text-gray-800 dark:text-gray-100'}`}>
                                            {day}
                                        </span>
                                        <span className={`text-[10px] font-semibold tracking-wider ${isActive ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`}>
                                            {month}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Show Slots Section */}
                    <div>
                        <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-4">Select Show Time</h2>

                        {/* Legend */}
                        <div className="flex flex-wrap items-center gap-4 mb-5 text-xs text-gray-500">
                            <span className="flex items-center gap-1.5">
                                <span className="inline-block w-3 h-3 rounded-sm border border-gray-300 bg-white"></span>
                                Available
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="inline-block w-3 h-3 rounded-sm bg-orange-500"></span>
                                Selected
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="inline-block w-3 h-3 rounded-sm bg-gray-100 border border-gray-200"></span>
                                Unavailable
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="inline-block w-0.5 h-3 bg-amber-400 rounded-full"></span>
                                Premium Screen
                            </span>
                        </div>

                        {showSlots.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
                                <p className="text-gray-500 text-base sm:text-lg">No shows available for this combination</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {(activeDateKey ? [activeDateKey] : sortedDates).map((date) => (
                                    <div key={date}>
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">
                                            {date}
                                        </h3>
                                        <div className="grid grid-cols-3 gap-2">
                                            {slotsByDate[date].map((slot) => {
                                                const premium = isPremiumSlot(slot);
                                                const isSelected = selectedSlot?.id === slot.id;
                                                const isDisabled = slot.is_sold_out;

                                                return (
                                                    <button
                                                        key={slot.id}
                                                        onClick={() => handleSlotSelect(slot)}
                                                        disabled={isDisabled}
                                                        className={`
                                                            relative flex flex-col justify-center items-start text-left
                                                            px-2.5 py-2.5 sm:px-3 sm:py-3 rounded-lg transition-all border
                                                            ${isDisabled
                                                                ? 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-55'
                                                                : isSelected
                                                                ? 'bg-orange-50 border-orange-300 shadow-sm cursor-pointer'
                                                                : 'bg-white border-gray-200 hover:border-orange-300 hover:shadow-sm cursor-pointer'
                                                            }
                                                        `}
                                                        style={
                                                            !isDisabled
                                                                ? {
                                                                    borderLeftWidth: '3px',
                                                                    borderLeftColor: isSelected
                                                                        ? '#ea580c'
                                                                        : premium
                                                                        ? '#f59e0b'
                                                                        : '#ea580c',
                                                                }
                                                                : {}
                                                        }
                                                    >
                                                        {/* Time */}
                                                        <div className={`text-xs sm:text-sm font-bold leading-tight ${
                                                            isDisabled
                                                                ? 'text-gray-400'
                                                                : isSelected
                                                                ? 'text-orange-700'
                                                                : 'text-gray-900'
                                                        }`}>
                                                            {slot.show_time}
                                                        </div>

                                                        {/* Screen Name */}
                                                        {slot.screen_name && (
                                                            <div className={`text-[10px] sm:text-xs mt-0.5 font-semibold tracking-wide uppercase ${
                                                                isDisabled
                                                                    ? 'text-gray-300'
                                                                    : isSelected
                                                                    ? premium ? 'text-amber-500' : 'text-orange-500'
                                                                    : premium
                                                                    ? 'text-amber-500'
                                                                    : 'text-orange-400'
                                                            }`}>
                                                                {slot.screen_name}
                                                            </div>
                                                        )}

                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Booking Summary Modal */}
            <BookingSummaryModal
                isOpen={isSummaryModalOpen}
                onClose={() => setIsSummaryModalOpen(false)}
                selectedSlot={selectedSlot}
                quantity={quantity}
                onQuantityChange={handleQuantityChange}
                onSelectSeats={handleOpenSeatingPlan}
                movie={movie}
                cinema={cinema}
                isPremiumSlot={isPremiumSlot}
            />
        </AppLayout>
    );
}