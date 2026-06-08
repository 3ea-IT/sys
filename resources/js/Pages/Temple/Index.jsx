import AppLayout from "@/Layouts/AppLayout";
import { Link, usePage, router } from "@inertiajs/react";
import { useState, useEffect } from "react";

// ── SVG ICON SYSTEM ──────────────────────────────────────────────
const Icon = {
    Search: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
        >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
        </svg>
    ),
    MapPin: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3 h-3"
        >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    ),
    Star: ({ filled = true, className = "w-3.5 h-3.5" }) => (
        <svg
            viewBox="0 0 24 24"
            fill={filled ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    ),
    Users: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3.5 h-3.5"
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    ),
    Clock: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3.5 h-3.5"
        >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    ),
    Crown: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3.5 h-3.5"
        >
            <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7z" />
            <path d="M5 20h14" />
        </svg>
    ),
    Bot: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
        >
            <path d="M12 8V4H8" />
            <rect width="16" height="12" x="4" y="8" rx="2" />
            <path d="M2 14h2" />
            <path d="M20 14h2" />
            <path d="M15 13v2" />
            <path d="M9 13v2" />
        </svg>
    ),
    ChevronRight: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
        >
            <path d="m9 18 6-6-6-6" />
        </svg>
    ),
    Filter: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3.5 h-3.5"
        >
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
    ),
    // Service Icons
    Ticket: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
        >
            <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
            <path d="M13 5v2" />
            <path d="M13 17v2" />
            <path d="M13 11v2" />
        </svg>
    ),
    GuideSvc: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
        >
            <circle cx="12" cy="8" r="4" />
            <path d="M12 14c-4 0-7 2-7 4v1h14v-1c0-2-3-4-7-4Z" />
        </svg>
    ),
    Car: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
        >
            <path d="M19 17H5v-2l2.5-7.5h9L19 15v2Z" />
            <circle cx="7.5" cy="17.5" r="1.5" />
            <circle cx="16.5" cy="17.5" r="1.5" />
        </svg>
    ),
    ParkingIcon: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
        >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
        </svg>
    ),
    Bus: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
        >
            <path d="M8 6v6" />
            <path d="M15 6v6" />
            <path d="M2 12h19.6" />
            <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5c-.2-.7-.7-1.2-1.4-1.4H4c-.7.2-1.2.7-1.4 1.4L1.2 12.8C1.1 13.2 1 13.6 1 14c0 .4.1.8.2 1.2.3 1.1.8 2.8.8 2.8h3" />
            <circle cx="7" cy="18" r="2" />
            <circle cx="17" cy="18" r="2" />
        </svg>
    ),
    Hotel: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
        >
            <path d="M18 20V10" />
            <path d="M6 20V4l12 6" />
            <path d="M2 20h20" />
        </svg>
    ),
    Sparkle: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
        >
            <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
        </svg>
    ),
    Activity: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
        >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
    ),
};

