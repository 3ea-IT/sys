import AppLayout from "@/Layouts/AppLayout";
import { Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";
import { MapPin, Star, Clock, Users, ArrowLeft } from "lucide-react";

export default function TourismShow({ package: pkg }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const [partySize, setPartySize] = useState(1);
    const [travelDate, setTravelDate] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleBook = (e) => {
        e.preventDefault();
        if (!user) {
            router.visit("/login");
            return;
        }
        setSubmitting(true);
        router.post(
            route("tourism.spiritual.book", pkg.id),
            { party_size: partySize, travel_date: travelDate || null },
            { onFinish: () => setSubmitting(false) }
        );
    };

    return (
        <AppLayout>
            <Link href={route("tourism.spiritual.index")} className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-4">
                <ArrowLeft className="w-4 h-4" /> Back to Spiritual Tourism
            </Link>

            <div
                className="h-56 md:h-72 rounded-2xl bg-gray-200 dark:bg-gray-700 bg-cover bg-center mb-6"
                style={pkg.image_url ? { backgroundImage: `url(${pkg.image_url})` } : {}}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{pkg.name}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {pkg.location}</span>
                        {pkg.duration && <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {pkg.duration}</span>}
                        <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-current text-yellow-500" /> {pkg.rating}</span>
                    </div>

                    {pkg.description && (
                        <div className="mb-6">
                            <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">About this package</h2>
                            <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">{pkg.description}</p>
                        </div>
                    )}

                    {pkg.itinerary && pkg.itinerary.length > 0 && (
                        <div className="mb-6">
                            <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Itinerary</h2>
                            <ul className="space-y-2">
                                {pkg.itinerary.map((item, idx) => (
                                    <li key={idx} className="text-sm text-gray-600 dark:text-gray-300 flex gap-2">
                                        <span className="font-semibold text-orange-600 dark:text-orange-400">Day {idx + 1}</span>
                                        <span>{typeof item === "string" ? item : item.description}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 h-fit">
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                        ₹{pkg.price.toLocaleString()} <span className="text-sm font-normal text-gray-500">/ person</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                        {pkg.available_slots} slot(s) remaining
                    </p>

                    {pkg.existing_booking ? (
                        <Link
                            href={route("tourism.spiritual.booking", pkg.existing_booking.id)}
                            className="block text-center w-full py-2.5 rounded-xl font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors"
                        >
                            View Booking ({pkg.existing_booking.booking_reference})
                        </Link>
                    ) : pkg.sold_out ? (
                        <button disabled className="w-full py-2.5 rounded-xl font-semibold bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed">
                            Sold Out
                        </button>
                    ) : (
                        <form onSubmit={handleBook} className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                                    Travellers
                                </label>
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-gray-400" />
                                    <input
                                        type="number"
                                        min="1"
                                        max={pkg.available_slots}
                                        value={partySize}
                                        onChange={(e) => setPartySize(Math.max(1, Number(e.target.value)))}
                                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                                    Travel Date (optional)
                                </label>
                                <input
                                    type="date"
                                    value={travelDate}
                                    onChange={(e) => setTravelDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm"
                                />
                            </div>
                            <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                                Total: ₹{(pkg.price * partySize).toLocaleString()}
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-2.5 rounded-xl font-semibold bg-orange-500 text-white hover:bg-orange-600 transition-colors disabled:opacity-60"
                            >
                                {user ? (submitting ? "Booking..." : "Book Now") : "Login to Book"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
