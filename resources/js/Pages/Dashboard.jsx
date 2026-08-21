import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import AppLayout from "@/Layouts/AppLayout";
import { Link, usePage, router } from "@inertiajs/react";

// ── SVG Icon Components ──────────────────────────────────────────────────────

const ClapperboardIcon = ({ size = 20, className = "" }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M4 11v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8H4Z" />
        <path d="m4 11-.88-2.87a2 2 0 0 1 1.33-2.5l11.48-3.5a2 2 0 0 1 2.5 1.32l.87 2.87L4 11Z" />
        <path d="m6.6 4.99 3.38 4.2" />
        <path d="m11.86 3.38 3.38 4.2" />
    </svg>
);

const TrophyIcon = ({ size = 20, className = "" }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
);

const VolleyballIcon = ({ size = 20, className = "" }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
    </svg>
);

const MusicIcon = ({ size = 20, className = "" }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
    </svg>
);

const MicIcon = ({ size = 20, className = "" }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
);

const LandmarkIcon = ({ size = 20, className = "" }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <line x1="3" x2="21" y1="22" y2="22" />
        <line x1="6" x2="6" y1="18" y2="11" />
        <line x1="10" x2="10" y1="18" y2="11" />
        <line x1="14" x2="14" y1="18" y2="11" />
        <line x1="18" x2="18" y1="18" y2="11" />
        <polygon points="12 2 20 7 4 7" />
    </svg>
);

const XCircleIcon = ({ size = 16, className = "" }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <circle cx="12" cy="12" r="10" />
        <path d="m15 9-6 6" />
        <path d="m9 9 6 6" />
    </svg>
);

const MapPinIcon = ({ size = 12, className = "" }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
    </svg>
);