export default function TempleIndex({
    temples = [],
    festivals = [],
    vipDarshans = [],
    categories = [],
    userLocation = "Ayodhya, UP",
}) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [activeFilter, setActiveFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);

    // ── CAROUSEL STATE & DATA ─────────────────────────────────────
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const bannerSlides = [
        {
            title: "Kashi Vishwanath",
            image: "/banner/Kashi-temple.png",
            tag: "Festival Season",
            description: "Witness the magical Ganga Aarti & ancient rituals"
        },
        {
            title: "Shri Ram Mandir",
            image: "/banner/Ram_Mandir,_Ayodhya.png",
            tag: "Divine Ayodhya",
            description: "Experience the grandeur of Lord Ram's sacred birthplace"
        },
        {
            title: "Mahakaleshwar Jyotirlinga",
            image: "/banner/mahakaleshwar.jpg",
            tag: "Sacred Ujjain",
            description: "Feel the spiritual energy of the revered Mahakal Temple"
        }
    ];

    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [isPaused, bannerSlides.length]);

    const searchResults =
        searchQuery.trim() === ""
            ? []
            : temples.filter(
                  (t) =>
                      t.name
                          ?.toLowerCase()
                          .includes(searchQuery.toLowerCase()) ||
                      t.location
                          ?.toLowerCase()
                          .includes(searchQuery.toLowerCase()),
              );

    const filteredTemples = temples.filter((t) => {
        if (activeFilter === "all") return true;
        if (activeFilter === "crowded") return t.crowd_level === "High";
        if (activeFilter === "moderate") return t.crowd_level === "Moderate";
        if (activeFilter === "peaceful") return t.crowd_level === "Low";
        if (activeFilter === "vip") return t.has_vip_darshan;
        if (activeFilter === "highRated") return (t.rating || 0) >= 4.5;
        return true;
    });

    const services = [
        { label: "Book Darshan", Icon: Icon.Ticket, href: "/temple/book" },
        { label: "VIP Access", Icon: Icon.Crown, href: "/temple/vip" },
        { label: "Hire Guide", Icon: Icon.GuideSvc, href: "/temple/guide" },
        { label: "Parking", Icon: Icon.ParkingIcon, href: "/temple/parking" },
        { label: "Transport", Icon: Icon.Bus, href: "/temple/transport" },
        { label: "Stay & Hotels", Icon: Icon.Hotel, href: "/temple/stay" },
        { label: "AI Assistant", Icon: Icon.Bot, href: "/temple/assistance" },
        { label: "Crowd Status", Icon: Icon.Activity, href: "/temple/crowd" },
    ];

    return (
        <AppLayout>
            {/* ── GREETING ── */}
            <div className="mb-5">
                <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-0.5">
                    Namaste
                </p>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                    {user?.name?.split(" ")[0] || "Devotee"}
                </h1>
                <p className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <Icon.MapPin />
                    {userLocation}
                </p>
            </div>

            {/* ── SEARCH ── */}
            <div className="relative mb-5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Icon.Search />
                </span>
                <input
                    type="text"
                    placeholder="Search temples, rituals, festivals…"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowSuggestions(true);
                    }}
                    onFocus={(e) => {
                        setShowSuggestions(true);
                        e.target.style.borderColor = "#c33c01";
                    }}
                    onBlur={(e) => {
                        setTimeout(() => setShowSuggestions(false), 150);
                        e.target.style.borderColor = "transparent";
                    }}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 border-2 border-transparent focus:outline-none focus:ring-0 transition"
                />
                {showSuggestions && searchQuery.trim() !== "" && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 overflow-hidden">
                        {searchResults.length === 0 ? (
                            <p className="p-3 text-center text-xs text-gray-400">
                                No results for "{searchQuery}"
                            </p>
                        ) : (
                            searchResults.slice(0, 5).map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() =>
                                        router.visit(`/temple/${t.id}`)
                                    }
                                    className="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-0 transition"
                                >
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {t.name}
                                    </p>
                                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                        <Icon.MapPin />
                                        {t.location}
                                    </p>
                                </button>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* ── HERO BANNER (AUTO-SLIDING CAROUSEL) ── */}
            <div 
                className="rounded-2xl overflow-hidden relative h-44 md:h-64 mb-6 shadow-md select-none group/carousel"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {bannerSlides.map((slide, index) => {
                    const isActive = index === currentSlide;
                    return (
                        <div
                            key={index}
                            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                            }`}
                        >
                            <div
                                className={`w-full h-full bg-cover bg-center transition-transform duration-[5000ms] ease-out ${
                                    isActive ? "scale-105" : "scale-100"
                                }`}
                                style={{
                                    backgroundImage: `linear-gradient(to right, rgba(195,64,15,0.8) 0%, rgba(195,64,15,0.3) 50%, transparent 100%), url(${slide.image})`,
                                }}
                            >
                                {/* ✔️ FIXED: Removed the leaked raw text comment from this container to prevent it from displaying on top of the image banner */}
                                <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-7 pl-6 md:pl-10">
                                    <span
                                        className={`inline-block text-[10px] font-extrabold tracking-widest uppercase mb-2 transform transition-all duration-700 delay-100 bg-white/95 px-2.5 py-1 rounded-md w-max shadow-sm ${
                                            isActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                                        }`}
                                        style={{ color: "#c33c01" }}
                                    >
                                        {slide.tag}
                                    </span>
                                    <h2 className={`text-xl md:text-3xl font-black text-white leading-tight mb-1 drop-shadow-md transform transition-all duration-700 delay-200 ${
                                        isActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                                    }`}>
                                        {slide.title}
                                    </h2>
                                    <p className={`text-white/90 text-xs md:text-sm drop-shadow-sm font-medium max-w-md transform transition-all duration-700 delay-300 ${
                                        isActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                                    }`}>
                                        {slide.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Navigation Dots */}
                <div className="absolute bottom-4 right-5 z-20 flex items-center gap-1.5 bg-black/20 backdrop-blur-sm px-2.5 py-1.5 rounded-full opacity-90 group-hover/carousel:opacity-100 transition-opacity">
                    {bannerSlides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                index === currentSlide 
                                    ? "w-4 bg-white" 
                                    : "w-1.5 bg-white/50 hover:bg-white/80"
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* ── QUICK SERVICES ── */}
            <section className="mb-7">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
                    Quick Services
                </p>
                <div className="grid grid-cols-4 gap-2.5">
                    {services.map(({ label, Icon: SvcIcon, href }) => (
                        <Link key={label} href={href}>
                            <div
                                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white dark:bg-gray-800 border transition-all group"
                                style={{ borderColor: "#c33c01" }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.boxShadow =
                                        "0 4px 12px rgba(195, 60, 1, 0.15)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.boxShadow = "none")
                                }
                            >
                                <span
                                    style={{ color: "#c33c01" }}
                                    className="group-hover:scale-110 transition-transform"
                                >
                                    <SvcIcon />
                                </span>
                                <span className="text-[9px] md:text-[10px] font-medium text-center text-gray-600 dark:text-gray-400 leading-tight">
                                    {label}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ── POPULAR TEMPLES ── */}
            <section className="mb-7">
                <SectionHeader title="Popular Temples" href="/temple/all" />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {temples.length === 0 ? (
                        <EmptyState cols={2} msg="No temples available" />
                    ) : (
                        temples
                            .slice(0, 10)
                            .map((t) => <TempleCard key={t.id} temple={t} />)
                    )}
                </div>
            </section>

            {/* ── UPCOMING FESTIVALS ── */}
            <section className="mb-7">
                <SectionHeader
                    title="Upcoming Festivals"
                    href="/temple/festivals"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {festivals.length === 0 ? (
                        <p className="text-xs text-gray-400">
                            No upcoming festivals
                        </p>
                    ) : (
                        festivals
                            .slice(0, 3)
                            .map((f, i) => (
                                <FestivalCard key={i} festival={f} />
                            ))
                    )}
                </div>
            </section>

            {/* ── VIP DARSHAN ── */}
            <section className="mb-7">
                <SectionHeader
                    title="VIP Darshan Available"
                    href="/temple/vip"
                    label="Explore"
                />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {vipDarshans.length === 0 ? (
                        <EmptyState cols={2} msg="No VIP darshan available" />
                    ) : (
                        vipDarshans
                            .slice(0, 10)
                            .map((v) => <VIPCard key={v.id} vip={v} />)
                    )}
                </div>
            </section>

            {/* ── BROWSE BY CROWD ── */}
            <section className="mb-7">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
                    Browse By Crowd
                </p>
                <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
                    {[
                        { id: "all", label: "All" },
                        { id: "peaceful", label: "Peaceful" },
                        { id: "moderate", label: "Moderate" },
                        { id: "crowded", label: "Crowded" },
                        { id: "vip", label: "VIP Access" },
                        { id: "highRated", label: "Top Rated" },
                    ].map(({ id, label }) => (
                        <button
                            key={id}
                            onClick={() => setActiveFilter(id)}
                            style={
                                activeFilter === id
                                    ? {
                                          backgroundColor: "#c33c01",
                                          borderColor: "#c33c01",
                                      }
                                    : {}
                            }
                            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                                activeFilter === id
                                    ? "text-white shadow-sm"
                                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300"
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
                <div className="space-y-2.5">
                    {filteredTemples.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-sm text-gray-400 mb-3">
                                No temples match this filter.
                            </p>
                            <button
                                onClick={() => setActiveFilter("all")}
                                className="text-xs font-semibold px-4 py-1.5 rounded-full hover:opacity-90 transition border"
                                style={{
                                    color: "#c33c01",
                                    borderColor: "#c33c01",
                                }}
                            >
                                Show All
                            </button>
                        </div>
                    ) : (
                        filteredTemples.map((t, i) => (
                            <FeaturedTempleRow key={t.id || i} temple={t} />
                        ))
                    )}
                </div>
            </section>

            {/* ── AI GUIDE BANNER ── */}
            <section className="mb-6">
                <div
                    className="flex items-center gap-4 rounded-2xl p-4 md:p-5 border"
                    style={{
                        backgroundColor: "rgba(195, 60, 1, 0.08)",
                        borderColor: "#c33c01",
                    }}
                >
                    <div
                        className="w-10 h-10 rounded-xl text-white flex items-center justify-center flex-shrink-0 shadow-sm"
                        style={{ backgroundColor: "#c33c01" }}
                    >
                        <Icon.Bot />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            AI Spiritual Guide
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                            Ask about temples, rituals, timings & pilgrimage
                        </p>
                    </div>
                    <Link
                        href="/temple/assistance"
                        className="flex-shrink-0 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap shadow-sm hover:opacity-90"
                        style={{ backgroundColor: "#c33c01" }}
                    >
                        Ask AI
                    </Link>
                </div>
            </section>
        </AppLayout>
    );
}

// ── SHARED SUB-COMPONENTS ───────────────────────────────────────

function SectionHeader({ title, href, label = "View all" }) {
    return (
        <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">
                {title}
            </h2>
            <Link
                href={href}
                className="flex items-center gap-0.5 text-xs font-medium hover:underline"
                style={{ color: "#c33c01" }}
            >
                {label}
                <Icon.ChevronRight />
            </Link>
        </div>
    );
}

function EmptyState({ cols, msg }) {
    return (
        <div className={`col-span-${cols} text-center py-8`}>
            <p className="text-xs text-gray-400">{msg}</p>
        </div>
    );
}

function getPosterSrc(image, folder = "temples") {
    if (!image)
        return "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=300&fit=crop";
    if (image.startsWith("http") || image.startsWith("/")) return image;
    return `/assets/${folder}/${image}`;
}

const FALLBACK =
    "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=300&fit=crop";

function TempleCard({ temple }) {
    const crowdColors = {
        Low: "bg-emerald-500",
        Moderate: "bg-amber-400",
        High: "bg-red-500",
    };
    return (
        <Link
            href={`/temple/${temple.id}`}
            className="block rounded-xl overflow-hidden cursor-pointer group"
        >
            <div className="relative h-40 md:h-44 bg-gray-100 dark:bg-gray-800 overflow-hidden rounded-xl">
                <img
                    src={getPosterSrc(temple.image)}
                    alt={temple.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                        e.target.src = FALLBACK;
                    }}
                />
                {temple.crowd_level && (
                    <span
                        className={`absolute top-2 right-2 ${crowdColors[temple.crowd_level] || "bg-gray-500"} text-white text-[9px] font-bold px-2 py-0.5 rounded-full`}
                    >
                        {temple.crowd_level}
                    </span>
                )}
            </div>
            <div className="pt-1.5 pb-0.5">
                <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 line-clamp-1 group-hover:text-orange-600 transition-colors">
                    {temple.name}
                </p>
                <p className="flex items-center gap-0.5 text-[10px] text-amber-500 font-medium mt-0.5">
                    <Icon.Star className="w-3 h-3" /> {temple.rating || 4.5}
                </p>
            </div>
        </Link>
    );
}

function FestivalCard({ festival }) {
    return (
        <Link
            href={`/temple/festivals/${festival.id}`}
            className="block rounded-xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-md transition cursor-pointer group"
        >
            <div className="relative h-32 bg-gray-100 dark:bg-gray-700 overflow-hidden">
                <img
                    src={getPosterSrc(festival.image, "festivals")}
                    alt={festival.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                        e.target.src =
                            "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&h=300&fit=crop";
                    }}
                />
            </div>
            <div className="p-3">
                <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 line-clamp-1 mb-0.5 group-hover:text-orange-600 transition-colors">
                    {festival.name}
                </p>
                <p className="flex items-center gap-1 text-[10px] text-gray-400 mb-2">
                    <Icon.MapPin />
                    {festival.location}
                </p>
                <div 
                    className="block w-full text-center text-white py-1.5 rounded-lg text-[10px] font-semibold transition group-hover:opacity-90"
                    style={{ backgroundColor: "#c33c01" }}
                >
                    Learn More
                </div>
            </div>
        </Link>
    );
}

// ── SUB-COMPONENTS ───────────────────────────────────────────────

function VIPCard({ vip }) {
    return (
        <div
            onClick={() => router.visit(`/temple/${vip.temple_id}`)}
            className="rounded-xl overflow-hidden cursor-pointer group"
        >
            <div className="relative h-40 md:h-44 bg-gray-100 dark:bg-gray-800 overflow-hidden rounded-xl">
                <img
                    src={getPosterSrc(vip.image, "vip")}
                    alt={vip.temple_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                        e.target.src = FALLBACK;
                    }}
                />
                <span className="absolute top-2 left-2 flex items-center gap-1 bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                    <Icon.Crown /> VIP
                </span>
            </div>
            <div className="pt-1.5 pb-0.5">
                <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
                    {vip.temple_name}
                </p>
                <p className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">
                    {vip.description}
                </p>
            </div>
        </div>
    );
}

function FeaturedTempleRow({ temple }) {
    return (
        <div
            className="bg-white dark:bg-gray-800 rounded-xl border transition-all overflow-hidden"
            style={{ borderColor: "#c33c01" }}
            onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(195, 60, 1, 0.15)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
        >
            <div className="flex gap-3 p-3 items-center">
                <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-700 flex-shrink-0 overflow-hidden">
                    <img
                        src={getPosterSrc(temple.image)}
                        alt={temple.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.src = FALLBACK;
                        }}
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
                        {temple.name}
                    </p>
                    <p className="flex items-center gap-1 text-[10px] text-gray-400 mt-0.5 line-clamp-1">
                        <Icon.MapPin />
                        {temple.location}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="flex items-center gap-0.5 text-[10px] text-amber-500 font-semibold">
                            <Icon.Star className="w-3 h-3" /> {temple.rating || 4.5}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}