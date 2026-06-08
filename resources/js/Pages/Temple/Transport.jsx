import AppLayout from "@/Layouts/AppLayout";
import { usePage, router } from "@inertiajs/react";
import { useState } from "react";

export default function Transport({ transports = [] }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [searchQuery, setSearchQuery] = useState("");
    const [transportFilter, setTransportFilter] = useState("all");

    const transportTypes = [
        { id: "all", label: "All" },
        { id: "shuttle", label: "Shuttle" },
        { id: "auto", label: "Auto" },
        { id: "taxi", label: "Taxi" },
        { id: "bus", label: "Bus" },
    ];

    // SEARCH & FILTER LOGIC
    const filteredTransports = transports.filter((transport) => {
        const matchesSearch =
            searchQuery.trim() === "" ||
            transport.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            transport.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
            transport.to.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesType =
            transportFilter === "all" ||
            transport.type.toLowerCase() === transportFilter.toLowerCase();

        return matchesSearch && matchesType;
    });

    const temples = [...new Set(transports.map((t) => t.location))];

    return (
        <AppLayout>
            {/* ── HEADER ── */}
            <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
                    Transport
                </h1>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
                    Book rides to temples
                </p>
            </div>

            {/* ── SEARCH BAR ── */}
            <div className="relative mb-6">
                <input
                    type="text"
                    placeholder="Search routes, locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 border-0 focus:ring-2 focus:ring-temple-500 text-sm md:text-base"
                />
                <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
            </div>

            {/* ── FILTERS ── */}
            <div className="flex flex-wrap gap-3 mb-6 overflow-x-auto pb-2">
                {transportTypes.map((type) => (
                    <button
                        key={type.id}
                        onClick={() => setTransportFilter(type.id)}
                        style={
                            transportFilter === type.id
                                ? { backgroundColor: "#c33c01" }
                                : {}
                        }
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${
                            transportFilter === type.id
                                ? "text-white"
                                : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                        }`}
                    >
                        {type.id === "shuttle" && "🚐 "}
                        {type.id === "auto" && "🚕 "}
                        {type.id === "taxi" && "🚕 "}
                        {type.id === "bus" && "🚌 "}
                        {type.label}
                    </button>
                ))}
            </div>

            {/* ── TEMPLE FILTER ── */}
            {temples.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2">
                    {temples.map((temple) => (
                        <button
                            key={temple}
                            className="px-4 py-2 rounded-full text-sm font-medium text-white"
                            style={{
                                backgroundColor: "rgba(195, 60, 1, 0.15)",
                                color: "#c33c01",
                            }}
                        >
                            {temple}
                        </button>
                    ))}
                </div>
            )}

            {/* ── RESULTS COUNT ── */}
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                {filteredTransports.length} transport options available
            </div>

            {/* ── TRANSPORT LIST ── */}
            <div className="space-y-4">
                {filteredTransports.map((transport) => (
                    <div
                        key={transport.id}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-card hover:shadow-lg transition-shadow overflow-hidden"
                    >
                        <div className="flex gap-4 p-4">
                            {/* Image */}
                            <div className="flex-shrink-0">
                                <img
                                    src={transport.image}
                                    alt={transport.name}
                                    className="w-32 md:w-40 h-32 md:h-32 object-cover rounded-lg"
                                    onError={(e) => {
                                        e.target.src =
                                            "https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=300&h=200&fit=crop";
                                    }}
                                />
                                {/* Type Badge */}
                                <div
                                    className="mt-2 px-2 py-1 text-white rounded text-xs font-bold text-center"
                                    style={{ backgroundColor: "#c33c01" }}
                                >
                                    {transport.type}
                                </div>
                            </div>

                            {/* Details */}
                            <div className="flex-grow">
                                {/* Title & Location */}
                                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
                                    {transport.name}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    ⊙ {transport.location}
                                </p>

                                {/* Route */}
                                <div className="flex items-center gap-2 mb-3 text-sm text-gray-700 dark:text-gray-300">
                                    <span>✔️ {transport.from}</span>
                                    <span>→</span>
                                    <span>{transport.to}</span>
                                </div>

                                {/* Info Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3 text-sm">
                                    <div className="flex items-center gap-1">
                                        <span>⏱️</span>
                                        <span className="text-gray-600 dark:text-gray-400">
                                            {transport.duration}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span>👥</span>
                                        <span className="text-gray-600 dark:text-gray-400">
                                            {transport.seats} seats
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span>🔄</span>
                                        <span className="text-gray-600 dark:text-gray-400">
                                            {transport.frequency}
                                        </span>
                                    </div>
                                </div>

                                {/* Amenities */}
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {transport.amenities.map((amenity, idx) => (
                                        <span
                                            key={idx}
                                            className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
                                        >
                                            {amenity === "AC" && "❄️"}
                                            {amenity === "GPS Tracking" && "📍"}
                                            {amenity === "WiFi" && "📡"}
                                            {amenity === "Safety Kit" && "🧳"}
                                            {amenity === "Fast Route" &&
                                                "⚡"}{" "}
                                            {amenity}
                                        </span>
                                    ))}
                                </div>

                                {/* Status */}
                                {transport.available && (
                                    <p className="text-sm text-green-600 dark:text-green-400 font-semibold">
                                        • {transport.status}
                                    </p>
                                )}
                            </div>

                            {/* Price & Button */}
                            <div className="flex flex-col items-end justify-between flex-shrink-0">
                                <div className="text-right">
                                    <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                                        ₹{transport.price}
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        /person
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        if (!user) {
                                            router.visit("/login");
                                            return;
                                        }
                                    }}
                                    className="text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors whitespace-nowrap hover:opacity-90"
                                    style={{ backgroundColor: "#c33c01" }}
                                >
                                    Book Ride
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── EMPTY STATE ── */}
            {filteredTransports.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                        No transport options found. Try adjusting your filters.
                    </p>
                </div>
            )}
        </AppLayout>
    );
}
