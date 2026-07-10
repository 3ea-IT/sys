import AdminAppLayout from "@/Layouts/AdminAppLayout";
import { Link, router } from "@inertiajs/react";

export default function PropertyShow({ property }) {
    return (
        <AdminAppLayout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-brand-primary dark:text-gray-100">{property.name}</h1>
                    <Link
                        href={route("admin.properties.index")}
                        className="px-4 py-2 bg-brand-background dark:bg-gray-700 text-brand-primary rounded-lg hover:opacity-90 transition-opacity"
                    >
                        Back to List
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    {property.image && (
                        <img
                            src={`/banner/${property.image}`}
                            alt={property.name}
                            className="w-full h-56 object-cover rounded-lg mb-6"
                        />
                    )}

                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-brand-secondary dark:text-gray-400 mb-2">Type</label>
                            <p className="text-brand-primary dark:text-gray-200">{property.type}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-brand-secondary dark:text-gray-400 mb-2">Location</label>
                            <p className="text-brand-primary dark:text-gray-200">{property.location}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-brand-secondary dark:text-gray-400 mb-2">Price per Night</label>
                            <p className="text-brand-primary dark:text-gray-200">₹{property.price_per_night}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-brand-secondary dark:text-gray-400 mb-2">Rating</label>
                            <p className="text-brand-primary dark:text-gray-200">{property.rating ? `★ ${property.rating}` : "N/A"}</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-brand-secondary dark:text-gray-400 mb-2">Status</label>
                        <span
                            className={`px-3 py-1 rounded text-sm font-medium ${
                                property.status === "active"
                                    ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                                    : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                            }`}
                        >
                            {property.status === "active" ? "Active" : "Inactive"}
                        </span>
                    </div>

                    {property.description && (
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-brand-secondary dark:text-gray-400 mb-2">Description</label>
                            <p className="text-brand-primary dark:text-gray-200">{property.description}</p>
                        </div>
                    )}

                    {property.amenities?.length > 0 && (
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-brand-secondary dark:text-gray-400 mb-2">Amenities</label>
                            <div className="flex flex-wrap gap-2">
                                {property.amenities.map((a) => (
                                    <span key={a} className="px-2 py-1 rounded-full text-xs font-medium bg-brand-background dark:bg-gray-700 text-brand-primary dark:text-gray-200">
                                        {a}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {property.images?.length > 0 && (
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-brand-secondary dark:text-gray-400 mb-2">Gallery</label>
                            <div className="flex flex-wrap gap-3">
                                {property.images.map((img) => (
                                    <div key={img.id} className="w-20 h-20 rounded-lg overflow-hidden border border-brand-border">
                                        <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {property.roomTypes && property.roomTypes.length > 0 && (
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-brand-secondary dark:text-gray-400 mb-2">Room Types</label>
                            <ul className="space-y-1">
                                {property.roomTypes.map((rt) => (
                                    <li key={rt.id} className="text-sm text-brand-primary dark:text-gray-200">
                                        {rt.name} — ₹{rt.price}/night ({rt.room_count} rooms)
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="flex gap-3 mt-8">
                        <Link
                            href={route("admin.properties.edit", property.id)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Edit
                        </Link>
                        <button
                            onClick={() => {
                                if (confirm("Are you sure?")) {
                                    router.delete(route("admin.properties.destroy", property.id));
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
