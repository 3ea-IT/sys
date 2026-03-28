import React from 'react';
import ReactDOM from 'react-dom';

export default function MatchBookingModal({ isOpen, onClose, match, quantity, onQuantityChange, onConfirmBooking }) {
    if (!isOpen || !match) return null;

    const ticketPrice = Number(match.ticket_price || 1000);
    const totalPrice = ticketPrice * quantity;
    const availableSeats = match.available_seats ?? 10;
    const isSoldOut = match.status === 'sold_out';

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[10000] px-4 py-6">
            <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Ticket Booking</h2>
                        <p className="text-xs text-gray-500 mt-1">Confirm your match tickets before checkout</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-xl font-light leading-none"
                        aria-label="Close modal"
                    >
                        ✕
                    </button>
                </div>

                <div className="px-6 py-4 space-y-4 overflow-y-auto flex-1">
                    <div className="bg-orange-50 rounded-2xl p-4">
                        <p className="text-xs text-gray-600 uppercase tracking-[0.2em] mb-2">Match</p>
                        <h3 className="text-sm font-bold text-gray-900">{match.team1?.name || 'Team 1'} vs {match.team2?.name || 'Team 2'}</h3>
                        <p className="text-xs text-gray-500 mt-1">{match.venue?.name || match.location || 'Venue details unavailable'}</p>
                        <p className="text-xs text-gray-500 mt-1">{new Date(match.match_date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })} • {match.match_time || new Date(match.match_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>

                    <div className="border-b pb-3">
                        <p className="text-xs text-gray-600 mb-2">Ticket Quantity</p>
                        <select
                            value={quantity}
                            onChange={onQuantityChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-600 font-semibold text-sm"
                            disabled={isSoldOut}
                        >
                            {[...Array(Math.min(availableSeats, 10))].map((_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {i + 1} Ticket{i + 1 > 1 ? 's' : ''}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-400 mt-1">{availableSeats} seats available</p>
                    </div>

                    {/* <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Ticket Price</span>
                            <span className="font-semibold text-gray-800">₹{ticketPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Quantity</span>
                            <span className="font-semibold text-gray-800">× {quantity}</span>
                        </div>
                        <div className="flex justify-between pt-3 border-t">
                            <span className="font-semibold text-gray-900">Total Amount</span>
                            <span className="font-bold text-orange-600 text-lg">₹{totalPrice.toFixed(2)}</span>
                        </div>
                    </div> */}

                    <div className="bg-orange-50 border border-orange-100 rounded-2xl p-3 text-xs text-orange-700">
                        M-Ticket will be sent to your registered mobile number once booking is confirmed.
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-100 bg-white flex flex-col gap-3">
                    <button
                        onClick={onConfirmBooking}
                        disabled={isSoldOut}
                        className={`w-full rounded-2xl py-3 text-sm font-bold text-white transition-colors ${isSoldOut ? 'bg-gray-300 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'}`}
                    >
                        {isSoldOut ? 'Sold Out' : `Select Seats`}
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full rounded-2xl py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
