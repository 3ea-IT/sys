import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function ShowSlots() {
    const { movie, cinema, showSlots } = usePage().props;
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const handleBackClick = () => {
        window.history.back();
    };

    const handleSlotSelect = (slot) => {
        if (slot.is_sold_out || slot.is_booked) {
            return;
        }
        setSelectedSlot(slot);
        setQuantity(1);
    };

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value);
        if (selectedSlot && value > 0 && value <= Math.min(selectedSlot.available_seats, 10)) {
            setQuantity(value);
        }
    };

    const handleBookNow = () => {
        if (!selectedSlot) return;
        
        // You can add booking logic here or redirect to booking page
        window.location.href = `/movie-tickets/book?slotId=${selectedSlot.id}&quantity=${quantity}`;
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

    const sortedDates = Object.keys(slotsByDate).sort();

    return (
        <AppLayout>
            <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-7xl">
                {/* Navigation and Headers */}
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

                {/* Main Content with Slots and Booking Sidebar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    {/* Show Slots Section */}
                    <div className="md:col-span-2">
                        <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-4">Select Show Time</h2>

                        {showSlots.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
                                <p className="text-gray-500 text-base sm:text-lg">No shows available for this combination</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {sortedDates.map((date) => (
                                    <div key={date}>
                                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 px-1">{date}</h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                                            {slotsByDate[date].map((slot) => (
                                                <button
                                                    key={slot.id}
                                                    onClick={() => handleSlotSelect(slot)}
                                                    disabled={slot.is_sold_out || slot.is_booked}
                                                    className={`p-3 sm:p-4 rounded-lg font-semibold transition-all border-2 text-sm sm:text-base ${
                                                        slot.is_sold_out
                                                            ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                                                            : slot.is_booked
                                                            ? 'bg-green-50 text-green-700 border-green-300 cursor-not-allowed'
                                                            : selectedSlot?.id === slot.id
                                                            ? 'bg-orange-600 text-white border-orange-600 shadow-lg'
                                                            : 'bg-white text-gray-900 border-gray-300 hover:border-orange-600 active:border-orange-600 cursor-pointer'
                                                    }`}
                                                >
                                                    <div className="text-base sm:text-lg mb-1">{slot.show_time}</div>
                                                    <div className="text-xs">
                                                        {slot.is_sold_out ? 'Sold Out' : (
                                                            slot.is_booked ? '✓ Booked' : (
                                                                <span className="text-gray-600">
                                                                    {slot.available_seats}/{slot.total_seats}
                                                                </span>
                                                            )
                                                        )}
                                                    </div>
                                                    {slot.screen_name && (
                                                        <div className="text-xs text-gray-500 mt-1">{slot.screen_name}</div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Booking Sidebar */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 sticky md:top-20">
                            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Booking Summary</h3>

                            {selectedSlot ? (
                                <div className="space-y-3 sm:space-y-4">
                                    {/* Selected Slot Info */}
                                    <div className="border-b pb-4">
                                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Selected Show</p>
                                        <p className="text-xl sm:text-2xl font-bold text-orange-600">{selectedSlot.show_time}</p>
                                        <p className="text-xs text-gray-600 mt-1">{selectedSlot.show_date}</p>
                                        {selectedSlot.screen_name && (
                                            <p className="text-xs text-gray-600">{selectedSlot.screen_name}</p>
                                        )}
                                    </div>

                                    {/* Ticket Quantity */}
                                    <div className="border-b pb-4">
                                        <p className="text-xs sm:text-sm text-gray-600 mb-2">Number of Tickets</p>
                                        <select
                                            value={quantity}
                                            onChange={handleQuantityChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-600 font-semibold text-sm"
                                        >
                                            {[...Array(Math.min(selectedSlot.available_seats, 10))].map((_, i) => (
                                                <option key={i + 1} value={i + 1}>{i + 1} Ticket{i + 1 > 1 ? 's' : ''}</option>
                                            ))}
                                        </select>
                                        <p className="text-xs text-gray-600 mt-1">Available: {selectedSlot.available_seats}</p>
                                    </div>

                                    {/* Price Calculation */}
                                    <div className="border-b pb-4 space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 text-xs sm:text-sm">Ticket Price</span>
                                            <span className="font-semibold text-xs sm:text-sm">₹{selectedSlot.price.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 text-xs sm:text-sm">Quantity</span>
                                            <span className="font-semibold text-xs sm:text-sm">× {quantity}</span>
                                        </div>
                                        <div className="flex justify-between text-base sm:text-lg">
                                            <span className="font-semibold text-gray-900">Subtotal</span>
                                            <span className="font-bold text-orange-600">₹{(selectedSlot.price * quantity).toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {/* Availability Alert */}
                                    <div className="bg-blue-50 border border-blue-200 rounded p-2">
                                        <p className="text-xs text-blue-800 text-center">
                                            Standard booking window applies
                                        </p>
                                    </div>

                                    {/* Book Button */}
                                    <button
                                        onClick={handleBookNow}
                                        className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 active:bg-orange-800 transition-colors text-sm sm:text-base"
                                    >
                                        Proceed to Book
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500 text-xs sm:text-sm">Select a show time to continue booking</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="mt-8 bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-sm font-semibold text-gray-900 mb-3">Legend</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-white border-2 border-gray-300"></div>
                            <span>Available</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-orange-600"></div>
                            <span>Selected</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-green-50 border-2 border-green-300"></div>
                            <span>Already Booked</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-gray-100 border-2 border-gray-300"></div>
                            <span>Sold Out</span>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
