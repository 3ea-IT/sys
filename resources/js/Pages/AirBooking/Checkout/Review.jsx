import AppLayout from "@/Layouts/AppLayout";
import AirBookingSteps from "@/Components/AirBookingSteps";
import { router, usePage } from "@inertiajs/react";
import { useState } from "react";
import { Wallet, PlaneTakeoff, PlaneLanding, AlertTriangle } from "lucide-react";

export default function Review({ booking, flight, travelers, addons }) {
    const { flash } = usePage().props;
    const [email, setEmail] = useState(booking.contact_email || "");
    const [phone, setPhone] = useState(booking.contact_phone || "");
    const [submitting, setSubmitting] = useState(false);

    const insufficientFunds = booking.wallet_balance < booking.total_amount;

    const handleConfirm = (e) => {
        e.preventDefault();
        setSubmitting(true);
        router.post(
            route("air-booking.checkout.review.confirm", booking.id),
            { contact_email: email, contact_phone: phone },
            { onFinish: () => setSubmitting(false) }
        );
    };

    const addonLabel = { extra_bag: "Extra checked bags", priority_boarding: "Priority boarding", travel_insurance: "Travel protection" };

    return (
        <AppLayout>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Review &amp; Payment</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Check everything before you pay</p>

            <AirBookingSteps current="review" />

            {flash?.error && (
                <div className="max-w-3xl mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {flash.error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
                <div className="md:col-span-2 space-y-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Itinerary</h3>
                        <div className="flex items-center justify-between text-sm mb-2">
                            <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300"><PlaneTakeoff className="w-3.5 h-3.5" /> {flight.origin}</span>
                            <span className="text-gray-400">{flight.departure_time}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300"><PlaneLanding className="w-3.5 h-3.5" /> {flight.destination}</span>
                            <span className="text-gray-400">{flight.arrival_time}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">{flight.airline} {flight.flight_number} · {booking.fare_label} fare</p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Travelers</h3>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1.5">
                            {travelers.map((t, i) => (
                                <li key={i} className="flex justify-between">
                                    <span>{t.name || `Traveler ${i + 1}`}</span>
                                    <span className="tnum">{t.seat_number ? `Seat ${t.seat_number}` : "Auto-assigned"}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {addons.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Add-ons</h3>
                            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1.5">
                                {addons.map((a, i) => (
                                    <li key={i} className="flex justify-between">
                                        <span>{addonLabel[a.type]} × {a.quantity}</span>
                                        <span className="tnum">₹{a.total_price.toLocaleString()}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <form onSubmit={handleConfirm} id="review-form" className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Contact details</h3>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">We'll send your confirmation and boarding updates here.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email address"
                                className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white text-sm"
                            />
                            <input
                                type="tel"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Phone number"
                                className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white text-sm"
                            />
                        </div>
                    </form>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 h-fit">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Price summary</h3>
                    <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                        <div className="flex justify-between"><span>Fare ({booking.passenger_count}x)</span><span className="tnum">₹{booking.fare_total.toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>Seats</span><span className="tnum">₹{booking.seats_total.toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>Add-ons</span><span className="tnum">₹{booking.addons_total.toLocaleString()}</span></div>
                    </div>
                    <div className="flex justify-between font-bold text-gray-900 dark:text-gray-100 border-t border-gray-100 dark:border-gray-700 pt-3 mb-4">
                        <span>Total</span>
                        <span className="tnum">₹{booking.total_amount.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/40 rounded-lg px-3 py-2 mb-4">
                        <span className="flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5" /> Wallet balance</span>
                        <span className="tnum">₹{booking.wallet_balance.toLocaleString()}</span>
                    </div>

                    {insufficientFunds && (
                        <p className="text-xs text-red-500 mb-3">Insufficient wallet balance to complete this booking.</p>
                    )}

                    <button
                        type="submit"
                        form="review-form"
                        disabled={submitting || insufficientFunds}
                        className="w-full py-3 rounded-xl font-semibold bg-sky-500 text-white hover:bg-sky-600 transition-colors disabled:opacity-60"
                    >
                        {submitting ? "Processing payment — don't close this window..." : `Confirm & Pay ₹${booking.total_amount.toLocaleString()}`}
                    </button>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 text-center">
                        By continuing you agree to the fare rules for this booking.
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
