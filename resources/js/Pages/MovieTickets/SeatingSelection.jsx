import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const SEATING_LAYOUT = [
    { row: 'A', seats: 18, section: 'RECLINER', price: 800, showSectionHeader: true },
    { row: 'B', seats: 18, section: 'PRIME', price: 400, showSectionHeader: true },
    { row: 'C', seats: 18, section: 'PRIME', price: 400, showSectionHeader: false },
    { row: 'D', seats: 18, section: 'PRIME', price: 400, showSectionHeader: false },
    { row: 'E', seats: 18, section: 'PRIME', price: 400, showSectionHeader: false },
    { row: 'F', seats: 18, section: 'PRIME', price: 400, showSectionHeader: false },
    { row: 'G', seats: 18, section: 'PRIME', price: 400, showSectionHeader: false },
    { row: 'H', seats: 18, section: 'PRIME', price: 400, showSectionHeader: false },
    { row: 'I', seats: 20, section: 'CLASSIC PLUS', price: 250, showSectionHeader: true },
    { row: 'J', seats: 20, section: 'CLASSIC PLUS', price: 250, showSectionHeader: false },
    { row: 'K', seats: 20, section: 'CLASSIC PLUS', price: 250, showSectionHeader: false },
    { row: 'L', seats: 20, section: 'CLASSIC', price: 200, showSectionHeader: true },
    { row: 'M', seats: 20, section: 'CLASSIC', price: 200, showSectionHeader: false },
    { row: 'N', seats: 20, section: 'CLASSIC', price: 200, showSectionHeader: false },
    { row: 'O', seats: 20, section: 'CLASSIC', price: 200, showSectionHeader: false },
];

const BOOKED_SEATS = [];

// Helper function to get CSRF token reliably
const getCsrfToken = () => {
    // Try to get from meta tag
    const metaToken = document.querySelector('meta[name="csrf-token"]')?.content;
    if (metaToken) return metaToken;
    
    // Try to get from cookie (Laravel's default)
    const nameEQ = 'XSRF-TOKEN=';
    const cookies = document.cookie.split(';');
    for(let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.indexOf(nameEQ) === 0) {
            try {
                return decodeURIComponent(cookie.substring(nameEQ.length));
            } catch (e) {
                return cookie.substring(nameEQ.length);
            }
        }
    }
    
    console.warn('⚠️ CSRF token not found in meta tag or cookies');
    return '';
};


const AISLE_AFTER = { 18: 9, 20: 10 };

