// ─────────────────────────────────────────────
// Guide.jsx  –  Guide Marketplace Listing Page
// ─────────────────────────────────────────────
import AppLayout from "@/Layouts/AppLayout";
import { Link, usePage, router } from "@inertiajs/react";
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
    Star: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
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
    Languages: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3 h-3"
        >
            <path d="m5 8 6 6" />
            <path d="m4 14 6-6 2-3" />
            <path d="M2 5h12" />
            <path d="M7 2h1" />
            <path d="m22 22-5-10-5 10" />
            <path d="M14 18h6" />
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
    BadgeCheck: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3 h-3"
        >
            <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    ),
};

const categoryColors = {
    "Temple Guide": {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-700 dark:text-blue-300",
        dot: "bg-blue-500",
    },
    "Elderly Care": {
        bg: "bg-emerald-100 dark:bg-emerald-900/30",
        text: "text-emerald-700 dark:text-emerald-300",
        dot: "bg-emerald-500",
    },
    Translator: {
        bg: "bg-purple-100 dark:bg-purple-900/30",
        text: "text-purple-700 dark:text-purple-300",
        dot: "bg-purple-500",
    },
    "Family Coordinator": {
        bg: "bg-pink-100 dark:bg-pink-900/30",
        text: "text-pink-700 dark:text-pink-300",
        dot: "bg-pink-500",
    },
    "Special Services": {
        bg: "bg-orange-100 dark:bg-orange-900/30",
        text: "text-orange-700 dark:text-orange-300",
        dot: "bg-orange-500",
    },
};

const GUIDE_FALLBACK =
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop";

