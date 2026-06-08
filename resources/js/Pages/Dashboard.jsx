import AppLayout from "@/Layouts/AppLayout";
import { Link, usePage, router } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function Dashboard({
    nearby = [],
    movies = [],
    expiring = [],
    activity = [],
    wallet = {},
}) {
    const { auth } = usePage().props;
    const user = auth?.user;

    // Format minutes to HH:MM format
    const formatDuration = (minutes) => {
        if (!minutes) return "0h 0m";
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    const handleExperienceAction = (exp) => {
        if (!user) {
            router.visit("/login");
            return;
        }

        // NEW: Check if already booked
        if (exp.is_booked) {
            router.visit(`/bookings/${exp.booking_id}`);
            return;
        }

        // Check if already has active hold
        if (exp.is_secured) {
            router.visit(`/holds/${exp.hold_id}`);
            return;
        }

        // Check booking mode and availability
        if (exp.supports_instant && exp.instant_availability > 0) {
            // Instant booking available - go to experience detail
            router.visit(`/experience/${exp.id}`);
        } else if (exp.supports_hold) {
            // Hold booking - create hold
            router.post("/holds", { experience_id: exp.id });
        } else {
            // No booking options available
            alert("No booking slots available");
        }
    };

    const handleInstantBooking = (e, exp) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) {
            router.visit("/login");
            return;
        }
        // Redirect to experience page instead of booking directly
        router.visit(`/experience/${exp.id}`);
    };

    const handleHoldBooking = (e, exp) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) {
            router.visit("/login");
            return;
        }
        // Redirect to experience page instead of booking directly
        router.visit(`/experience/${exp.id}`);
    };

    const handleMovieClick = (movie) => {
        if (!user) {
            router.visit("/login");
            return;
        }
        // Go to cinema selection page for this movie via preview route
        router.post("/movies/preview/cinemas", { movie });
    };

    // Category definitions - Emojis Removed
    const categories = [
        { label: "Movies", icon: "🎬", href: "/movies" },
        { label: "TATA IPL 2026", icon: "🏏", href: "/ipl" },
        { label: "Sports", icon: "⚽", href: "/explore/sports" },
        { label: "Music Shows", icon: "🎵", href: "/explore/music-shows" },
        { label: "Comedy Shows", icon: "😂", href: "/explore/comedy-shows" },
        { label: "Temples", icon: "🛕", href: "/temple" },
    ];

    return (
        <AppLayout>
            {/* Header Region */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-5">
                <div>
                    <p className="text-sm md:text-base text-brand-secondary dark:text-gray-400">
                        Good evening,
                    </p>
                    <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-brand-primary dark:text-gray-100">
                        Welcome, {user?.name?.split(" ")[0] || "User"}
                    </h1>
                </div>
                {/* Immersive Wallet Status Component */}
                {/* <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/40 dark:to-gray-800/80 border border-gray-200/60 dark:border-gray-700/50 self-start md:self-auto shadow-sm">
                    <div 
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold uppercase tracking-wider"
                        style={{ backgroundColor: "rgba(195,64,15,0.15)", color: "#c3400f" }}
                    >
                        INR
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Wallet Balance</p>
                        <p className="text-sm font-black text-gray-900 dark:text-gray-100">
                            {wallet?.balance ? `₹${wallet.balance}` : "₹0.00"}
                        </p>
                    </div>
                </div> */}
            </div>

            {/* ── CATEGORY ICONS ROW ── */}
            <div className="mt-4 -mx-4 md:-mx-6 lg:-mx-8">
                <div className="flex overflow-x-auto no-scrollbar px-4 md:px-6 lg:px-8 pb-1 gap-1">
                    {categories.map((cat) => (
                        <Link
                            key={cat.label}
                            href={cat.href}
                            className="flex flex-col items-center gap-0.5 flex-shrink-0 px-2 group"
                        >
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-lg group-hover:bg-gradient-to-br group-hover:from-orange-500 group-hover:to-orange-600 group-hover:text-white transition-all shadow-sm">
                                    {cat.icon}
                                </div>
                                {cat.badge && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[7px] font-bold px-0.5 py-0 rounded leading-none">
                                        {cat.badge}
                                    </span>
                                )}
                            </div>
                            <span className="text-[9px] text-center font-medium text-gray-700 dark:text-gray-300 leading-tight max-w-[50px] group-hover:text-brand-primary transition-colors">
                                {cat.label}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* ── HERO BRAND HUB PANEL CARD ── */}
            <div 
                className="mt-4 md:mt-8 lg:mt-10 rounded-xl md:rounded-2xl border shadow-sm flex flex-col md:flex-row items-stretch justify-between overflow-hidden relative min-h-[180px] bg-[#c3400f]"
                style={{ borderColor: 'rgba(195,64,15,0.25)' }}
            >
                <div 
                    className="flex-1 p-6 md:p-8 pl-6 md:pl-10 flex flex-col justify-center z-10 relative bg-gradient-to-r from-[#c3400f] via-[#c3400f]/95 to-transparent"
                >
                    <span className="inline-block text-[9px] font-black tracking-widest uppercase mb-2 bg-white text-[#c3400f] px-2.5 py-1 rounded-md shadow-xs w-max">
                        Premium Pass Dashboard
                    </span>
                    <h2 className="text-xl md:text-3xl font-black text-white leading-tight mb-2 drop-shadow-sm">
                        Secure Your Live Experiences Instantly
                    </h2>
                    <p className="text-white/90 text-xs md:text-sm font-medium leading-relaxed max-w-xl">
                        Skip loading queue sheets. Reserve dynamic entry passes, lock down priority hold tokens, and track real-time stadium capacities completely online from your personalized seat controller interface.
                    </p>
                    <div className="flex flex-row gap-2 mt-4">
                        <Link
                            href="/explore"
                            className="px-4 py-2 rounded-lg bg-white text-xs font-bold shadow-xs hover:opacity-95 transition-all text-[#c3400f]"
                        >
                            Explore Events
                        </Link>
                        <Link
                            href="/temple"
                            className="px-4 py-2 rounded-lg bg-transparent text-white border border-white/30 text-xs font-bold backdrop-blur-xs hover:bg-white/10 transition-all"
                        >
                            Darshan Hubs
                        </Link>
                    </div>
                </div>

                <div className="hidden md:block w-1/3 lg:w-2/5 relative overflow-hidden bg-[#c3400f]">
                    <img 
                        src="/banner/banner-new.png" 
                        alt="Promo display" 
                        className="w-full h-full object-cover object-center absolute inset-0 mix-blend-normal"
                        onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&q=80";
                        }}
                    />
                </div>
            </div>

            {/* ── NEARBY EXPERIENCES SECTION ── */}
            <section className="mt-8 md:mt-10">
                <div className="flex justify-between items-center mb-4 px-0">
                    <h2 className="font-bold text-lg md:text-xl text-brand-primary dark:text-gray-100 tracking-tight">
                        Nearby Experiences
                    </h2>
                    <Link
                        href="/explore"
                        className="text-xs font-bold text-gray-400 hover:text-[#c3400f] transition-colors"
                    >
                        View all
                    </Link>
                </div>

                {/* Perforated Ticket Layout Framework Container */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                    {nearby.length === 0 ? (
                        <div className="col-span-full border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl p-8 bg-gradient-to-b from-gray-50/40 to-transparent dark:from-gray-900/10 flex flex-col items-center justify-center min-h-[160px]">
                            <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-400 flex items-center justify-center text-xs font-bold mb-3">TKT</div>
                            <p className="text-sm font-bold text-gray-600 dark:text-gray-400">No active experience stubs found nearby</p>
                            <p className="text-xs text-gray-400 mt-0.5">We will broadcast nearby local venues and priority lines here as soon as they open</p>
                        </div>
                    ) : (
                        nearby.map((exp) => (
                            <div
                                key={exp.id}
                                onClick={() =>
                                    !exp.is_booked &&
                                    !exp.is_secured &&
                                    !exp.seats_full &&
                                    router.visit(`/experience/${exp.id}`)
                                }
                                className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col cursor-pointer transition-all relative ${exp.seats_full ? "opacity-50" : "hover:shadow-xl hover:-translate-y-0.5 duration-200"} before:content-[''] before:absolute before:w-4 before:h-4 before:bg-gray-50 before:dark:bg-slate-900 before:border before:border-gray-100 before:dark:border-gray-700 before:-right-2 before:top-24 before:rounded-full after:content-[''] after:absolute after:w-4 after:h-4 after:bg-gray-50 after:dark:bg-slate-900 after:border after:border-gray-100 after:dark:border-gray-700 after:-left-2 after:top-24 after:rounded-full`}
                            >
                                {exp.seats_full && (
                                    <div className="absolute top-[40%] left-0 right-0 z-40 bg-gradient-to-r from-red-600 to-red-700 backdrop-blur-sm px-3 py-1.5 text-center">
                                        <p className="text-white text-xs font-bold tracking-wide">SEATS FULL</p>
                                    </div>
                                )}
                                <div className="p-4 pb-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-black uppercase tracking-wider text-white px-2 py-0.5 rounded" style={{ backgroundColor: "#c3400f" }}>
                                            {exp.category?.toUpperCase() || "VIP"}
                                        </span>
                                        <span className="text-xs font-bold text-gray-400">
                                            {exp.distance || "0.4 mi"}
                                        </span>
                                    </div>
                                    <h3 className="text-sm font-black text-gray-900 dark:text-gray-100 line-clamp-1 leading-tight">
                                        {exp.title}
                                    </h3>
                                    <p className="text-[11px] font-semibold text-gray-400 truncate mt-0.5">
                                        Location: {exp.location}
                                    </p>
                                </div>
                                <div className="border-t border-dashed border-gray-200 dark:border-gray-700 mx-2 my-1" />
                                <div className="p-4 pt-3 bg-gray-50/50 dark:bg-gray-900/20 flex flex-col justify-between gap-2 flex-1">
                                    <div className="flex justify-between items-center text-[11px]">
                                        <span className="text-gray-400 font-semibold">Available Pass Slots:</span>
                                        <span className="font-bold text-gray-700 dark:text-gray-300">{exp.instant_availability || "50"}</span>
                                    </div>
                                    <div className="mt-auto">
                                        {exp.is_booked ? (
                                            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.visit(`/bookings/${exp.booking_id}`); }} className="w-full text-center text-xs py-2 rounded-xl font-bold bg-green-600 text-white hover:bg-green-700 transition-all">View Pass</button>
                                        ) : exp.is_secured ? (
                                            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.visit(`/holds/${exp.hold_id}`); }} className="w-full text-center text-xs py-2 rounded-xl font-bold border text-[#c3400f] border-[#c3400f] bg-transparent hover:bg-[#c3400f] hover:text-white transition-all">Manage Hold</button>
                                        ) : exp.booking_mode === "instant" ? (
                                            <button onClick={(e) => handleInstantBooking(e, exp)} disabled={exp.seats_full} className={`w-full text-center text-xs py-2 rounded-xl font-bold text-white transition-all ${exp.seats_full ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "hover:opacity-95"}`} style={!exp.seats_full ? { backgroundColor: "#c3400f" } : {}}>{exp.seats_full ? "Fully Booked" : "Book Pass"}</button>
                                        ) : (
                                            <div className="flex gap-2">
                                                <button onClick={(e) => handleInstantBooking(e, exp)} disabled={exp.seats_full} className={`flex-1 text-center text-[11px] py-2 rounded-xl font-bold transition-all ${exp.seats_full ? "bg-gray-200 text-gray-400" : "bg-green-600 text-white hover:bg-green-700"}`}>Book</button>
                                                <button onClick={(e) => handleHoldBooking(e, exp)} className="flex-1 text-center text-[11px] py-2 rounded-xl font-bold text-white hover:opacity-95 transition-all" style={{ backgroundColor: "#c3400f" }}>Hold</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* ── TRENDING MOVIES SECTION ── */}
            <section className="mt-6 md:mt-8 lg:mt-10">
                <div className="flex justify-between items-center mb-4 md:mb-6 px-0">
                    <h2 className="font-semibold text-lg md:text-2xl lg:text-3xl text-brand-primary dark:text-gray-100">
                        Trending Movies
                    </h2>
                    <Link
                        href="/movies"
                        className="text-xs md:text-sm text-brand-secondary dark:text-gray-400 hover:text-brand-primary transition-colors"
                    >
                        View all
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                    {movies.length === 0 ? (
                        <div className="w-full border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl p-8 bg-gradient-to-b from-gray-50/40 to-transparent dark:from-gray-900/10 flex flex-col items-center justify-center min-h-[160px]">
                            <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-400 flex items-center justify-center text-xs font-bold mb-3">MV</div>
                            <p className="text-sm font-bold text-gray-600 dark:text-gray-400">No active screen selections available today</p>
                            <p className="text-xs text-gray-400 mt-0.5">Cinematographic listings and pre-booking seating charts will load instantly here</p>
                        </div>
                    ) : (
                        movies.map((movie) => (
                            <div
                                key={movie.id}
                                onClick={() => handleMovieClick(movie)}
                                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group relative before:content-[''] before:absolute before:w-4 before:h-4 before:bg-gray-50 before:dark:bg-slate-900 before:border before:border-gray-100 before:dark:border-gray-700 before:-right-2 before:bottom-12 before:rounded-full after:content-[''] after:absolute after:w-4 after:h-4 after:bg-gray-50 after:dark:bg-slate-900 after:border after:border-gray-100 after:dark:border-gray-700 after:-left-2 after:bottom-12 after:rounded-full"
                            >
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                                            {movie.format || "MOVIE"}
                                        </span>
                                        <span className="text-xs font-black text-amber-500">★ {movie.rating || "UA"}</span>
                                    </div>
                                    <h3 className="text-sm font-black text-gray-900 dark:text-gray-100 line-clamp-1 leading-tight group-hover:text-[#c3400f] transition-colors">
                                        {movie.title}
                                    </h3>
                                    <p className="text-[11px] font-bold text-gray-400 mt-0.5">{movie.language} • {movie.category}</p>
                                    <p className="text-[11px] font-medium text-gray-400 mt-0.5">⏱️ {formatDuration(movie.duration || 150)}</p>
                                </div>
                                <div className="border-t border-dashed border-gray-200 dark:border-gray-700 mx-2" />
                                <div className="p-3 bg-gray-50/50 dark:bg-gray-900/20 flex items-center justify-between flex-1">
                                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Capacity Checked</span>
                                    <button 
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleMovieClick(movie); }}
                                        className="text-[11px] font-black text-white px-3 py-1 rounded shadow-xs hover:opacity-95 transition-opacity"
                                        style={{ backgroundColor: "#c3400f" }}
                                    >
                                        Book Seats
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Recent Activity Section */}
            <section className="mt-6 md:mt-8 lg:mt-10 mb-6">
                <h2 className="font-semibold text-lg md:text-2xl lg:text-3xl text-brand-primary dark:text-gray-100 mb-3 md:mb-4">
                    Your Recent Activity
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {activity.length === 0 ? (
                        <div className="col-span-full bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 flex items-center justify-between gap-4 shadow-xs">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-900/60 border text-gray-400 font-extrabold flex items-center justify-center text-xs">LOG</div>
                                <div>
                                    <p className="text-sm font-black text-gray-800 dark:text-gray-200">No transactions recorded yet</p>
                                    <p className="text-xs text-gray-400">Log in or book local admission cards to list active timelines here</p>
                                </div>
                            </div>
                            <Link href="/login" className="text-xs font-extrabold text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap" style={{ backgroundColor: "#c3400f" }}>Login</Link>
                        </div>
                    ) : (
                        /* ✔️ FIXED SYNTAX ERROR: Dynamic self-invoked functional map block has been wrapped flawlessly to close lookups neatly */
                        <div className="relative pl-6 border-l-2 border-gray-100 dark:border-gray-800 ml-4 space-y-6 py-2">
                            {activity.map((log, idx) => (
                                <div key={idx} className="relative group transition-all">
                                    <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-white dark:bg-gray-900 border-2 border-green-500 flex items-center justify-center shadow-xs z-10 group-hover:scale-110 transition-transform">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700/60 shadow-xs group-hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div className="flex items-start gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 flex items-center justify-center text-sm font-black flex-shrink-0">
                                                ✓
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 tracking-wide leading-snug">
                                                    {log.title}
                                                </h4>
                                                <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mt-0.5">
                                                    {log.subtitle}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] uppercase font-extrabold text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-700 px-2.5 py-1 rounded-md self-start sm:self-auto flex-shrink-0 tracking-wider">
                                            {log.time || "Just Now"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </AppLayout>
    );
}