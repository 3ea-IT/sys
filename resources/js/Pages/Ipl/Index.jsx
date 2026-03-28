import AppLayout from "@/Layouts/AppLayout";
import { usePage, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import axios from "axios";

// IPL team brand colors for the team cards
const TEAM_COLORS = {
    "Mumbai Indians": { bg: "bg-blue-100", text: "text-blue-900" },
    "Kolkata Knight Riders": { bg: "bg-purple-100", text: "text-purple-900" },
    "Chennai Super Kings": { bg: "bg-yellow-100", text: "text-yellow-900" },
    "Royal Challengers Bengaluru": { bg: "bg-red-100", text: "text-red-900" },
    "Rajasthan Royals": { bg: "bg-pink-100", text: "text-pink-900" },
    "Punjab Kings": { bg: "bg-red-100", text: "text-red-900" },
    "Sunrisers Hyderabad": { bg: "bg-orange-100", text: "text-orange-900" },
    "Delhi Capitals": { bg: "bg-blue-100", text: "text-blue-900" },
    "Gujarat Titans": { bg: "bg-sky-100", text: "text-sky-900" },
    "Lucknow Super Giants": { bg: "bg-teal-100", text: "text-teal-900" },
};

function getTeamColors(name) {
    return TEAM_COLORS[name] || { bg: "bg-gray-100", text: "text-gray-900" };
}
// Parse match date string to Date object
function parseMatchDate(dateStr) {
    // Handles ISO or yyyy-mm-dd formats
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) return d;
    // Fallback: try replacing dashes with slashes
    const fallback = new Date(dateStr.replace(/-/g, "/"));
    return !isNaN(fallback.getTime()) ? fallback : null;
}

