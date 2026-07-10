import AdminAppLayout from "@/Layouts/AdminAppLayout";
import { Link, router } from "@inertiajs/react";
import { useState } from "react";
import { Search, Plus, Edit2, Trash2, Eye } from "lucide-react";

export default function DiningOfferIndex({ offers, search: initialSearch, status: initialStatus }) {
    const [search, setSearch] = useState(initialSearch);
    const [status, setStatus] = useState(initialStatus);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route("admin.dining-offers.index"), { search, status });
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this offer?")) {
            router.delete(route("admin.dining-offers.destroy", id));
        }
    };

    const handleToggleStatus = (id) => {
        router.post(route("admin.dining-offers.toggle-status", id));
    };

    return (
        <AdminAppLayout>
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-brand-primary dark:text-gray-100 mb-2">
                        Dining Offers Management
                    </h1>
                    <p className="text-brand-secondary dark:text-gray-400">
                        Manage promotional offers for restaurants
                    </p>
                </div>

                <div className="mb-6 flex justify-end">
                    <Link
                        href={route("admin.dining-offers.create")}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:opacity-90 transition-opacity"
                    >
                        <Plus className="w-4 h-4" />
                        Add Offer
                    </Link>
                </div>

                <form onSubmit={handleSearch} className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div>
                            <label className="block text-sm font-medium text-brand-primary dark:text-gray-200 mb-2">Search</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 w-4 h-4 text-brand-secondary" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search offers..."
                                    className="w-full pl-10 pr-4 py-2 border border-brand-border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-brand-primary dark:text-gray-200 mb-2">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-4 py-2 border border-brand-border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                            >
                                <option value="all">All Statuses</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>

                        <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:opacity-90 transition-opacity">
                            Filter
                        </button>
                    </div>
                </form>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-brand-border dark:border-gray-700 bg-brand-background dark:bg-gray-900">
                                <th className="px-6 py-3 text-left text-sm font-semibold text-brand-primary dark:text-gray-200">Title</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-brand-primary dark:text-gray-200">Restaurant</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-brand-primary dark:text-gray-200">Discount</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-brand-primary dark:text-gray-200">Valid Until</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-brand-primary dark:text-gray-200">Status</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-brand-primary dark:text-gray-200">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-border dark:divide-gray-700">
                            {offers && offers.data && offers.data.length > 0 ? (
                                offers.data.map((offer) => (
                                    <tr key={offer.id} className="hover:bg-brand-background dark:hover:bg-gray-700 transition-colors">
                                        <td className="px-6 py-4 text-sm text-brand-primary dark:text-gray-300 font-medium">{offer.title}</td>
                                        <td className="px-6 py-4 text-sm text-brand-secondary dark:text-gray-400">{offer.restaurant?.name || "N/A"}</td>
                                        <td className="px-6 py-4 text-sm text-brand-primary dark:text-gray-300">
                                            {offer.discount_percent ? `${offer.discount_percent}%` : "N/A"}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-brand-secondary dark:text-gray-400">{offer.valid_until || "N/A"}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium ${
                                                    offer.status === "active"
                                                        ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                                                        : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                                                }`}
                                            >
                                                {offer.status === "active" ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex gap-2">
                                                <Link
                                                    href={route("admin.dining-offers.show", offer.id)}
                                                    className="p-2 hover:bg-brand-background dark:hover:bg-gray-700 rounded transition-colors"
                                                    title="View"
                                                >
                                                    <Eye className="w-4 h-4 text-brand-primary" />
                                                </Link>
                                                <Link
                                                    href={route("admin.dining-offers.edit", offer.id)}
                                                    className="p-2 hover:bg-brand-background dark:hover:bg-gray-700 rounded transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                </Link>
                                                <button
                                                    onClick={() => handleToggleStatus(offer.id)}
                                                    className="p-2 hover:bg-brand-background dark:hover:bg-gray-700 rounded transition-colors"
                                                    title="Toggle Status"
                                                >
                                                    ⚙️
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(offer.id)}
                                                    className="p-2 hover:bg-brand-background dark:hover:bg-gray-700 rounded transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-brand-secondary dark:text-gray-400">
                                        No offers found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {offers && offers.links && offers.links.length > 3 && (
                    <div className="mt-6 flex justify-center gap-2">
                        {offers.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || "#"}
                                className={`px-3 py-2 rounded transition-colors ${
                                    link.active
                                        ? "bg-brand-primary text-white"
                                        : "bg-white dark:bg-gray-800 border border-brand-border dark:border-gray-600 text-brand-primary dark:text-gray-300 hover:bg-brand-background dark:hover:bg-gray-700"
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AdminAppLayout>
    );
}