const ClockIcon = ({ size = 12, className = "" }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

const CalendarIcon = ({ size = 16, className = "" }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <rect width="18" height="18" x="3" y="4" rx="2" />
        <line x1="16" x2="16" y1="2" y2="6" />
        <line x1="8" x2="8" y1="2" y2="6" />
        <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
);

const TicketIcon = ({ size = 12, className = "" }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
        <path d="M13 5v2" />
        <path d="M13 17v2" />
        <path d="M13 11v2" />
    </svg>
);

const CheckIcon = ({ size = 14, className = "" }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const ZapIcon = ({ size = 14, className = "" }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
);

const LockIcon = ({ size = 14, className = "" }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

const FilmIcon = ({ size = 14, className = "" }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M7 3v18" />
        <path d="M3 7.5h4" />
        <path d="M3 12h18" />
        <path d="M3 16.5h4" />
        <path d="M17 3v18" />
        <path d="M17 7.5h4" />
        <path d="M17 16.5h4" />
    </svg>
);

const ActivityIcon = ({ size = 16, className = "" }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
);

const ArrowRightIcon = ({ size = 14, className = "" }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
    </svg>
);

const PlaneIcon = ({ size = 20, className = "" }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-1 .1-1.3.5l-.7.8c-.3.4-.2.9.2 1.2L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.5.9.7 1.3.3l.9-.7c.4-.3.6-.8.5-1.3Z" />
    </svg>
);

const UtensilsIcon = ({ size = 20, className = "" }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
        <path d="M7 2v20" />
        <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
);

const BedIcon = ({ size = 20, className = "" }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M2 4v16" />
        <path d="M2 8h18a2 2 0 0 1 2 2v10" />
        <path d="M2 17h20" />
        <path d="M6 8v9" />
    </svg>
);

const CarIcon = ({ size = 20, className = "" }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M5 17h14l1-5-2-4H6l-2 4 1 5Z" />
        <path d="M6 8h12M4 12h16" />
        <circle cx="7" cy="17" r="1.5" />
        <circle cx="17" cy="17" r="1.5" />
    </svg>
);

const BusIcon = ({ size = 20, className = "" }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <rect x="4" y="4" width="16" height="12" rx="2" />
        <path d="M7 20h.01M17 20h.01" />
        <path d="M6 16h12" />
        <path d="M8 8h8" />
        <path d="M8 11h2M14 11h2" />
        <path d="M4 8h16" />
    </svg>
);

const GamepadIcon = ({ size = 20, className = "" }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <line x1="6" y1="12" x2="10" y2="12" />
        <line x1="8" y1="10" x2="8" y2="14" />
        <circle cx="15" cy="13" r="1" />
        <circle cx="18" cy="11" r="1" />
        <rect x="2" y="6" width="20" height="12" rx="6" />
    </svg>
);

const ChevronDownIcon = ({ size = 12, className = "" }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="m6 9 6 6 6-6" />
    </svg>
);

const HeartIcon = ({ size = 14, className = "" }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// CategoryDropdown
//
// The parent grid can sit inside a scrolling container in some layouts, so we
// keep the same portal-based positioning approach as before — it renders the
// submenu into document.body with `position: fixed` computed from the
// trigger's live bounding rect, so it can never get clipped and still tracks
// scroll/resize. Only the trigger's visual treatment changed (icon-in-circle
// over a label, to match the reference UI), the open/close/positioning logic
// is untouched.
// ─────────────────────────────────────────────────────────────────────────────

const CategoryDropdown = ({ cat }) => {
    const [open, setOpen] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const triggerRef = useRef(null);
    const menuRef = useRef(null);

    const updatePosition = useCallback(() => {
        if (!triggerRef.current) return;
        const rect = triggerRef.current.getBoundingClientRect();
        const menuWidth = 224;
        const viewportPadding = 12;
        const maxLeft = window.innerWidth - menuWidth - viewportPadding;

        setCoords({
            top: rect.bottom + 8,
            left: Math.max(viewportPadding, Math.min(rect.left, maxLeft)),
        });
    }, []);

    const toggleOpen = () => {
        if (!open) updatePosition();
        setOpen((prev) => !prev);
    };

    useEffect(() => {
        if (!open) return;

        updatePosition();

        const handleClickOutside = (e) => {
            if (
                triggerRef.current?.contains(e.target) ||
                menuRef.current?.contains(e.target)
            ) {
                return;
            }
            setOpen(false);
        };

        const handleEscape = (e) => {
            if (e.key === "Escape") setOpen(false);
        };

        const handleReposition = () => updatePosition();

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
        window.addEventListener("scroll", handleReposition, true);
        window.addEventListener("resize", handleReposition);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
            window.removeEventListener("scroll", handleReposition, true);
            window.removeEventListener("resize", handleReposition);
        };
    }, [open, updatePosition]);

    return (
        <>
            <button
                type="button"
                ref={triggerRef}
                onClick={toggleOpen}
                className="flex flex-col items-center gap-2 group cursor-pointer"
                aria-haspopup="true"
                aria-expanded={open}
            >
                <span className="relative w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
                    <span className={cat.color}>{cat.icon}</span>
                    <ChevronDownIcon
                        size={10}
                        className={`absolute -bottom-1 -right-1 bg-white dark:bg-gray-900 rounded-full p-0.5 w-4 h-4 border border-gray-100 dark:border-gray-700 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
                    />
                </span>
                <span className="w-16 text-[11px] leading-tight font-medium text-gray-700 dark:text-gray-300 text-center line-clamp-2 break-words">
                    {cat.label}
                </span>
            </button>

            {open &&
                createPortal(
                    <div
                        ref={menuRef}
                        style={{
                            position: "fixed",
                            top: coords.top,
                            left: coords.left,
                            zIndex: 9999,
                        }}
                        className="w-56 py-1.5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xl"
                    >
                        {cat.children.map((child) => (
                            <Link
                                key={child.label}
                                href={child.href}
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                <span className={cat.color}>{child.icon}</span>
                                {child.label}
                            </Link>
                        ))}
                    </div>,
                    document.body,
                )}
        </>
    );
};

// ─────────────────────────────────────────────────────────────────────────────

export default function Dashboard({
    nearby = [],
    movies = [],
    offers = [],
    expiring = [],
    activity = [],
    wallet = {},
    spiritualPlaces = [],
    moodCards = [],
    diningOffers = [],
}) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [trendingMoviesLoading, setTrendingMoviesLoading] = useState(true);
    const [trendingMoviesError, setTrendingMoviesError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();

        fetch("/api/movies/top?n=3", {
            headers: { Accept: "application/json" },
            signal: controller.signal,
        })
            .then((response) => {
                if (!response.ok) throw new Error(`Failed to load trending movies (${response.status})`);
                return response.json();
            })
            .then((payload) => {
                const remoteMovies = payload.movies ?? payload.films ?? payload.data ?? [];
                setTrendingMovies(
                    Array.isArray(remoteMovies)
                        ? remoteMovies.slice(0, 3).map((movie) => ({
                              ...movie,
                              id: movie.film_id ?? movie.id ?? movie.movie_id ?? movie.title,
                              title: movie.film_name ?? movie.title ?? movie.name ?? "Untitled",
                              image:
                                  movie.images?.poster?.[1]?.medium?.film_image ??
                                  movie.images?.poster?.["1"]?.medium?.film_image ??
                                  movie.image ??
                                  movie.poster ??
                                  null,
                              language: movie.language ?? movie.lang ?? movie.original_language,
                              category: Array.isArray(movie.genres)
                                  ? movie.genres.join(", ")
                                  : movie.genre ?? movie.category,
                              duration: movie.length ?? movie.duration ?? movie.runtime,
                              format: movie.format ?? movie.age_rating?.[0]?.rating,
                          }))
                        : [],
                );
                setTrendingMoviesError(null);
            })
            .catch((error) => {
                if (error.name !== "AbortError") setTrendingMoviesError(error.message);
            })
            .finally(() => setTrendingMoviesLoading(false));

        return () => controller.abort();
    }, []);

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
        if (exp.is_booked) {
            router.visit(`/bookings/${exp.booking_id}`);
            return;
        }
        if (exp.is_secured) {
            router.visit(`/holds/${exp.hold_id}`);
            return;
        }
        if (exp.supports_instant && exp.instant_availability > 0) {
            router.visit(`/experience/${exp.id}`);
        } else if (exp.supports_hold) {
            router.post("/holds", { experience_id: exp.id });
        } else {
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
        router.visit(`/experience/${exp.id}`);
    };

    const handleHoldBooking = (e, exp) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) {
            router.visit("/login");
            return;
        }
        router.visit(`/experience/${exp.id}`);
    };

    const handleMovieClick = (movie) => {
        if (!user) {
            router.visit("/login");
            return;
        }
        router.post("/movies/preview/cinemas", { movie });
    };

    const handleComingSoon = (event) => {
        event.preventDefault();
        window.alert("Coming soon");
    };

    const categories = [
        {
            label: "Movies",
            icon: <ClapperboardIcon size={20} />,
            href: "/movies",
            color: "text-red-500",
            bg: "bg-red-50 dark:bg-red-900/20",
        },
        {
            label: "Events",
            icon: <TicketIcon size={20} />,
            color: "text-yellow-500",
            bg: "bg-yellow-50 dark:bg-yellow-900/20",
            children: [
                {
                    label: "Concerts",
                    icon: <MusicIcon size={16} />,
                    href: "/explore/concerts",
                },
                {
                    label: "Comedy Shows",
                    icon: <MicIcon size={16} />,
                    href: "/explore/comedy-shows",
                },
                {
                    label: "Workshops",
                    icon: <ActivityIcon size={16} />,
                    href: "/explore/workshops",
                },
                {
                    label: "Exhibitions",
                    icon: <LandmarkIcon size={16} />,
                    href: "/explore/exhibitions",
                },
                {
                    label: "Sports Events",
                    icon: <VolleyballIcon size={16} />,
                    href: "/explore/sports",
                },
                {
                    label: "Live Performances",
                    icon: <MusicIcon size={16} />,
                    href: "/explore/music-shows",
                },
            ],
        },
        {
            label: "Air Booking",
            icon: <PlaneIcon size={20} />,
            href: "/air-booking",
            color: "text-sky-500",
            bg: "bg-sky-50 dark:bg-sky-900/20",
        },
        {
            label: "Cab",
            icon: <CarIcon size={20} />,
            href: "#",
            color: "text-violet-500",
            bg: "bg-violet-50 dark:bg-violet-900/20",
            comingSoon: true,
        },
        {
            label: "Bus",
            icon: <BusIcon size={20} />,
            href: "#",
            color: "text-teal-500",
            bg: "bg-teal-50 dark:bg-teal-900/20",
            comingSoon: true,
        },
        {
            label: "Tourism",
            icon: <LandmarkIcon size={20} />,
            color: "text-orange-500",
            bg: "bg-orange-50 dark:bg-orange-900/20",
            children: [
                {
                    label: "Spiritual Tourism",
                    icon: <LandmarkIcon size={16} />,
                    href: "/tourism/spiritual",
                },
                {
                    label: "Pilgrimage Tourism",
                    icon: <LandmarkIcon size={16} />,
                    href: "/temple",
                },
            ],
        },
        {
            label: "Dining & Restaurants",
            icon: <UtensilsIcon size={20} />,
            href: "/dineout",
            color: "text-amber-600",
            bg: "bg-amber-50 dark:bg-amber-900/20",
        },
        {
            label: "Accommodation",
            icon: <BedIcon size={20} />,
            href: "/accommodation",
            color: "text-indigo-500",
            bg: "bg-indigo-50 dark:bg-indigo-900/20",
        },
    ];

    const getGreeting = () => {
        const hour = parseInt(
            new Date().toLocaleString("en-US", {
                timeZone: "Asia/Kolkata",
                hour: "numeric",
                hour12: false,
            }),
        );
        if (hour >= 5 && hour < 12) return "Good Morning";
        if (hour >= 12 && hour < 17) return "Good Afternoon";
        if (hour >= 17 && hour < 21) return "Good Evening";
        return "Good Night";
    };

    // Shared experience card renderer
    const ExperienceCard = ({ exp, isDesktop = false }) => {
        const minW = isDesktop ? "" : "min-w-[260px]";
        return (
            <div
                key={exp.id}
                onClick={() =>
                    !exp.is_booked &&
                    !exp.is_secured &&
                    !exp.seats_full &&
                    router.visit(`/experience/${exp.id}`)
                }
                className={`${minW} relative bg-white dark:bg-gray-900 rounded-3xl overflow-hidden flex flex-col cursor-pointer transition-all duration-200 border border-gray-100 dark:border-gray-800 shadow-sm ${exp.seats_full ? "opacity-50" : "hover:shadow-lg hover:-translate-y-0.5"}`}
            >
                {exp.seats_full && (
                    <div className="absolute inset-0 z-40 flex items-center justify-center">
                        <div className="bg-red-600/90 backdrop-blur-sm text-white text-[11px] font-semibold tracking-widest px-4 py-1.5 rounded-full flex items-center gap-1.5">
                            <XCircleIcon size={12} /> SEATS FULL
                        </div>
                    </div>
                )}

                <div className="relative h-40 overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img
                        src={
                            exp.image
                                ? exp.image.startsWith("/")
                                    ? exp.image
                                    : `/assets/experiences/${exp.image}`
                                : "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=160&fit=crop"
                        }
                        alt={exp.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.src =
                                "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=160&fit=crop";
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-transparent" />
                    {exp.category && (
                        <span className="absolute top-3 left-3 bg-white/95 dark:bg-gray-900/95 text-gray-800 dark:text-gray-100 text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full uppercase shadow-sm">
                            {exp.category}
                        </span>
                    )}
                    <span className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/25 backdrop-blur-sm flex items-center justify-center text-white">
                        <HeartIcon size={13} />
                    </span>
                    {exp.distance && (
                        <span className="absolute bottom-3 right-3 bg-white/90 dark:bg-gray-900/90 text-gray-700 dark:text-gray-300 text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                            <MapPinIcon size={10} /> {exp.distance}
                        </span>
                    )}
                </div>

                <div className="p-4 flex-1 flex flex-col gap-1">
                    <h3 className="text-[15px] font-serif font-bold leading-snug line-clamp-2 text-gray-900 dark:text-gray-100">
                        {exp.title}
                    </h3>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <MapPinIcon size={10} /> {exp.location}
                    </p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
                        <ClockIcon size={10} />
                        {(() => {
                            let dateStr = "";
                            if (exp.start_date) {
                                let d = exp.start_date;
                                if (typeof d === "object" && d.date) d = d.date;
                                try {
                                    dateStr = new Date(d).toLocaleDateString(
                                        undefined,
                                        {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        },
                                    );
                                } catch {
                                    dateStr = d;
                                }
                            }
                            return (
                                dateStr +
                                (exp.start_time ? ` · ${exp.start_time}` : "")
                            );
                        })()}
                    </p>
                    {exp.instant_availability != null && (
                        <p className="text-[11px] text-gray-400 dark:text-gray-500">
                            {exp.instant_availability} seats left
                        </p>
                    )}

                    <div className="mt-auto pt-3">
                        {exp.is_booked ? (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    router.visit(`/bookings/${exp.booking_id}`);
                                }}
                                className="w-full flex items-center justify-center gap-1.5 text-xs py-2.5 rounded-xl font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                            >
                                <CheckIcon size={13} /> View Booking
                            </button>
                        ) : exp.is_secured ? (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    router.visit(`/holds/${exp.hold_id}`);
                                }}
                                className="w-full flex items-center justify-center gap-1.5 text-xs py-2.5 rounded-xl font-semibold border-2 border-[#1B1B3A] text-[#1B1B3A] dark:text-blue-400 dark:border-blue-400 hover:bg-[#1B1B3A] hover:text-white dark:hover:bg-blue-400 dark:hover:text-gray-900 transition-colors"
                            >
                                <CheckIcon size={13} /> View Hold
                            </button>
                        ) : exp.booking_mode === "instant" ? (
                            <button
                                onClick={(e) => handleInstantBooking(e, exp)}
                                disabled={exp.seats_full}
                                className={`w-full flex items-center justify-center gap-1.5 text-xs py-2.5 rounded-xl font-semibold transition-colors ${exp.seats_full ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500" : "bg-emerald-500 text-white hover:bg-emerald-600"}`}
                            >
                                {exp.seats_full ? (
                                    <>
                                        <XCircleIcon size={13} /> Fully Booked
                                    </>
                                ) : (
                                    <>
                                        <ZapIcon size={13} /> Book Now
                                    </>
                                )}
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={(e) =>
                                        handleInstantBooking(e, exp)
                                    }
                                    disabled={exp.seats_full}
                                    className={`flex-1 flex items-center justify-center gap-1 text-[11px] py-2.5 rounded-xl font-semibold transition-colors ${exp.seats_full ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500" : "bg-emerald-500 text-white hover:bg-emerald-600"}`}
                                >
                                    {exp.seats_full ? (
                                        "Sold Out"
                                    ) : (
                                        <>
                                            <ZapIcon size={12} /> Book
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={(e) => handleHoldBooking(e, exp)}
                                    className="flex-1 flex items-center justify-center gap-1 text-[11px] py-2.5 rounded-xl font-semibold bg-[#1B1B3A] text-white hover:bg-[#1B1B3A]/90 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
                                >
                                    <LockIcon size={12} /> Hold
                                </button>
                            </div>
                        )}
                        {exp.booking_mode === "both" &&
                            !exp.is_secured &&
                            !exp.is_booked && (
                                <p className="mt-1.5 text-[10px] text-gray-400 dark:text-gray-500 text-center">
                                    Both options available
                                </p>
                            )}
                    </div>
                </div>
            </div>
        );
    };

    // Shared movie card renderer
    const MovieCard = ({ movie, isDesktop = false }) => {
        const minW = isDesktop ? "" : "min-w-[232px]";
        return (
            <div
                key={movie.id}
                onClick={() => handleMovieClick(movie)}
                className={`${minW} bg-white dark:bg-gray-900 rounded-3xl overflow-hidden flex flex-col cursor-pointer transition-all duration-200 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg hover:-translate-y-0.5`}
            >
                <div className="relative aspect-[2/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img
                        src={
                            movie.image
                                ? movie.image.startsWith("/") || movie.image.startsWith("http")
                                    ? movie.image
                                    : `/assets/movies/${movie.image}`
                                : "https://images.unsplash.com/photo-1489599849228-ed304dbb6b38?w=400&h=160&fit=crop"
                        }
                        alt={movie.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.src =
                                "https://images.unsplash.com/photo-1489599849228-ed304dbb6b38?w=400&h=160&fit=crop";
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-transparent" />
                    {movie.format && (
                        <span className="absolute top-3 left-3 bg-white/95 dark:bg-gray-900/95 text-gray-800 dark:text-gray-100 text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full uppercase shadow-sm">
                            {movie.format}
                        </span>
                    )}
                    <span className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/25 backdrop-blur-sm flex items-center justify-center text-white">
                        <HeartIcon size={13} />
                    </span>
                    {movie.rating && (
                        <span className="absolute bottom-3 left-3 bg-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                            {movie.rating}
                        </span>
                    )}
                </div>

                <div className="p-4 flex-1 flex flex-col gap-1">
                    <h3 className="text-[15px] font-serif font-bold leading-snug line-clamp-2 text-gray-900 dark:text-gray-100">
                        {movie.title}
                    </h3>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                        {movie.language} · {movie.category}
                    </p>
                    {movie.duration != null && (
                        <p className="text-[11px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
                            <ClockIcon size={10} /> {formatDuration(movie.duration)}
                        </p>
                    )}

                    <div className="mt-auto pt-3">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleMovieClick(movie);
                            }}
                            className="w-full flex items-center justify-center gap-1.5 text-xs py-2.5 rounded-xl font-semibold bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                        >
                            <FilmIcon size={13} /> Select Cinema
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const pickedItems = [
        ...nearby.map((item) => ({ ...item, type: "experience", href: `/experience/${item.id}` })),
        ...movies.map((item) => ({ ...item, type: "movie", href: "/movies" })),
    ].slice(0, 2);

    const weekendPlan = nearby.slice(0, 4).map((experience, index) => ({
        ...experience,
        time: experience.start_time || "Schedule pending",
        label: experience.category || "Experience",
        icon: index % 2 === 0 ? <TicketIcon size={15} /> : <UtensilsIcon size={15} />,
    }));

    return (
        <AppLayout>
            {/* ── Header ─────────────────────────────────────────── */}
            <div className="flex items-baseline gap-2 whitespace-nowrap pt-1">
                <p className="mb-0 text-xs font-medium uppercase tracking-widest text-gray-400 dark:text-gray-500">
                    {getGreeting()}
                </p>
                <h1 className="text-xs font-medium tracking-widest text-brand-primary dark:text-gray-100">
                    {user?.name?.split(" ")[0] || "User"}
                </h1>
            </div>

            {/* ── Banner ─────────────────────────────────────────── */}
            <div className="mt-4 w-full overflow-hidden rounded-[15px] shadow-sm">
                <img
                    src="/banner/banner-new.png"
                    alt="Banner"
                    className="block h-auto w-full object-contain"
                    onError={(e) => {
                        e.target.style.display = "none";
                    }}
                />
            </div>

            <div className="bg-[#FAF6F0] dark:bg-gray-950 -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8 pt-5 pb-4 rounded-3xl mt-5">
                {/* ── Explore Card (Category Grid) ────────────────────── */}
                <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm px-4 py-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-serif text-lg font-bold text-gray-900 dark:text-gray-100">
                            Explore
                        </h2>
                        <Link
                            href="/explore"
                            className="flex items-center gap-1 text-xs font-medium text-[#1B1B3A] dark:text-blue-400 hover:opacity-70 transition-opacity"
                        >
                            See everything <ArrowRightIcon size={12} />
                        </Link>
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-y-6 gap-x-1 justify-items-center">
                        {categories.map((cat) =>
                            cat.children ? (
                                <CategoryDropdown key={cat.label} cat={cat} />
                            ) : (
                                <Link
                                    key={cat.label}
                                    href={cat.href}
                                    className="flex flex-col items-center gap-2 group"
                                >
                                    <span className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
                                        <span className={cat.color}>
                                            {cat.icon}
                                        </span>
                                    </span>
                                    <span className="w-16 text-[11px] leading-tight font-medium text-gray-700 dark:text-gray-300 text-center line-clamp-2 break-words">
                                        {cat.label}
                                    </span>
                                </Link>
                            ),
                        )}
                    </div>
                </div>

                {/* ── Quick Book ───────────────────────────────────────── */}
                <div className="mt-3 rounded-[20px] border border-[#d9dde7] bg-[#f1f2f6] px-4 py-4 dark:border-gray-700 dark:bg-gray-800/70 sm:px-5">
                    <p className="mb-2 flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.14em] text-[#15285f] dark:text-blue-300">
                        <ZapIcon size={16} className="text-[#f59b19]" />
                        Quick Book
                    </p>
                    <div className="flex flex-nowrap gap-3 overflow-x-auto pb-1">
                        {[
                            {
                                label: "Movie",
                                icon: <ClapperboardIcon size={15} />,
                                href: categories.find(
                                    (c) => c.label === "Movies",
                                )?.href,
                            },
                            {
                                label: "Flight",
                                icon: <PlaneIcon size={15} />,
                                href: categories.find(
                                    (c) => c.label === "Air Booking",
                                )?.href,
                            },
                            {
                                label: "Hotel",
                                icon: <BedIcon size={15} />,
                                href: categories.find(
                                    (c) => c.label === "Accommodation",
                                )?.href,
                            },
                            {
                                label: "Dining",
                                icon: <UtensilsIcon size={15} />,
                                href: categories.find(
                                    (c) => c.label === "Dining & Restaurants",
                                )?.href,
                            },
                        ]
                            .filter((item) => item.href)
                            .map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="flex min-h-[46px] min-w-[120px] flex-1 items-center justify-center gap-2 rounded-full border border-[#d9dde7] bg-white px-4 py-2 text-[15px] font-semibold text-[#071b50] shadow-sm transition-colors hover:border-[#9ca8bd] dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:hover:border-gray-400"
                                >
                                    <span className="text-[#172c70] dark:text-blue-300">
                                        {item.icon}
                                    </span>
                                    {item.label}
                                </Link>
                            ))}
                    </div>
                </div>
            </div>

            {moodCards.length > 0 && (
                <section className="mt-7 md:mt-9">
                    <div className="mb-4">
                        <h2 className="font-serif text-2xl font-bold text-[#102344] dark:text-gray-100 md:text-3xl">What are you in the mood for?</h2>
                        <p className="mt-1 text-sm text-[#5e7190] dark:text-gray-400">Pick a feeling, not a category.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                        {moodCards.map((card) => (
                            <Link key={card.key} href={card.href} className="group relative min-h-[150px] overflow-hidden rounded-2xl bg-[#17203b] sm:min-h-[175px] md:min-h-[205px] md:rounded-[22px]">
                                {card.image && <img src={card.image} alt={card.detail || card.title} className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105" />}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#11152c] via-[#11152c]/25 to-black/5" />
                                <div className="absolute bottom-3 left-3 right-3 text-white sm:bottom-4 sm:left-4">
                                    <h3 className="font-serif text-xl font-bold leading-none sm:text-2xl md:text-3xl">{card.title}</h3>
                                    <p className="mt-1 text-xs font-semibold text-white/90 sm:text-sm">{card.subtitle}</p>
                                    <p className="mt-1 truncate text-[10px] text-white/70 sm:text-xs">{card.detail} · {card.count} available</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {diningOffers.length > 0 && (
                <section className="mt-8 md:mt-10">
                    <div className="mb-3 flex items-end justify-between gap-2 sm:mb-4">
                        <div className="pl-2">
                            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-amber-500 sm:text-[10px]">Fresh from dining</p>
                            <h2 className="mt-0.5 font-serif text-lg font-bold leading-tight text-[#102344] dark:text-gray-100 sm:text-xl md:text-2xl">Offers picked for you</h2>
                        </div>
                        <Link href="/dineout" className="flex shrink-0 items-center gap-0.5 rounded-full border border-indigo-100 px-2.5 py-1 text-[11px] font-semibold text-indigo-500 transition hover:border-indigo-400 hover:bg-indigo-50 sm:text-xs">See all <ArrowRightIcon size={10} /></Link>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                        {diningOffers.map((offer) => (
                            <Link key={offer.id} href="/dineout" className="flex min-h-[112px] flex-col rounded-2xl border border-[#e5d9ca] bg-[#fffaf3] p-4 transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700 dark:bg-gray-900">
                                <p className="truncate text-[10px] font-bold uppercase tracking-[0.14em] text-[#172c70] dark:text-blue-300">{offer.restaurant_name}</p>
                                <p className="mt-2 line-clamp-2 text-sm font-extrabold leading-5 text-[#0c214b] dark:text-gray-100">{offer.title}</p>
                                <p className="mt-auto pt-2 text-[11px] text-[#738198]">{offer.discount_percent ? `${offer.discount_percent}% off` : "Special dining offer"}{offer.valid_until ? ` · Until ${offer.valid_until}` : ""}</p>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {weekendPlan.length > 0 && (
                <section className="mt-4 rounded-2xl bg-[#0F2A44] px-8 py-4 text-white shadow-[0_8px_24px_rgba(15,42,68,0.18)] sm:px-5 sm:py-5 md:mt-8 md:rounded-[28px] md:px-8 md:py-6">
                    <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#F2A541]">
                        <CalendarIcon size={16} /> Saturday
                    </p>
                    <h2 className="mt-1.5 font-serif text-2xl font-bold md:mt-2 md:text-3xl">Plan your weekend</h2>
                    <p className="mt-1 text-xs text-[#C8D5E2] sm:text-sm">Build your perfect day, one booking at a time.</p>
                    <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:mt-6 lg:grid-cols-4">
                        {weekendPlan.map((item) => (
                            <Link key={item.id} href={`/experience/${item.id}`} className="relative border-t-2 border-[#466681] pt-3 md:pt-4">
                                <span className="absolute -top-5 left-0 flex h-9 w-9 items-center justify-center rounded-full bg-[#081C2D] text-[#B8CDE0] md:-top-6 md:h-11 md:w-11">{item.icon}</span>
                                <p className="text-xs font-bold text-[#F2A541] sm:text-sm">{item.time}</p>
                                <p className="mt-1 truncate text-sm font-semibold md:text-base">{item.title}</p>
                                <p className="truncate text-xs text-[#B8CDE0]">{item.location}</p>
                            </Link>
                        ))}
                    </div>
                    <Link href="/explore" className="mt-5 flex items-center justify-center gap-2 rounded-full bg-[#F2A541] px-5 py-2.5 text-sm font-bold text-[#0F2A44] hover:bg-[#F6B85E] md:mt-6 md:py-3">
                        Plan my weekend <ArrowRightIcon size={16} />
                    </Link>
                </section>
            )}

            {spiritualPlaces.length > 0 && (
                <section className="mt-8 md:mt-10">
                    <div className="mb-3 flex items-end justify-between gap-3 md:mb-4">
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-500">Darshan</p>
                            <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-gray-100 md:text-2xl">Discover spiritual India</h2>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">Darshan, puja and aarti, thoughtfully arranged.</p>
                        </div>
                        <Link href="/temple" className="flex shrink-0 items-center gap-1 text-xs font-semibold text-indigo-500 sm:text-sm">Explore <ArrowRightIcon size={14} /></Link>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {spiritualPlaces.map((place) => (
                            <Link key={place.id} href={`/temple/${place.id}`} className="group relative min-h-[180px] overflow-hidden rounded-2xl bg-gray-200 md:min-h-[220px] md:rounded-[28px]">
                                {place.image && <img src={place.image} alt={place.name} className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105" />}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                                <div className="absolute bottom-4 left-4 text-white md:bottom-5 md:left-5">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-300 sm:text-xs">{place.location}</p>
                                    <h3 className="mt-1 font-serif text-xl font-bold md:text-2xl">{place.name}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {offers.length > 0 && (
                <section className="mt-8 px-1 md:mt-10 md:px-0">
                    <div className="mb-4 flex items-start justify-between gap-3 px-2">
                        <div className="min-w-0">
                            <h2 className="font-serif text-2xl sm:text-[28px] font-bold leading-tight tracking-tight text-[#102344] dark:text-gray-100">
                                Exclusive for you
                            </h2>
                            <p className="mt-1 text-sm leading-5 text-[#5e7190] dark:text-gray-400">
                                Applied automatically at checkout.
                            </p>
                        </div>
                        <Link href="/dining" className="flex shrink-0 items-center gap-1 pt-1 whitespace-nowrap text-sm font-semibold text-[#102c70] dark:text-blue-400">
                            All offers
                            <ArrowRightIcon size={14} />
                        </Link>
                    </div>
                    <div className="grid gap-4 px-1 sm:grid-cols-2 sm:px-0">
                        {offers.map((offer) => (
                            <Link
                                key={offer.id}
                                href="/dining"
                                className="flex min-h-[122px] flex-col rounded-[20px] border border-[#e5d9ca] bg-[#fffaf3] px-4 py-4 shadow-none transition hover:-translate-y-0.5 hover:border-[#d6bfa5] hover:shadow-md dark:border-gray-700 dark:bg-gray-900 sm:px-5"
                            >
                                <p className="flex items-center gap-2 truncate text-xs font-bold uppercase tracking-[0.14em] text-[#172c70] dark:text-blue-300">
                                    <UtensilsIcon size={16} /> {offer.restaurant_name || "Dining"}
                                </p>
                                <p className="mt-3 line-clamp-2 text-[19px] font-extrabold leading-6 text-[#0c214b] dark:text-gray-100 sm:text-[20px]">
                                    {offer.title}
                                </p>
                                {offer.description && <p className="mt-1 line-clamp-1 text-[14px] leading-5 text-[#5e7190] dark:text-gray-400">{offer.description}</p>}
                                {offer.valid_until && <p className="mt-auto pt-1 text-xs text-gray-400">Valid until {offer.valid_until}</p>}
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {pickedItems.length > 0 && (
                <section className="mt-10 px-2 md:mt-12 md:px-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6c7b95] dark:text-gray-500">For you</p>
                    <div className="mt-1 flex items-end justify-between">
                        <h2 className="font-serif text-2xl font-bold tracking-tight text-[#102344] dark:text-gray-100">Picked for you</h2>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {pickedItems.map((item) => (
                            <Link key={`${item.type}-${item.id}`} href={item.href} className="flex min-h-[94px] min-w-0 items-center gap-3 rounded-[20px] border border-[#d9dde7] bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700 dark:bg-gray-900">
                                {item.image ? (
                                    <img src={item.image.startsWith("/") ? item.image : `/assets/${item.type === "movie" ? "movies" : "experiences"}/${item.image}`} alt="" className="h-16 w-16 shrink-0 rounded-2xl object-cover" />
                                ) : (
                                    <div className="h-16 w-16 shrink-0 rounded-2xl bg-[#e9eef4] dark:bg-gray-800" />
                                )}
                                <div className="min-w-0">
                                    <p className="truncate text-[10px] font-bold uppercase tracking-[0.16em] text-[#6c7b95]">{item.type === "movie" ? "Popular movies" : "Because you explored"}</p>
                                    <p className="mt-1 truncate text-sm font-bold text-[#0c214b] dark:text-gray-100">{item.title}</p>
                                    <p className="mt-1 text-xs text-[#738198]">{item.location || item.category || item.language}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* ── Nearby Experiences ─────────────────────────────── */}
            <section className="mt-9 md:mt-10">
                <div className="flex justify-between items-end mb-4 md:mb-5">
                    <div>
                        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-gray-400 dark:text-gray-500 mb-1">
                            Right Now
                        </p>
                        <h2 className="font-serif text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100 md:text-2xl">
                            Nearby Experiences
                        </h2>
                    </div>
                    <Link
                        href="/explore"
                        className="flex items-center gap-1 text-xs font-medium text-[#1B1B3A] dark:text-blue-400 hover:opacity-70 transition-opacity"
                    >
                        See all <ArrowRightIcon size={13} />
                    </Link>
                </div>

                {/* Mobile / Tablet — stacked vertically, not horizontal scroll */}
                <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {nearby.length === 0 ? (
                        <p className="text-sm text-gray-400 dark:text-gray-500 py-8 w-full text-center col-span-full">
                            No experiences available nearby
                        </p>
                    ) : (
                        nearby.map((exp) => (
                            <ExperienceCard
                                key={exp.id}
                                exp={exp}
                                isDesktop={true}
                            />
                        ))
                    )}
                </div>

                {/* Desktop */}
                <div className="hidden lg:grid lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {nearby.map((exp) => (
                        <ExperienceCard
                            key={exp.id}
                            exp={exp}
                            isDesktop={true}
                        />
                    ))}
                </div>
            </section>

            {/* ── Trending Movies ────────────────────────────────── */}
            <section className="mt-9 md:mt-10">
                <div className="flex justify-between items-end mb-4 md:mb-5">
                    <div>
                        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-gray-400 dark:text-gray-500 mb-1">
                            Trending
                        </p>
                        <h2 className="font-serif text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100 md:text-2xl">
                            Trending Movies
                        </h2>
                    </div>
                    <Link
                        href="/movies"
                        className="flex items-center gap-1 text-xs font-medium text-[#1B1B3A] dark:text-blue-400 hover:opacity-70 transition-opacity"
                    >
                        See all <ArrowRightIcon size={13} />
                    </Link>
                </div>

                {/* Mobile / Tablet */}
                <div className="lg:hidden flex gap-3 overflow-x-auto no-scrollbar pb-1">
                    {trendingMoviesLoading ? (
                        <p className="text-sm text-gray-400 dark:text-gray-500 py-8 w-full text-center">
                            Loading trending movies...
                        </p>
                    ) : trendingMoviesError ? (
                        <p className="text-sm text-red-500 py-8 w-full text-center">
                            Unable to load trending movies
                        </p>
                    ) : trendingMovies.length === 0 ? (
                        <p className="text-sm text-gray-400 dark:text-gray-500 py-8 w-full text-center">
                            No trending movies available
                        </p>
                    ) : (
                        trendingMovies.map((movie) => (
                            <MovieCard
                                key={movie.id}
                                movie={movie}
                                isDesktop={false}
                            />
                        ))
                    )}
                </div>

                {/* Desktop */}
                <div className="hidden lg:grid lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {trendingMovies.map((movie) => (
                        <MovieCard
                            key={movie.id}
                            movie={movie}
                            isDesktop={true}
                        />
                    ))}
                </div>
            </section>

            {/* ── Recent Activity ────────────────────────────────── */}
            <section className="mt-9 md:mt-10 pb-8">
                <div className="mb-4 md:mb-5">
                    <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-gray-400 dark:text-gray-500 mb-1">
                        Timeline
                    </p>
                    <h2 className="font-serif text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100 md:text-2xl">
                        Recent Activity
                    </h2>
                </div>

                {activity.length === 0 ? (
                    <div className="text-center py-10 text-sm text-gray-400 dark:text-gray-500 border border-dashed border-gray-200 dark:border-gray-800 rounded-3xl bg-white/50 dark:bg-gray-900/50">
                        No recent activity yet
                    </div>
                ) : (
                    <div className="space-y-2.5">
                        {activity.map((log, idx) => (
                            <div
                                key={idx}
                                className="bg-white dark:bg-gray-900 rounded-2xl px-4 py-3.5 flex items-center gap-3 border border-gray-100 dark:border-gray-800 shadow-sm hover:border-gray-200 dark:hover:border-gray-700 transition-colors"
                            >
                                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center flex-shrink-0">
                                    <CheckIcon
                                        size={14}
                                        className="text-emerald-500"
                                    />
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

            <Link
                href="/help"
                className="mb-8 flex items-start gap-3 rounded-2xl border border-[#d9dde7] bg-white px-4 py-4 text-[#102344] transition hover:border-[#aebbd0] hover:shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 md:mb-10 md:items-center md:px-5"
            >
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#eef3f8] text-[#0F2A44] dark:bg-gray-800 dark:text-blue-300">
                    <LockIcon size={16} />
                </span>
                <p className="min-w-0 text-xs leading-5 text-[#5e7190] dark:text-gray-400 sm:text-sm">
                    <span className="font-bold text-[#102344] dark:text-gray-100">Secure payments.</span>{" "}
                    Transparent pricing, verified partners and instant confirmations on every booking.
                </p>
            </Link>
        </AppLayout>
    );
}