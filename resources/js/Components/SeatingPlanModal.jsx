import React, { useState } from 'react';

const SEATING_LAYOUT = [
    // Section: RECLINER
    { row: 'A', seats: 18, section: 'RECLINER', price: 800, showSectionHeader: true },

    // Section: PRIME
    { row: 'B', seats: 18, section: 'PRIME', price: 400, showSectionHeader: true },
    { row: 'C', seats: 18, section: 'PRIME', price: 400, showSectionHeader: false },
    { row: 'D', seats: 18, section: 'PRIME', price: 400, showSectionHeader: false },
    { row: 'E', seats: 18, section: 'PRIME', price: 400, showSectionHeader: false },
    { row: 'F', seats: 18, section: 'PRIME', price: 400, showSectionHeader: false },
    { row: 'G', seats: 18, section: 'PRIME', price: 400, showSectionHeader: false },
    { row: 'H', seats: 18, section: 'PRIME', price: 400, showSectionHeader: false },

    // Section: CLASSIC PLUS
    { row: 'I', seats: 20, section: 'CLASSIC PLUS', price: 250, showSectionHeader: true },
    { row: 'J', seats: 20, section: 'CLASSIC PLUS', price: 250, showSectionHeader: false },
    { row: 'K', seats: 20, section: 'CLASSIC PLUS', price: 250, showSectionHeader: false },

    // Section: CLASSIC
    { row: 'L', seats: 20, section: 'CLASSIC', price: 200, showSectionHeader: true },
    { row: 'M', seats: 20, section: 'CLASSIC', price: 200, showSectionHeader: false },
    { row: 'N', seats: 20, section: 'CLASSIC', price: 200, showSectionHeader: false },
    { row: 'O', seats: 20, section: 'CLASSIC', price: 200, showSectionHeader: false },
];

// Static booked seats for demo
const BOOKED_SEATS = [];

const AISLE_AFTER = {
    18: 9,
    20: 10,
};

