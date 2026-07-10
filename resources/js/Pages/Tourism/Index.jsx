import AppLayout from "@/Layouts/AppLayout";
import { Link, router } from "@inertiajs/react";
import { useState } from "react";
import { Search, MapPin, Star, Clock } from "lucide-react";

export default function TourismIndex({ packages = [], search: initialSearch = "" }) {
    const [search, setSearch] = useState(initialSearch);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route("tourism.spiritual.index"), { search }, { preserveState: true });
    };

    return (
        <AppLayout>
            <div className="mb-6">
                <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
                    Spiritual Tourism
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Curated spiritual journeys and wellness retreats
                </p>
            </div>

            <form onSubmit={handleSearch} className="relative mb-8">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name or location..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 border-0 focus:ring-2 focus:ring-orange-500 text-sm"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </form>

            {packages.length === 0 ? (
                <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                    No spiritual tourism packages available right now.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {packages.map((pkg) => (
                        <Link
                            key={pkg.id}
                            href={route("tourism.spiritual.show", pkg.id)}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
                        >
                            <div
                                className="h-40 bg-gray-200 dark:bg-gray-700 bg-cover bg-center"
                                style={pkg.image_url ? { backgroundImage: `url(${pkg.image_url})` } : {}}
                            />
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{pkg.name}</h3>
                                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-2">
                                    <MapPin className="w-3 h-3" /> {pkg.location}
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                                    {pkg.duration && (
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> {pkg.duration}
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1">
                                        <Star className="w-3 h-3 fill-current text-yellow-500" /> {pkg.rating}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-orange-600 dark:text-orange-400">
                                        ₹{pkg.price.toLocaleString()} <span className="text-xs font-normal text-gray-500">/ person</span>
                                    </span>
                                    {pkg.sold_out && (
                                        <span className="text-xs font-semibold text-red-500">Sold Out</span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </AppLayout>
    );
}
