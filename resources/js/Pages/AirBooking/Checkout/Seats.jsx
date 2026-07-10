import AppLayout from "@/Layouts/AppLayout";
import AirBookingSteps from "@/Components/AirBookingSteps";
import { router } from "@inertiajs/react";
import { Fragment, useMemo, useState } from "react";
import { Armchair } from "lucide-react";

const SEAT_STYLE = {
    standard: { label: "Standard", swatch: "bg-gray-200 dark:bg-gray-600" },
    extra_legroom: { label: "Extra legroom", swatch: "bg-sky-300 dark:bg-sky-700" },
    exit_row: { label: "Exit row", swatch: "bg-amber-300 dark:bg-amber-700" },
};

export default function Seats({ booking, flight, seats, travelers: initialTravelers }) {
    const [activeTravelerId, setActiveTravelerId] = useState(initialTravelers[0]?.id);
    const [assignments, setAssignments] = useState(() => {
        const map = {};
        initialTravelers.forEach((t) => {
            if (t.seat_id) map[t.id] = t.seat_id;
        });
        return map;
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const rows = useMemo(() => {
        const byRow = {};
        seats.forEach((seat) => {
            const row = seat.seat_number.match(/^\d+/)[0];
            byRow[row] = byRow[row] || [];
            byRow[row].push(seat);
        });
        return Object.entries(byRow).sort((a, b) => Number(a[0]) - Number(b[0]));
    }, [seats]);

    const takenSeatIds = new Set(Object.values(assignments));

    const selectSeat = (seat) => {
        if (seat.occupied) return;
        if (takenSeatIds.has(seat.id) && assignments[activeTravelerId] !== seat.id) return;

        setAssignments((prev) => {
            const next = { ...prev };
            if (next[activeTravelerId] === seat.id) {
                delete next[activeTravelerId];
            } else {
                next[activeTravelerId] = seat.id;
            }
            return next;
        });
    };

    const total = seats
        .filter((s) => Object.values(assignments).includes(s.id))
        .reduce((sum, s) => sum + s.price_addon, 0);

    const handleContinue = () => {
        setSubmitting(true);
        setError(null);
        router.post(
            route("air-booking.checkout.seats.store", booking.id),
            { assignments },
            {
                onError: () => setError("Something went wrong saving your seats."),
                onFinish: () => setSubmitting(false),
            }
        );
    };

    return (
        <AppLayout>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Choose Your Seats</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {flight.airline} {flight.flight_number} {flight.aircraft_type ? `· ${flight.aircraft_type}` : ""}
            </p>

            <AirBookingSteps current="seats" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
                        {initialTravelers.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setActiveTravelerId(t.id)}
                                className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                                    activeTravelerId === t.id
                                        ? "bg-sky-500 border-sky-500 text-white"
                                        : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
                                }`}
                            >
                                {t.first_name || `Traveler`} {t.last_name}
                                {assignments[t.id] && (
                                    <span className="ml-1.5 opacity-80">
                                        · {seats.find((s) => s.id === assignments[t.id])?.seat_number}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-4 mb-4 text-xs text-gray-500 dark:text-gray-400">
                        {Object.entries(SEAT_STYLE).map(([key, s]) => (
                            <span key={key} className="flex items-center gap-1.5">
                                <span className={`w-3 h-3 rounded ${s.swatch} inline-block`} /> {s.label}
                            </span>
                        ))}
                        <span className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded bg-gray-400 dark:bg-gray-500 inline-block opacity-40" /> Taken
                        </span>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 md:p-6">
                        <div className="space-y-2">
                            {rows.map(([row, rowSeats]) => (
                                <div key={row} className="flex items-center gap-2">
                                    <span className="w-5 text-xs text-gray-400 tnum">{row}</span>
                                    <div className="flex gap-1.5">
                                        {rowSeats.map((seat, i) => {
                                            const isSelected = assignments[activeTravelerId] === seat.id;
                                            const isTakenByOther = takenSeatIds.has(seat.id) && !isSelected;
                                            return (
                                                <Fragment key={seat.id}>
                                                    <button
                                                        type="button"
                                                        title={`Seat ${seat.seat_number}, ${SEAT_STYLE[seat.seat_type].label}${seat.price_addon > 0 ? `, +₹${seat.price_addon}` : ""}${seat.occupied ? ", unavailable" : ""}`}
                                                        aria-label={`Seat ${seat.seat_number}, ${SEAT_STYLE[seat.seat_type].label}, ${seat.price_addon > 0 ? `plus rupees ${seat.price_addon}` : "no extra charge"}, ${seat.occupied ? "unavailable" : "available"}`}
                                                        disabled={seat.occupied || isTakenByOther}
                                                        onClick={() => selectSeat(seat)}
                                                        className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${
                                                            seat.occupied || isTakenByOther
                                                                ? "bg-gray-300 dark:bg-gray-600 opacity-40 cursor-not-allowed"
                                                                : isSelected
                                                                ? "bg-emerald-500 text-white"
                                                                : `${SEAT_STYLE[seat.seat_type].swatch} hover:opacity-80`
                                                        }`}
                                                    >
                                                        <Armchair className="w-4 h-4" />
                                                    </button>
                                                    {i === 2 && <span className="w-3" />}
                                                </Fragment>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 h-fit">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Seat selection</h3>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1.5 mb-4">
                        {initialTravelers.map((t) => (
                            <li key={t.id} className="flex justify-between">
                                <span>{t.first_name || "Traveler"} {t.last_name}</span>
                                <span className="tnum">{seats.find((s) => s.id === assignments[t.id])?.seat_number || "—"}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="flex justify-between text-sm font-semibold text-gray-900 dark:text-gray-100 border-t border-gray-100 dark:border-gray-700 pt-3 mb-4">
                        <span>Seats total</span>
                        <span>₹{total.toLocaleString()}</span>
                    </div>
                    {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
                    <button
                        onClick={handleContinue}
                        disabled={submitting}
                        className="w-full py-2.5 rounded-xl font-semibold bg-sky-500 text-white hover:bg-sky-600 transition-colors disabled:opacity-60 mb-2"
                    >
                        {submitting ? "Saving..." : "Continue to Bags"}
                    </button>
                    <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
                        Seats will be auto-assigned at check-in if you skip this step.
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
