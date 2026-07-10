import AppLayout from "@/Layouts/AppLayout";
import { Link, router } from "@inertiajs/react";
import { useState } from "react";
import { ArrowLeft, PlaneTakeoff, PlaneLanding } from "lucide-react";

export default function Change({ booking, flight, alternatives }) {
    const [picked, setPicked] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const diffFor = (tierPrice) => tierPrice * booking.passenger_count - booking.fare_total;

    const handleConfirm = () => {
        if (!picked) return;
        setSubmitting(true);
        router.post(
            route("air-booking.booking.change.confirm", booking.id),
            { new_flight_id: picked.flightId, new_fare_tier: picked.tier },
            { onFinish: () => setSubmitting(false) }
        );
    };

    return (
        <AppLayout>
            <Link href={route("air-booking.booking", booking.id)} className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-4">
                <ArrowLeft className="w-4 h-4" /> Back to booking
            </Link>

            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Change Flight</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Current: {flight.airline} {flight.flight_number} · {flight.origin} → {flight.destination} · {flight.departure_time} · {booking.fare_label} (₹{booking.fare_total.toLocaleString()})
            </p>

            {alternatives.length === 0 ? (
                <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                    No other flights available on this route right now.
                </div>
            ) : (
                <div className="space-y-4 max-w-3xl">
                    {alternatives.map((alt) => (
                        <div key={alt.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
                            <div className="flex items-center justify-between mb-3">
                                <p className="font-semibold text-gray-900 dark:text-gray-100">{alt.airline} · {alt.flight_number}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                    <PlaneTakeoff className="w-3.5 h-3.5" /> {alt.departure_time} <PlaneLanding className="w-3.5 h-3.5 ml-2" /> {alt.arrival_time}
                                </p>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {alt.fare_tiers.map((tier) => {
                                    const diff = diffFor(tier.price);
                                    const isPicked = picked?.flightId === alt.id && picked?.tier === tier.tier;
                                    return (
                                        <button
                                            key={tier.tier}
                                            onClick={() => setPicked({ flightId: alt.id, tier: tier.tier, label: tier.label, price: tier.price, diff })}
                                            className={`text-left p-3 rounded-lg border-2 transition-colors ${
                                                isPicked
                                                    ? "border-sky-500 bg-sky-50 dark:bg-sky-900/20"
                                                    : "border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                                            }`}
                                        >
                                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{tier.label}</p>
                                            <p className="font-bold text-gray-900 dark:text-gray-100 tnum">₹{tier.price.toLocaleString()}</p>
                                            <p className={`text-xs tnum ${diff > 0 ? "text-red-500" : diff < 0 ? "text-emerald-500" : "text-gray-400"}`}>
                                                {diff > 0 ? `+₹${diff.toLocaleString()}` : diff < 0 ? `-₹${Math.abs(diff).toLocaleString()}` : "No change"}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {picked && (
                <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between max-w-3xl mx-auto md:relative md:mt-6 md:rounded-xl md:border">
                    <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{picked.label} — ₹{picked.price.toLocaleString()}</p>
                        <p className={`text-xs tnum ${picked.diff > 0 ? "text-red-500" : picked.diff < 0 ? "text-emerald-500" : "text-gray-400"}`}>
                            {picked.diff > 0
                                ? `You'll pay ₹${picked.diff.toLocaleString()} more`
                                : picked.diff < 0
                                ? `₹${Math.abs(picked.diff).toLocaleString()} will be refunded to your wallet`
                                : "No fare difference"}
                            {" · Seats will need to be reselected at check-in."}
                        </p>
                    </div>
                    <button
                        onClick={handleConfirm}
                        disabled={submitting}
                        className="px-5 py-2.5 rounded-xl font-semibold bg-sky-500 text-white hover:bg-sky-600 transition-colors disabled:opacity-60"
                    >
                        {submitting ? "Confirming..." : "Confirm Change"}
                    </button>
                </div>
            )}
        </AppLayout>
    );
}