export default function GuideMarketplace({ guides = [] }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategoryFilter, setActiveCategoryFilter] = useState("all");
    const [showSuggestions, setShowSuggestions] = useState(false);

    const categories = [
        { id: "all", label: "All Guides" },
        { id: "temple", label: "Temple Guide" },
        { id: "elderly", label: "Elderly Care" },
        { id: "translator", label: "Translator" },
        { id: "family", label: "Family Coordinator" },
        { id: "special", label: "Special Services" },
    ];

    const catMap = {
        temple: "Temple Guide",
        elderly: "Elderly Care",
        translator: "Translator",
        family: "Family Coordinator",
        special: "Special Services",
    };

    const searchResults =
        searchQuery.trim() === ""
            ? []
            : guides.filter(
                  (g) =>
                      g.name
                          ?.toLowerCase()
                          .includes(searchQuery.toLowerCase()) ||
                      g.specialization
                          ?.toLowerCase()
                          .includes(searchQuery.toLowerCase()),
              );

    const filteredGuides = guides.filter((g) =>
        activeCategoryFilter === "all"
            ? true
            : g.category === catMap[activeCategoryFilter],
    );

    const displayGuides =
        searchQuery.trim() !== "" ? searchResults : filteredGuides;

    return (
        <AppLayout>
            <div className="mb-5">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Hire Guide
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Find verified guides for your pilgrimage journey
                </p>
            </div>

            {/* ── SEARCH ── */}
            <div className="relative mb-5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Icon.Search />
                </span>
                <input
                    type="text"
                    placeholder="Search guides, specialization, or language…"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowSuggestions(true);
                    }}
                    onFocus={(e) => {
                        setShowSuggestions(true);
                        e.target.style.borderColor = "#c33c01";
                    }}
                    onBlur={() =>
                        setTimeout(() => setShowSuggestions(false), 150)
                    }
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 border-2 border-transparent focus:outline-none transition"
                    style={{ "--tw-ring-color": "#c33c01" }}
                />
                {showSuggestions && searchQuery.trim() !== "" && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 overflow-hidden">
                        {searchResults.length === 0 ? (
                            <p className="p-3 text-center text-xs text-gray-400">
                                No guides found for "{searchQuery}"
                            </p>
                        ) : (
                            searchResults.slice(0, 5).map((g) => (
                                <button
                                    key={g.id}
                                    onClick={() => {
                                        setSearchQuery(g.name);
                                        setShowSuggestions(false);
                                    }}
                                    className="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-0 transition"
                                >
                                    <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                                        {g.name}
                                    </p>
                                    <p className="text-[10px] text-gray-400">
                                        {g.category}
                                    </p>
                                </button>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* ── CATEGORY FILTERS ── */}
            <div className="mb-5">
                <div className="flex items-center gap-2 mb-2.5 text-xs text-gray-400">
                    <Icon.Filter /> Filter by Category
                </div>
                <div className="flex gap-2 flex-wrap">
                    {categories.map((c) => (
                        <button
                            key={c.id}
                            onClick={() => setActiveCategoryFilter(c.id)}
                            style={
                                activeCategoryFilter === c.id
                                    ? { backgroundColor: "#c33c01" }
                                    : {}
                            }
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                activeCategoryFilter === c.id
                                    ? "text-white shadow-sm"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-150 dark:hover:bg-gray-750"
                            }`}
                        >
                            {c.label}
                        </button>
                    ))}
                </div>
            </div>

            <p className="text-xs text-gray-400 mb-4">
                Showing{" "}
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {displayGuides.length}
                </span>{" "}
                {displayGuides.length === 1 ? "guide" : "guides"}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayGuides.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                        <p className="text-sm text-gray-400">
                            {searchQuery.trim() !== ""
                                ? `No guides for "${searchQuery}"`
                                : "No guides available"}
                        </p>
                    </div>
                ) : (
                    displayGuides.map((g) => (
                        <GuideCard key={g.id} guide={g} user={user} />
                    ))
                )}
            </div>
        </AppLayout>
    );
}

export function GuideCard({ guide, user }) {
    const imageSrc = (() => {
        if (!guide.image) return GUIDE_FALLBACK;
        if (guide.image.startsWith("http") || guide.image.startsWith("/"))
            return guide.image;
        return `/assets/guides/${guide.image}`;
    })();

    const cat = categoryColors[guide.category] || {
        bg: "bg-gray-100 dark:bg-gray-800",
        text: "text-gray-600 dark:text-gray-400",
        dot: "bg-gray-400",
    };

    const handleHireClick = (e) => {
        e.stopPropagation();
        if (!user) {
            router.visit("/login");
            return;
        }
        router.visit(`/temple/guide/${guide.id}`);
    };

    return (
        <div
            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 transition-all group"
            style={{ borderColor: "#c33c01" }}
            onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(195, 60, 1, 0.15)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
        >
            {/* Image */}
            <div className="relative h-52 bg-gray-100 dark:bg-gray-700 overflow-hidden">
                <img
                    src={imageSrc}
                    alt={guide.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                        e.target.src = GUIDE_FALLBACK;
                    }}
                />
                <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between">
                    <span className="flex items-center gap-1 bg-emerald-500 text-white text-[9px] font-bold px-2 py-1 rounded-full">
                        <Icon.BadgeCheck /> Verified
                    </span>
                    <span
                        className={`${cat.bg} ${cat.text} text-[9px] font-semibold px-2 py-1 rounded-full`}
                    >
                        {guide.category}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-3">
                <div className="flex items-start justify-between mb-1">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex-1 pr-2 line-clamp-1">
                        {guide.name}
                    </h3>
                    <span className="flex items-center gap-0.5 text-[10px] font-semibold text-amber-500 flex-shrink-0">
                        <Icon.Star />
                        {guide.rating}
                    </span>
                </div>
                <p className="text-[10px] text-gray-400 line-clamp-1 mb-2">
                    {guide.specialization}
                </p>

                <div className="flex items-center gap-3 text-[10px] text-gray-400 mb-2.5 pb-2.5 border-b border-gray-100 dark:border-gray-700">
                    <span className="flex items-center gap-1">
                        <Icon.Languages />
                        {guide.languages}
                    </span>
                    <span className="flex items-center gap-1">
                        <Icon.Clock />
                        {guide.experience}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[10px] text-gray-400">Per Hour</p>
                        <p
                            className="text-sm font-bold"
                            style={{ color: "#c33c01" }}
                        >
                            ₹{guide.price}
                        </p>
                    </div>
                    <button
                        onClick={handleHireClick}
                        className="text-white px-4 py-1.5 rounded-lg text-xs font-semibold transition shadow-sm hover:opacity-90"
                        style={{ backgroundColor: "#c33c01" }}
                    >
                        Hire Now
                    </button>
                </div>
            </div>
        </div>
    );
}
