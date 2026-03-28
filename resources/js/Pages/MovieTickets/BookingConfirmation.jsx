import React from 'react';
import { usePage, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function BookingConfirmation() {
    const { booking, movie, cinema, slot } = usePage().props;

    const formatDate = (date) => {
        if (!date) return 'N/A';
        
        try {
            const dateObj = new Date(date);
            if (isNaN(dateObj.getTime())) return 'N/A';
            
            return dateObj.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        } catch (e) {
            console.error('Date formatting error:', e);
            return 'N/A';
        }
    };

    const formatTime = (time) => {
        if (!time) return 'N/A';
        
        try {
            // Handle both HH:mm and HH:mm:ss formats
            const timeParts = String(time).split(':');
            if (timeParts.length < 2) return 'N/A';
            
            const hours = parseInt(timeParts[0], 10);
            const minutes = parseInt(timeParts[1], 10);
            
            if (isNaN(hours) || isNaN(minutes)) return 'N/A';
            
            // Create a date with the parsed time
            const date = new Date(2000, 0, 1, hours, minutes);
            
            return date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
            });
        } catch (e) {
            console.error('Time formatting error:', e);
            return 'N/A';
        }
    };

    return (
        <>
            {/* Print Styles */}
            <style>{`
                @media print {
                    * {
                        margin: 0;
                        padding: 0;
                    }
                    
                    html, body {
                        background: white;
                        margin: 0;
                        padding: 0;
                        height: auto;
                    }
                    
                    /* Hide AppLayout header/navigation */
                    nav, header, .nav-header, nav *, .print\\:hidden {
                        display: none !important;
                    }
                    
                    /* Hide buttons that aren't needed for print */
                    button, a {
                        color: inherit;
                        text-decoration: none;
                    }
                    
                    .no-print {
                        display: none !important;
                    }
                    
                    /* Optimize page layout for single page */
                    .ticket-container {
                        width: 100% !important;
                        max-width: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        background: white !important;
                        box-shadow: none !important;
                        min-h-screen: auto;
                        display: block !important;
                    }
                    
                    .ticket-wrapper {
                        width: 100% !important;
                        max-width: 100% !important;
                        background: white !important;
                        padding: 12px !important;
                        margin: 0 !important;
                        box-shadow: none !important;
                        border: 1px solid #ddd;
                        page-break-inside: avoid;
                        border-radius: 0 !important;
                    }
                    
                    /* Optimize spacing */
                    div, section, article {
                        page-break-inside: avoid;
                    }
                    
                    /* Typography optimization */
                    h1, h2, h3 {
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                    
                    /* Reduce margins and padding */
                    .mb-4, .mb-5, .mb-6 {
                        margin-bottom: 8px !important;
                    }
                    
                    .pb-4, .pb-5 {
                        padding-bottom: 6px !important;
                    }
                    
                    .mt-3 {
                        margin-top: 6px !important;
                    }
                    
                    .gap-1, .gap-2, .gap-3, .gap-4, .gap-5 {
                        gap: 6px !important;
                    }
                    
                    /* Reduce padding on containers */
                    .p-3, .p-4, .p-5, .p-6, .p-8 {
                        padding: 8px !important;
                    }
                    
                    /* Optimize text sizes */
                    .text-xl, .text-2xl, .text-3xl {
                        font-size: 16px !important;
                        line-height: 1.2 !important;
                    }
                    
                    .text-lg {
                        font-size: 14px !important;
                        line-height: 1.2 !important;
                    }
                    
                    .text-base {
                        font-size: 13px !important;
                        line-height: 1.2 !important;
                    }
                    
                    .text-sm {
                        font-size: 11px !important;
                        line-height: 1.1 !important;
                    }
                    
                    .text-xs {
                        font-size: 10px !important;
                        line-height: 1.1 !important;
                    }
                    
                    /* Optimize image sizes */
                    img {
                        max-width: 80px !important;
                        height: auto !important;
                    }
                    
                    /* QR code optimization */
                    .w-28, .w-36, .w-44 {
                        max-width: 100px !important;
                    }
                    
                    .h-28, .h-36, .h-44 {
                        max-height: 100px !important;
                    }
                    
                    /* Grid optimization */
                    .grid {
                        gap: 6px !important;
                    }
                    
                    /* Badge and spacing */
                    .px-2, .px-3, .px-4 {
                        padding-left: 4px !important;
                        padding-right: 4px !important;
                    }
                    
                    .py-0, .py-1, .py-2 {
                        padding-top: 2px !important;
                        padding-bottom: 2px !important;
                    }
                    
                    /* Remove shadows and effects */
                    .shadow-2xl, .shadow-lg, .shadow-md, .shadow-sm {
                        box-shadow: none !important;
                    }
                    
                    /* Optimize borders */
                    .border {
                        border-width: 1px !important;
                    }
                    
                    /* Landscape for better use of space */
                    @page {
                        size: A4;
                        margin: 5mm;
                    }
                }
            `}</style>

            <AppLayout>
                <div className="min-h-screen bg-brand-background flex items-center justify-center ticket-container">
                    <div className="w-full max-w-sm sm:max-w-md md:max-w-2xl bg-white shadow-2xl rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8 ticket-wrapper">
                        {/* Ticket Header */}
                        <div className="flex justify-between items-center mb-5 sm:mb-6 md:mb-8 border-b pb-4 sm:pb-5 no-print">
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Your Ticket</h1>
                            <button className="text-gray-400 hover:text-gray-600 transition-colors p-1 sm:p-2">
                            </button>
                        </div>

                        {/* Ticket Information - Movie Details */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-5 md:mb-6">
                            <div className="flex gap-3 sm:gap-4 md:gap-5 items-start">
                                {/* Left: Movie Poster Image */}
                                <img 
                                    src={movie.image} 
                                    alt={movie.title}
                                    className="w-24 h-40 sm:w-28 sm:h-48 md:w-32 md:h-56 object-cover rounded-lg flex-shrink-0"
                                />
                                
                                {/* Right: All Movie Information */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 break-words leading-snug">
                                        {movie.title}
                                    </p>
                                    <div className="flex gap-2 mt-1.5 flex-wrap">
                                        <span className="inline-block bg-white border border-gray-300 text-gray-700 px-2 py-0.5 rounded text-xs font-semibold">
                                            {movie.language}
                                        </span>
                                        <span className="inline-block bg-white border border-gray-300 text-gray-700 px-2 py-0.5 rounded text-xs font-semibold">
                                            {movie.format}
                                        </span>
                                    </div>
                                    
                                    {/* Cinema Details */}
                                    <div className="mt-3 space-y-1.5">
                                        <div className="flex items-start gap-2">
                                            <span className="text-gray-500 mt-0.5 text-sm">📍</span>
                                            <div className="min-w-0">
                                                <p className="text-xs sm:text-sm font-semibold text-gray-900">
                                                    {cinema.name}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {cinema.location}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-500 text-sm">📅</span>
                                            <p className="text-xs sm:text-sm text-gray-700 font-medium">
                                                {formatDate(slot.show_date)}
                                            </p>
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-500 text-sm">⏰</span>
                                            <p className="text-xs sm:text-sm text-gray-700 font-medium">
                                                {formatTime(slot.show_time)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* QR Code and Booking Details */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-5 md:mb-6">
                            <div className="flex flex-col gap-3 sm:gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Booking Reference</p>
                                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 break-all">
                                        {booking.booking_reference}
                                    </p>
                                </div>

                                {/* QR Code - Centered */}
                                <div className="flex justify-center py-3 sm:py-4 md:py-6 bg-white rounded border border-gray-200">
                                    <img 
                                        src={`https://api.qrserver.com/v1/create-qr-code/?data=${booking.booking_reference}&size=200x200`} 
                                        alt="QR Code" 
                                        className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44"
                                    />
                                </div>

                                {/* Booking Stats */}
                                <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-2 border-t border-gray-200">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Seats</p>
                                        <p className="text-sm sm:text-base font-semibold text-gray-900">
                                            {booking.seat_numbers.join(", ")}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                                        <p className="text-lg sm:text-xl md:text-2xl font-bold text-brand-primary">
                                            ₹{booking.total_amount}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Important Information */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 md:p-5 mb-4 sm:mb-5 md:mb-6">
                            <p className="text-xs sm:text-sm text-blue-900 leading-relaxed">
                                <span className="font-semibold">📋 Important:</span> {' '}
                                Cancellation available - cut-off time of 20 minutes before showtime
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-2 sm:space-y-3 md:space-y-0 md:flex md:gap-3 no-print">
                            <button 
                                onClick={() => window.print()}
                                className="w-full md:flex-1 bg-brand-primary hover:bg-brand-secondary text-white py-2.5 sm:py-3 md:py-3 px-4 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base"
                            >
                                🖨️ Print Ticket
                            </button>
                        </div>

                        {/* Help Text */}
                        <p className="text-center text-xs text-gray-500 mt-4 no-print">
                            For issues or support, contact cinema management
                        </p>
                    </div>
                </div>
            </AppLayout>
        </>
    );
}