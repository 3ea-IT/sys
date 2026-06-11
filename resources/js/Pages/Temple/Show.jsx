import AppLayout from "@/Layouts/AppLayout";
import { Link, usePage, router } from "@inertiajs/react";
import { useState } from "react";

const Icon = {
    Back: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
        >
            <path d="m15 18-6-6 6-6" />
        </svg>
    ),
    MapPin: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3.5 h-3.5"
        >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    ),
    Star: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    ),
    Users: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
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
    Crown: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
        >
            <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7z" />
            <path d="M5 20h14" />
        </svg>
    ),
    Check: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3.5 h-3.5"
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    ),
    StarFill: ({ half = false, className = "w-4 h-4" }) => (
        <svg
            viewBox="0 0 24 24"
            fill={half ? "none" : "currentColor"}
            stroke="currentColor"
            strokeWidth={1.5}
            className={className}
        >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
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
    Restroom: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
        >
            <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
            <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
            <path d="m16 7 2 2 4-4" />
        </svg>
    ),
    Food: () => (
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
            <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
        </svg>
    ),
    Gift: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
        >
            <polyline points="20 12 20 22 4 22 4 12" />
            <rect x="2" y="7" width="20" height="5" />
            <line x1="12" y1="22" x2="12" y2="7" />
            <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
            <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
        </svg>
    ),
    Water: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
        >
            <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
        </svg>
    ),
    Aid: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
        >
            <path d="M8 3H5a2 2 0 0 0-2 2v3" />
            <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
            <path d="M3 16v3a2 2 0 0 0 2 2h3" />
            <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
    ),
};

