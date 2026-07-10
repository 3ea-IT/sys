import AppLayout from "@/Layouts/AppLayout";
import { Link, router, usePage } from "@inertiajs/react";
import { CheckCircle2, PlaneTakeoff, PlaneLanding, Users, Luggage, ArrowRightLeft } from "lucide-react";

const addonLabel = { extra_bag: "Extra checked bags", priority_boarding: "Priority boarding", travel_insurance: "Travel protection" };

export default function AirBookingBooking({ booking, flight, travelers = [], addons = [] }) {
    const { flash } = usePage().props;

    const handleCancel = () => {
        if (confirm("Cancel this booking?")) {
            router.post(route("air-booking.booking.cancel", booking.id));
        }
    };

    return (
        <AppLayout>
            <div className="max-w-2xl mx-auto">
                {flash?.success && (
                    <div className="mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm">
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm">
                        {flash.error}
                    </div>
                )}

                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                    <div
                        className="h-32 bg-gray-200 dark:bg-gray-700 bg-cover bg-center"
                        style={flight.image_url ? { backgroundImage: `url(${flight.image_url})` } : {}}
                    />
                    <div className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            {booking.status === "confirmed" ? (
                                <CheckCircle2 className="w-6 h-6 text-green-500" />
                            ) : (
                                <span className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center text-red-600 text-xs font-bold">×</span>
                            )}
                            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                {booking.status === "confirmed" ? "Booking Confirmed" : "Booking Cancelled"}
                            </h1>
                            {booking.fare_label && (
                                <span className="ml-auto text-xs font-semibold px-2 py-1 rounded-full bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400">
                                    {booking.fare_label}
                                </span>
                            )}
                        </div>

                        <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                            {flight.airline} · {flight.flight_number}
                        </h2>

                        <div className="flex items-center justify-between mb-4 text-sm">
                            <div>
                                <p className="flex items-center gap-1 text-gray-500 dark:text-gray-400"><PlaneTakeoff className="w-3.5 h-3.5" /> {flight.origin}</p>
                                <p className="text-xs text-gray-400">{flight.departure_time}</p>
                            </div>
                            <div className="text-right">
                                <p className="flex items-center justify-end gap-1 text-gray-500 dark:text-gray-400">{flight.destination} <PlaneLanding className="w-3.5 h-3.5" /></p>
                                <p className="text-xs text-gray-400">{flight.arrival_time}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                            <div>
                                <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Reference</p>
                                <p className="font-medium text-gray-900 dark:text-gray-100 tnum">{booking.booking_reference}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 dark:text-gray-400 text-xs mb-1 flex items-center gap-1">
                                    <Users className="w-3 h-3" /> Passengers
                                </p>
                                <p className="font-medium text-gray-900 dark:text-gray-100">{booking.passenger_count}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Total Paid</p>
                                <p className="font-medium text-gray-900 dark:text-gray-100 tnum">₹{booking.total_amount.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 dark:text-gray-400 text-xs mb-1 flex items-center gap-1">
                                    <Luggage className="w-3 h-3" /> Baggage
                                </p>
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                    {booking.baggage_checked_kg > 0 ? `${booking.baggage_checked_kg}kg checked, ` : ""}{booking.baggage_cabin_kg}kg cabin
                                </p>
                            </div>
                        </div>

                        {travelers.length > 0 && (
                            <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mb-4">
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Travelers</p>
                                <ul className="text-sm text-gray-700 dark:text-gray-200 space-y-1.5">
                                    {travelers.map((t, i) => (
                                        <li key={i} className="flex justify-between">
                                            <span>{t.name || `Traveler ${i + 1}`}</span>
                                            <span className="text-gray-400 tnum">{t.seat_number ? `Seat ${t.seat_number}` : "Auto-assigned"}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {addons.length > 0 && (
                            <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mb-4">
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Add-ons</p>
                                <ul className="text-sm text-gray-700 dark:text-gray-200 space-y-1.5">
                                    {addons.map((a, i) => (
                                        <li key={i} className="flex justify-between">
                                            <span>{addonLabel[a.type]} × {a.quantity}</span>
                                            <span className="text-gray-400 tnum">₹{a.total_price.toLocaleString()}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
                            {booking.refundable
                                ? "This fare is fully refundable."
                                : `Cancellation fee: ₹${booking.change_fee.toLocaleString()}`}
                        </p>

                        <div className="flex gap-3">
                            <Link
                                href={route("air-booking.index")}
                                className="flex-1 text-center py-2.5 rounded-xl font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                Search More Flights
                            </Link>
                            {booking.status === "confirmed" && !flight.is_past && (
                                <Link
                                    href={route("air-booking.booking.change", booking.id)}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-semibold bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-sky-900/50 transition-colors"
                                >
                                    <ArrowRightLeft className="w-4 h-4" /> Change
                                </Link>
                            )}
                            {booking.status === "confirmed" && (
                                <button
                                    onClick={handleCancel}
                                    className="flex-1 py-2.5 rounded-xl font-semibold bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                        <Link
                            href={route("air-booking.my-bookings")}
                            className="block text-center text-xs text-gray-400 dark:text-gray-500 mt-3 hover:text-sky-500"
                        >
                            View all my bookings
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
