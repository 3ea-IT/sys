import AdminAppLayout from "@/Layouts/AdminAppLayout";
import { Link, router } from "@inertiajs/react";
import { useState } from "react";
import { Search, Plus, Edit2, Trash2, Eye } from "lucide-react";

export default function PropertyIndex({ properties, search: initialSearch, status: initialStatus, type: initialType, types }) {
    const [search, setSearch] = useState(initialSearch);
    const [status, setStatus] = useState(initialStatus);
    const [type, setType] = useState(initialType);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route("admin.properties.index"), { search, status, type });
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this property?")) {
            router.delete(route("admin.properties.destroy", id));
        }
    };

    const handleToggleStatus = (id) => {
        router.post(route("admin.properties.toggle-status", id));
    };

    return (
        <AdminAppLayout>
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-brand-primary dark:text-gray-100 mb-2">
                        Properties Management
                    </h1>
                    <p className="text-brand-secondary dark:text-gray-400">
                        Manage Accommodation listings
                    </p>
                </div>

                <div className="mb-6 flex justify-end">
                    <Link
                        href={route("admin.properties.create")}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:opacity-90 transition-opacity"
                    >
                        <Plus className="w-4 h-4" />
                        Add Property
                    </Link>
                </div>

                <form onSubmit={handleSearch} className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div>
                            <label className="block text-sm font-medium text-brand-primary dark:text-gray-200 mb-2">Search</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 w-4 h-4 text-brand-secondary" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search properties..."
                                    className="w-full pl-10 pr-4 py-2 border border-brand-border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-brand-primary dark:text-gray-200 mb-2">Type</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full px-4 py-2 border border-brand-border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                            >
                                <option value="all">All Types</option>
                                {types.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
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
                                <th className="px-6 py-3 text-left text-sm font-semibold text-brand-primary dark:text-gray-200">Name</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-brand-primary dark:text-gray-200">Type</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-brand-primary dark:text-gray-200">Location</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-brand-primary dark:text-gray-200">Price/Night</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-brand-primary dark:text-gray-200">Status</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-brand-primary dark:text-gray-200">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-border dark:divide-gray-700">
                            {properties && properties.data && properties.data.length > 0 ? (
                                properties.data.map((property) => (
                                    <tr key={property.id} className="hover:bg-brand-background dark:hover:bg-gray-700 transition-colors">
                                        <td className="px-6 py-4 text-sm text-brand-primary dark:text-gray-300 font-medium">{property.name}</td>
                                        <td className="px-6 py-4 text-sm text-brand-secondary dark:text-gray-400">{property.type}</td>
                                        <td className="px-6 py-4 text-sm text-brand-secondary dark:text-gray-400">{property.location}</td>
                                        <td className="px-6 py-4 text-sm text-brand-primary dark:text-gray-300">₹{property.price_per_night}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium ${
                                                    property.status === "active"
                                                        ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                                                        : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                                                }`}
                                            >
                                                {property.status === "active" ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex gap-2">
                                                <Link
                                                    href={route("admin.properties.show", property.id)}
                                                    className="p-2 hover:bg-brand-background dark:hover:bg-gray-700 rounded transition-colors"
                                                    title="View"
                                                >
                                                    <Eye className="w-4 h-4 text-brand-primary" />
                                                </Link>
                                                <Link
                                                    href={route("admin.properties.edit", property.id)}
                                                    className="p-2 hover:bg-brand-background dark:hover:bg-gray-700 rounded transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                </Link>
                                                <button
                                                    onClick={() => handleToggleStatus(property.id)}
                                                    className="p-2 hover:bg-brand-background dark:hover:bg-gray-700 rounded transition-colors"
                                                    title="Toggle Status"
                                                >
                                                    ⚙️
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(property.id)}
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
                                        No properties found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {properties && properties.links && properties.links.length > 3 && (
                    <div className="mt-6 flex justify-center gap-2">
                        {properties.links.map((link, index) => (
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
