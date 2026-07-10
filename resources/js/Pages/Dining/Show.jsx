import AppLayout from "@/Layouts/AppLayout";
import { Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";
import { MapPin, Star, Users, Calendar, Clock, ArrowLeft, Tag } from "lucide-react";

export default function DiningShow({ restaurant, offers = [] }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const [partySize, setPartySize] = useState(2);
    const [reservationDate, setReservationDate] = useState("");
    const [reservationTime, setReservationTime] = useState("19:00");
    const [submitting, setSubmitting] = useState(false);

    const handleReserve = (e) => {
        e.preventDefault();
        if (!user) {
            router.visit("/login");
            return;
        }
        setSubmitting(true);
        router.post(
            route("dining.book", restaurant.id),
            { party_size: partySize, reservation_date: reservationDate, reservation_time: reservationTime },
            { onFinish: () => setSubmitting(false) }
        );
    };

    return (
        <AppLayout>
            <Link href={route("dining.index")} className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-4">
                <ArrowLeft className="w-4 h-4" /> Back to Dining
            </Link>

            <div
                className="h-56 md:h-72 rounded-2xl bg-gray-200 dark:bg-gray-700 bg-cover bg-center mb-6"
                style={restaurant.image_url ? { backgroundImage: `url(${restaurant.image_url})` } : {}}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{restaurant.name}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {restaurant.location}</span>
                        <span>{restaurant.cuisine}</span>
                        <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-current text-yellow-500" /> {restaurant.rating}</span>
                        <span className="capitalize">{restaurant.price_range}</span>
                    </div>

                    {restaurant.description && (
                        <div className="mb-6">
                            <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">About</h2>
                            <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">{restaurant.description}</p>
                        </div>
                    )}

                    {offers.length > 0 && (
                        <div className="mb-6">
                            <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Offers</h2>
                            <div className="space-y-2">
                                {offers.map((offer) => (
                                    <div key={offer.id} className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/40 rounded-lg p-3">
                                        <Tag className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                {offer.title} {offer.discount_percent ? `— ${offer.discount_percent}% off` : ""}
                                            </p>
                                            {offer.description && <p className="text-xs text-gray-500 dark:text-gray-400">{offer.description}</p>}
                                            {offer.valid_until && <p className="text-xs text-gray-400 mt-1">Valid until {offer.valid_until}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 h-fit">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Reserve a Table</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Free reservation — pay at the restaurant</p>

                    <form onSubmit={handleReserve} className="space-y-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                                Party Size
                            </label>
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-gray-400" />
                                <input
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={partySize}
                                    onChange={(e) => setPartySize(Math.max(1, Number(e.target.value)))}
                                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                                <Calendar className="w-3 h-3 inline mr-1" /> Date
                            </label>
                            <input
                                type="date"
                                required
                                value={reservationDate}
                                onChange={(e) => setReservationDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                                <Clock className="w-3 h-3 inline mr-1" /> Time
                            </label>
                            <input
                                type="time"
                                required
                                value={reservationTime}
                                onChange={(e) => setReservationTime(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-2.5 rounded-xl font-semibold bg-amber-500 text-white hover:bg-amber-600 transition-colors disabled:opacity-60"
                        >
                            {user ? (submitting ? "Reserving..." : "Reserve Table") : "Login to Reserve"}
                        </button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
