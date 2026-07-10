import AppLayout from "@/Layouts/AppLayout";
import { Link, router } from "@inertiajs/react";
import { useState } from "react";
import { Search, MapPin, Star, SlidersHorizontal, X } from "lucide-react";

export default function AccommodationIndex({
    properties = [],
    search: initialSearch = "",
    type: initialType = "",
    amenities: initialAmenities = [],
    min_rating: initialMinRating = "",
    sort: initialSort = "popular",
    amenityOptions = [],
}) {
    const [search, setSearch] = useState(initialSearch);
    const [type, setType] = useState(initialType);
    const [amenities, setAmenities] = useState(initialAmenities);
    const [minRating, setMinRating] = useState(initialMinRating);
    const [showFilters, setShowFilters] = useState(false);
    const sort = initialSort;

    const types = ["Hotel", "Resort", "Homestay", "Guest House", "Vacation Rental"];

    const runSearch = (overrides = {}) => {
        router.get(
            route("accommodation.index"),
            { search, type, amenities, min_rating: minRating, sort, ...overrides },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleSearch = (e) => {
        e.preventDefault();
        runSearch();
    };

    const toggleAmenity = (a) => {
        const next = amenities.includes(a) ? amenities.filter((x) => x !== a) : [...amenities, a];
        setAmenities(next);
        runSearch({ amenities: next });
    };

    const activeFilterCount = amenities.length + (minRating ? 1 : 0);

    const clearFilters = () => {
        setAmenities([]);
        setMinRating("");
        runSearch({ amenities: [], min_rating: "" });
    };

    return (
        <AppLayout>
            <div className="mb-6">
                <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
                    Accommodation
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Hotels, Resorts, Homestays, Guest Houses & Vacation Rentals
                </p>
            </div>

            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 mb-4">
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name or location..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 border-0 focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 dark:text-gray-100 text-sm"
                >
                    <option value="">All Types</option>
                    {types.map((t) => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </select>
                <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-indigo-500 text-white font-semibold text-sm hover:bg-indigo-600 transition-colors"
                >
                    Search
                </button>
            </form>

            <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
                <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                    {[
                        { key: "popular", label: "Popular" },
                        { key: "price_low", label: "Price: Low to High" },
                        { key: "price_high", label: "Price: High to Low" },
                        { key: "rating", label: "Rating" },
                    ].map((opt) => (
                        <button
                            key={opt.key}
                            onClick={() => runSearch({ sort: opt.key })}
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                                sort === opt.key
                                    ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
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
                        <span className="w-5 h-5 flex items-center justify-center rounded-full bg-indigo-500 text-white text-[10px]">
                            {activeFilterCount}
                        </span>
                    )}
                </button>
            </div>

            {showFilters && (
                <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="md:col-span-2">
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Amenities</p>
                        <div className="flex flex-wrap gap-2">
                            {amenityOptions.map((a) => (
                                <button
                                    key={a}
                                    onClick={() => toggleAmenity(a)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                                        amenities.includes(a)
                                            ? "bg-indigo-500 border-indigo-500 text-white"
                                            : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
                                    }`}
                                >
                                    {a}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Minimum rating</p>
                        <select
                            value={minRating}
                            onChange={(e) => { setMinRating(e.target.value); runSearch({ min_rating: e.target.value }); }}
                            className="w-full px-2 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-gray-100 text-sm mb-2"
                        >
                            <option value="">Any rating</option>
                            <option value="3">3+ stars</option>
                            <option value="4">4+ stars</option>
                            <option value="4.5">4.5+ stars</option>
                        </select>
                        <button
                            onClick={clearFilters}
                            className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <X className="w-3.5 h-3.5" /> Clear filters
                        </button>
                    </div>
                </div>
            )}

            {properties.length === 0 ? (
                <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                    No properties found.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {properties.map((property) => (
                        <Link
                            key={property.id}
                            href={route("accommodation.show", property.id)}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
                        >
                            <div
                                className="h-40 bg-gray-200 dark:bg-gray-700 bg-cover bg-center relative"
                                style={property.image_url ? { backgroundImage: `url(${property.image_url})` } : {}}
                            >
                                <span className="absolute top-2 left-2 bg-white/90 dark:bg-gray-900/90 text-[10px] font-semibold px-2 py-1 rounded-full text-gray-700 dark:text-gray-200">
                                    {property.type}
                                </span>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{property.name}</h3>
                                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-2">
                                    <MapPin className="w-3 h-3" /> {property.location}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                                        ₹{property.price_per_night.toLocaleString()} <span className="text-xs font-normal text-gray-500">/ night</span>
                                    </span>
                                    <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                        <Star className="w-3 h-3 fill-current text-yellow-500" /> {property.rating}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </AppLayout>
    );
}
