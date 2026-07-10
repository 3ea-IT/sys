import AppLayout from "@/Layouts/AppLayout";
import { Link, router } from "@inertiajs/react";
import { useState } from "react";
import { Search, MapPin, Star, Tag } from "lucide-react";

export default function DiningIndex({ restaurants = [], search: initialSearch = "" }) {
    const [search, setSearch] = useState(initialSearch);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route("dining.index"), { search }, { preserveState: true });
    };

    const priceLabel = { budget: "₹", mid: "₹₹", premium: "₹₹₹" };

    return (
        <AppLayout>
            <div className="mb-6">
                <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
                    Dining & Restaurants
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Discover restaurants, offers, and reserve a table
                </p>
            </div>

            <form onSubmit={handleSearch} className="relative mb-8">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name, location, or cuisine..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 border-0 focus:ring-2 focus:ring-amber-500 text-sm"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </form>

            {restaurants.length === 0 ? (
                <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                    No restaurants found.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {restaurants.map((restaurant) => (
                        <Link
                            key={restaurant.id}
                            href={route("dining.show", restaurant.id)}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
                        >
                            <div
                                className="h-40 bg-gray-200 dark:bg-gray-700 bg-cover bg-center relative"
                                style={restaurant.image_url ? { backgroundImage: `url(${restaurant.image_url})` } : {}}
                            >
                                {restaurant.has_offers && (
                                    <span className="absolute top-2 left-2 flex items-center gap-1 bg-amber-500 text-white text-[10px] font-semibold px-2 py-1 rounded-full">
                                        <Tag className="w-3 h-3" /> Offer
                                    </span>
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{restaurant.name}</h3>
                                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-2">
                                    <MapPin className="w-3 h-3" /> {restaurant.location}
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                    <span>{restaurant.cuisine || "Multi-cuisine"}</span>
                                    <span className="flex items-center gap-2">
                                        <span>{priceLabel[restaurant.price_range]}</span>
                                        <span className="flex items-center gap-1">
                                            <Star className="w-3 h-3 fill-current text-yellow-500" /> {restaurant.rating}
                                        </span>
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
