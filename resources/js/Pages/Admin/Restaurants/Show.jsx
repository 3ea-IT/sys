import AdminAppLayout from "@/Layouts/AdminAppLayout";
import { Link, router } from "@inertiajs/react";

export default function RestaurantShow({ restaurant }) {
    return (
        <AdminAppLayout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-brand-primary dark:text-gray-100">{restaurant.name}</h1>
                    <Link
                        href={route("admin.restaurants.index")}
                        className="px-4 py-2 bg-brand-background dark:bg-gray-700 text-brand-primary rounded-lg hover:opacity-90 transition-opacity"
                    >
                        Back to List
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    {restaurant.image && (
                        <img
                            src={`/banner/${restaurant.image}`}
                            alt={restaurant.name}
                            className="w-full h-56 object-cover rounded-lg mb-6"
                        />
                    )}

                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-brand-secondary dark:text-gray-400 mb-2">Location</label>
                            <p className="text-brand-primary dark:text-gray-200">{restaurant.location}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-brand-secondary dark:text-gray-400 mb-2">Cuisine</label>
                            <p className="text-brand-primary dark:text-gray-200">{restaurant.cuisine || "N/A"}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-brand-secondary dark:text-gray-400 mb-2">Price Range</label>
                            <p className="text-brand-primary dark:text-gray-200 capitalize">{restaurant.price_range}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-brand-secondary dark:text-gray-400 mb-2">Rating</label>
                            <p className="text-brand-primary dark:text-gray-200">{restaurant.rating ? `★ ${restaurant.rating}` : "N/A"}</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-brand-secondary dark:text-gray-400 mb-2">Status</label>
                        <span
                            className={`px-3 py-1 rounded text-sm font-medium ${
                                restaurant.status === "active"
                                    ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                                    : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                            }`}
                        >
                            {restaurant.status === "active" ? "Active" : "Inactive"}
                        </span>
                    </div>

                    {restaurant.description && (
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-brand-secondary dark:text-gray-400 mb-2">Description</label>
                            <p className="text-brand-primary dark:text-gray-200">{restaurant.description}</p>
                        </div>
                    )}

                    {restaurant.offers && restaurant.offers.length > 0 && (
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-brand-secondary dark:text-gray-400 mb-2">Offers</label>
                            <ul className="space-y-1">
                                {restaurant.offers.map((offer) => (
                                    <li key={offer.id} className="text-sm text-brand-primary dark:text-gray-200">
                                        {offer.title} {offer.discount_percent ? `(${offer.discount_percent}% off)` : ""}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="flex gap-3 mt-8">
                        <Link
                            href={route("admin.restaurants.edit", restaurant.id)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Edit
                        </Link>
                        <button
                            onClick={() => {
                                if (confirm("Are you sure?")) {
                                    router.delete(route("admin.restaurants.destroy", restaurant.id));
                                }
                            }}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </AdminAppLayout>
    );
}
