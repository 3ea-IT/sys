import React, { useRef } from 'react';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function MatchBookingConfirmation() {
    const { booking, match } = usePage().props;
    const ticketRef = useRef(null);

    const matchTitle = `${match.team1?.name || 'Team 1'} vs ${match.team2?.name || 'Team 2'}`;
    const venue = match.venue?.name || match.location || 'Venue';
    const city = match.venue?.city ? `, ${match.venue.city}` : '';

    const formatDate = (date) => {
        if (!date) return 'N/A';
        try {
            const dateObj = new Date(date);
            if (isNaN(dateObj.getTime())) return 'N/A';
            return dateObj.toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
            });
        } catch (e) { return 'N/A'; }
    };

    const formatTime = (time) => {
        if (!time) return 'N/A';
        try {
            const timeParts = String(time).split(':');
            if (timeParts.length < 2) return 'N/A';
            const hours = parseInt(timeParts[0], 10);
            const minutes = parseInt(timeParts[1], 10);
            if (isNaN(hours) || isNaN(minutes)) return 'N/A';
            return new Date(2000, 0, 1, hours, minutes).toLocaleTimeString('en-US', {
                hour: 'numeric', minute: '2-digit', hour12: true,
            });
        } catch (e) { return 'N/A'; }
    };

    const handlePrint = () => {
        const ticketNode = ticketRef.current;
        if (!ticketNode) return;

        // Collect all stylesheets from the current page
        const styleSheets = Array.from(document.styleSheets)
            .map((sheet) => {
                try {
                    const rules = Array.from(sheet.cssRules || []).map(r => r.cssText).join('\n');
                    return `<style>${rules}</style>`;
                } catch {
                    // Cross-origin sheets — link by href instead
                    return sheet.href ? `<link rel="stylesheet" href="${sheet.href}" />` : '';
                }
            })
            .join('\n');

        const printWindow = window.open('', '_blank', 'width=800,height=900');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <title>Ticket — ${matchTitle}</title>
                    ${styleSheets}
                    <style>
                        *, *::before, *::after { box-sizing: border-box; }
                        html, body {
                            margin: 0;
                            padding: 0;
                            background: #f3f4f6;
                            font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }
                        .print-shell {
                            min-height: 100vh;
                            display: flex;
                            align-items: flex-start;
                            justify-content: center;
                            padding: 24px 16px;
                        }
                        .print-card {
                            width: 100%;
                            max-width: 640px;
                            background: white;
                            border-radius: 12px;
                            box-shadow: 0 4px 24px rgba(0,0,0,0.10);
                            padding: 32px 28px;
                        }
                        @media print {
                            html, body { background: white; }
                            .print-shell { padding: 0; min-height: unset; }
                            .print-card {
                                box-shadow: none;
                                border-radius: 0;
                                padding: 16px;
                                max-width: 100%;
                            }
                            @page { size: A4; margin: 8mm; }
                        }
                    </style>
                </head>
                <body>
                    <div class="print-shell">
                        <div class="print-card">
                            ${ticketNode.innerHTML}
                        </div>
                    </div>
                    <script>
                        window.onload = function () {
                            const images = document.querySelectorAll('img');
                            let loaded = 0;
                            if (images.length === 0) {
                                window.print();
                                window.close();
                                return;
                            }
                            images.forEach(function(img) {
                                if (img.complete) {
                                    loaded++;
                                    if (loaded === images.length) { window.print(); window.close(); }
                                } else {
                                    img.onload = img.onerror = function () {
                                        loaded++;
                                        if (loaded === images.length) { window.print(); window.close(); }
                                    };
                                }
                            });
                        };
                    <\/script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    const TeamBadge = ({ team, color }) => (
        <div
            style={{
                background: color || '#1a1a2e',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                borderRadius: '8px',
            }}
        >
            <span style={{ color: 'white', fontWeight: 900, fontSize: '1.5rem', lineHeight: 1 }}>
                {team?.short_name || team?.name?.slice(0, 3)?.toUpperCase() || 'TM'}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px', fontWeight: 500, marginTop: 4, textAlign: 'center', padding: '0 4px', lineHeight: 1.2 }}>
                {team?.name || ''}
            </span>
        </div>
    );

    return (
        <AppLayout>
            <div className="min-h-screen bg-brand-background flex items-center justify-center py-4 px-0">
                <div className="w-full max-w-sm sm:max-w-md md:max-w-2xl bg-white shadow-2xl rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5">

                    {/* Page header */}
                    <div className="flex justify-between items-center mb-4 sm:mb-5 border-b pb-3 sm:pb-4">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Your Ticket</h1>
                    </div>

                    {/* ── PRINTABLE REGION ── */}
                    <div ref={ticketRef}>

                        {/* Match Details Card */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                            <div className="flex gap-3 sm:gap-4 md:gap-4 items-start">

                                {/* Team visual — same dimensions as movie poster */}
                                <div className="w-24 h-40 sm:w-28 sm:h-48 md:w-32 md:h-56 flex-shrink-0 rounded-lg overflow-hidden flex flex-col" style={{ gap: 1 }}>
                                    <div style={{ flex: 1 }}>
                                        {match.team1?.logo ? (
                                            <img src={match.team1.logo} alt={match.team1.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <TeamBadge team={match.team1} color={match.team1?.color || '#004BA0'} />
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ea580c', padding: '4px 0' }}>
                                        <span style={{ color: 'white', fontSize: 10, fontWeight: 900, letterSpacing: '0.15em' }}>VS</span>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        {match.team2?.logo ? (
                                            <img src={match.team2.logo} alt={match.team2.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <TeamBadge team={match.team2} color={match.team2?.color || '#3A225D'} />
                                        )}
                                    </div>
                                </div>

                                {/* Match info */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 break-words leading-snug">
                                        {matchTitle}
                                    </p>
                                    <div className="flex gap-2 mt-1 flex-wrap">
                                        <span className="inline-block bg-white border border-gray-300 text-gray-700 px-2 py-0.5 rounded text-xs font-semibold">
                                            IPL 2025
                                        </span>
                                        <span className="inline-block bg-orange-50 border border-orange-200 text-orange-700 px-2 py-0.5 rounded text-xs font-semibold">
                                            {booking.quantity} Ticket{booking.quantity > 1 ? 's' : ''}
                                        </span>
                                    </div>
                                    <div className="mt-2 space-y-1.5">
                                        <div className="flex items-start gap-2">
                                            <span className="text-gray-500 mt-0.5 text-sm">📍</span>
                                            <div className="min-w-0">
                                                <p className="text-xs sm:text-sm font-semibold text-gray-900">{venue}{city}</p>
                                                {match.venue?.address && (
                                                    <p className="text-xs text-gray-500 mt-0.5">{match.venue.address}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-500 text-sm">📅</span>
                                            <p className="text-xs sm:text-sm text-gray-700 font-medium">{formatDate(match.match_date)}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-500 text-sm">⏰</span>
                                            <p className="text-xs sm:text-sm text-gray-700 font-medium">{formatTime(match.match_time)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* QR Code & Booking Reference */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                            <div className="flex flex-col gap-3 sm:gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Booking Reference</p>
                                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 break-all">
                                        {booking.booking_reference}
                                    </p>
                                </div>
                                <div className="flex justify-center py-3 sm:py-3 bg-white rounded border border-gray-200">
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?data=${booking.booking_reference}&size=200x200`}
                                        alt="QR Code"
                                        className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44"
                                        crossOrigin="anonymous"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-2 border-t border-gray-200">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Stand Sections</p>
                                        <p className="text-sm sm:text-base font-semibold text-gray-900">
                                            {booking.seat_numbers?.join(', ') || 'N/A'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                                        <p className="text-lg sm:text-xl md:text-2xl font-bold text-brand-primary">
                                            ₹{Number(booking.total_amount).toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Important Info */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                            <p className="text-xs sm:text-sm text-blue-900 leading-relaxed">
                                <span className="font-semibold">📋 Important:</span>{' '}
                                Please keep this booking confirmation and a valid photo ID ready at stadium entry. Doors open 60 minutes before match time.
                            </p>
                        </div>

                    </div>
                    {/* ── END PRINTABLE REGION ── */}

                    {/* Buttons — stay on screen only */}
                    <div className="mt-4 space-y-2 sm:space-y-3 md:space-y-0 md:flex md:gap-3">
                        <button
                            onClick={handlePrint}
                            className="w-full md:flex-1 bg-brand-primary hover:bg-brand-secondary text-white py-2.5 sm:py-3 px-4 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base"
                        >
                            🖨️ Print / Download Ticket
                        </button>
                        <a
                            href={`/ipl/match/${match.id}`}
                            className="w-full md:flex-1 inline-flex items-center justify-center border border-gray-300 text-gray-700 py-2.5 sm:py-3 px-4 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base hover:bg-gray-50"
                        >
                            View Match Details
                        </a>
                    </div>

                    <p className="text-center text-xs text-gray-500 mt-4">
                        For issues or support, contact stadium management
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}