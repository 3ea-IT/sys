import AdminAppLayout from "@/Layouts/AdminAppLayout";
import { Link, router } from "@inertiajs/react";

export default function PropertyBookingShow({ booking }) {
    const handleUpdateStatus = (newStatus) => {
        const label = newStatus === "cancelled" ? "cancel and refund" : "reinstate";
        if (confirm(`Are you sure you want to ${label} this booking?`)) {
            router.post(route("admin.property-bookings.update-status", booking.id), { status: newStatus });
        }
    };

    return (
        <AdminAppLayout>
            <div className="max-w-3xl mx-auto">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-brand-primary dark:text-gray-100">{booking.booking_reference}</h1>
                    <Link
                        href={route("admin.property-bookings.index")}
                        className="px-4 py-2 bg-brand-background dark:bg-gray-700 text-brand-primary rounded-lg hover:opacity-90 transition-opacity"
                    >
                        Back to List
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="mb-6">
                        <span
                            className={`px-3 py-1 rounded text-sm font-medium ${
                                booking.status === "confirmed"
                                    ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                                    : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                            }`}
                        >
                            {booking.status === "confirmed" ? "Confirmed" : "Cancelled"}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-brand-secondary dark:text-gray-400 mb-2">Customer</label>
                            <p className="text-brand-primary dark:text-gray-200">{booking.customer_name}</p>
                            <p className="text-xs text-brand-secondary dark:text-gray-400">{booking.customer_email}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-brand-secondary dark:text-gray-400 mb-2">Guests</label>
                            <p className="text-brand-primary dark:text-gray-200">{booking.guest_count}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-brand-secondary dark:text-gray-400 mb-2">Property</label>
                            <p className="text-brand-primary dark:text-gray-200">{booking.property_name}</p>
                            <p className="text-xs text-brand-secondary dark:text-gray-400">{booking.property_location}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-brand-secondary dark:text-gray-400 mb-2">Room Type</label>
                            <p className="text-brand-primary dark:text-gray-200">{booking.room_name}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-brand-secondary dark:text-gray-400 mb-2">Check-in</label>
                            <p className="text-brand-primary dark:text-gray-200">{booking.check_in}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-brand-secondary dark:text-gray-400 mb-2">Check-out</label>
                            <p className="text-brand-primary dark:text-gray-200">{booking.check_out}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-brand-secondary dark:text-gray-400 mb-2">Price / Night</label>
                            <p className="text-brand-primary dark:text-gray-200">₹{booking.amount_per_night}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-brand-secondary dark:text-gray-400 mb-2">Total Paid</label>
                            <p className="text-brand-primary dark:text-gray-200">₹{booking.total_amount}</p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <label className="block text-sm font-medium text-brand-secondary dark:text-gray-400 mb-2">Booked On</label>
                        <p className="text-brand-primary dark:text-gray-200">{booking.created_at}</p>
                    </div>

                    <div className="flex gap-3">
                        {booking.status === "confirmed" ? (
                            <button
                                onClick={() => handleUpdateStatus("cancelled")}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                            >
                                Cancel &amp; Refund
                            </button>
                        ) : (
                            <button
                                onClick={() => handleUpdateStatus("confirmed")}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                            >
                                Reinstate Booking
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </AdminAppLayout>
    );
}
