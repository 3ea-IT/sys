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
    WiFi: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
        >
            <path d="M5 12.55a11 11 0 0 1 14.08 0" />
            <path d="M1.42 9a16 16 0 0 1 21.16 0" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <circle cx="12" cy="20" r="1" />
        </svg>
    ),
    Parking: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
        >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
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
    Snowflake: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
        >
            <line x1="2" y1="12" x2="22" y2="12" />
            <line x1="12" y1="2" x2="12" y2="22" />
            <path d="m20 16-4-4 4-4" />
            <path d="m4 8 4 4-4 4" />
            <path d="m16 4-4 4-4-4" />
            <path d="m8 20 4-4 4 4" />
        </svg>
    ),
    Utensils: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
        >
            <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
            <path d="M7 2v20" />
            <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
        </svg>
    ),
};

const amenityIcons = {
    WiFi: Icon.WiFi,
    Parking: Icon.Parking,
    Security: Icon.Shield,
    AC: Icon.Snowflake,
    Restaurant: Icon.Utensils,
    "24/7 Service": Icon.Clock,
};

const FALLBACK =
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop";

export default function StayDetail({ stay = {} }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [imageIndex, setImageIndex] = useState(0);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [rating, setRating] = useState(5);
    const [reviewText, setReviewText] = useState("");

    const images = stay.gallery || [stay.image || FALLBACK];

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
        router.visit(`/stay/${stay.id}/book`);
    };

    const handleReviewSubmit = () => {
        // Handle review submission
        setReviewText("");
        setRating(5);
        setShowReviewForm(false);
    };

    return (
        <AppLayout>
            {/* ── BACK BUTTON ── */}
            <button
                onClick={() => router.visit("/temple/stay")}
                className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-6 transition"
            >
                <Icon.ChevronLeft />
                Back to Stays
            </button>

            {/* ── IMAGE GALLERY ── */}
            <div className="relative h-96 bg-gray-100 dark:bg-gray-700 rounded-2xl overflow-hidden mb-6">
                <img
                    src={images[imageIndex] || FALLBACK}
                    alt={stay.name}
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
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ── MAIN CONTENT ── */}
                <div className="lg:col-span-2">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                            {stay.name}
                        </h1>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Icon.MapPin />
                            <span>
                                {stay.location} · {stay.distance}
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
                                        i < Math.floor(stay.rating || 4)
                                            ? "text-yellow-400"
                                            : "text-gray-300"
                                    }
                                />
                            ))}
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            {stay.rating || 4.0} ({stay.reviewCount || 0}{" "}
                            reviews)
                        </span>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                            About
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            {stay.description}
                        </p>
                    </div>

                    {/* Amenities */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                            Amenities
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {(Array.isArray(stay.amenities)
                                ? stay.amenities
                                : stay.amenities?.split(",") || []
                            ).map((amenity, i) => {
                                const amenityName = amenity.trim();
                                const AmenityIcon =
                                    amenityIcons[amenityName] || Icon.Home;
                                return (
                                    <div
                                        key={i}
                                        className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                    >
                                        <AmenityIcon />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            {amenityName}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Room Types */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                            Room Information
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                    Room Types
                                </p>
                                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                    {stay.roomTypes || 0}
                                </p>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                    Total Rooms
                                </p>
                                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                    {stay.rooms || 0}
                                </p>
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
                                className="text-sm font-medium px-4 py-2 rounded-lg"
                                style={{
                                    backgroundColor: "#c33c01",
                                    color: "white",
                                }}
                            >
                                Write Review
                            </button>
                        </div>

                        {showReviewForm && (
                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mb-4">
                                <div className="mb-3">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                        Rating
                                    </label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((r) => (
                                            <button
                                                key={r}
                                                onClick={() => setRating(r)}
                                                className={`p-2 rounded transition ${
                                                    rating >= r
                                                        ? "text-yellow-400"
                                                        : "text-gray-300"
                                                }`}
                                            >
                                                <Icon.Star />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                        Your Review
                                    </label>
                                    <textarea
                                        value={reviewText}
                                        onChange={(e) =>
                                            setReviewText(e.target.value)
                                        }
                                        placeholder="Share your experience..."
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                                        rows="4"
                                    />
                                </div>
                                <button
                                    onClick={handleReviewSubmit}
                                    className="w-full py-2 rounded-lg font-semibold text-white transition"
                                    style={{ backgroundColor: "#c33c01" }}
                                >
                                    Submit Review
                                </button>
                            </div>
                        )}

                        {stay.reviews && stay.reviews.length > 0 ? (
                            <div className="space-y-3">
                                {stay.reviews.map((review, i) => (
                                    <div
                                        key={i}
                                        className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="flex gap-1">
                                                {[...Array(review.rating)].map(
                                                    (_, idx) => (
                                                        <Icon.Star
                                                            key={idx}
                                                            className="text-yellow-400 w-3 h-3"
                                                        />
                                                    ),
                                                )}
                                            </div>
                                            <span className="text-xs text-gray-500">
                                                {review.author}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            {review.comment}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                                No reviews yet. Be the first to review!
                            </p>
                        )}
                    </div>
                </div>

                {/* ── SIDEBAR ── */}
                <div>
                    {/* Price Card */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 mb-4 sticky top-4">
                        <div className="mb-4">
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
                                Price per night
                            </p>
                            <p
                                className="text-3xl font-bold mb-1"
                                style={{ color: "#c33c01" }}
                            >
                                ₹{stay.price}
                            </p>
                            <p className="text-xs text-gray-400">
                                Excluding taxes & fees
                            </p>
                        </div>

                        <button
                            onClick={handleBooking}
                            className="w-full py-3 rounded-lg font-semibold text-white transition mb-3 hover:opacity-90"
                            style={{ backgroundColor: "#c33c01" }}
                        >
                            Book Now
                        </button>

                        {/* Contact Info */}
                        <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-2">
                                <Icon.Phone className="w-4 h-4 text-gray-400" />
                                <a
                                    href={`tel:${stay.phone}`}
                                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                                >
                                    {stay.phone}
                                </a>
                            </div>
                            <div className="flex items-center gap-2">
                                <Icon.Mail className="w-4 h-4 text-gray-400" />
                                <a
                                    href={`mailto:${stay.email}`}
                                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 break-all"
                                >
                                    {stay.email}
                                </a>
                            </div>
                            <div className="flex items-center gap-2">
                                <Icon.Clock className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {stay.operatingHours}
                                </span>
                            </div>
                        </div>

                        {/* Availability */}
                        <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                            <p className="text-xs text-green-700 dark:text-green-300 font-semibold">
                                ✓ {stay.available || 0} rooms available
                            </p>
                        </div>
                    </div>

                    {/* Temple Info Card */}
                    {stay.temple && (
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-semibold">
                                TEMPLE
                            </p>
                            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                {stay.temple}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                This accommodation is near {stay.temple}. Book
                                your stay for a comfortable pilgrimage
                                experience.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
