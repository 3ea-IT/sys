import AppLayout from "@/Layouts/AppLayout";
import { Link, usePage, router } from "@inertiajs/react";

// ── SVG Icon Components ──────────────────────────────────────────────────────

const ClapperboardIcon = ({ size = 20, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M4 11v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8H4Z"/>
        <path d="m4 11-.88-2.87a2 2 0 0 1 1.33-2.5l11.48-3.5a2 2 0 0 1 2.5 1.32l.87 2.87L4 11Z"/>
        <path d="m6.6 4.99 3.38 4.2"/>
        <path d="m11.86 3.38 3.38 4.2"/>
    </svg>
);

const TrophyIcon = ({ size = 20, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
        <path d="M4 22h16"/>
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
    </svg>
);

const VolleyballIcon = ({ size = 20, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
        <path d="M2 12h20"/>
    </svg>
);

const MusicIcon = ({ size = 20, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M9 18V5l12-2v13"/>
        <circle cx="6" cy="18" r="3"/>
        <circle cx="18" cy="16" r="3"/>
    </svg>
);

const MicIcon = ({ size = 20, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
        <line x1="12" x2="12" y1="19" y2="22"/>
    </svg>
);

const LandmarkIcon = ({ size = 20, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="3" x2="21" y1="22" y2="22"/>
        <line x1="6" x2="6" y1="18" y2="11"/>
        <line x1="10" x2="10" y1="18" y2="11"/>
        <line x1="14" x2="14" y1="18" y2="11"/>
        <line x1="18" x2="18" y1="18" y2="11"/>
        <polygon points="12 2 20 7 4 7"/>
    </svg>
);

const XCircleIcon = ({ size = 16, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10"/>
        <path d="m15 9-6 6"/>
        <path d="m9 9 6 6"/>
    </svg>
);

const MapPinIcon = ({ size = 12, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
        <circle cx="12" cy="10" r="3"/>
    </svg>
);

const ClockIcon = ({ size = 12, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
    </svg>
);

const TicketIcon = ({ size = 12, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>
        <path d="M13 5v2"/>
        <path d="M13 17v2"/>
        <path d="M13 11v2"/>
    </svg>
);

const CheckIcon = ({ size = 14, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="20 6 9 17 4 12"/>
    </svg>
);

const ZapIcon = ({ size = 14, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
);

const LockIcon = ({ size = 14, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
);

const FilmIcon = ({ size = 14, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect width="18" height="18" x="3" y="3" rx="2"/>
        <path d="M7 3v18"/>
        <path d="M3 7.5h4"/>
        <path d="M3 12h18"/>
        <path d="M3 16.5h4"/>
        <path d="M17 3v18"/>
        <path d="M17 7.5h4"/>
        <path d="M17 16.5h4"/>
    </svg>
);

const ActivityIcon = ({ size = 16, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
);

const ArrowRightIcon = ({ size = 14, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M5 12h14"/>
        <path d="m12 5 7 7-7 7"/>
    </svg>
);

// ─────────────────────────────────────────────────────────────────────────────

export default function Dashboard({
    nearby = [],
    movies = [],
    expiring = [],
    activity = [],
    wallet = {},
}) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const formatDuration = (minutes) => {
        if (!minutes) return "0h 0m";
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    const handleExperienceAction = (exp) => {
        if (!user) { router.visit("/login"); return; }
        if (exp.is_booked) { router.visit(`/bookings/${exp.booking_id}`); return; }
        if (exp.is_secured) { router.visit(`/holds/${exp.hold_id}`); return; }
        if (exp.supports_instant && exp.instant_availability > 0) {
            router.visit(`/experience/${exp.id}`);
        } else if (exp.supports_hold) {
            router.post("/holds", { experience_id: exp.id });
        } else {
            alert("No booking slots available");
        }
    };

    const handleInstantBooking = (e, exp) => {
        e.preventDefault(); e.stopPropagation();
        if (!user) { router.visit("/login"); return; }
        router.visit(`/experience/${exp.id}`);
    };

    const handleHoldBooking = (e, exp) => {
        e.preventDefault(); e.stopPropagation();
        if (!user) { router.visit("/login"); return; }
        router.visit(`/experience/${exp.id}`);
    };

    const handleMovieClick = (movie) => {
        if (!user) { router.visit("/login"); return; }
        router.post("/movies/preview/cinemas", { movie });
    };

    const categories = [
        { label: "Movies",      icon: <ClapperboardIcon size={18} />, href: "/movies",              color: "text-red-500",    bg: "bg-red-50 dark:bg-red-900/20" },
        { label: "TATA IPL",    icon: <TrophyIcon size={18} />,       href: "/ipl",                 color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-900/20" },
        { label: "Sports",      icon: <VolleyballIcon size={18} />,   href: "/explore/sports",      color: "text-green-500",  bg: "bg-green-50 dark:bg-green-900/20" },
        { label: "Music",       icon: <MusicIcon size={18} />,        href: "/explore/music-shows", color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
        { label: "Comedy",      icon: <MicIcon size={18} />,          href: "/explore/comedy-shows",color: "text-pink-500",   bg: "bg-pink-50 dark:bg-pink-900/20" },
        { label: "Temples",     icon: <LandmarkIcon size={18} />,     href: "/temple",              color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20" },
    ];

    const getGreeting = () => {
        const hour = parseInt(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata", hour: "numeric", hour12: false }));
        if (hour >= 5 && hour < 12) return "Good Morning";
        if (hour >= 12 && hour < 17) return "Good Afternoon";
        if (hour >= 17 && hour < 21) return "Good Evening";
        return "Good Night";
    };

    // Shared experience card renderer
    const ExperienceCard = ({ exp, isDesktop = false }) => {
        const minW = isDesktop ? "" : "min-w-[220px]";
        return (
            <div
                key={exp.id}
                onClick={() => !exp.is_booked && !exp.is_secured && !exp.seats_full && router.visit(`/experience/${exp.id}`)}
                className={`${minW} relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden flex flex-col cursor-pointer transition-all duration-200 border border-gray-100 dark:border-gray-800 ${exp.seats_full ? "opacity-50" : "hover:shadow-lg hover:-translate-y-0.5"}`}
            >
                {exp.seats_full && (
                    <div className="absolute inset-0 z-40 flex items-center justify-center">
                        <div className="bg-red-600/90 backdrop-blur-sm text-white text-[11px] font-semibold tracking-widest px-4 py-1.5 rounded-full flex items-center gap-1.5">
                            <XCircleIcon size={12} /> SEATS FULL
                        </div>
                    </div>
                )}

                <div className="relative h-36 overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img
                        src={exp.image ? (exp.image.startsWith("/") ? exp.image : `/assets/experiences/${exp.image}`) : "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=160&fit=crop"}
                        alt={exp.title}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=160&fit=crop"; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <span className="absolute top-2.5 left-2.5 bg-white/15 backdrop-blur-md text-white text-[9px] font-semibold tracking-wider px-2 py-0.5 rounded-full uppercase border border-white/20">
                        {exp.category || "VIP"}
                    </span>
                    <span className="absolute bottom-2.5 right-2.5 bg-white/90 dark:bg-gray-900/90 text-gray-700 dark:text-gray-300 text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                        <MapPinIcon size={10} /> {exp.distance || "0.4 mi"}
                    </span>
                </div>

                <div className="p-3.5 flex-1 flex flex-col gap-1">
                    <h3 className="text-sm font-semibold leading-snug line-clamp-2 text-gray-900 dark:text-gray-100">
                        {exp.title}
                    </h3>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">{exp.location}</p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
                        <ClockIcon size={10} />
                        {(() => {
                            let dateStr = "";
                            if (exp.start_date) {
                                let d = exp.start_date;
                                if (typeof d === "object" && d.date) d = d.date;
                                try {
                                    dateStr = new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
                                } catch { dateStr = d; }
                            }
                            return dateStr + (exp.start_time ? ` · ${exp.start_time}` : "");
                        })()}
                    </p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500">
                        {exp.instant_availability || "50"} seats left
                    </p>

                    <div className="mt-auto pt-2">
                        {exp.is_booked ? (
                            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.visit(`/bookings/${exp.booking_id}`); }}
                                className="w-full flex items-center justify-center gap-1.5 text-xs py-2.5 rounded-xl font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition-colors">
                                <CheckIcon size={13} /> View Booking
                            </button>
                        ) : exp.is_secured ? (
                            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.visit(`/holds/${exp.hold_id}`); }}
                                className="w-full flex items-center justify-center gap-1.5 text-xs py-2.5 rounded-xl font-semibold border-2 border-brand-primary text-brand-primary dark:text-blue-400 dark:border-blue-400 hover:bg-brand-primary hover:text-white dark:hover:bg-blue-400 dark:hover:text-gray-900 transition-colors">
                                <CheckIcon size={13} /> View Hold
                            </button>
                        ) : exp.booking_mode === "instant" ? (
                            <button onClick={(e) => handleInstantBooking(e, exp)} disabled={exp.seats_full}
                                className={`w-full flex items-center justify-center gap-1.5 text-xs py-2.5 rounded-xl font-semibold transition-colors ${exp.seats_full ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500" : "bg-emerald-500 text-white hover:bg-emerald-600"}`}>
                                {exp.seats_full ? <><XCircleIcon size={13} /> Fully Booked</> : <><ZapIcon size={13} /> Book Now</>}
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button onClick={(e) => handleInstantBooking(e, exp)} disabled={exp.seats_full}
                                    className={`flex-1 flex items-center justify-center gap-1 text-[11px] py-2.5 rounded-xl font-semibold transition-colors ${exp.seats_full ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500" : "bg-emerald-500 text-white hover:bg-emerald-600"}`}>
                                    {exp.seats_full ? "Sold Out" : <><ZapIcon size={12} /> Book</>}
                                </button>
                                <button onClick={(e) => handleHoldBooking(e, exp)}
                                    className="flex-1 flex items-center justify-center gap-1 text-[11px] py-2.5 rounded-xl font-semibold bg-brand-primary text-white hover:bg-brand-primary/90 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors">
                                    <LockIcon size={12} /> Hold
                                </button>
                            </div>
                        )}
                        {exp.booking_mode === "both" && !exp.is_secured && !exp.is_booked && (
                            <p className="mt-1.5 text-[10px] text-gray-400 dark:text-gray-500 text-center">Both options available</p>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // Shared movie card renderer
    const MovieCard = ({ movie, isDesktop = false }) => {
        const minW = isDesktop ? "" : "min-w-[200px]";
        return (
            <div
                key={movie.id}
                onClick={() => handleMovieClick(movie)}
                className={`${minW} bg-white dark:bg-gray-900 rounded-2xl overflow-hidden flex flex-col cursor-pointer transition-all duration-200 border border-gray-100 dark:border-gray-800 hover:shadow-lg hover:-translate-y-0.5`}
            >
                <div className="relative h-36 overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img
                        src={movie.image ? (movie.image.startsWith("/") ? movie.image : `/assets/movies/${movie.image}`) : "https://images.unsplash.com/photo-1489599849228-ed304dbb6b38?w=400&h=160&fit=crop"}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1489599849228-ed304dbb6b38?w=400&h=160&fit=crop"; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <span className="absolute top-2.5 left-2.5 bg-white/15 backdrop-blur-md text-white text-[9px] font-semibold tracking-wider px-2 py-0.5 rounded-full uppercase border border-white/20">
                        {movie.format || "MOVIE"}
                    </span>
                    <span className="absolute top-2.5 right-2.5 bg-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                        {movie.rating || "UA"}
                    </span>
                </div>

                <div className="p-3.5 flex-1 flex flex-col gap-1">
                    <h3 className="text-sm font-semibold leading-snug line-clamp-2 text-gray-900 dark:text-gray-100">
                        {movie.title}
                    </h3>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">{movie.language} · {movie.category}</p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
                        <ClockIcon size={10} /> {formatDuration(movie.duration || 150)}
                    </p>

                    <div className="mt-auto pt-2">
                        <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleMovieClick(movie); }}
                            className="w-full flex items-center justify-center gap-1.5 text-xs py-2.5 rounded-xl font-semibold bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                        >
                            <FilmIcon size={13} /> Select Cinema
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <AppLayout>
            {/* ── Header ─────────────────────────────────────────── */}
            <div className="pt-1">
                <p className="text-xs font-medium tracking-widest uppercase text-gray-400 dark:text-gray-500 mb-1">
                    {getGreeting()}
                </p>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-brand-primary dark:text-gray-100">
                    {user?.name?.split(" ")[0] || "User"}
                </h1>
            </div>

            {/* ── Category Pills Row ──────────────────────────────── */}
            <div className="mt-6 -mx-4 md:-mx-6 lg:-mx-8">
                <div className="flex overflow-x-auto no-scrollbar px-4 md:px-6 lg:px-8 pb-1 gap-2">
                    {categories.map((cat) => (
                        <Link
                            key={cat.label}
                            href={cat.href}
                            className={`flex items-center gap-2 flex-shrink-0 px-3.5 py-2 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600 transition-all group shadow-sm`}
                        >
                            <span className={`${cat.color}`}>{cat.icon}</span>
                            <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap group-hover:text-brand-primary transition-colors">
                                {cat.label}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* ── Banner ─────────────────────────────────────────── */}
            <div className="mt-5 rounded-2xl overflow-hidden">
                <img
                    src="/banner/banner-new.png"
                    alt="Banner"
                    className="w-full h-auto object-cover"
                    onError={(e) => { e.target.style.display = "none"; }}
                />
            </div>

            {/* ── Nearby Experiences ─────────────────────────────── */}
            <section className="mt-8 md:mt-10">
                <div className="flex justify-between items-center mb-4 md:mb-5">
                    <h2 className="text-base font-bold tracking-tight text-gray-900 dark:text-gray-100 md:text-xl lg:text-2xl">
                        Nearby Experiences
                    </h2>
                    <Link href="/explore" className="flex items-center gap-1 text-xs font-medium text-gray-400 dark:text-gray-500 hover:text-brand-primary transition-colors">
                        View all <ArrowRightIcon size={13} />
                    </Link>
                </div>

                {/* Mobile / Tablet */}
                <div className="lg:hidden flex gap-3 overflow-x-auto no-scrollbar pb-1">
                    {nearby.length === 0 ? (
                        <p className="text-sm text-gray-400 dark:text-gray-500 py-8 w-full text-center">
                            No experiences available nearby
                        </p>
                    ) : nearby.map((exp) => (
                        <ExperienceCard key={exp.id} exp={exp} isDesktop={false} />
                    ))}
                </div>

                {/* Desktop */}
                <div className="hidden lg:grid lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {nearby.map((exp) => (
                        <ExperienceCard key={exp.id} exp={exp} isDesktop={true} />
                    ))}
                </div>
            </section>

            {/* ── Trending Movies ────────────────────────────────── */}
            <section className="mt-8 md:mt-10">
                <div className="flex justify-between items-center mb-4 md:mb-5">
                    <h2 className="text-base font-bold tracking-tight text-gray-900 dark:text-gray-100 md:text-xl lg:text-2xl">
                        Trending Movies
                    </h2>
                    <Link href="/movies" className="flex items-center gap-1 text-xs font-medium text-gray-400 dark:text-gray-500 hover:text-brand-primary transition-colors">
                        View all <ArrowRightIcon size={13} />
                    </Link>
                </div>

                {/* Mobile / Tablet */}
                <div className="lg:hidden flex gap-3 overflow-x-auto no-scrollbar pb-1">
                    {movies.length === 0 ? (
                        <p className="text-sm text-gray-400 dark:text-gray-500 py-8 w-full text-center">
                            No movies available
                        </p>
                    ) : movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} isDesktop={false} />
                    ))}
                </div>

                {/* Desktop */}
                <div className="hidden lg:grid lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} isDesktop={true} />
                    ))}
                </div>
            </section>

            {/* ── Recent Activity ────────────────────────────────── */}
            <section className="mt-8 md:mt-10 pb-8">
                <div className="flex items-center gap-2 mb-4 md:mb-5">
                    {/* <ActivityIcon size={16} className="text-gray-400 dark:text-gray-500" /> */}
                    <h2 className="text-base font-bold tracking-tight text-gray-900 dark:text-gray-100 md:text-xl lg:text-2xl">
                        Recent Activity
                    </h2>
                </div>

                {activity.length === 0 ? (
                    <div className="text-center py-10 text-sm text-gray-400 dark:text-gray-500 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
                        No recent activity yet
                    </div>
                ) : (
                    <div className="space-y-2">
                        {activity.map((log, idx) => (
                            <div
                                key={idx}
                                className="bg-white dark:bg-gray-900 rounded-2xl px-4 py-3.5 flex items-center gap-3 border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-colors"
                            >
                                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center flex-shrink-0">
                                    <CheckIcon size={14} className="text-emerald-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold line-clamp-1 text-gray-900 dark:text-gray-100">
                                        {log.title}
                                    </p>
                                    <p className="text-[11px] text-gray-400 dark:text-gray-500 line-clamp-1 mt-0.5">
                                        {log.subtitle}
                                    </p>
                                </div>
                                <span className="text-[11px] text-gray-400 dark:text-gray-500 font-medium flex-shrink-0">
                                    {log.time}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </AppLayout>
    );
}