export default function IplIndex() {
    // State for About section expand/collapse
    const [aboutExpanded, setAboutExpanded] = useState(false);
    const { auth } = usePage().props || {};
    const user = auth?.user;
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios
            .get("/api/ipl-matches")
            .then((response) => {
                setMatches(response.data);
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to load IPL matches.");
                setLoading(false);
            });
    }, []);

    const handleMatchClick = (match) => {
        if (!user) {
            router.visit("/login");
            return;
        }
        if (match.booking_link) {
            window.open(match.booking_link, "_blank");
        }
    };

    // Derive unique teams from matches
    const teams = [];
    const seen = new Set();
    matches.forEach((m) => {
        [m.team1, m.team2].forEach((t) => {
            if (t && !seen.has(t.name)) {
                seen.add(t.name);
                teams.push(t);
            }
        });
    });

    // Venue city: prefer match.city, else first word of location/venue
    function getCity(match) {
        if (match.city) return match.city;
        const venue = match.location || match.venue?.name || "";
        return venue.split(":").pop().trim().split(",")[0].split(" ").slice(-1)[0] || "";
    }

    return (
        <AppLayout>

            {/* ── BANNER ── */}
            <div className="-mx-4 md:-mx-6 lg:-mx-8 -my-2">
                <img
                    src="/banner/banner-ipl.jpg"
                    alt="TATA IPL 2026"
                    className="w-full h-44 md:h-56 object-cover"
                    onError={(e) => {
                        // Fallback gradient banner if image missing
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                    }}
                />
                {/* Fallback banner */}
                <div
                    className="w-full h-44 md:h-56 hidden items-center justify-center"
                    style={{
                        background: "linear-gradient(135deg, #1a237e 0%, #283593 40%, #1565c0 100%)",
                    }}
                >
                    <div className="text-center">
                        <p className="text-4xl font-black text-white tracking-wider">🏏 TATA IPL</p>
                        <p className="text-xl font-bold text-yellow-300 mt-1">2026</p>
                    </div>
                </div>
            </div>

            {/* ── CRICKET TAG + SEASON DATE ── */}
            <div className="mt-4 flex flex-col gap-2">
                <span className="inline-block bg-gray-900 dark:bg-gray-700 text-white text-xs font-semibold px-3 py-1 rounded w-fit">
                    Cricket
                </span>
                <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="16" y1="2" x2="16" y2="6" strokeLinecap="round"/>
                        <line x1="8" y1="2" x2="8" y2="6" strokeLinecap="round"/>
                        <line x1="3" y1="10" x2="21" y2="10" strokeLinecap="round"/>
                    </svg>
                    Season begins 28 Mar 2026
                </p>
            </div>

            {/* ── TEAMS GRID ── */}
            {!loading && teams.length > 0 && (
                <div className="mt-6">
                    <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-3">
                        Teams ({teams.length})
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                        {teams.map((team) => {
                            const { bg, text } = getTeamColors(team.name);
                            return (
                                <div
                                    key={team.name}
                                    className={`${bg} rounded-lg flex items-center justify-between px-3 py-3 overflow-hidden`}
                                >
                                    <p className={`text-[11px] font-bold ${text} uppercase leading-tight max-w-[90px]`}>
                                        {team.name}
                                    </p>
                                    {team.logo ? (
                                        <img
                                            src={team.logo}
                                            alt={team.name}
                                            className="w-14 h-10 object-contain flex-shrink-0"
                                        />
                                    ) : (
                                        <span className="text-3xl flex-shrink-0">🏏</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ── EVENTS HEADER ── */}
            <div className="mt-8 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {loading ? "Loading..." : `${matches.length} Events`}
                </h2>
                <div className="flex items-center gap-2">
                    {/* Sort pill */}
                    <button className="flex items-center gap-1.5 border border-gray-300 dark:border-gray-600 rounded-full px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M6 12h12M9 17h6" />
                        </svg>
                        Most recent
                    </button>
                    {/* Filter icon */}
                    {/* <button className="border border-gray-300 dark:border-gray-600 rounded-full p-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18l-7 8v5l-4 3V12L3 4z" />
                        </svg>
                    </button> */}
                </div>
            </div>

            {/* ── MATCH LIST ── */}
            <div className="mt-4 flex flex-col gap-0">
                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-brand-secondary dark:text-gray-400">Loading IPL matches...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <p className="text-red-600">{error}</p>
                    </div>
                ) : matches.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-brand-secondary dark:text-gray-400">No matches available</p>
                    </div>
                ) : (
                    matches.map((match) => {

                        // Parse and format date for DateColumn
                        const dateObj = parseMatchDate(match.match_date);
                        const city = getCity(match);
                        const venue = match.location || match.venue?.name || "";
                        const isSoldOut = match.status === "sold_out";
                        const isLive = match.status === "booking_live";
                        const isFast = match.status === "fast_filling";

                        const statusLabel = isSoldOut
                            ? "Sold Out"
                            : isLive
                            ? "Booking is live"
                            : "Fast Filling. Book Now";

                        const statusColor = isSoldOut
                            ? "text-gray-400"
                            : "text-red-500";

                        // Format date parts for display
                        let day = "--", month = "--", weekday = "--";
                        if (dateObj) {
                            day = dateObj.getDate();
                            month = dateObj.toLocaleString("en-US", { month: "short" }).toUpperCase();
                            weekday = dateObj.toLocaleString("en-US", { weekday: "short" }).toUpperCase();
                        }

                        return (
                            <div
                                key={match.id}
                                className="flex items-stretch gap-3 mb-4"
                                onClick={() => !isSoldOut && handleMatchClick(match)}
                            >
                                {/* Date Column */}
                                <div className="flex-shrink-0 w-[72px] border border-gray-200 dark:border-gray-700 rounded-xl flex flex-col items-center justify-center py-3 bg-white dark:bg-gray-800 cursor-default">
                                    <p className="text-base font-bold text-gray-900 dark:text-gray-100 leading-none">
                                        <span className="text-lg">{day}</span>
                                        <span className="text-sm ml-0.5">{month}</span>
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{weekday}</p>
                                    {city && (
                                        <>
                                            <div className="w-8 border-t border-gray-200 dark:border-gray-600 my-1.5" />
                                            <p className="text-[10px] text-gray-500 dark:text-gray-400 text-center px-1 leading-tight truncate w-full text-center">
                                                {city}
                                            </p>
                                        </>
                                    )}
                                </div>

                                {/* Match Card */}
                                <div
                                    className={`flex-1 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 overflow-hidden cursor-pointer hover:shadow-md transition-all ${isSoldOut ? "opacity-70" : ""}`}
                                >
                                    <div className="px-4 pt-3 pb-1">
                                        {/* Match number */}
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
                                            {match.match_number ? `Match ${match.match_number}` : ""}
                                        </p>

                                        {/* Teams row */}
                                        <div className="flex items-center justify-between gap-2 mb-3">
                                            {/* Team 1 */}
                                            <div className="flex flex-col items-center gap-1.5 flex-1">
                                                {match.team1?.logo ? (
                                                    <img
                                                        src={match.team1.logo}
                                                        alt={match.team1.name}
                                                        className="w-12 h-12 object-contain rounded-full border border-gray-100 dark:border-gray-700"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-lg">🏏</div>
                                                )}
                                                <p className="text-xs font-bold text-gray-900 dark:text-gray-100 text-center leading-tight">
                                                    {match.team1?.name}
                                                </p>
                                            </div>

                                            {/* VS pill */}
                                            <div className="flex-shrink-0 bg-gray-200 dark:bg-gray-600 rounded-full w-9 h-9 flex items-center justify-center">
                                                <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase">VS</span>
                                            </div>

                                            {/* Team 2 */}
                                            <div className="flex flex-col items-center gap-1.5 flex-1">
                                                {match.team2?.logo ? (
                                                    <img
                                                        src={match.team2.logo}
                                                        alt={match.team2.name}
                                                        className="w-12 h-12 object-contain rounded-full border border-gray-100 dark:border-gray-700"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-lg">🏏</div>
                                                )}
                                                <p className="text-xs font-bold text-gray-900 dark:text-gray-100 text-center leading-tight">
                                                    {match.team2?.name}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="border-t border-gray-100 dark:border-gray-700 mx-4" />

                                    {/* Time + Venue + Status */}
                                    <div className="px-4 py-2.5">
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            {match.match_time}
                                            {venue && (
                                                <>
                                                    <span className="mx-1.5 text-gray-300">|</span>
                                                    <span className="truncate">{venue.length > 22 ? venue.slice(0, 22) + "..." : venue}</span>
                                                </>
                                            )}
                                        </p>
                                        <button
                                            className={`mt-1 text-xs font-semibold flex items-center gap-0.5 ${statusColor} hover:underline`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (!isSoldOut) {
                                                    // Go to MatchDetail page for Booking is live or Fast Filling
                                                    if (isLive || isFast) {
                                                        window.location.href = `/ipl/match/${match.id}`;
                                                    } else {
                                                        handleMatchClick(match);
                                                    }
                                                }
                                            }}
                                            disabled={isSoldOut}
                                        >
                                            {statusLabel}
                                            {!isSoldOut && (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 mt-px" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* ── ABOUT THE TOURNAMENT ── */}
            <div className="mt-6 pb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                    About The Tournament
                </h2>
                {!aboutExpanded ? (
                    <>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            Get ready for the most electrifying cricket spectacle of the year! The Indian Premier
                            League returns with its 19th edition – TATA IPL 2026, bringing together the world's
                            best cricketers for two months of thrilling T20 action...
                        </p>
                        <button
                            className="mt-2 text-orange-600 hover:underline text-sm font-semibold focus:outline-none"
                            onClick={() => setAboutExpanded(true)}
                        >
                            Read More
                        </button>
                    </>
                ) : (
                    <>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            Get ready for the most electrifying cricket spectacle of the year! The Indian Premier
                            League returns with its 19th edition – TATA IPL 2026, bringing together the world's
                            best cricketers for two months of thrilling T20 action. Featuring 10 powerhouse teams
                            battling across 84 high-intensity matches, the tournament promises edge-of-the-seat
                            entertainment, unforgettable moments, and stadiums buzzing with energy.
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                            Starting 28 March 2026, fans can witness their favourite stars smash sixes, take
                            stunning catches, and deliver match-winning performances under the lights.
                        </p>
                        <button
                            className="mt-2 text-orange-600 hover:underline text-sm font-semibold focus:outline-none"
                            onClick={() => setAboutExpanded(false)}
                        >
                            Read Less
                        </button>
                    </>
                )}
            </div>

        </AppLayout>
    );
}