import AppLayout from "@/Layouts/AppLayout";
import { usePage, router } from "@inertiajs/react";
import { useState } from "react";

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
    Star: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
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
            className="w-3 h-3"
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
            className="w-3 h-3"
        >
            <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7z" />
            <path d="M5 20h14" />
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
};

const FALLBACK = "/banner/kashi-temple.png";

export default function TempleBook({ temples = [] }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [searchQuery, setSearchQuery] = useState("");
    const [activeStateFilter, setActiveStateFilter] = useState("all");
    const [showSuggestions, setShowSuggestions] = useState(false);

    const states = [
        { id: "all", label: "All States" },
        { id: "uttar_pradesh", label: "Uttar Pradesh" },
        { id: "andhra_pradesh", label: "Andhra Pradesh" },
        { id: "madhya_pradesh", label: "Madhya Pradesh" },
        { id: "jammu_kashmir", label: "Jammu & Kashmir" },
        { id: "maharashtra", label: "Maharashtra" },
        { id: "tamil_nadu", label: "Tamil Nadu" },
    ];

    const stateMatch = (temple, id) => {
        const loc = temple.location?.toLowerCase() || "";
        const map = {
            uttar_pradesh: "uttar pradesh",
            andhra_pradesh: "andhra pradesh",
            madhya_pradesh: "madhya pradesh",
            jammu_kashmir: ["jammu", "kashmir"],
            maharashtra: "maharashtra",
            tamil_nadu: "tamil nadu",
        };
        const val = map[id];
        if (!val) return true;
        if (Array.isArray(val)) return val.some((v) => loc.includes(v));
        return loc.includes(val);
    };

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

    const filteredTemples = temples.filter((t) =>
        activeStateFilter === "all" ? true : stateMatch(t, activeStateFilter),
    );

    const displayTemples =
        searchQuery.trim() !== "" ? searchResults : filteredTemples;

    return (
        <AppLayout>
            <div className="mb-5">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Book Darshan
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Discover sacred destinations across India
                </p>
            </div>

            {/* ── SEARCH ── */}
            <div className="relative mb-5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Icon.Search />
                </span>
                <input
                    type="text"
                    placeholder="Search temples, cities, or rituals…"
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
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 border-2 border-transparent focus:outline-none transition"
                />
                {showSuggestions && searchQuery.trim() !== "" && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 overflow-hidden">
                        {searchResults.length === 0 ? (
                            <p className="p-3 text-center text-xs text-gray-400">
                                No temples found for "{searchQuery}"
                            </p>
                        ) : (
                            searchResults.slice(0, 5).map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => {
                                        setSearchQuery(t.name);
                                        setShowSuggestions(false);
                                    }}
                                    className="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-0 transition"
                                >
                                    <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                                        {t.name}
                                    </p>
                                    <p className="flex items-center gap-1 text-[10px] text-gray-400 mt-0.5">
                                        <Icon.MapPin />
                                        {t.location}
                                    </p>
                                </button>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* ── STATE FILTERS ── */}
            <div className="mb-5">
                <div className="flex items-center gap-2 mb-2.5 text-xs text-gray-400">
                    <Icon.Filter /> Filter by State
                </div>
                <div className="flex gap-2 flex-wrap">
                    {states.map((s) => (
                        <button
                            key={s.id}
                            onClick={() => setActiveStateFilter(s.id)}
                            style={
                                activeStateFilter === s.id
                                    ? { backgroundColor: "#c33c01" }
                                    : {}
                            }
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                activeStateFilter === s.id
                                    ? "text-white shadow-sm"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-150 dark:hover:bg-gray-750"
                            }`}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>

            <p className="text-xs text-gray-400 mb-4">
                Showing{" "}
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {displayTemples.length}
                </span>{" "}
                temples
            </p>

            {/* ── TEMPLE GRID ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayTemples.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                        <p className="text-sm text-gray-400">
                            {searchQuery.trim() !== ""
                                ? `No temples found for "${searchQuery}"`
                                : "No temples available"}
                        </p>
                    </div>
                ) : (
                    displayTemples.map((t) => (
                        <TempleBookCard key={t.id} temple={t} user={user} />
                    ))
                )}
            </div>
        </AppLayout>
    );
}

function TempleBookCard({ temple, user }) {
    const getPosterSrc = (img) => {
        if (!img) return FALLBACK;
        if (img.startsWith("http") || img.startsWith("/")) return img;
        return `/assets/temples/${img}`;
    };

    const handleBookClick = (e) => {
        e.stopPropagation();
        if (!user) {
            router.visit("/login");
            return;
        }
        router.visit(`/temple/${temple.id}/book-confirm`);
    };

    const crowdColor =
        {
            Low: "bg-emerald-500 text-white",
            Moderate: "bg-amber-400 text-gray-900",
            High: "bg-red-500 text-white",
        }[temple.crowd_level] || "bg-gray-500 text-white";

    return (
        <div
            onClick={() => router.visit(`/temple/${temple.id}`)}
            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all cursor-pointer group"
            onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "#c33c01")
            }
            onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "rgb(229, 231, 235)")
            }
        >
            <div className="relative h-44 bg-gray-100 dark:bg-gray-700 overflow-hidden">
                <img
                    src={getPosterSrc(temple.image)}
                    alt={temple.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                        e.target.src = FALLBACK;
                    }}
                />
                <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-start">
                    {temple.has_vip_darshan && (
                        <span className="flex items-center gap-1 bg-amber-500 text-white px-2 py-1 rounded-full text-[10px] font-bold">
                            <Icon.Crown /> VIP
                        </span>
                    )}
                    {temple.crowd_level && (
                        <span
                            className={`${crowdColor} px-2 py-1 rounded-full text-[10px] font-semibold ml-auto`}
                        >
                            {temple.crowd_level}
                        </span>
                    )}
                </div>
            </div>

            <div className="p-3">
                <div className="flex items-start justify-between mb-1">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex-1 line-clamp-1 pr-2">
                        {temple.name}
                    </h3>
                    <span className="flex items-center gap-0.5 text-[10px] font-semibold text-amber-500 flex-shrink-0">
                        <Icon.Star />
                        {temple.rating || 4.5}
                    </span>
                </div>
                <p className="flex items-center gap-1 text-[10px] text-gray-400 mb-2">
                    <Icon.MapPin />
                    {temple.location}
                </p>

                <div className="flex items-center gap-3 text-[10px] text-gray-400 mb-2.5 pb-2.5 border-b border-gray-100 dark:border-gray-700">
                    {temple.avg_wait && (
                        <span className="flex items-center gap-1">
                            <Icon.Clock />~{temple.avg_wait}
                        </span>
                    )}
                    {temple.special_event && (
                        <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 px-1.5 py-0.5 rounded font-semibold">
                            {temple.special_event}
                        </span>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    {temple.regular_price ? (
                        <div>
                            <p className="text-[10px] text-gray-400">From</p>
                            <p
                                className="text-base font-bold"
                                style={{ color: "#c33c01" }}
                            >
                                ₹{temple.regular_price}
                            </p>
                        </div>
                    ) : (
                        <div />
                    )}
                    <button
                        onClick={handleBookClick}
                        className="text-white px-4 py-1.5 rounded-lg text-xs font-semibold transition shadow-sm hover:opacity-90"
                        style={{ backgroundColor: "#c33c01" }}
                    >
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    );
}
