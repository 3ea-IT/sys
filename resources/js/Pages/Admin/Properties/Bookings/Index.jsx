import AdminAppLayout from "@/Layouts/AdminAppLayout";
import { Link, router } from "@inertiajs/react";
import { useState } from "react";
import { Search, Eye } from "lucide-react";

export default function PropertyBookingIndex({ bookings, search: initialSearch, status: initialStatus }) {
    const [search, setSearch] = useState(initialSearch);
    const [status, setStatus] = useState(initialStatus);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route("admin.property-bookings.index"), { search, status });
    };

    const handleUpdateStatus = (id, newStatus) => {
        const label = newStatus === "cancelled" ? "cancel and refund" : "reinstate";
        if (confirm(`Are you sure you want to ${label} this booking?`)) {
            router.post(route("admin.property-bookings.update-status", id), { status: newStatus });
        }
    };

    return (
        <AdminAppLayout>
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-brand-primary dark:text-gray-100 mb-2">
                        Accommodation Bookings
                    </h1>
                    <p className="text-brand-secondary dark:text-gray-400">
                        View and manage all Accommodation bookings
                    </p>
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
                                    placeholder="Reference or customer name..."
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
                                <option value="confirmed">Confirmed</option>
                                <option value="cancelled">Cancelled</option>
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
                                <th className="px-6 py-3 text-left text-sm font-semibold text-brand-primary dark:text-gray-200">Booking</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-brand-primary dark:text-gray-200">Customer</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-brand-primary dark:text-gray-200">Property / Room</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-brand-primary dark:text-gray-200">Check-in</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-brand-primary dark:text-gray-200">Check-out</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-brand-primary dark:text-gray-200">Status</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-brand-primary dark:text-gray-200">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-border dark:divide-gray-700">
                            {bookings?.data?.length > 0 ? (
                                bookings.data.map((b) => (
                                    <tr key={b.id} className="hover:bg-brand-background dark:hover:bg-gray-700 transition-colors">
                                        <td className="px-6 py-4 text-sm text-brand-primary dark:text-gray-300 font-medium">{b.booking_reference}</td>
                                        <td className="px-6 py-4 text-sm text-brand-secondary dark:text-gray-400">{b.customer_name}</td>
                                        <td className="px-6 py-4 text-sm text-brand-secondary dark:text-gray-400">{b.property_name} — {b.room_name}</td>
                                        <td className="px-6 py-4 text-sm text-brand-primary dark:text-gray-300">{b.check_in}</td>
                                        <td className="px-6 py-4 text-sm text-brand-primary dark:text-gray-300">{b.check_out}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium ${
                                                    b.status === "confirmed"
                                                        ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                                                        : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                                                }`}
                                            >
                                                {b.status === "confirmed" ? "Confirmed" : "Cancelled"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex gap-2">
                                                <Link
                                                    href={route("admin.property-bookings.show", b.id)}
                                                    className="p-2 hover:bg-brand-background dark:hover:bg-gray-700 rounded transition-colors"
                                                    title="View"
                                                >
                                                    <Eye className="w-4 h-4 text-brand-primary" />
                                                </Link>
                                                {b.status === "confirmed" ? (
                                                    <button
                                                        onClick={() => handleUpdateStatus(b.id, "cancelled")}
                                                        className="px-2 py-1 text-xs font-medium rounded bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50"
                                                    >
                                                        Cancel
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleUpdateStatus(b.id, "confirmed")}
                                                        className="px-2 py-1 text-xs font-medium rounded bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50"
                                                    >
                                                        Reinstate
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-brand-secondary dark:text-gray-400">
                                        No bookings found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {bookings?.links?.length > 3 && (
                    <div className="mt-6 flex justify-center gap-2">
                        {bookings.links.map((link, index) => (
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
