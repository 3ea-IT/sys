import AppLayout from "@/Layouts/AppLayout";
import { usePage, router } from "@inertiajs/react";
import { useState } from "react";

export default function VipDetail({ vip = {} }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [showBookingForm, setShowBookingForm] = useState(false);

    const handleBookNow = () => {
        if (!user) {
            router.visit("/login");
            return;
        }
        setShowBookingForm(true);
    };

    const handleConfirmBooking = () => {
        if (!selectedSlot) {
            alert("Please select a time slot");
            return;
        }
        // TODO: Implement booking logic
        alert(
            `Booking confirmed for ${quantity} person(s) in ${selectedSlot.slot} slot`,
        );
    };

    return (
        <AppLayout>
            {/* ── HEADER ── */}
            <div className="mb-8">
                <button
                    onClick={() => router.visit("/temple/vip")}
                    className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-4 flex items-center gap-2"
                >
                    ← Back to VIP Darshan
                </button>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100">
                    {vip.temple_name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
                    Location: {vip.location}
                </p>
            </div>

            {/* ── MAIN IMAGE ── */}
            <div className="relative mb-8 rounded-lg overflow-hidden shadow-lg h-[700px]">
                <img
                    src={vip.image}
                    alt={vip.temple_name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.src = "/banner/kashi-temple.png";
                    }}
                />
                {/* Rating Badge */}
                <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-md flex items-center gap-2">
                    <span className="text-2xl font-bold">★</span>
                    <div>
                        <p className="font-bold text-lg text-gray-900 dark:text-gray-100">
                            {vip.rating}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                            {vip.total_reviews} reviews
                        </p>
                    </div>
                </div>
            </div>

            {/* ── GRID LAYOUT ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* ── LEFT SECTION (Main Content) ── */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Description */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                            About This Experience
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {vip.description}
                        </p>
                    </div>

                    {/* Duration & Basic Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                                Duration
                            </p>
                            <p className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-1">
                                {vip.duration}
                            </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                                Avg Wait
                            </p>
                            <p className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-1">
                                {vip.avg_wait_time}
                            </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                                Daily Slots
                            </p>
                            <p className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-1">
                                {vip.max_slots_daily}
                            </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                                Status
                            </p>
                            <p
                                className={`text-lg font-bold mt-1 ${vip.available ? "text-green-600" : "text-red-600"}`}
                            >
                                {vip.available ? "Available" : "Full"}
                            </p>
                        </div>
                    </div>

                    {/* What's Included */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                            What's Included
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {vip.includes?.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                                >
                                    <span className="text-green-600 text-xl font-bold">
                                        [✓]
                                    </span>
                                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Highlights */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                            Experience Highlights
                        </h2>
                        <ul className="space-y-3">
                            {vip.highlights?.map((highlight, idx) => (
                                <li
                                    key={idx}
                                    className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
                                >
                                    <span className="text-orange-600 text-xl font-bold mt-1">
                                        •
                                    </span>
                                    <span className="leading-relaxed">
                                        {highlight}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* What to Expect */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                            What to Expect
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {vip.what_to_expect}
                        </p>
                    </div>

                    {/* Best Time */}
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                            Best Time to Visit
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 text-lg font-medium">
                            {vip.best_time}
                        </p>
                    </div>

                    {/* Available Timings */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                            Available Time Slots
                        </h2>
                        <div className="space-y-3">
                            {vip.timings?.map((timing, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => setSelectedSlot(timing)}
                                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                        selectedSlot?.slot === timing.slot
                                            ? "border-orange-600 bg-orange-50 dark:bg-orange-900/20"
                                            : "border-gray-200 dark:border-gray-700 hover:border-orange-600"
                                    }`}
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-gray-100">
                                                {timing.slot}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {timing.time}
                                            </p>
                                        </div>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                timing.status === "Available"
                                                    ? "bg-green-200 dark:bg-green-900 text-green-800 dark:text-green-200"
                                                    : timing.status ===
                                                        "Limited"
                                                      ? "bg-yellow-200 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                                                      : "bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200"
                                            }`}
                                        >
                                            {timing.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Amenities */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                            Facilities & Amenities
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {vip.amenities?.map((amenity, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg"
                                >
                                    <span className="text-lg font-bold">
                                        [+]
                                    </span>
                                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                                        {amenity}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── RIGHT SECTION (Booking Card) ── */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                        {/* Pricing */}
                        <div className="mb-6">
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                                VIP Price Per Person
                            </p>
                            <div className="flex items-baseline gap-2">
                                <p className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                                    ₹{vip.vip_price?.toLocaleString()}
                                </p>
                                {vip.regular_price > 0 && (
                                    <p className="text-lg text-gray-500 dark:text-gray-400 line-through">
                                        ₹{vip.regular_price?.toLocaleString()}
                                    </p>
                                )}
                            </div>
                            {vip.regular_price > 0 && (
                                <p className="text-green-600 font-semibold mt-2">
                                    Save ₹
                                    {(
                                        vip.vip_price - vip.regular_price
                                    ).toLocaleString()}
                                </p>
                            )}
                        </div>

                        <hr className="my-6 border-gray-200 dark:border-gray-700" />

                        {/* Slot Selection in Sidebar */}
                        {!showBookingForm && (
                            <div className="mb-6">
                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                    Select Time Slot
                                </p>
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {vip.timings?.map((timing, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() =>
                                                setSelectedSlot(timing)
                                            }
                                            className={`w-full p-3 rounded-lg text-sm font-medium transition-all text-left ${
                                                selectedSlot?.slot ===
                                                timing.slot
                                                    ? "bg-orange-600 text-white"
                                                    : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600"
                                            }`}
                                        >
                                            {timing.slot}
                                            <br />
                                            <span className="text-xs opacity-75">
                                                {timing.time}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity Selection */}
                        {showBookingForm && (
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                    Number of Persons
                                </label>
                                <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 rounded-lg p-2">
                                    <button
                                        onClick={() =>
                                            setQuantity(
                                                Math.max(1, quantity - 1),
                                            )
                                        }
                                        className="px-3 py-2 font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                                    >
                                        −
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) =>
                                            setQuantity(
                                                Math.max(
                                                    1,
                                                    parseInt(e.target.value),
                                                ),
                                            )
                                        }
                                        className="w-12 text-center font-bold bg-transparent text-gray-900 dark:text-gray-100"
                                    />
                                    <button
                                        onClick={() =>
                                            setQuantity(quantity + 1)
                                        }
                                        className="px-3 py-2 font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Total Price */}
                        {showBookingForm && (
                            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="flex justify-between mb-2">
                                    <p className="text-gray-600 dark:text-gray-400">
                                        ₹{vip.vip_price?.toLocaleString()} ×{" "}
                                        {quantity}
                                    </p>
                                    <p className="font-bold text-gray-900 dark:text-gray-100">
                                        ₹
                                        {(
                                            vip.vip_price * quantity
                                        ).toLocaleString()}
                                    </p>
                                </div>
                                <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
                                    <div className="flex justify-between">
                                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                                            Total
                                        </p>
                                        <p className="text-2xl font-bold text-orange-600">
                                            ₹
                                            {(
                                                vip.vip_price * quantity
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            {!showBookingForm ? (
                                <button
                                    onClick={handleBookNow}
                                    className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors"
                                    style={{ backgroundColor: "#c33c01" }}
                                    onMouseEnter={(e) =>
                                        (e.target.style.opacity = "0.9")
                                    }
                                    onMouseLeave={(e) =>
                                        (e.target.style.opacity = "1")
                                    }
                                >
                                    Book Now
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={handleConfirmBooking}
                                        className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors"
                                        style={{ backgroundColor: "#c33c01" }}
                                        onMouseEnter={(e) =>
                                            (e.target.style.opacity = "0.9")
                                        }
                                        onMouseLeave={(e) =>
                                            (e.target.style.opacity = "1")
                                        }
                                    >
                                        Confirm Booking
                                    </button>
                                    <button
                                        onClick={() =>
                                            setShowBookingForm(false)
                                        }
                                        className="w-full py-3 px-4 rounded-lg font-semibold border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        Back
                                    </button>
                                </>
                            )}
                        </div>

                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                            [✓] Secure payment • Free cancellation up to 24
                            hours
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
