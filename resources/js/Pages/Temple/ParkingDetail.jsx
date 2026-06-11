import AppLayout from "@/Layouts/AppLayout";
import { usePage, router } from "@inertiajs/react";
import { useState } from "react";

const Icon = {
    MapPin: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
        >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    ),
    Phone: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
        >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
    ),
    Mail: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
        >
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
    ),
    Clock: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
        >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    ),
    Star: () => (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth={2}
            className="w-4 h-4"
        >
            <polygon points="12 2 15.09 10.26 24 10.26 17.55 15.74 19.64 24 12 19.52 4.36 24 6.45 15.74 0 10.26 8.91 10.26 12 2" />
        </svg>
    ),
    ChevronLeft: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
        >
            <polyline points="15 18 9 12 15 6" />
        </svg>
    ),
    ChevronRight: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
        >
            <polyline points="9 18 15 12 9 6" />
        </svg>
    ),
    Bike: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
        >
            <circle cx="5.5" cy="17.5" r="3.5" />
            <circle cx="18.5" cy="17.5" r="3.5" />
            <path d="M15 6a1 1 0 0 0-1 1v5.5h2.5L12 6h-1" />
            <path d="M5.5 14H10l4-8" />
        </svg>
    ),
    Car: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
        >
            <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-2" />
            <circle cx="7.5" cy="17.5" r="2.5" />
            <circle cx="17.5" cy="17.5" r="2.5" />
        </svg>
    ),
    CCTV: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
        >
            <path d="m17 17 4 4" />
            <path d="M3.268 12.043A8 8 0 0 0 17 17l4 4" />
            <path d="M3 7v4a1 1 0 0 0 1 1h4" />
            <path d="M7 7V3" />
        </svg>
    ),
    Shield: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
    ),
    Home: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
        >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        </svg>
    ),
    Zap: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
        >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
    ),
    Download: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
        >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
    ),
};

const amenityIcons = {
    CCTV: Icon.CCTV,
    Security: Icon.Shield,
    Covered: Icon.Home,
    "EV Charging": Icon.Zap,
};

const FALLBACK =
    "https://images.unsplash.com/photo-1468817814611-b7edf94b5d60?w=500&h=300&fit=crop";

