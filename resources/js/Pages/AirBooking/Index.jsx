import AppLayout from "@/Layouts/AppLayout";
import { Link, router } from "@inertiajs/react";
import { useState } from "react";
import { Search, PlaneTakeoff, PlaneLanding, Clock, SlidersHorizontal, X } from "lucide-react";

export default function AirBookingIndex({ flights = [], filters = {}, availableAirlines = [] }) {
    const [origin, setOrigin] = useState(filters.origin || "");
    const [destination, setDestination] = useState(filters.destination || "");
    const [date, setDate] = useState(filters.date || "");
    const [showFilters, setShowFilters] = useState(false);

    const [airlines, setAirlines] = useState(filters.airlines || []);
    const [priceMin, setPriceMin] = useState(filters.price_min || "");
    const [priceMax, setPriceMax] = useState(filters.price_max || "");
    const [timeOfDay, setTimeOfDay] = useState(filters.time_of_day || "");
    const sort = filters.sort || "best";

    const runSearch = (overrides = {}) => {
        router.get(
            route("air-booking.index"),
            {
                origin,
                destination,
                date,
                sort,
                airlines,
                price_min: priceMin,
                price_max: priceMax,
                time_of_day: timeOfDay,
                ...overrides,
            },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleSearch = (e) => {
        e.preventDefault();
        runSearch();
    };

    const toggleAirline = (airline) => {
        const next = airlines.includes(airline)
            ? airlines.filter((a) => a !== airline)
            : [...airlines, airline];
        setAirlines(next);
        runSearch({ airlines: next });
    };

    const activeFilterCount =
        airlines.length + (priceMin ? 1 : 0) + (priceMax ? 1 : 0) + (timeOfDay ? 1 : 0);

    const clearFilters = () => {
        setAirlines([]);
        setPriceMin("");
        setPriceMax("");
        setTimeOfDay("");
        runSearch({ airlines: [], price_min: "", price_max: "", time_of_day: "" });
    };

    const formatDuration = (minutes) => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}h ${m}m`;
    };

    const timeBuckets = [
        { key: "morning", label: "Morning (6AM–12PM)" },
        { key: "afternoon", label: "Afternoon (12–6PM)" },
        { key: "evening", label: "Evening (6–12AM)" },
        { key: "night", label: "Night (12–6AM)" },
    ];

    return (
        <AppLayout>
            <div className="mb-6">
                <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
                    Air Booking
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Search and book flights
                </p>
            </div>

            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
                <div className="relative">
                    <PlaneTakeoff className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                        placeholder="From"
                        className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-gray-100 text-sm"
                    />
                </div>
                <div className="relative">
                    <PlaneLanding className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder="To"
                        className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-gray-100 text-sm"
                    />
                </div>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-gray-100 text-sm"
                />
                <button
                    type="submit"
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-sky-500 text-white font-semibold text-sm hover:bg-sky-600 transition-colors"
                >
                    <Search className="w-4 h-4" /> Search
                </button>
            </form>

            {/* Sort + filter bar */}
            <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
                <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                    {[
                        { key: "best", label: "Best" },
                        { key: "cheapest", label: "Cheapest" },
                        { key: "fastest", label: "Fastest" },
                        { key: "earliest", label: "Earliest" },
                    ].map((opt) => (
                        <button
                            key={opt.key}
                            onClick={() => runSearch({ sort: opt.key })}
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                                sort === opt.key
                                    ? "bg-white dark:bg-gray-700 text-sky-600 dark:text-sky-400 shadow-sm"
                                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
                <button
                    onClick={() => setShowFilters((v) => !v)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                    {activeFilterCount > 0 && (
                        <span className="w-5 h-5 flex items-center justify-center rounded-full bg-sky-500 text-white text-[10px]">
                            {activeFilterCount}
                        </span>
                    )}
                </button>
            </div>

            {showFilters && (
                <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 grid grid-cols-1 md:grid-cols-4 gap-5">
                    <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Airlines</p>
                        <div className="space-y-1.5">
                            {availableAirlines.map((a) => (
                                <label key={a} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                                    <input
                                        type="checkbox"
                                        checked={airlines.includes(a)}
                                        onChange={() => toggleAirline(a)}
                                        className="rounded border-gray-300"
                                    />
                                    {a}
                                </label>
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Price range (₹)</p>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                placeholder="Min"
                                value={priceMin}
                                onChange={(e) => setPriceMin(e.target.value)}
                                onBlur={() => runSearch()}
                                className="w-full px-2 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-gray-100 text-sm"
                            />
                            <span className="text-gray-400">–</span>
                            <input
                                type="number"
                                placeholder="Max"
                                value={priceMax}
                                onChange={(e) => setPriceMax(e.target.value)}
                                onBlur={() => runSearch()}
                                className="w-full px-2 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-gray-100 text-sm"
                            />
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Departure time</p>
                        <select
                            value={timeOfDay}
                            onChange={(e) => { setTimeOfDay(e.target.value); runSearch({ time_of_day: e.target.value }); }}
                            className="w-full px-2 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-gray-100 text-sm"
                        >
                            <option value="">Any time</option>
                            {timeBuckets.map((b) => (
                                <option key={b.key} value={b.key}>{b.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={clearFilters}
                            className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <X className="w-3.5 h-3.5" /> Clear filters
                        </button>
                    </div>
                </div>
            )}

            <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">{flights.length} flight(s) found</p>

            {flights.length === 0 ? (
                <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                    No flights match these filters.
                    {activeFilterCount > 0 && (
                        <button onClick={clearFilters} className="block mx-auto mt-2 text-sky-600 dark:text-sky-400 font-medium">
                            Clear filters
                        </button>
                    )}
                </div>
            ) : (
                <div className="space-y-3">
                    {flights.map((flight) => (
                        <Link
                            key={flight.id}
                            href={route("air-booking.show", flight.id)}
                            className="flex flex-col md:flex-row md:items-center justify-between bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 hover:shadow-md transition-shadow gap-3"
                        >
                            <div>
                                <p className="font-semibold text-gray-900 dark:text-gray-100">
                                    {flight.airline} · {flight.flight_number}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {flight.origin} → {flight.destination}
                                </p>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                                <p>{flight.departure_time}</p>
                                <p className="flex items-center gap-1 text-xs text-gray-400">
                                    <Clock className="w-3 h-3" /> {formatDuration(flight.duration_minutes)} · <span className="capitalize">{flight.seat_class}</span>
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-sky-600 dark:text-sky-400">from ₹{flight.from_price.toLocaleString()}</p>
                                {flight.sold_out ? (
                                    <span className="text-xs font-semibold text-red-500">Sold Out</span>
                                ) : (
                                    <span className="text-xs text-gray-400">{flight.seats_available} seats left</span>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </AppLayout>
    );
}
