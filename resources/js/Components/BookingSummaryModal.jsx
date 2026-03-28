import React from 'react';
import ReactDOM from 'react-dom';

export default function BookingSummaryModal({ isOpen, onClose, selectedSlot, quantity, onQuantityChange, onSelectSeats, movie, cinema, isPremiumSlot }) {
    if (!isOpen || !selectedSlot) return null;

    const totalPrice = selectedSlot.price * quantity;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-3 sm:px-4">
            <div className="bg-white w-full sm:max-w-md rounded-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">Booking Summary</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-xl font-light leading-none"
                    >
                        ✕
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">

                    {/* Movie Info */}
                    <div className="bg-orange-50 rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">Movie</p>
                        <p className="text-sm font-bold text-gray-900">{movie?.title}</p>
                        <p className="text-xs text-gray-600 mt-1">📍 {cinema?.name}</p>
                    </div>

                    {/* Selected Slot Info */}
                    <div className="border-b pb-3">
                        <p className="text-xs text-gray-600 mb-1">Selected Show</p>
                        <p className="text-2xl font-bold text-orange-600">{selectedSlot.show_time}</p>
                        <p className="text-xs text-gray-600 mt-1">{selectedSlot.show_date}</p>
                        {selectedSlot.screen_name && (
                            <p className={`text-xs font-semibold mt-0.5 ${
                                isPremiumSlot(selectedSlot) ? 'text-amber-500' : 'text-orange-400'
                            }`}>
                                {selectedSlot.screen_name}
                            </p>
                        )}
                    </div>

                    {/* Ticket Quantity */}
                    <div className="border-b pb-3">
                        <p className="text-xs text-gray-600 mb-2">Number of Tickets</p>
                        <select
                            value={quantity}
                            onChange={onQuantityChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-600 font-semibold text-sm"
                        >
                            {[...Array(Math.min(selectedSlot.available_seats, 10))].map((_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {i + 1} Ticket{i + 1 > 1 ? 's' : ''}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-400 mt-1">{selectedSlot.available_seats} seats available</p>
                    </div>

                    {/* Price Breakdown */}
                    <div className="border-b pb-3 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Ticket Price</span>
                            <span className="font-semibold text-gray-800">₹{selectedSlot.price.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Quantity</span>
                            <span className="font-semibold text-gray-800">× {quantity}</span>
                        </div>
                        <div className="flex justify-between pt-1 border-t">
                            <span className="font-semibold text-gray-900">Total Amount</span>
                            <span className="font-bold text-orange-600 text-lg">₹{totalPrice.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="bg-orange-50 border border-orange-100 rounded-lg p-2.5">
                        <p className="text-xs text-orange-700 text-center">
                            Standard booking window applies
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-3 bg-white">
                    {/* <button
                        onClick={onClose}
                        className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button> */}
                    <button
                        onClick={onSelectSeats}
                        className="flex-1 bg-orange-600 text-white py-2.5 rounded-xl font-bold hover:bg-orange-700 active:bg-orange-800 transition-colors text-sm"
                    >
                        🪑 Select Seats → ₹{totalPrice.toFixed(2)}
                    </button>
                </div>

            </div>
        </div>,
        document.body
    );
}
