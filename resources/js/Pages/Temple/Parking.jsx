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
    Bike: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
        >
            <circle cx="5.5" cy="17.5" r="3.5" />
            <circle cx="18.5" cy="17.5" r="3.5" />
            <path d="M15 6a1 1 0 0 0-1 1v5.5h2.5L12 6h-1" />
            <path d="M5.5 14H10l4-8" />
        </svg>
    ),
    Car: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
        >
            <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-2" />
            <circle cx="7.5" cy="17.5" r="2.5" />
            <circle cx="17.5" cy="17.5" r="2.5" />
        </svg>
    ),
    Vehicles: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
        >
            <rect x="1" y="3" width="15" height="13" />
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
    ),
    CCTV: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3 h-3"
        >
            <path d="m17 17 4 4" />
            <path d="M3.268 12.043A8 8 0 0 0 17 17l4 4" />
            <path d="M3 7v4a1 1 0 0 0 1 1h4" />
            <path d="M7 7V3" />
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
    Home: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3 h-3"
        >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        </svg>
    ),
    Zap: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3 h-3"
        >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
    ),
};

const amenityIcons = {
    CCTV: Icon.CCTV,
    Security: Icon.Shield,
    Covered: Icon.Home,
    "EV Charging": Icon.Zap,
};

const FALLBACK =
    "https://images.unsplash.com/photo-1468817814611-b7edf94b5d60?w=500&h=300&fit=crop";

export default function Parking({ parkings = [] }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [searchQuery, setSearchQuery] = useState("");
    const [vehicleFilter, setVehicleFilter] = useState("all");

    const vehicleTypes = [
        { id: "all", label: "All", IconComp: Icon.Vehicles },
        { id: "2-wheeler", label: "2-Wheeler", IconComp: Icon.Bike },
        { id: "4-wheeler", label: "4-Wheeler", IconComp: Icon.Car },
    ];

    const filteredParkings = parkings.filter((p) => {
        const matchesSearch =
            searchQuery.trim() === "" ||
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesVehicle =
            vehicleFilter === "all" ||
            p.vehicleType === "All" ||
            p.vehicleType === vehicleFilter;
        return matchesSearch && matchesVehicle;
    });

    const availabilityColor = (available, total) => {
        const pct = (available / total) * 100;
        if (pct > 50)
            return {
                bg: "bg-emerald-100 dark:bg-emerald-950/30",
                text: "text-emerald-700 dark:text-emerald-300",
                bar: "bg-emerald-500",
            };
        if (pct > 20)
            return {
                bg: "bg-amber-100 dark:bg-amber-950/30",
                text: "text-amber-700 dark:text-amber-300",
                bar: "bg-amber-400",
            };
        return {
            bg: "bg-red-100 dark:bg-red-950/30",
            text: "text-red-700 dark:text-red-300",
            bar: "bg-red-500",
        };
    };

    return (
        <AppLayout>
            <div className="mb-5">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Parking Finder
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Find secure parking near temples
                </p>
            </div>

            {/* ── SEARCH ── */}
            <div className="relative mb-5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Icon.Search />
                </span>
                <input
                    type="text"
                    placeholder="Search by temple, location, or parking name…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 border-2 border-transparent focus:outline-none transition"
                    onFocus={(e) => (e.target.style.borderColor = "#c33c01")}
                    onBlur={(e) => (e.target.style.borderColor = "transparent")}
                />
            </div>

            {/* ── VEHICLE FILTERS ── */}
            <div className="flex gap-2 mb-5">
                {vehicleTypes.map(({ id, label, IconComp }) => (
                    <button
                        key={id}
                        onClick={() => setVehicleFilter(id)}
                        style={
                            vehicleFilter === id
                                ? { backgroundColor: "#c33c01" }
                                : {}
                        }
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                            vehicleFilter === id
                                ? "text-white shadow-sm"
                                : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300"
                        }`}
                    >
                        <IconComp />
                        {label}
                    </button>
                ))}
            </div>

            <p className="text-xs text-gray-400 mb-4">
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {filteredParkings.length}
                </span>{" "}
                parking spots found
            </p>

            {/* ── GRID ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredParkings.map((p) => {
                    const avail = availabilityColor(
                        p.availableSpots,
                        p.totalSpots,
                    );
                    const pct = Math.round(
                        (p.availableSpots / p.totalSpots) * 100,
                    );
                    return (
                        <div
                            key={p.id}
                            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all"
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
                                    src={p.image || FALLBACK}
                                    alt={p.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = FALLBACK;
                                    }}
                                />
                                <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between">
                                    <span className="bg-gray-900/80 text-white text-[9px] font-bold px-2.5 py-1 rounded-full">
                                        {p.vehicleType === "2-Wheeler"
                                            ? "2-Wheeler"
                                            : p.vehicleType === "4-Wheeler"
                                              ? "4-Wheeler"
                                              : "All Vehicles"}
                                    </span>
                                </div>
                            </div>

                            <div className="p-3.5">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                    {p.name}
                                </h3>
                                <p className="flex items-center gap-1 text-[10px] text-gray-400 mb-2">
                                    <Icon.MapPin />
                                    {p.location} · {p.distance}
                                </p>

                                {/* Amenities */}
                                <div className="flex flex-wrap gap-1 mb-3">
                                    {p.amenities.map((a, i) => {
                                        const AIcon = amenityIcons[a];
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

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] text-gray-400">
                                            Hourly Rate
                                        </p>
                                        <p
                                            className="text-base font-bold"
                                            style={{ color: "#c33c01" }}
                                        >
                                            ₹{p.hourlyRate}
                                            <span className="text-xs font-normal text-gray-400">
                                                /hr
                                            </span>
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            if (!user) {
                                                router.visit("/login");
                                                return;
                                            }
                                        }}
                                        className="text-white px-4 py-1.5 rounded-lg text-xs font-semibold transition shadow-sm hover:opacity-90"
                                        style={{ backgroundColor: "#c33c01" }}
                                    >
                                        Reserve
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredParkings.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-sm text-gray-400">
                        No parking spots found. Try adjusting your filters.
                    </p>
                </div>
            )}
        </AppLayout>
    );
}
