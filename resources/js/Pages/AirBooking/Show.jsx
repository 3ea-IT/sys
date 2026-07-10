import AppLayout from "@/Layouts/AppLayout";
import { Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";
import { PlaneTakeoff, PlaneLanding, Clock, Users, ArrowLeft, Check, X, ListChecks } from "lucide-react";

const TIER_STYLE = {
    basic: { border: "border-gray-200 dark:border-gray-700", accent: "text-gray-600 dark:text-gray-300" },
    standard: { border: "border-sky-300 dark:border-sky-700", accent: "text-sky-600 dark:text-sky-400" },
    flex: { border: "border-emerald-300 dark:border-emerald-700", accent: "text-emerald-600 dark:text-emerald-400" },
};

export default function AirBookingShow({ flight }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const [passengerCount, setPassengerCount] = useState(1);
    const [submittingTier, setSubmittingTier] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    const handleSelect = (tier) => {
        if (!user) {
            router.visit("/login");
            return;
        }
        setSubmittingTier(tier);
        router.post(
            route("air-booking.start", flight.id),
            { fare_tier: tier, passenger_count: passengerCount },
            { onFinish: () => setSubmittingTier(null) }
        );
    };

    return (
        <AppLayout>
            <Link href={route("air-booking.index")} className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-4">
                <ArrowLeft className="w-4 h-4" /> Back to Air Booking
            </Link>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {flight.airline} · {flight.flight_number}
            </h1>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 mb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-1">
                            <PlaneTakeoff className="w-4 h-4" /> Origin
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{flight.origin}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{flight.departure_time}</p>
                    </div>
                    <Clock className="w-5 h-5 text-gray-300" />
                    <div className="text-right">
                        <p className="flex items-center justify-end gap-1 text-sm text-gray-500 dark:text-gray-400 mb-1">
                            Destination <PlaneLanding className="w-4 h-4" />
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{flight.destination}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{flight.arrival_time}</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between mb-6">
                <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-300">
                    <span>Duration: {Math.floor(flight.duration_minutes / 60)}h {flight.duration_minutes % 60}m</span>
                    <span className="capitalize">Class: {flight.seat_class}</span>
                </div>
                <button
                    onClick={() => setShowDetails((v) => !v)}
                    className="flex items-center gap-1 text-sm text-sky-600 dark:text-sky-400 font-medium"
                >
                    <ListChecks className="w-4 h-4" /> Flight details
                </button>
            </div>

            {showDetails && (
                <div className="bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 rounded-xl p-4 mb-6 text-sm text-gray-600 dark:text-gray-300 space-y-1.5">
                    <p><b className="text-gray-900 dark:text-gray-100">Aircraft:</b> {flight.aircraft_type || "Not specified"}</p>
                    <p><b className="text-gray-900 dark:text-gray-100">Flight number:</b> {flight.flight_number}</p>
                    <p><b className="text-gray-900 dark:text-gray-100">Operated by:</b> {flight.airline}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 pt-1">Full fare rules for baggage, changes, and refunds are shown per fare below.</p>
                </div>
            )}

            {flight.existing_booking ? (
                <Link
                    href={route("air-booking.booking", flight.existing_booking.id)}
                    className="block text-center w-full py-3 rounded-xl font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors mb-6"
                >
                    View Booking ({flight.existing_booking.booking_reference})
                </Link>
            ) : flight.sold_out ? (
                <div className="text-center w-full py-3 rounded-xl font-semibold bg-gray-200 dark:bg-gray-700 text-gray-500 mb-6">
                    Sold Out
                </div>
            ) : (
                <>
                    <div className="flex items-center gap-3 mb-5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 w-fit">
                        <Users className="w-4 h-4 text-gray-400" />
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Passengers</label>
                        <input
                            type="number"
                            min="1"
                            max={Math.min(9, flight.seats_available)}
                            value={passengerCount}
                            onChange={(e) => setPassengerCount(Math.max(1, Number(e.target.value)))}
                            className="w-16 px-2 py-1 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm text-center"
                        />
                    </div>

                    <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Choose your fare</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {flight.fare_tiers.map((fare) => {
                            const style = TIER_STYLE[fare.tier];
                            return (
                                <div
                                    key={fare.tier}
                                    className={`relative bg-white dark:bg-gray-800 rounded-xl border-2 ${style.border} p-5 flex flex-col`}
                                >
                                    {fare.tier === "standard" && (
                                        <span className="absolute -top-3 left-4 bg-sky-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                            RECOMMENDED
                                        </span>
                                    )}
                                    <p className={`text-sm font-bold uppercase tracking-wide mb-1 ${style.accent}`}>{fare.label}</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                                        ₹{fare.price.toLocaleString()} <span className="text-xs font-normal text-gray-500">/ person</span>
                                    </p>
                                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-5 flex-1">
                                        <li className="flex items-start gap-2">
                                            {fare.baggage_checked_kg > 0 ? <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" /> : <X className="w-4 h-4 text-gray-300 mt-0.5 flex-shrink-0" />}
                                            {fare.baggage_checked_kg > 0 ? `${fare.baggage_checked_kg}kg checked bag` : "No checked bag"}
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                            {fare.baggage_cabin_kg}kg cabin bag
                                        </li>
                                        <li className="flex items-start gap-2">
                                            {fare.seat_selection_included ? <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" /> : <X className="w-4 h-4 text-gray-300 mt-0.5 flex-shrink-0" />}
                                            {fare.seat_selection_included ? "Free seat selection" : "Seat selection at a fee"}
                                        </li>
                                        <li className="flex items-start gap-2">
                                            {fare.refundable ? <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" /> : <X className="w-4 h-4 text-gray-300 mt-0.5 flex-shrink-0" />}
                                            {fare.refundable ? "Fully refundable" : `₹${fare.change_fee.toLocaleString()} change/cancellation fee`}
                                        </li>
                                    </ul>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">{fare.description}</p>
                                    <button
                                        onClick={() => handleSelect(fare.tier)}
                                        disabled={submittingTier !== null}
                                        className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-colors disabled:opacity-60 ${
                                            fare.tier === "standard"
                                                ? "bg-sky-500 text-white hover:bg-sky-600"
                                                : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600"
                                        }`}
                                    >
                                        {!user ? "Login to select" : submittingTier === fare.tier ? "Starting..." : "Select"}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">Full fare rules and taxes are confirmed at checkout.</p>
                </>
            )}
        </AppLayout>
    );
}
