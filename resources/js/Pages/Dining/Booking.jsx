import AppLayout from "@/Layouts/AppLayout";
import { Link, router, usePage } from "@inertiajs/react";
import { CheckCircle2, MapPin, Calendar, Clock, Users } from "lucide-react";

export default function DiningBooking({ booking, restaurant }) {
    const { flash } = usePage().props;

    const handleCancel = () => {
        if (confirm("Cancel this reservation?")) {
            router.post(route("dining.booking.cancel", booking.id));
        }
    };

    return (
        <AppLayout>
            <div className="max-w-xl mx-auto">
                {flash?.success && (
                    <div className="mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm">
                        {flash.success}
                    </div>
                )}

                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                    <div
                        className="h-40 bg-gray-200 dark:bg-gray-700 bg-cover bg-center"
                        style={restaurant.image_url ? { backgroundImage: `url(${restaurant.image_url})` } : {}}
                    />
                    <div className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            {booking.status === "confirmed" ? (
                                <CheckCircle2 className="w-6 h-6 text-green-500" />
                            ) : (
                                <span className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center text-red-600 text-xs font-bold">×</span>
                            )}
                            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                {booking.status === "confirmed" ? "Table Reserved" : "Reservation Cancelled"}
                            </h1>
                        </div>

                        <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{restaurant.name}</h2>
                        <p className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-4">
                            <MapPin className="w-4 h-4" /> {restaurant.location}
                        </p>

                        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                            <div>
                                <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Reference</p>
                                <p className="font-medium text-gray-900 dark:text-gray-100">{booking.booking_reference}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 dark:text-gray-400 text-xs mb-1 flex items-center gap-1">
                                    <Users className="w-3 h-3" /> Party Size
                                </p>
                                <p className="font-medium text-gray-900 dark:text-gray-100">{booking.party_size}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 dark:text-gray-400 text-xs mb-1 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> Date
                                </p>
                                <p className="font-medium text-gray-900 dark:text-gray-100">{booking.reservation_date}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 dark:text-gray-400 text-xs mb-1 flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> Time
                                </p>
                                <p className="font-medium text-gray-900 dark:text-gray-100">{booking.reservation_time}</p>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <Link
                                href={route("dining.index")}
                                className="flex-1 text-center py-2.5 rounded-xl font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                Explore More
                            </Link>
                            {booking.status === "confirmed" && (
                                <button
                                    onClick={handleCancel}
                                    className="flex-1 py-2.5 rounded-xl font-semibold bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                                >
                                    Cancel Reservation
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
