import { Check } from "lucide-react";

const STEPS = [
    { key: "flights", label: "Flight" },
    { key: "travelers", label: "Travelers" },
    { key: "seats", label: "Seats" },
    { key: "addons", label: "Bags" },
    { key: "review", label: "Payment" },
];

export default function AirBookingSteps({ current }) {
    const currentIndex = STEPS.findIndex((s) => s.key === current);

    return (
        <div className="flex items-center mb-8 overflow-x-auto no-scrollbar pb-1">
            {STEPS.map((step, i) => {
                const done = i < currentIndex;
                const active = i === currentIndex;
                return (
                    <div key={step.key} className="flex items-center flex-shrink-0">
                        <div className="flex flex-col items-center gap-1.5">
                            <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                                    done
                                        ? "bg-emerald-500 text-white"
                                        : active
                                        ? "bg-sky-500 text-white"
                                        : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                                }`}
                            >
                                {done ? <Check className="w-3.5 h-3.5" /> : i + 1}
                            </div>
                            <span
                                className={`text-[11px] font-medium whitespace-nowrap ${
                                    active ? "text-gray-900 dark:text-gray-100" : "text-gray-400 dark:text-gray-500"
                                }`}
                            >
                                {step.label}
                            </span>
                        </div>
                        {i < STEPS.length - 1 && (
                            <div className={`w-10 md:w-16 h-[2px] mx-1 mb-4 ${done ? "bg-emerald-400" : "bg-gray-200 dark:bg-gray-700"}`} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
