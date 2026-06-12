// ─────────────────────────────
// Stay.jsx  –  Stay & Hotels
// ─────────────────────────────
import AppLayout from "@/Layouts/AppLayout";
import { usePage, router } from "@inertiajs/react";
import { useState } from "react";

const StayIcon = {
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
    WiFi: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3 h-3"
        >
            <path d="M5 12.55a11 11 0 0 1 14.08 0" />
            <path d="M1.42 9a16 16 0 0 1 21.16 0" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <circle cx="12" cy="20" r="1" />
        </svg>
    ),
    Parking: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3 h-3"
        >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
        </svg>
    ),
    Shield: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3 h-3"
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
    ),
    Snowflake: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3 h-3"
        >
            <line x1="2" y1="12" x2="22" y2="12" />
            <line x1="12" y1="2" x2="12" y2="22" />
            <path d="m20 16-4-4 4-4" />
            <path d="m4 8 4 4-4 4" />
            <path d="m16 4-4 4-4-4" />
            <path d="m8 20 4-4 4 4" />
        </svg>
    ),
    Food: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3 h-3"
        >
            <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
            <path d="M7 2v20" />
            <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
        </svg>
    ),
    Check: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3 h-3"
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    ),
    Bed: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3 h-3"
        >
            <path d="M2 4v16" />
            <path d="M2 8h18a2 2 0 0 1 2 2v10" />
            <path d="M2 17h20" />
            <path d="M6 8v9" />
        </svg>
    ),
};

const amenityIconMap = {
    WiFi: StayIcon.WiFi,
    Parking: StayIcon.Parking,
    Security: StayIcon.Shield,
    AC: StayIcon.Snowflake,
    Restaurant: StayIcon.Food,
};
const STAY_FALLBACK =
    "https://images.unsplash.com/photo-1566996122988-99ef5aa50203?w=500&h=300&fit=crop";

export function Stay({ stays = [] }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");

    const types = [
        { id: "all", label: "All" },
        { id: "dharamshala", label: "Dharamshala" },
        { id: "budget", label: "Budget" },
        { id: "premium", label: "Premium" },
        { id: "resort", label: "Resort" },
    ];

    const filteredStays = stays.filter((s) => {
        const matchesSearch =
            searchQuery.trim() === "" ||
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.temple.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType =
            typeFilter === "all" ||
            s.type.toLowerCase().includes(typeFilter.toLowerCase());
        return matchesSearch && matchesType;
    });

    const temples = [...new Set(stays.map((s) => s.temple))];

    return (
        <AppLayout>
            <div className="mb-5">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Stay & Hotels
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Accommodations near temples
                </p>
            </div>

            <div className="relative mb-5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <StayIcon.Search />
                </span>
                <input
                    type="text"
                    placeholder="Search hotels, dharamshalas…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 border-2 border-transparent focus:outline-none transition"
                    onFocus={(e) => (e.target.style.borderColor = "#c33c01")}
                    onBlur={(e) => (e.target.style.borderColor = "transparent")}
                />
            </div>

            <div className="flex gap-2 flex-wrap mb-4">
                {types.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setTypeFilter(t.id)}
                        style={
                            typeFilter === t.id
                                ? { backgroundColor: "#c33c01" }
                                : {}
                        }
                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                            typeFilter === t.id
                                ? "text-white shadow-sm"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-150 dark:hover:bg-gray-750"
                        }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {temples.length > 0 && (
                <div className="flex gap-2 flex-wrap mb-4">
                    {temples.map((t) => (
                        <span
                            key={t}
                            className="px-3 py-1 rounded-full text-xs font-medium"
                            style={{
                                backgroundColor: "rgba(195, 60, 1, 0.1)",
                                color: "#c33c01",
                                borderColor: "#c33c01",
                            }}
                        >
                            {t}
                        </span>
                    ))}
                </div>
            )}

            <p className="text-xs text-gray-400 mb-4">
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {filteredStays.length}
                </span>{" "}
                accommodations found
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStays.map((stay) => (
                    <div
                        key={stay.id}
                        className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all group cursor-pointer"
                        onClick={() => router.visit(`/stay/${stay.id}`)}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.borderColor = "#c33c01")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.borderColor =
                                "rgb(229, 231, 235)")
                        }
                    >
                        <div className="relative h-40 bg-gray-100 dark:bg-gray-700 overflow-hidden">
                            <img
                                src={stay.image || STAY_FALLBACK}
                                alt={stay.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                    e.target.src = STAY_FALLBACK;
                                }}
                            />
                            <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-start">
                                <span
                                    className="text-white text-[9px] font-bold px-2 py-1 rounded-full"
                                    style={{ backgroundColor: "#c33c01" }}
                                >
                                    {stay.badge}
                                </span>
                                <span className="flex items-center gap-0.5 bg-gray-900/80 text-white text-[9px] font-bold px-2 py-1 rounded-full">
                                    <StayIcon.Star />
                                    {stay.rating}
                                    <span className="font-normal opacity-70">
                                        ({stay.reviews})
                                    </span>
                                </span>
                            </div>
                        </div>
                        <div className="p-3.5">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1 line-clamp-1">
                                {stay.name}
                            </h3>
                            <p className="text-[10px] text-gray-400 mb-2">
                                {stay.location}
                            </p>
                            <div className="flex flex-wrap gap-1 mb-2.5">
                                {(Array.isArray(stay.amenities)
                                    ? stay.amenities
                                    : stay.amenities.split(", ")
                                )
                                    .slice(0, 3)
                                    .map((a, i) => {
                                        const AIcon = amenityIconMap[a];
                                        return (
                                            <span
                                                key={i}
                                                className="flex items-center gap-1 text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full"
                                            >
                                                {AIcon && <AIcon />}
                                                {a}
                                            </span>
                                        );
                                    })}
                            </div>
                            <p className="flex items-center gap-1 text-[10px] text-gray-400 mb-3">
                                <StayIcon.Bed />
                                {stay.roomTypes} room types
                            </p>
                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-[10px] text-gray-400">
                                        From
                                    </p>
                                    <p
                                        className="text-base font-bold"
                                        style={{ color: "#c33c01" }}
                                    >
                                        ₹{stay.price}
                                        <span className="text-xs font-normal text-gray-400">
                                            /night
                                        </span>
                                    </p>
                                    {stay.available && (
                                        <p className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold mt-0.5">
                                            <StayIcon.Check />
                                            Available
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        router.visit(`/stay/${stay.id}`);
                                    }}
                                    className="text-white px-4 py-1.5 rounded-lg text-xs font-semibold transition shadow-sm hover:opacity-90"
                                    style={{ backgroundColor: "#c33c01" }}
                                >
                                    View
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {filteredStays.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-sm text-gray-400">
                        No accommodations found. Try adjusting your filters.
                    </p>
                </div>
            )}
        </AppLayout>
    );
}

export default Stay;
