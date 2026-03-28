import AppLayout from "@/Layouts/AppLayout";
import { usePage } from "@inertiajs/react";
import React, { useState, useEffect } from "react";
import MatchBookingModal from '@/Components/MatchBookingModal';

export default function MatchDetail() {
    const { matchId } = usePage().props;
    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [interested, setInterested] = useState(false);
    const [aboutExpanded, setAboutExpanded] = useState(false);
    const [knowExpanded, setKnowExpanded] = useState(false);
    const [termsExpanded, setTermsExpanded] = useState(false);
    const [bookingModalOpen, setBookingModalOpen] = useState(false);
    const [ticketQuantity, setTicketQuantity] = useState(1);
    const [venueMatches, setVenueMatches] = useState([]);
    const [similarMatches, setSimilarMatches] = useState([]);

    React.useEffect(() => {
        fetch(`/api/ipl-matches/${matchId}`)
            .then((res) => res.json())
            .then((data) => {
                setMatch(data);
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to load match details.");
                setLoading(false);
            });

        // Fetch all matches for "Events at this venue" and "You may also like"
        fetch(`/api/ipl-matches`)
            .then((res) => res.json())
            .then((all) => {
                setSimilarMatches(all.filter((m) => m.id !== matchId).slice(0, 4));
            })
            .catch(() => {});
    }, [matchId]);

    if (loading) {
        return (
            <AppLayout>
                <div className="py-12 text-center text-gray-500">Loading...</div>
            </AppLayout>
        );
    }
    if (error || !match) {
        return (
            <AppLayout>
                <div className="py-12 text-center text-red-600">{error || "Match not found."}</div>
            </AppLayout>
        );
    }

    // Format date and time
    const dateObj = new Date(match.match_date);
    const formattedDate = dateObj.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
    });
    const time = match.match_time || dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const venue = match.venue?.name || match.location || "-";
    const city = match.city || match.venue?.city || "";
    const isSoldOut = match.status === "sold_out";
    const isFast = match.status === "fast_filling";
    const isLive = match.status === "booking_live";

    const statusLabel = isSoldOut ? "Sold Out" : isFast ? "Filling Fast" : "Booking is Live";

    const ticketPrice = Number(match.ticket_price || 1000);
    const availableTickets = match.available_seats ?? 10;
    const totalBookingAmount = ticketPrice * ticketQuantity;

    const matchTitle = `${match.team1?.name || "Team 1"} VS ${match.team2?.name || "Team 2"}`;
    const bannerImage = match.banner_image || match.team1?.banner || null;

    // Dummy interest count
    const interestCount = match.interest_count || "84.2k";

    return (
        <AppLayout>
            {/* ── FULL-WIDTH BANNER ── */}
            <div className="-mx-4 md:-mx-6 lg:-mx-8 -my-2">
                {bannerImage ? (
                    <img
                        src={bannerImage}
                        alt={matchTitle}
                        className="w-fullxmdxl h-56 md:h-72 lobject-cover"
                    />
                ) : (
                    <div
                        className="w-full h-56 md:h-72 flex items-center justify-center relative overflow-hidden"
                        style={{ background: "linear-gradient(135deg, #1a237e 0%, #311b92 50%, #4a148c 100%)" }}
                    >
                        {/* Team logos in banner */}
                        <div className="flex items-center gap-6 z-10">
                            {match.team1?.logo ? (
                                <img src={match.team1.logo} alt={match.team1.name} className="w-20 h-20 object-contain drop-shadow-xl" />
                            ) : (
                                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-4xl">🏏</div>
                            )}
                            <div className="flex flex-col items-center">
                                <span className="text-white font-black text-xl tracking-widest">VS</span>
                            </div>
                            {match.team2?.logo ? (
                                <img src={match.team2.logo} alt={match.team2.name} className="w-20 h-20 object-contain drop-shadow-xl" />
                            ) : (
                                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-4xl">🏏</div>
                            )}
                        </div>
                        {/* IPL logo watermark */}
                        <div className="absolute top-4 right-4 text-white/30 text-xs font-bold tracking-widest">TATA IPL 2026</div>
                    </div>
                )}
            </div>

            {/* ── CRICKET TAG ── */}
            <div className="mt-4">
                <span className="inline-block bg-gray-800 dark:bg-gray-700 text-white text-xs font-semibold px-3 py-1 rounded">
                    Cricket
                </span>
            </div>

            {/* ── INTEREST BAR ── */}
            {/* <div className="mt-3 flex items-center justify-between bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3"> */}
                {/* <div className="flex items-center gap-2">
                    <div>
                        <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{interestCount} are interested</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">Mark interested to know more about this event.</span>
                    </div>
                </div> */}
                {/* <button
                    onClick={() => setInterested(!interested)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                        interested
                            ? "bg-brand-primary text-white border-brand-primary"
                            : "bg-white dark:bg-gray-700 text-brand-primary dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:border-brand-primary"
                    }`}
                >
                    {interested ? "Interested ✓" : "Interested?"}
                </button> */}
            {/* </div> */}

            {/* ── EVENT INFO ROWS ── */}
            <div className="mt-4 flex flex-col gap-3">
                {/* Date */}
                <div className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span className="text-sm text-gray-800 dark:text-gray-200">{formattedDate}</span>
                </div>
                {/* Time */}
                <div className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span className="text-sm text-gray-800 dark:text-gray-200">{time}</span>
                </div>
                {/* Duration */}
                <div className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-gray-800 dark:text-gray-200">{match.duration || "5 Hours"}</span>
                </div>
                {/* Language */}
                <div className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                    <span className="text-sm text-gray-800 dark:text-gray-200">{match.language || "Multi Language"}</span>
                </div>
                {/* Venue */}
                <div className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm text-gray-800 dark:text-gray-200 uppercase font-medium flex-1">
                        {venue}{city ? `: ${city.toUpperCase()}` : ""}
                    </span>
                    {/* Navigate icon */}
                    <button
                        onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(venue + " " + city)}`, "_blank")}
                        className="text-brand-primary hover:text-brand-secondary"
                        title="Get Directions"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* ── EXPLORE TOURNAMENT HOMEPAGE BANNER ── */}
            <div
                className="mt-6 rounded-xl overflow-hidden flex items-center gap-4 px-5 py-4 cursor-pointer hover:opacity-95 transition-opacity"
                style={{ background: "linear-gradient(135deg, #f3e7ff 0%, #fce4d6 100%)" }}
                onClick={() => window.location.href = '/ipl'}
            >
                <div className="text-4xl flex-shrink-0">📣</div>
                <span className="text-sm font-extrabold text-gray-800 uppercase tracking-wider flex-1">
                    Explore The Tournament Homepage
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </div>

            {/* ── BOOKINGS FILLING FAST STRIP ── */}
            {(isFast || isLive) && (
                <div className="mt-4 flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg px-4 py-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs text-blue-800 dark:text-blue-300 font-medium">
                        Bookings are filling fast{city ? ` for ${city}` : ""}
                    </p>
                </div>
            )}

            {/* ── YOU SHOULD KNOW ── */}
            <div className="mt-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800 rounded-xl p-4">
                <div className="flex gap-4">
                    <div className="text-3xl flex-shrink-0 mt-1">💡</div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-2">You should know</h3>
                        <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                            1. After booking is confirmed, your M-Ticket{" "}
                            <span className="font-bold">will activate 48 hours before the match</span>. You can transfer tickets once the QR code is active.
                        </p>
                        {knowExpanded && (
                            <>
                                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed mt-2">
                                    2. Open your BookMyShow app and navigate to the 'My Bookings' section to access your M-Ticket.
                                </p>
                                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed mt-2">
                                    3. Please carry a valid photo ID proof for verification at the venue entrance.
                                </p>
                                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed mt-2">
                                    4. Outside food and beverages are not permitted inside the stadium.
                                </p>
                            </>
                        )}
                        <button
                            onClick={() => setKnowExpanded(!knowExpanded)}
                            className="mt-2 text-xs font-semibold text-brand-primary hover:underline focus:outline-none"
                        >
                            {knowExpanded ? "Read Less" : "Read More"}
                        </button>
                    </div>
                </div>
            </div>

            {/* ── ABOUT THE EVENT ── */}
            <div className="mt-6">
                <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">About The Event</h2>
                {match.description && match.description.length > 180 ? (
                    !aboutExpanded ? (
                        <>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                {match.description.slice(0, 180) + "..."}
                            </p>
                            <button
                                className="mt-2 text-sm font-semibold text-brand-primary hover:underline focus:outline-none"
                                onClick={() => setAboutExpanded(true)}
                            >
                                Read More
                            </button>
                        </>
                    ) : (
                        <>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                {match.description}
                            </p>
                            <button
                                className="mt-2 text-sm font-semibold text-brand-primary hover:underline focus:outline-none"
                                onClick={() => setAboutExpanded(false)}
                            >
                                Read Less
                            </button>
                        </>
                    )
                ) : (
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {match.description && match.description.length > 0
                            ? match.description
                            : "Get ready for an action-packed encounter in TATA IPL 2026. Two powerhouse teams will battle it out in a thrilling T20 contest at a packed stadium."
                        }
                    </p>
                )}
            </div>

            {/* ── CONTACTLESS TICKETING STRIP ── */}
            <div className="mt-6 flex items-center gap-3 border-t border-b border-gray-200 dark:border-gray-700 py-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
                <p className="text-xs text-gray-700 dark:text-gray-300">
                    Contactless Ticketing &amp; Fast-track Entry with M-ticket.{" "}
                    <span className="text-brand-primary font-semibold cursor-pointer hover:underline">Learn How</span>
                </p>
            </div>

            {/* ── TERMS & CONDITIONS ── */}
            <div className="mt-4">
                <button
                    onClick={() => setTermsExpanded(!termsExpanded)}
                    className="w-full flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Terms &amp; Conditions</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`w-4 h-4 text-gray-500 transition-transform ${termsExpanded ? "rotate-90" : ""}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
                {termsExpanded && (
                    <div className="mt-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-4 text-xs text-gray-600 dark:text-gray-400 leading-relaxed space-y-2">
                        <p>• Tickets once booked cannot be cancelled, exchanged, or refunded.</p>
                        <p>• Outside food and beverages are not allowed inside the venue.</p>
                        <p>• All attendees are subject to security checks at the entry gates.</p>
                        <p>• The management reserves the right to refuse entry without any reason.</p>
                        <p>• Children below 3 years do not require a ticket but must be accompanied by a ticketed adult.</p>
                    </div>
                )}
            </div>

            {/* ── EVENTS AT THIS VENUE ── */}
            {similarMatches.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-1">Events At This Venue</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Explore upcoming events, book now</p>
                    <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
                        {similarMatches.slice(0, 2).map((m) => (
                            <a key={m.id} href={`/ipl/match/${m.id}`} className="block rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all min-w-[180px] max-w-[180px] flex-shrink-0">
                                {m.banner_image || m.team1?.banner ? (
                                    <img
                                        src={m.banner_image || m.team1?.banner}
                                        alt={`${m.team1?.name} vs ${m.team2?.name}`}
                                        className="w-full h-32 object-cover"
                                    />
                                ) : (
                                    <div
                                        className="w-full h-32 flex items-center justify-center"
                                        style={{ background: "linear-gradient(135deg, #1a237e, #4a148c)" }}
                                    >
                                        <div className="flex items-center gap-2">
                                            {m.team1?.logo && <img src={m.team1.logo} alt="" className="w-10 h-10 object-contain" />}
                                            <span className="text-white text-xs font-bold">VS</span>
                                            {m.team2?.logo && <img src={m.team2.logo} alt="" className="w-10 h-10 object-contain" />}
                                        </div>
                                    </div>
                                )}
                                <div className="p-2">
                                    <p className="text-[10px] font-bold text-gray-800 dark:text-gray-200 uppercase leading-tight line-clamp-2">
                                        {m.team1?.name} VS {m.team2?.name}
                                    </p>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* ── YOU MAY ALSO LIKE ── */}
            {similarMatches.length > 0 && (
                <div className="mt-8 mb-28">
                    <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-1">You May Also Like</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Events around you, book now</p>
                    <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
                        {similarMatches.map((m) => (
                            <a key={m.id} href={`/ipl/match/${m.id}`} className="block rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all min-w-[180px] max-w-[180px] flex-shrink-0">
                                {m.banner_image || m.team1?.banner ? (
                                    <img
                                        src={m.banner_image || m.team1?.banner}
                                        alt={`${m.team1?.name} vs ${m.team2?.name}`}
                                        className="w-full h-32 object-cover"
                                    />
                                ) : (
                                    <div
                                        className="w-full h-32 flex items-center justify-center"
                                        style={{ background: "linear-gradient(135deg, #1a237e, #311b92)" }}
                                    >
                                        <div className="flex items-center gap-2">
                                            {m.team1?.logo && <img src={m.team1.logo} alt="" className="w-10 h-10 object-contain" />}
                                            <span className="text-white text-xs font-bold">VS</span>
                                            {m.team2?.logo && <img src={m.team2.logo} alt="" className="w-10 h-10 object-contain" />}
                                        </div>
                                    </div>
                                )}
                                <div className="p-2">
                                    <p className="text-[10px] font-bold text-gray-800 dark:text-gray-200 uppercase leading-tight line-clamp-2">
                                        {m.team1?.name} VS {m.team2?.name}
                                    </p>
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 uppercase tracking-wide">TATA IPL 2026</p>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* ── STICKY BOTTOM BAR ── */}
            <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between shadow-2xl"
                 style={{ zIndex: 9999 }}>
                <div>
                    <p className="text-base font-bold text-gray-900 dark:text-gray-100">
                        ₹{match.ticket_price || "1000"} onwards
                    </p>
                    <p className={`text-xs font-semibold ${isSoldOut ? "text-gray-400" : "text-brand-primary"}`}>
                        {statusLabel}
                    </p>
                </div>
                <button
                    onClick={() => setBookingModalOpen(true)}
                    disabled={isSoldOut}
                    className={`px-8 py-3 rounded-lg font-bold text-sm transition-all ${
                        isSoldOut
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-brand-primary hover:bg-brand-secondary text-white shadow-lg"
                    }`}
                >
                    {isSoldOut ? "Sold Out" : "Book Now"}
                </button>
            </div>

            <MatchBookingModal
                isOpen={bookingModalOpen}
                onClose={() => setBookingModalOpen(false)}
                match={match}
                quantity={ticketQuantity}
                onQuantityChange={(e) => setTicketQuantity(Number(e.target.value))}
                onConfirmBooking={() => {
                    setBookingModalOpen(false);
                    window.location.href = `/ipl/match/${match.id}/seats?quantity=${ticketQuantity}`;
                }}
            />
        </AppLayout>
    );
}