export default function SeatingPlanModal({ isOpen, onClose, quantity, onSelectSeats, selectedSlot }) {
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [error, setError] = useState('');

    const handleSeatClick = (seatId, isBooked) => {
        setError('');
        if (isBooked) return;

        if (selectedSeats.includes(seatId)) {
            setSelectedSeats(selectedSeats.filter(id => id !== seatId));
        } else {
            if (selectedSeats.length >= quantity) {
                setError(`You can only select ${quantity} seat${quantity > 1 ? 's' : ''}`);
                return;
            }
            setSelectedSeats([...selectedSeats, seatId]);
        }
    };

    const handleConfirmSeats = () => {
        if (selectedSeats.length !== quantity) {
            setError(`Please select exactly ${quantity} seat${quantity > 1 ? 's' : ''}`);
            return;
        }
        onSelectSeats(selectedSeats);
        setSelectedSeats([]);
        setError('');
        onClose();
    };

    const handleCancel = () => {
        setSelectedSeats([]);
        setError('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 px-3 sm:px-4">
            <div className="bg-white w-full sm:max-w-3xl sm:rounded-2xl max-h-[95vh] flex flex-col overflow-hidden rounded-xl">

                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <div>
                        <h2 className="text-base font-bold text-gray-900">Select Seats</h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {selectedSlot?.show_date} • {selectedSlot?.show_time}
                            {selectedSlot?.screen_name && (
                                <span className="ml-1 text-orange-500 font-medium">• {selectedSlot.screen_name}</span>
                            )}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full">
                            ✏ {quantity} Ticket{quantity > 1 ? 's' : ''}
                        </span>
                        <button
                            onClick={handleCancel}
                            className="text-gray-400 hover:text-gray-600 text-xl font-light leading-none"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Scrollable Seating Area */}
                <div className="flex-1 overflow-y-auto">
                    <div className="flex">

                        {/* Left Row Labels - sticky */}
                        <div className="sticky left-0 z-10 bg-white flex flex-col pt-4 pb-2 pl-2 pr-1 min-w-[28px]">
                            {SEATING_LAYOUT.map(({ row, showSectionHeader }) => (
                                <React.Fragment key={row}>
                                    {showSectionHeader && (
                                        <div className="h-7 mb-1" /> 
                                    )}
                                    <div className="h-7 flex items-center justify-center mb-1">
                                        <span className="text-[10px] font-bold text-gray-400">{row}</span>
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>

                        {/* Seat Grid */}
                        <div className="flex-1 overflow-x-auto px-2 pt-4 pb-2">
                            <div className="min-w-max mx-auto">
                                {SEATING_LAYOUT.map(({ row, seats, section, price, showSectionHeader }) => (
                                    <React.Fragment key={row}>
                                        {/* Section Header */}
                                        {showSectionHeader && (
                                            <div className="flex items-center gap-2 mb-1 mt-1">
                                                <span className="text-[10px] text-gray-400 whitespace-nowrap font-medium">
                                                    ₹{price} &nbsp;{section}
                                                </span>
                                                <div className="flex-1 h-px bg-gray-200" />
                                            </div>
                                        )}

                                        {/* Row of Seats */}
                                        <div className="flex gap-[3px] mb-1 items-center">
                                            {Array.from({ length: seats }, (_, i) => {
                                                const seatNum = i + 1;
                                                const seatId = `${row}${seatNum}`;
                                                const isBooked = BOOKED_SEATS.includes(seatId);
                                                const isSelected = selectedSeats.includes(seatId);
                                                const aisleAfter = AISLE_AFTER[seats] || Math.floor(seats / 2);

                                                return (
                                                    <React.Fragment key={seatId}>
                                                        <button
                                                            onClick={() => handleSeatClick(seatId, isBooked)}
                                                            disabled={isBooked}
                                                            title={seatId}
                                                            className={`
                                                                w-6 h-6 rounded-t-md text-[9px] font-semibold
                                                                flex items-center justify-center
                                                                transition-all select-none flex-shrink-0
                                                                border
                                                                ${isBooked
                                                                    ? 'bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed'
                                                                    : isSelected
                                                                    ? 'bg-orange-500 border-orange-500 text-white scale-105 shadow-sm cursor-pointer'
                                                                    : 'bg-white border-orange-300 text-orange-500 hover:bg-orange-50 cursor-pointer'
                                                                }
                                                            `}
                                                        >
                                                            {isSelected ? '✓' : seatNum}
                                                        </button>
                                                        {/* Aisle gap */}
                                                        {seatNum === aisleAfter && (
                                                            <div className="w-4 flex-shrink-0" />
                                                        )}
                                                    </React.Fragment>
                                                );
                                            })}
                                        </div>
                                    </React.Fragment>
                                ))}
                            </div>

                            {/* Screen */}
                            <div className="text-center mt-8 mb-6 px-4">
                                <div
                                    className="mx-auto"
                                    style={{
                                        width: '70%',
                                        height: '14px',
                                        background: 'linear-gradient(180deg, #bfdbfe 0%, #e0f2fe 100%)',
                                        borderRadius: '0 0 60% 60% / 0 0 100% 100%',
                                        boxShadow: '0 4px 16px 0 #bfdbfe88',
                                    }}
                                />
                                <p className="text-[10px] text-gray-400 mt-2 tracking-widest uppercase">All eyes this way please!</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-center gap-6">
                    <span className="flex items-center gap-1.5 text-xs text-gray-600">
                        <span className="w-5 h-5 rounded-t border border-orange-300 bg-white inline-block"></span>
                        Available
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-gray-600">
                        <span className="w-5 h-5 rounded-t bg-orange-500 inline-block"></span>
                        Selected
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-gray-600">
                        <span className="w-5 h-5 rounded-t bg-gray-100 border border-gray-200 inline-block"></span>
                        Booked
                    </span>
                </div>

                {/* Error */}
                {error && (
                    <div className="mx-4 mb-2 px-3 py-2 bg-red-50 border border-red-100 rounded-lg">
                        <p className="text-xs text-red-600">{error}</p>
                    </div>
                )}

                {/* Selected Seats chips */}
                {selectedSeats.length > 0 && (
                    <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                        {selectedSeats.sort().map(seat => (
                            <span
                                key={seat}
                                className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs font-semibold"
                            >
                                {seat}
                                <button
                                    onClick={() => handleSeatClick(seat, false)}
                                    className="hover:text-orange-900 font-bold leading-none"
                                >
                                    ✕
                                </button>
                            </span>
                        ))}
                    </div>
                )}

                {/* Footer */}
                <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between gap-3 bg-white">
                    <button
                        onClick={handleCancel}
                        className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirmSeats}
                        disabled={selectedSeats.length !== quantity}
                        className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-colors ${
                            selectedSeats.length === quantity
                                ? 'bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                        {selectedSeats.length === quantity
                            ? `Confirm ${quantity} Seat${quantity > 1 ? 's' : ''}`
                            : `Select ${quantity - selectedSeats.length} more seat${(quantity - selectedSeats.length) > 1 ? 's' : ''}`
                        }
                    </button>
                </div>

            </div>
        </div>
    );
}