export default function ParkingDetail({ parking = {} }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [imageIndex, setImageIndex] = useState(0);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [rating, setRating] = useState(5);
    const [reviewText, setReviewText] = useState("");

    const images = parking.gallery || [parking.image || FALLBACK];

    const nextImage = () => {
        setImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleBooking = () => {
        if (!user) {
            router.visit("/login");
            return;
        }
        // Redirect to booking page
        router.visit(`/parking/${parking.id}/book`);
    };

    const handleReviewSubmit = () => {
        // Handle review submission
        setReviewText("");
        setRating(5);
        setShowReviewForm(false);
    };

    const availabilityColor = (available, total) => {
        const pct = (available / total) * 100;
        if (pct > 50)
            return {
                bg: "bg-emerald-100 dark:bg-emerald-950/30",
                text: "text-emerald-700 dark:text-emerald-300",
                bar: "bg-emerald-500",
            };
        if (pct > 20)
            return {
                bg: "bg-amber-100 dark:bg-amber-950/30",
                text: "text-amber-700 dark:text-amber-300",
                bar: "bg-amber-400",
            };
        return {
            bg: "bg-red-100 dark:bg-red-950/30",
            text: "text-red-700 dark:text-red-300",
            bar: "bg-red-500",
        };
    };

    const avail = availabilityColor(
        parking.availableSpots || 0,
        parking.totalSpots || 1,
    );
    const availPct = Math.round(
        ((parking.availableSpots || 0) / (parking.totalSpots || 1)) * 100,
    );

    return (
        <AppLayout>
            {/* ── BACK BUTTON ── */}
            <button
                onClick={() => router.visit("/temple/parking")}
                className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-6 transition"
            >
                <Icon.ChevronLeft />
                Back to Parkings
            </button>

            {/* ── IMAGE GALLERY ── */}
            <div className="relative h-96 bg-gray-100 dark:bg-gray-700 rounded-2xl overflow-hidden mb-6">
                <img
                    src={images[imageIndex] || FALLBACK}
                    alt={parking.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.src = FALLBACK;
                    }}
                />

                {images.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 text-gray-900 dark:text-white p-2 rounded-full transition"
                        >
                            <Icon.ChevronLeft />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 text-gray-900 dark:text-white p-2 rounded-full transition"
                        >
                            <Icon.ChevronRight />
                        </button>

                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                            {images.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setImageIndex(i)}
                                    className={`w-2 h-2 rounded-full transition ${
                                        i === imageIndex
                                            ? "bg-white"
                                            : "bg-white/50"
                                    }`}
                                />
                            ))}
                        </div>
                    </>
                )}

                <div className="absolute top-4 right-4 flex gap-2">
                    <span className="bg-gray-900/80 text-white text-sm font-bold px-3 py-1 rounded-full">
                        {parking.vehicleType === "2-Wheeler"
                            ? "2-Wheeler"
                            : parking.vehicleType === "4-Wheeler"
                              ? "4-Wheeler"
                              : "All Vehicles"}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ── MAIN CONTENT ── */}
                <div className="lg:col-span-2">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                            {parking.name}
                        </h1>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Icon.MapPin />
                            <span>
                                {parking.location} · {parking.distance}
                            </span>
                        </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Icon.Star
                                    key={i}
                                    className={
                                        i < Math.floor(parking.rating || 4)
                                            ? "text-yellow-400"
                                            : "text-gray-300"
                                    }
                                />
                            ))}
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            {parking.rating || 4.0} ({parking.reviewCount || 0}{" "}
                            reviews)
                        </span>
                    </div>

                    {/* Availability */}
                    <div className={`p-4 rounded-xl mb-6 ${avail.bg}`}>
                        <div className="flex items-center justify-between mb-2">
                            <span
                                className={`text-sm font-semibold ${avail.text}`}
                            >
                                Availability
                            </span>
                            <span className={`text-lg font-bold ${avail.text}`}>
                                {parking.availableSpots || 0} of{" "}
                                {parking.totalSpots || 0} available
                            </span>
                        </div>
                        <div className="w-full bg-gray-300 dark:bg-gray-600 h-2 rounded-full overflow-hidden">
                            <div
                                className={`h-full ${avail.bar} transition-all`}
                                style={{ width: `${availPct}%` }}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                            About
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            {parking.description ||
                                "Secure and convenient parking facility with modern amenities. Well-maintained parking area with 24/7 security and surveillance. Easy access and quick entry/exit."}
                        </p>
                    </div>

                    {/* Amenities */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                            Amenities
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {(parking.amenities || []).map((amenity, idx) => {
                                const AIcon = amenityIcons[amenity];
                                return (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg"
                                    >
                                        {AIcon && (
                                            <AIcon className="text-gray-600 dark:text-gray-400" />
                                        )}
                                        <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                                            {amenity}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Operating Hours */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                            Operating Hours
                        </h2>
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                <Icon.Clock className="text-gray-400" />
                                <div>
                                    <p className="font-medium">
                                        {parking.operatingHours ||
                                            "24/7 Available"}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Open all day
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                Reviews
                            </h2>
                            <button
                                onClick={() =>
                                    setShowReviewForm(!showReviewForm)
                                }
                                className="text-sm font-medium px-4 py-2 rounded-lg transition"
                                style={{
                                    backgroundColor: "#c33c01",
                                    color: "white",
                                }}
                            >
                                Leave Review
                            </button>
                        </div>

                        {showReviewForm && (
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4 border border-gray-200 dark:border-gray-700">
                                <div className="mb-3">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Rating
                                    </label>
                                    <div className="flex gap-2 mt-2">
                                        {[1, 2, 3, 4, 5].map((r) => (
                                            <button
                                                key={r}
                                                onClick={() => setRating(r)}
                                                className="transition"
                                            >
                                                <Icon.Star
                                                    className={
                                                        r <= rating
                                                            ? "text-yellow-400"
                                                            : "text-gray-300"
                                                    }
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Your Review
                                    </label>
                                    <textarea
                                        value={reviewText}
                                        onChange={(e) =>
                                            setReviewText(e.target.value)
                                        }
                                        placeholder="Share your experience..."
                                        className="w-full mt-2 p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg text-sm focus:outline-none focus:border-orange-500 transition"
                                        rows="4"
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={handleReviewSubmit}
                                        className="flex-1 text-white px-4 py-2 rounded-lg text-sm font-medium transition hover:opacity-90"
                                        style={{ backgroundColor: "#c33c01" }}
                                    >
                                        Submit Review
                                    </button>
                                    <button
                                        onClick={() => setShowReviewForm(false)}
                                        className="flex-1 px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 transition hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            {(parking.reviews || []).map((review, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-gray-100">
                                                {review.name}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {review.date}
                                            </p>
                                        </div>
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Icon.Star
                                                    key={i}
                                                    className={
                                                        i < review.rating
                                                            ? "text-yellow-400"
                                                            : "text-gray-300"
                                                    }
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {review.comment}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── SIDEBAR ── */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6 space-y-4">
                        {/* Pricing Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
                            <div className="mb-4">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                    Hourly Rate
                                </p>
                                <p
                                    className="text-3xl font-bold"
                                    style={{ color: "#c33c01" }}
                                >
                                    ₹{parking.hourlyRate || 50}
                                    <span className="text-base font-normal text-gray-600 dark:text-gray-400">
                                        /hr
                                    </span>
                                </p>
                            </div>

                            {parking.dailyRate && (
                                <div className="mb-4">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                        Daily Rate
                                    </p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        ₹{parking.dailyRate}
                                    </p>
                                </div>
                            )}

                            <button
                                onClick={handleBooking}
                                className="w-full text-white px-4 py-3 rounded-lg text-sm font-semibold transition hover:opacity-90 mb-3"
                                style={{ backgroundColor: "#c33c01" }}
                            >
                                Reserve Now
                            </button>

                            <button className="w-full px-4 py-3 rounded-lg text-sm font-semibold border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 transition hover:bg-gray-50 dark:hover:bg-gray-700">
                                Add to Favorites
                            </button>
                        </div>

                        {/* Contact Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                Contact Info
                            </h3>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Icon.Phone className="text-gray-400 flex-shrink-0" />
                                    <a
                                        href={`tel:${parking.phone}`}
                                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition"
                                    >
                                        {parking.phone || "+91 98765 43210"}
                                    </a>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Icon.Mail className="text-gray-400 flex-shrink-0" />
                                    <a
                                        href={`mailto:${parking.email}`}
                                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition break-all"
                                    >
                                        {parking.email || "contact@parking.com"}
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Vehicle Types */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                Supported Vehicles
                            </h3>

                            <div className="space-y-2">
                                {parking.vehicleType === "All" ? (
                                    <>
                                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                            <Icon.Bike className="text-orange-600" />
                                            <span className="text-sm">
                                                2-Wheelers
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                            <Icon.Car className="text-orange-600" />
                                            <span className="text-sm">
                                                4-Wheelers
                                            </span>
                                        </div>
                                    </>
                                ) : parking.vehicleType === "2-Wheeler" ? (
                                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                        <Icon.Bike className="text-orange-600" />
                                        <span className="text-sm">
                                            2-Wheelers Only
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                        <Icon.Car className="text-orange-600" />
                                        <span className="text-sm">
                                            4-Wheelers Only
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