export default function SeatingSelection() {
    const { movie, cinema, selectedSlot, quantity: quantityFromProps, razorpayKey } = usePage().props;
    const quantity = parseInt(quantityFromProps) || 1; // Convert to number
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [isBooking, setIsBooking] = useState(false);
    const [bookingError, setBookingError] = useState('');
    const [error, setError] = useState('');
    // Modal state for BookingSummaryModal
    const [isBookingModalOpen, setBookingModalOpen] = useState(false);

    // Load Razorpay script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
    }, []);

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

    const handlePayment = async () => {
        if (!selectedSlot || selectedSeats.length === 0) return;
        setIsBooking(true);
        setBookingError('');

        try {
            // Step 1: Create Razorpay order on backend
            const csrfToken = getCsrfToken();
            const orderResponse = await fetch('/api/movie-tickets/create-razorpay-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({
                    movie_show_slot_id: selectedSlot.id,
                    quantity: quantity,
                    seat_numbers: selectedSeats,
                }),
            });

            const orderData = await orderResponse.json();
            if (!orderResponse.ok) {
                setBookingError(orderData.error || 'Failed to create payment order');
                setIsBooking(false);
                return;
            }

            // Step 2: Initialize Razorpay checkout
            const options = {
                key: razorpayKey,
                amount: orderData.amount * 100, // Amount in paise
                currency: 'INR',
                name: 'SecureSeat - Movie Tickets',
                description: `Booking for ${movie.title}`,
                order_id: orderData.orderId,
                handler: async (response) => {
                    // Step 3: Verify payment on backend
                    try {
                        const csrfToken = getCsrfToken();
                        const payloadData = {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            movie_show_slot_id: selectedSlot.id,
                            quantity: quantity,
                            seat_numbers: selectedSeats,
                        };
                        
                        console.log('🔵 Verify Payment - Sending:', payloadData);
                        console.log('🔵 CSRF Token:', csrfToken);

                        const verifyResponse = await fetch('/api/movie-tickets/verify-payment', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRF-TOKEN': csrfToken,
                            },
                            body: JSON.stringify(payloadData),
                        });

                        const verifyData = await verifyResponse.json();
                        console.log('🔴 Verify Payment - Response:', verifyResponse.status, verifyData);
                        
                        if (!verifyResponse.ok) {
                            const errorMessage = verifyData.details ? 
                                `Validation errors: ${JSON.stringify(verifyData.details)}` : 
                                verifyData.error || 'Payment verification failed';
                            setBookingError(errorMessage);
                            setIsBooking(false);
                            return;
                        }

                        // Payment successful
                        window.location.href = `/movie-tickets/booking/${verifyData.booking_id}`;
                    } catch (err) {
                        setBookingError('An error occurred during payment verification.');
                        setIsBooking(false);
                    }
                },
                prefill: {
                    email: document.querySelector('meta[name="user-email"]')?.content || '',
                },
                theme: {
                    color: '#f97316'
                },
                modal: {
                    ondismiss: () => {
                        setIsBooking(false);
                        setBookingError('Payment cancelled. Please try again.');
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            setBookingError('An error occurred. Please try again.');
            setIsBooking(false);
        }
    };

    const totalPrice = selectedSlot?.price * quantity;
    const seatsReady = selectedSeats.length === quantity;

    return (
        <AppLayout modalOpen={isBookingModalOpen}>
            {/* Back Button — separate section */}
            <div className="container mx-auto max-w-7xl px-2 sm:px-4 pt-3 sm:pt-4">
                <button
                    onClick={() => window.history.back()}
                    className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold text-xs sm:text-sm hover:bg-orange-50 px-2 py-1.5 rounded-lg transition-colors active:bg-orange-100"
                >
                    <span className="text-base">←</span>
                    <span className="hidden sm:inline">Back to Slots</span>
                    <span className="sm:hidden">Back</span>
                </button>
            </div>

            {/* Info Bar — separate section with styling */}
            <div className="bg-gradient-to-r from-white to-orange-50 border-b-2 border-orange-300 shadow-md my-2 sm:my-0">
                <div className="container mx-auto max-w-7xl px-3 sm:px-4 py-3 sm:py-4">
                    <div className="flex flex-col gap-3 sm:gap-4">
                        {/* Top: Movie & Cinema Info */}
                        <div className="flex items-start gap-3 min-w-0">
                            <div className="flex-1 min-w-0">
                                <p className="text-sm sm:text-base md:text-lg font-bold text-gray-900 leading-tight line-clamp-2">{movie?.title}</p>
                                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mt-1">
                                    <span>📍</span>
                                    <span className="line-clamp-1">{cinema?.name}</span>
                                </div>
                            </div>
                        </div>

                        {/* Bottom: Date, Time & Ticket Count */}
                        <div className="flex items-center gap-2 sm:gap-3 w-full">
                            <div className="flex-1 bg-white rounded-lg px-2.5 sm:px-3 py-2 shadow-sm border border-orange-100">
                                <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-tight">Date & Time</p>
                                <div className="flex items-baseline gap-1 mt-0.5">
                                    <span className="text-base sm:text-lg font-bold text-orange-600">{selectedSlot?.show_time || 'N/A'}</span>
                                    <span className="text-xs text-gray-500 hidden sm:inline">{selectedSlot?.show_date || 'N/A'}</span>
                                </div>
                            </div>
                            
                            <div className="bg-orange-500 text-white rounded-lg px-3 sm:px-4 py-2 shadow-md flex flex-col items-center justify-center">
                                <p className="text-[10px] font-semibold uppercase tracking-wide">Ticket</p>
                                <p className="text-lg sm:text-xl font-bold leading-none">{quantity}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-7xl px-0 sm:px-4 py-3 sm:py-4">

                {/* ── SEATING PLAN ── */}
                <div className="bg-white sm:rounded-xl sm:shadow-sm sm:border sm:border-gray-100 mb-4 overflow-hidden">

                    {/* Row labels sidebar + scrollable seat grid */}
                    <div className="flex">

                        {/* Fixed left sidebar: row labels */}
                        <div className="sticky left-0 z-10 bg-white flex flex-col shrink-0 pl-3 pr-1 pt-1">
                            {SEATING_LAYOUT.map(({ row, showSectionHeader }) => (
                                <React.Fragment key={row}>
                                    {showSectionHeader && <div className="h-6 mb-[3px]" />}
                                    <div className="w-5 h-6 flex items-center justify-center mb-[3px]">
                                        <span className="text-[10px] font-bold text-gray-400">{row}</span>
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>

                        {/* Horizontally scrollable seat area */}
                        <div className="overflow-x-auto flex-1 pr-3 pt-4 pb-2">
                            <div className="inline-block min-w-max">
                                {SEATING_LAYOUT.map(({ row, seats, section, price, showSectionHeader }) => (
                                    <React.Fragment key={row}>
                                        {showSectionHeader && (
                                            <div className="flex items-center gap-2 mb-[3px] mt-[2px]">
                                                <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">
                                                    ₹{price} &nbsp;{section}
                                                </span>
                                                <div className="flex-1 h-px bg-gray-200 min-w-[40px]" />
                                            </div>
                                        )}

                                        <div className="flex gap-[3px] mb-[3px] items-center">
                                            {Array.from({ length: seats }, (_, i) => {
                                                const seatNum = i + 1;
                                                const seatId = `${row}${seatNum}`;
                                                const isBooked = BOOKED_SEATS.includes(seatId);
                                                const isSelected = selectedSeats.includes(seatId);
                                                const aisleAfter = AISLE_AFTER[seats] ?? Math.floor(seats / 2);

                                                return (
                                                    <React.Fragment key={seatId}>
                                                        <button
                                                            onClick={() => handleSeatClick(seatId, isBooked)}
                                                            disabled={isBooked}
                                                            title={seatId}
                                                            className={`
                                                                w-6 h-6 rounded-t-md text-[9px] font-semibold
                                                                flex items-center justify-center
                                                                transition-all select-none shrink-0 border
                                                                ${isBooked
                                                                    ? 'bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed'
                                                                    : isSelected
                                                                    ? 'bg-orange-500 border-orange-500 text-white scale-105 shadow-sm cursor-pointer'
                                                                    : 'bg-white border-orange-300 text-orange-500 hover:bg-orange-50 active:bg-orange-100 cursor-pointer'
                                                                }
                                                            `}
                                                        >
                                                            {isSelected ? '✓' : seatNum}
                                                        </button>
                                                        {seatNum === aisleAfter && (
                                                            <div className="w-4 shrink-0" />
                                                        )}
                                                    </React.Fragment>
                                                );
                                            })}
                                        </div>
                                    </React.Fragment>
                                ))}

                                {/* Screen */}
                                <div className="text-center mt-8 mb-4">
                                    <div
                                        style={{
                                            width: '65%',
                                            height: '14px',
                                            background: 'linear-gradient(180deg, #bfdbfe 0%, #e0f2fe 100%)',
                                            borderRadius: '0 0 60% 60% / 0 0 100% 100%',
                                            boxShadow: '0 6px 18px 0 #bfdbfe99',
                                            margin: '0 auto',
                                        }}
                                    />
                                    <p className="text-[10px] text-gray-400 mt-2 tracking-widest uppercase">All eyes this way please!</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex items-center justify-center gap-3 sm:gap-6 px-3 sm:px-4 py-2.5 sm:py-3 border-t border-gray-100 flex-wrap">
                        <span className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                            <span className="w-5 h-5 rounded-t border border-orange-300 bg-white inline-block shrink-0"></span>
                            <span className="hidden sm:inline">Available</span>
                            <span className="sm:hidden">Avail.</span>
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                            <span className="w-5 h-5 rounded-t bg-orange-500 inline-block shrink-0"></span>
                            Selected
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                            <span className="w-5 h-5 rounded-t bg-gray-100 border border-gray-200 inline-block shrink-0"></span>
                            <span className="hidden sm:inline">Sold</span>
                            <span className="sm:hidden">Booked</span>
                        </span>
                    </div>

                    {/* Seat selection error */}
                    {error && (
                        <div className="mx-3 sm:mx-4 my-3 px-3 sm:px-4 py-2.5 sm:py-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-xs sm:text-sm text-red-700 font-medium">⚠️ {error}</p>
                        </div>
                    )}
                </div>

                {/* ── BOOKING DETAILS (visible only after seats selected) ── */}
                {selectedSeats.length > 0 && (
                    <div className="bg-white sm:rounded-xl sm:shadow-sm sm:border sm:border-gray-100 overflow-hidden mb-4 mx-3 sm:mx-0 animate-[fadeIn_0.2s_ease]">

                        {/* Selected seats chips */}
                        <div className="px-3 sm:px-4 pt-3 sm:pt-4 pb-3 border-b border-gray-100">
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2.5">
                                Selected Seats ({selectedSeats.length}/{quantity})
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {selectedSeats.sort().map(seat => (
                                    <button
                                        key={seat}
                                        onClick={() => handleSeatClick(seat, false)}
                                        className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-700 px-2.5 py-1.5 rounded-full text-xs font-semibold hover:bg-orange-200 transition-colors active:bg-orange-300"
                                    >
                                        {seat}
                                        <span className="text-orange-400 font-bold leading-none text-sm">✕</span>
                                    </button>
                                ))}
                                {/* Ghost placeholders for remaining seats */}
                                {Array.from({ length: quantity - selectedSeats.length }, (_, i) => (
                                    <span
                                        key={`empty-${i}`}
                                        className="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-semibold border border-dashed border-orange-200 text-orange-300"
                                    >
                                        + seat
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Price breakdown */}
                        <div className="px-3 sm:px-4 py-3 sm:py-4 border-b border-gray-100 space-y-2">
                            <div className="flex justify-between text-xs sm:text-sm">
                                <span className="text-gray-600 font-medium">Ticket Price</span>
                                <span className="font-semibold text-gray-800">₹{selectedSlot?.price?.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-xs sm:text-sm">
                                <span className="text-gray-600 font-medium">Quantity</span>
                                <span className="font-semibold text-gray-800">× {quantity}</span>
                            </div>
                            <div className="flex justify-between pt-2.5 border-t border-gray-100">
                                <span className="font-bold text-gray-900 text-sm">Total</span>
                                <span className="text-lg sm:text-xl font-bold text-orange-600">₹{totalPrice?.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Booking error */}
                        {bookingError && (
                            <div className="mx-3 sm:mx-4 my-3 px-3 sm:px-4 py-2.5 sm:py-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-xs sm:text-sm text-red-700 font-medium">⚠️ {bookingError}</p>
                            </div>
                        )}

                        {/* Pay button */}
                        <div className="px-3 sm:px-4 py-3 sm:py-4">
                            <button
                                onClick={handlePayment}
                                disabled={isBooking || !seatsReady}
                                className={`w-full py-2.5 sm:py-3 px-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base transition-all ${
                                    seatsReady && !isBooking
                                        ? 'bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700 shadow-md'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                {isBooking
                                    ? '⏳ Processing...'
                                    : seatsReady
                                    ? `💳 Pay ₹${totalPrice?.toFixed(2)}`
                                    : `📍 Select ${quantity - selectedSeats.length} more seat${(quantity - selectedSeats.length) !== 1 ? 's' : ''}`
                                }
                            </button>
                        </div>
                    </div>
                )}

                {/* Empty state — no seats selected yet */}
                {selectedSeats.length === 0 && (
                    <div className="mx-3 sm:mx-0 text-center py-8 sm:py-10 bg-white sm:rounded-xl sm:border sm:border-dashed sm:border-orange-200">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-2xl sm:text-3xl">🎫</span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 font-semibold px-4">
                            Select {quantity} seat{quantity > 1 ? 's' : ''} from the seating plan above
                        </p>
                    </div>
                )}

            </div>
        </AppLayout>
    );
}