import AppLayout from "@/Layouts/AppLayout";
import AirBookingSteps from "@/Components/AirBookingSteps";
import { router } from "@inertiajs/react";
import { useState } from "react";
import { Luggage, Zap, ShieldCheck } from "lucide-react";

export default function AddOns({ booking, catalog, selected }) {
    const [extraBags, setExtraBags] = useState(selected.extra_bags || 0);
    const [priorityBoarding, setPriorityBoarding] = useState(selected.priority_boarding || false);
    const [insuranceChoice, setInsuranceChoice] = useState(
        selected.travel_insurance ? "add" : null
    );
    const [submitting, setSubmitting] = useState(false);

    const total =
        extraBags * catalog.extra_bag.unit_price +
        (priorityBoarding ? catalog.priority_boarding.unit_price * booking.passenger_count : 0) +
        (insuranceChoice === "add" ? catalog.travel_insurance.unit_price * booking.passenger_count : 0);

    const handleContinue = () => {
        setSubmitting(true);
        router.post(
            route("air-booking.checkout.addons.store", booking.id),
            {
                extra_bags: extraBags,
                priority_boarding: priorityBoarding,
                travel_insurance: insuranceChoice === "add",
            },
            { onFinish: () => setSubmitting(false) }
        );
    };

    return (
        <AppLayout>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Baggage &amp; Add-ons</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Optional extras for this booking</p>

            <AirBookingSteps current="addons" />

            <div className="max-w-2xl space-y-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <Luggage className="w-5 h-5 text-sky-500 mt-0.5" />
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-gray-100">{catalog.extra_bag.label}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">₹{catalog.extra_bag.unit_price} per bag</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setExtraBags((n) => Math.max(0, n - 1))}
                            className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold"
                        >
                            −
                        </button>
                        <span className="w-6 text-center font-semibold text-gray-900 dark:text-gray-100 tnum">{extraBags}</span>
                        <button
                            type="button"
                            onClick={() => setExtraBags((n) => Math.min(10, n + 1))}
                            className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold"
                        >
                            +
                        </button>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <Zap className="w-5 h-5 text-amber-500 mt-0.5" />
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-gray-100">{catalog.priority_boarding.label}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">₹{catalog.priority_boarding.unit_price} × {booking.passenger_count} passenger(s)</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setPriorityBoarding((v) => !v)}
                        className={`relative w-11 h-6 rounded-full transition-colors ${priorityBoarding ? "bg-sky-500" : "bg-gray-300 dark:bg-gray-600"}`}
                        aria-pressed={priorityBoarding}
                        aria-label="Toggle priority boarding"
                    >
                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${priorityBoarding ? "translate-x-5" : ""}`} />
                    </button>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5">
                    <div className="flex items-start gap-3 mb-4">
                        <ShieldCheck className="w-5 h-5 text-emerald-500 mt-0.5" />
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-gray-100">{catalog.travel_insurance.label}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                ₹{catalog.travel_insurance.unit_price} × {booking.passenger_count} passenger(s) · Optional, doesn't affect your booking
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setInsuranceChoice("add")}
                            className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition-colors ${
                                insuranceChoice === "add"
                                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                                    : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
                            }`}
                        >
                            Add protection
                        </button>
                        <button
                            type="button"
                            onClick={() => setInsuranceChoice("decline")}
                            className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition-colors ${
                                insuranceChoice === "decline"
                                    ? "border-gray-400 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                                    : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
                            }`}
                        >
                            No thanks
                        </button>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 flex items-center justify-between">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">Add-ons total</span>
                    <span className="font-bold text-gray-900 dark:text-gray-100 tnum">₹{total.toLocaleString()}</span>
                </div>

                <button
                    onClick={handleContinue}
                    disabled={submitting}
                    className="w-full py-3 rounded-xl font-semibold bg-sky-500 text-white hover:bg-sky-600 transition-colors disabled:opacity-60"
                >
                    {submitting ? "Saving..." : "Continue to Review & Payment"}
                </button>
            </div>
        </AppLayout>
    );
}
