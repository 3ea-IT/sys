import AppLayout from "@/Layouts/AppLayout";
import { Link, router } from "@inertiajs/react";
import { useState } from "react";

const FALLBACK =
    "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=300&fit=crop";

function getPosterSrc(image, folder = "temples") {
    if (!image) return FALLBACK;
    if (image.startsWith("http") || image.startsWith("/")) return image;
    return `/assets/${folder}/${image}`;
}

function ArrowLeftIcon(props) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
        </svg>
    );
}

function SearchIcon(props) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
        </svg>
    );
}

function StarIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" />
        </svg>
    );
}

function TempleCard({ temple }) {
    const crowdColors = {
        Low: "bg-emerald-500",
        Moderate: "bg-amber-400",
        High: "bg-red-500",
        "Very High": "bg-red-600",
        Extreme: "bg-red-700",
    };
    return (
        <Link
            href={`/temple/${temple.id}`}
            className="block rounded-xl overflow-hidden cursor-pointer group"
        >
            <div className="relative h-48 md:h-52 bg-gray-100 dark:bg-gray-800 overflow-hidden rounded-xl">
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
                {temple.has_vip_darshan && (
                    <span className="absolute top-2 left-2 bg-[#c33c01] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                        VIP
                    </span>
                )}
            </div>
            <div className="pt-1.5 pb-0.5">
                <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 line-clamp-1 group-hover:text-orange-600 transition-colors">
                    {temple.name}
                </p>
                <p className="flex items-center gap-2 text-[10px] mt-0.5">
                    <span className="flex items-center gap-0.5 text-amber-500 font-medium">
                        <StarIcon className="w-3 h-3" /> {temple.rating || 4.5}
                    </span>
                    {temple.location && (
                        <span className="text-gray-400 line-clamp-1">
                            {temple.location}
                        </span>
                    )}
                </p>
            </div>
        </Link>
    );
}

export default function All({ temples = [] }) {
    const [search, setSearch] = useState("");
    const [crowdFilter, setCrowdFilter] = useState("all");

    const filtered = temples.filter((t) => {
        const matchesSearch =
            search.trim() === "" ||
            t.name.toLowerCase().includes(search.toLowerCase()) ||
            (t.location || "").toLowerCase().includes(search.toLowerCase());
        const matchesCrowd = crowdFilter === "all" || t.crowd_level === crowdFilter;
        return matchesSearch && matchesCrowd;
    });

    return (
        <AppLayout>
            {/* ── HEADER ── */}
            <div className="mb-5 flex items-center gap-3">
                <button
                    onClick={() => router.visit("/temple")}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    aria-label="Back"
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                </button>
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
                        All Temples
                    </h1>
                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                        {temples.length} temples available
                    </p>
                </div>
            </div>

            {/* ── SEARCH ── */}
            <div className="relative mb-4">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search temples or locations…"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 border-0 text-sm focus:ring-2 focus:ring-offset-0"
                    style={{ "--tw-ring-color": "#c33c01" }}
                />
            </div>

            {/* ── CROWD FILTER ── */}
            <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar pb-1">
                {[
                    { id: "all", label: "All" },
                    { id: "Low", label: "Low" },
                    { id: "Moderate", label: "Moderate" },
                    { id: "High", label: "High" },
                ].map(({ id, label }) => (
                    <button
                        key={id}
                        onClick={() => setCrowdFilter(id)}
                        style={
                            crowdFilter === id
                                ? { backgroundColor: "#c33c01", borderColor: "#c33c01" }
                                : {}
                        }
                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                            crowdFilter === id
                                ? "text-white shadow-sm"
                                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300"
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* ── GRID ── */}
            {filtered.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-sm text-gray-400 mb-3">
                        No temples match your search.
                    </p>
                    <button
                        onClick={() => {
                            setSearch("");
                            setCrowdFilter("all");
                        }}
                        className="text-xs font-semibold px-4 py-1.5 rounded-full border"
                        style={{ color: "#c33c01", borderColor: "#c33c01" }}
                    >
                        Clear filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 gap-y-5">
                    {filtered.map((temple) => (
                        <TempleCard key={temple.id} temple={temple} />
                    ))}
                </div>
            )}
        </AppLayout>
    );
}