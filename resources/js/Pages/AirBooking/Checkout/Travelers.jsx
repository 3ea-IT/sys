import AppLayout from "@/Layouts/AppLayout";
import AirBookingSteps from "@/Components/AirBookingSteps";
import { router } from "@inertiajs/react";
import { useState } from "react";

const emptyTraveler = () => ({
    type: "adult",
    title: "Mr",
    first_name: "",
    last_name: "",
    dob: "",
    passport_number: "",
    passport_expiry: "",
    passport_country: "",
    special_assistance: "",
    meal_preference: "",
});

export default function Travelers({ booking, flight, travelers: initialTravelers }) {
    const [travelers, setTravelers] = useState(
        initialTravelers.map((t) => ({
            type: t.type || "adult",
            title: t.title || "Mr",
            first_name: t.first_name || "",
            last_name: t.last_name || "",
            dob: t.dob || "",
            passport_number: t.passport_number || "",
            passport_expiry: t.passport_expiry || "",
            passport_country: t.passport_country || "",
            special_assistance: t.special_assistance || "",
            meal_preference: t.meal_preference || "",
        }))
    );
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const update = (index, field, value) => {
        setTravelers((prev) => prev.map((t, i) => (i === index ? { ...t, [field]: value } : t)));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        router.post(
            route("air-booking.checkout.travelers.store", booking.id),
            { travelers },
            {
                onError: (errs) => setErrors(errs),
                onFinish: () => setSubmitting(false),
            }
        );
    };

    return (
        <AppLayout>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Traveler Details</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {flight.airline} {flight.flight_number} · {flight.origin} → {flight.destination} · {flight.departure_time}
            </p>

            <AirBookingSteps current="travelers" />

            <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl">
                {travelers.map((traveler, index) => (
                    <fieldset key={index} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5">
                        <legend className="font-semibold text-gray-900 dark:text-gray-100 px-1">Traveler {index + 1}</legend>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                            <select
                                value={traveler.title}
                                onChange={(e) => update(index, "title", e.target.value)}
                                className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white text-sm"
                            >
                                <option>Mr</option>
                                <option>Ms</option>
                                <option>Mrs</option>
                            </select>
                            <select
                                value={traveler.type}
                                onChange={(e) => update(index, "type", e.target.value)}
                                className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white text-sm"
                            >
                                <option value="adult">Adult</option>
                                <option value="child">Child</option>
                                <option value="infant">Infant</option>
                            </select>
                            <input
                                type="date"
                                value={traveler.dob}
                                onChange={(e) => update(index, "dob", e.target.value)}
                                placeholder="Date of birth"
                                className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white text-sm col-span-2 md:col-span-2"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                            <div>
                                <input
                                    type="text"
                                    value={traveler.first_name}
                                    onChange={(e) => update(index, "first_name", e.target.value)}
                                    placeholder="First name (as on ID)"
                                    className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white text-sm"
                                />
                                {errors[`travelers.${index}.first_name`] && (
                                    <p className="text-xs text-red-500 mt-1">{errors[`travelers.${index}.first_name`]}</p>
                                )}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    value={traveler.last_name}
                                    onChange={(e) => update(index, "last_name", e.target.value)}
                                    placeholder="Last name (as on ID)"
                                    className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white text-sm"
                                />
                                {errors[`travelers.${index}.last_name`] && (
                                    <p className="text-xs text-red-500 mt-1">{errors[`travelers.${index}.last_name`]}</p>
                                )}
                            </div>
                        </div>

                        <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
                            Passport details — required for international travel, optional for domestic.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                            <input
                                type="text"
                                value={traveler.passport_number}
                                onChange={(e) => update(index, "passport_number", e.target.value)}
                                placeholder="Passport number"
                                className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white text-sm"
                            />
                            <input
                                type="date"
                                value={traveler.passport_expiry}
                                onChange={(e) => update(index, "passport_expiry", e.target.value)}
                                placeholder="Passport expiry"
                                className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white text-sm"
                            />
                            <input
                                type="text"
                                value={traveler.passport_country}
                                onChange={(e) => update(index, "passport_country", e.target.value)}
                                placeholder="Issuing country"
                                className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white text-sm"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <select
                                value={traveler.special_assistance}
                                onChange={(e) => update(index, "special_assistance", e.target.value)}
                                className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white text-sm"
                            >
                                <option value="">No special assistance needed</option>
                                <option value="wheelchair_ramp">Wheelchair — to aircraft door</option>
                                <option value="wheelchair_cabin">Wheelchair — to cabin seat</option>
                                <option value="visual_assistance">Visual assistance</option>
                                <option value="hearing_assistance">Hearing assistance</option>
                                <option value="medical_equipment">Medical equipment</option>
                            </select>
                            <select
                                value={traveler.meal_preference}
                                onChange={(e) => update(index, "meal_preference", e.target.value)}
                                className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white text-sm"
                            >
                                <option value="">No meal preference</option>
                                <option value="vegetarian">Vegetarian</option>
                                <option value="non_vegetarian">Non-vegetarian</option>
                                <option value="vegan">Vegan</option>
                                <option value="jain">Jain</option>
                            </select>
                        </div>
                    </fieldset>
                ))}

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-xl font-semibold bg-sky-500 text-white hover:bg-sky-600 transition-colors disabled:opacity-60"
                >
                    {submitting ? "Saving..." : "Continue to Seats"}
                </button>
            </form>
        </AppLayout>
    );
}