export default function TempleShow({ temple = {} }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [activeTab, setActiveTab] = useState("overview");

    const getPosterSrc = (image) => {
        if (!image)
            return "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=400&fit=crop";
        if (image.startsWith("http") || image.startsWith("/")) return image;
        return `/assets/temples/${image}`;
    };

    const handleBookDarshan = (type) => {
        if (!user) {
            router.visit("/login");
            return;
        }
        router.visit(`/temple/${temple.id}/book`, {
            state: { darshan_type: type },
        });
    };

    const crowdConfig = {
        Low: {
            bg: "bg-emerald-50 dark:bg-emerald-950/30",
            text: "text-emerald-700 dark:text-emerald-300",
            dot: "bg-emerald-500",
        },
        Moderate: {
            bg: "bg-amber-50 dark:bg-amber-950/30",
            text: "text-amber-700 dark:text-amber-300",
            dot: "bg-amber-400",
        },
        High: {
            bg: "bg-red-50 dark:bg-red-950/30",
            text: "text-red-700 dark:text-red-300",
            dot: "bg-red-500",
        },
    };
    const crowd = crowdConfig[temple.crowd_level] || crowdConfig.Moderate;

    const tabs = ["overview", "timings", "facilities", "reviews"];

    return (
        <AppLayout>
            {/* ── BACK ── */}
            <Link
                href="/temple"
                className="inline-flex items-center gap-1.5 text-xs font-semibold mb-4 hover:underline"
                style={{ color: "#c33c01" }}
            >
                <Icon.Back /> Back to Temples
            </Link>

            {/* ── HERO ── */}
            <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden shadow-md mb-5">
                <img
                    src={getPosterSrc(temple.image)}
                    alt={temple.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.src =
                            "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=400&fit=crop";
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5 md:p-6">
                    <h1 className="text-xl md:text-3xl font-bold text-white mb-1">
                        {temple.name}
                    </h1>
                    <p className="flex items-center gap-1 text-white/75 text-xs">
                        <Icon.MapPin />
                        {temple.location}
                    </p>
                </div>
            </div>

            {/* ── STAT CHIPS ── */}
            <div className="flex gap-2 flex-wrap mb-5">
                <div className="flex items-center gap-1.5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-full px-3 py-1.5 shadow-sm">
                    <span className="text-amber-400">
                        <Icon.Star />
                    </span>
                    <span className="text-xs font-bold text-gray-900 dark:text-gray-100">
                        {temple.rating || 4.5}
                    </span>
                    <span className="text-xs text-gray-400">Rating</span>
                </div>
                <div
                    className={`flex items-center gap-1.5 ${crowd.bg} rounded-full px-3 py-1.5`}
                >
                    <span
                        className={`w-2 h-2 rounded-full ${crowd.dot}`}
                    ></span>
                    <span className={`text-xs font-semibold ${crowd.text}`}>
                        {temple.crowd_level || "Normal"} Crowd
                    </span>
                </div>
                <div className="flex items-center gap-1.5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-full px-3 py-1.5 shadow-sm">
                    <span className="text-gray-400">
                        <Icon.Clock />
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                        Open Daily
                    </span>
                </div>
                {temple.has_vip_darshan && (
                    <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-full px-3 py-1.5">
                        <span className="text-amber-500">
                            <Icon.Crown />
                        </span>
                        <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                            VIP Available
                        </span>
                    </div>
                )}
            </div>

            {/* ── TABS ── */}
            <div className="flex gap-0 border-b border-gray-200 dark:border-gray-700 mb-5 overflow-x-auto no-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all capitalize ${
                            activeTab === tab
                                ? "border-transparent"
                                : "text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-800 dark:hover:text-gray-200"
                        }`}
                        style={
                            activeTab === tab
                                ? {
                                      color: "#c33c01",
                                      borderBottomColor: "#c33c01",
                                  }
                                : {}
                        }
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* ── TAB CONTENT ── */}
            <div className="mb-6">
                {activeTab === "overview" && (
                    <div className="space-y-3">
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                About This Temple
                            </h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                {temple.description ||
                                    "One of the most sacred and ancient temples in India. Experience the divine spirituality and participate in age-old rituals and ceremonies."}
                            </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                Amenities
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {(
                                    temple.amenities || [
                                        "Parking",
                                        "Restrooms",
                                        "Prasad Counter",
                                        "Lockers",
                                        "Food Court",
                                        "Gift Shop",
                                    ]
                                ).map((a, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-2"
                                    >
                                        <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                                            <Icon.Check />
                                        </span>
                                        <span className="text-xs text-gray-700 dark:text-gray-300">
                                            {a}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "timings" && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                            Darshan Timings
                        </h3>
                        <div className="space-y-2">
                            {(
                                temple.timings || [
                                    {
                                        name: "Morning Darshan",
                                        time: "5:00 AM – 10:00 AM",
                                        type: "Regular",
                                    },
                                    {
                                        name: "Afternoon Darshan",
                                        time: "12:00 PM – 3:00 PM",
                                        type: "Regular",
                                    },
                                    {
                                        name: "Evening Aarti",
                                        time: "6:00 PM – 7:00 PM",
                                        type: "Special",
                                    },
                                    {
                                        name: "Night Darshan",
                                        time: "8:00 PM – 11:00 PM",
                                        type: "Regular",
                                    },
                                ]
                            ).map((t, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                                >
                                    <div>
                                        <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                                            {t.name}
                                        </p>
                                        <p className="text-[10px] text-gray-400 mt-0.5">
                                            {t.time}
                                        </p>
                                    </div>
                                    <span
                                        className={`text-[10px] font-semibold px-2 py-1 rounded-full ${
                                            t.type === "Special"
                                                ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                                                : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                                        }`}
                                    >
                                        {t.type}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === "facilities" && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                            Facilities
                        </h3>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                            {[
                                { IconComp: Icon.Parking, label: "Parking" },
                                { IconComp: Icon.Restroom, label: "Restrooms" },
                                { IconComp: Icon.Food, label: "Food Court" },
                                { IconComp: Icon.Gift, label: "Gift Shop" },
                                { IconComp: Icon.Water, label: "Water" },
                                { IconComp: Icon.Aid, label: "First Aid" },
                            ].map(({ IconComp, label }, i) => (
                                <div
                                    key={i}
                                    className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-center"
                                >
                                    <span style={{ color: "#c33c01" }}>
                                        <IconComp />
                                    </span>
                                    <p className="text-[10px] font-medium text-gray-700 dark:text-gray-300">
                                        {label}
                                    </p>
                                    <span className="text-[9px] font-semibold text-emerald-600">
                                        Available
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === "reviews" && (
                    <div className="space-y-2.5">
                        {(
                            temple.reviews || [
                                {
                                    name: "Priya Sharma",
                                    rating: 5,
                                    text: "Amazing spiritual experience! Very peaceful and well-maintained.",
                                    date: "2 days ago",
                                },
                                {
                                    name: "Rajesh Kumar",
                                    rating: 5,
                                    text: "The VIP darshan service was excellent. Highly recommended!",
                                    date: "1 week ago",
                                },
                                {
                                    name: "Anjali Patel",
                                    rating: 4,
                                    text: "Beautiful temple with great atmosphere. Parking could be better.",
                                    date: "2 weeks ago",
                                },
                            ]
                        ).map((r, i) => (
                            <div
                                key={i}
                                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-3.5"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                                            style={{
                                                backgroundColor: "#c33c01",
                                            }}
                                        >
                                            {r.name[0]}
                                        </div>
                                        <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                                            {r.name}
                                        </p>
                                    </div>
                                    <span className="text-[10px] text-gray-400">
                                        {r.date}
                                    </span>
                                </div>
                                <div className="flex gap-0.5 mb-1.5 ml-9">
                                    {[...Array(5)].map((_, idx) => (
                                        <span
                                            key={idx}
                                            className={
                                                idx < r.rating
                                                    ? "text-amber-400"
                                                    : "text-gray-200 dark:text-gray-600"
                                            }
                                        >
                                            <svg
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                className="w-3 h-3"
                                            >
                                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                            </svg>
                                        </span>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 ml-9 leading-relaxed">
                                    {r.text}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── BOOKING SECTION ── */}
            <div
                className="rounded-2xl p-4 md:p-5 mb-6"
                style={{
                    backgroundColor: "rgba(195, 60, 1, 0.08)",
                    borderColor: "#c33c01",
                    border: "1px solid",
                }}
            >
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4">
                    Book Your Darshan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    {/* Regular */}
                    <div
                        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 transition"
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.borderColor = "#c33c01")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.borderColor = "")
                        }
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                                style={{ backgroundColor: "#c33c01" }}
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="w-4 h-4"
                                >
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                    <polyline points="9 22 9 12 15 12 15 22" />
                                </svg>
                            </div>
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                Regular Darshan
                            </h4>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                            Experience regular darshan during your preferred
                            time slot
                        </p>
                        <div className="flex items-center justify-between">
                            <p
                                className="text-base font-bold"
                                style={{ color: "#c33c01" }}
                            >
                                ₹{temple.regular_price || 0}
                                <span className="text-xs font-normal text-gray-400">
                                    /person
                                </span>
                            </p>
                            <button
                                onClick={() => handleBookDarshan("regular")}
                                className="text-white px-4 py-1.5 rounded-lg text-xs font-semibold transition hover:opacity-90"
                                style={{ backgroundColor: "#c33c01" }}
                            >
                                Book Now
                            </button>
                        </div>
                    </div>

                    {/* VIP */}
                    {temple.has_vip_darshan && (
                        <div
                            className="rounded-xl p-4 transition"
                            style={{
                                backgroundColor: "rgba(195, 60, 1, 0.08)",
                                borderColor: "#c33c01",
                                border: "1px solid",
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.borderColor = "#c33c01")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.borderColor = "#c33c01")
                            }
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                                    style={{ backgroundColor: "#c33c01" }}
                                >
                                    <Icon.Crown />
                                </div>
                                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                    VIP Darshan
                                </h4>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                                Priority access with minimal queue and exclusive
                                benefits
                            </p>
                            <div className="flex items-center justify-between">
                                <p
                                    className="text-base font-bold"
                                    style={{ color: "#c33c01" }}
                                >
                                    ₹{temple.vip_price || 0}
                                    <span className="text-xs font-normal text-gray-400">
                                        /person
                                    </span>
                                </p>
                                <button
                                    onClick={() => handleBookDarshan("vip")}
                                    className="text-white px-4 py-1.5 rounded-lg text-xs font-semibold transition hover:opacity-90"
                                    style={{ backgroundColor: "#c33c01" }}
                                >
                                    Book VIP
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-4 gap-2">
                    {[
                        {
                            label: "Max Slots",
                            value: temple.daily_slots || 500,
                        },
                        {
                            label: "Avg Wait",
                            value: temple.avg_wait || "30 min",
                        },
                        {
                            label: "Reviews",
                            value: temple.total_reviews || "1,200",
                        },
                        {
                            label: "Today",
                            value: temple.today_visitors || "N/A",
                        },
                    ].map(({ label, value }) => (
                        <div key={label} className="text-center">
                            <p className="text-xs font-bold text-gray-900 dark:text-gray-100">
                                {value}
                            </p>
                            <p className="text-[10px] text-gray-400">{label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
