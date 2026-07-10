import AppLayout from "@/Layouts/AppLayout";
import { Link } from "@inertiajs/react";
import { PlaneTakeoff, PlaneLanding } from "lucide-react";

const statusStyle = {
    confirmed: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
    cancelled: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200",
};

export default function MyBookings({ bookings }) {
    const data = bookings.data || [];

    return (
        <AppLayout>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">My Flight Bookings</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">All your Air Booking trips in one place</p>

            {data.length === 0 ? (
                <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                    You haven't booked any flights yet.
                    <Link href={route("air-booking.index")} className="block mt-2 text-sky-600 dark:text-sky-400 font-medium">
                        Search flights
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {data.map((booking) => (
                        <Link
                            key={booking.id}
                            href={route("air-booking.booking", booking.id)}
                            className="flex flex-col md:flex-row md:items-center justify-between bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 hover:shadow-md transition-shadow gap-3"
                        >
                            <div>
                                <p className="font-semibold text-gray-900 dark:text-gray-100">
                                    {booking.flight.airline} · {booking.flight.flight_number}
                                </p>
                                <p className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                    <PlaneTakeoff className="w-3.5 h-3.5" /> {booking.flight.origin}
                                    <span className="mx-1">→</span>
                                    <PlaneLanding className="w-3.5 h-3.5" /> {booking.flight.destination}
                                </p>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                                <p>{booking.flight.departure_time}</p>
                                <p className="text-xs text-gray-400 tnum">{booking.booking_reference}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-gray-900 dark:text-gray-100 tnum">₹{booking.total_amount.toLocaleString()}</p>
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusStyle[booking.status]}`}>
                                    {booking.status === "confirmed" ? "Confirmed" : "Cancelled"}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {bookings.links && bookings.links.length > 3 && (
                <div className="mt-6 flex justify-center gap-2">
                    {bookings.links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.url || "#"}
                            className={`px-3 py-2 rounded transition-colors text-sm ${
                                link.active
                                    ? "bg-sky-500 text-white"
                                    : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}
        </AppLayout>
    );
}
