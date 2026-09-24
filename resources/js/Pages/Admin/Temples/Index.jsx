import AdminAppLayout from "@/Layouts/AdminAppLayout";
import { Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";
import {
    Search,
    Plus,
    Edit2,
    Trash2,
    Eye,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

export default function TempleIndex({
    temples,
    search: initialSearch,
    status: initialStatus,
    crowd_level: initialCrowdLevel,
    crowdLevels,
}) {
    const [search, setSearch] = useState(initialSearch);
    const [status, setStatus] = useState(initialStatus);
    const [crowdLevel, setCrowdLevel] = useState(initialCrowdLevel);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route("admin.temples.index"), {
            search,
            status,
            crowd_level: crowdLevel,
        });
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this temple?")) {
            router.delete(route("admin.temples.destroy", id));
        }
    };

    const handleToggleStatus = (id) => {
        router.post(route("admin.temples.toggle-status", id));
    };

    return (
        <AdminAppLayout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-brand-primary dark:text-gray-100 mb-2">
                        Temples Management
                    </h1>
                    <p className="text-brand-secondary dark:text-gray-400">
                        Manage all temple listings and details
                    </p>
                </div>

                {/* Create Button */}
                <div className="mb-6 flex justify-end">
                    <Link
                        href={route("admin.temples.create")}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:opacity-90 transition-opacity"
                    >
                        <Plus className="w-4 h-4" />
                        Add Temple
                    </Link>
                </div>

                {/* Filters */}
                <form
                    onSubmit={handleSearch}
                    className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
                >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div>
                            <label className="block text-sm font-medium text-brand-primary dark:text-gray-200 mb-2">
                                Search
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 w-4 h-4 text-brand-secondary" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search temples..."
                                    className="w-full pl-10 pr-4 py-2 border border-brand-border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-brand-primary dark:text-gray-200 mb-2">
                                Status
                            </label>
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

                        <div>
                            <label className="block text-sm font-medium text-brand-primary dark:text-gray-200 mb-2">
                                Crowd Level
                            </label>
                            <select
                                value={crowdLevel}
                                onChange={(e) => setCrowdLevel(e.target.value)}
                                className="w-full px-4 py-2 border border-brand-border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                            >
                                <option value="all">All Levels</option>
                                {crowdLevels.map((level) => (
                                    <option key={level} value={level}>
                                        {level}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Filter
                        </button>
                    </div>
                </form>

                {/* Desktop table */}
                <div className="hidden overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800 md:block">
                    <div className="overflow-x-auto">
                    <table className="w-full min-w-[980px]">
                        <thead>
                            <tr className="border-b border-brand-border dark:border-gray-700 bg-brand-background dark:bg-gray-900">
                                <th className="px-6 py-3 text-left text-sm font-semibold text-brand-primary dark:text-gray-200">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-brand-primary dark:text-gray-200">
                                    Location
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-brand-primary dark:text-gray-200">
                                    Rating
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-brand-primary dark:text-gray-200">
                                    Crowd Level
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-brand-primary dark:text-gray-200">
                                    Price
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-brand-primary dark:text-gray-200">
                                    VIP
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-brand-primary dark:text-gray-200">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-brand-primary dark:text-gray-200">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-border dark:divide-gray-700">
                            {temples.data && temples.data.length > 0 ? (
                                temples.data.map((temple) => (
                                    <tr
                                        key={temple.id}
                                        className="hover:bg-brand-background dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <td className="px-6 py-4 text-sm text-brand-primary dark:text-gray-300 font-medium">
                                            {temple.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-brand-secondary dark:text-gray-400">
                                            {temple.location}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-brand-primary dark:text-gray-300">
                                            ★ {temple.rating}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
                                                {temple.crowd_level}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-brand-primary dark:text-gray-300">
                                            ₹{temple.instant_price}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-brand-primary dark:text-gray-300">
                                            {temple.has_vip_darshan ? (
                                                <span className="text-green-600 dark:text-green-400">
                                                    Yes
                                                </span>
                                            ) : (
                                                <span className="text-red-600 dark:text-red-400">
                                                    No
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium ${
                                                    temple.status === "active"
                                                        ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                                                        : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                                                }`}
                                            >
                                                {temple.status === "active"
                                                    ? "Active"
                                                    : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex gap-2">
                                                <Link
                                                    href={route(
                                                        "admin.temples.show",
                                                        temple.id,
                                                    )}
                                                    className="p-2 hover:bg-brand-background dark:hover:bg-gray-700 rounded transition-colors"
                                                    title="View"
                                                >
                                                    <Eye className="w-4 h-4 text-brand-primary" />
                                                </Link>
                                                <Link
                                                    href={route(
                                                        "admin.temples.edit",
                                                        temple.id,
                                                    )}
                                                    className="p-2 hover:bg-brand-background dark:hover:bg-gray-700 rounded transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        handleToggleStatus(
                                                            temple.id,
                                                        )
                                                    }
                                                    className="p-2 hover:bg-brand-background dark:hover:bg-gray-700 rounded transition-colors"
                                                    title="Toggle Status"
                                                >
                                                    ⚙️
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(temple.id)
                                                    }
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
                                    <td
                                        colSpan="8"
                                        className="px-6 py-8 text-center text-brand-secondary dark:text-gray-400"
                                    >
                                        No temples found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    </div>
                </div>

                {/* Mobile cards */}
                <div className="divide-y divide-brand-border overflow-hidden rounded-lg bg-white shadow dark:divide-gray-700 dark:bg-gray-800 md:hidden">
                    {temples.data && temples.data.length > 0 ? (
                        temples.data.map((temple) => (
                            <article key={temple.id} className="p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <h2 className="truncate text-sm font-semibold text-brand-primary dark:text-gray-100">
                                            {temple.name}
                                        </h2>
                                        <p className="mt-1 text-xs text-brand-secondary dark:text-gray-400">
                                            {temple.location}
                                        </p>
                                    </div>
                                    <span
                                        className={`shrink-0 rounded px-2 py-1 text-xs font-medium ${
                                            temple.status === "active"
                                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                        }`}
                                    >
                                        {temple.status === "active" ? "Active" : "Inactive"}
                                    </span>
                                </div>

                                <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                                    <div>
                                        <dt className="text-brand-secondary dark:text-gray-500">Rating</dt>
                                        <dd className="mt-0.5 font-medium text-brand-primary dark:text-gray-200">★ {temple.rating}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-brand-secondary dark:text-gray-500">Crowd</dt>
                                        <dd className="mt-0.5 font-medium text-brand-primary dark:text-gray-200">{temple.crowd_level}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-brand-secondary dark:text-gray-500">Price</dt>
                                        <dd className="mt-0.5 font-medium text-brand-primary dark:text-gray-200">₹{temple.instant_price}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-brand-secondary dark:text-gray-500">VIP Darshan</dt>
                                        <dd className={`mt-0.5 font-medium ${temple.has_vip_darshan ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                                            {temple.has_vip_darshan ? "Yes" : "No"}
                                        </dd>
                                    </div>
                                </dl>

                                <div className="mt-4 flex items-center justify-end gap-1 border-t border-brand-border pt-3 dark:border-gray-700">
                                    <Link
                                        href={route("admin.temples.show", temple.id)}
                                        className="rounded p-2 hover:bg-brand-background dark:hover:bg-gray-700"
                                        title="View"
                                    >
                                        <Eye className="h-4 w-4 text-brand-primary" />
                                    </Link>
                                    <Link
                                        href={route("admin.temples.edit", temple.id)}
                                        className="rounded p-2 hover:bg-brand-background dark:hover:bg-gray-700"
                                        title="Edit"
                                    >
                                        <Edit2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    </Link>
                                    <button
                                        onClick={() => handleToggleStatus(temple.id)}
                                        className="rounded p-2 hover:bg-brand-background dark:hover:bg-gray-700"
                                        title="Toggle Status"
                                    >
                                        ⚙️
                                    </button>
                                    <button
                                        onClick={() => handleDelete(temple.id)}
                                        className="rounded p-2 hover:bg-brand-background dark:hover:bg-gray-700"
                                        title="Delete"
                                    >
                                        <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                                    </button>
                                </div>
                            </article>
                        ))
                    ) : (
                        <p className="px-6 py-8 text-center text-sm text-brand-secondary dark:text-gray-400">
                            No temples found
                        </p>
                    )}
                </div>

                {/* Pagination */}
                {temples.links && temples.links.length > 3 && (
                    <div className="mt-6 flex justify-center gap-2">
                        {temples.links.map((link, index) => (
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
