import AppLayout from "@/Layouts/AppLayout";
import { usePage, router } from "@inertiajs/react";
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
    Star: ({ filled = true, className = "w-4 h-4" }) => (
        <svg
            viewBox="0 0 24 24"
            fill={filled ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={1.5}
            className={className}
        >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    ),
    BadgeCheck: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3.5 h-3.5"
        >
            <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    ),
    Languages: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
        >
            <path d="m5 8 6 6" />
            <path d="m4 14 6-6 2-3" />
            <path d="M2 5h12" />
            <path d="M7 2h1" />
            <path d="m22 22-5-10-5 10" />
            <path d="M14 18h6" />
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
    Calendar: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
        >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
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
};

const categoryColors = {
    "Temple Guide": {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-700 dark:text-blue-300",
    },
    "Elderly Care": {
        bg: "bg-emerald-100 dark:bg-emerald-900/30",
        text: "text-emerald-700 dark:text-emerald-300",
    },
    Translator: {
        bg: "bg-purple-100 dark:bg-purple-900/30",
        text: "text-purple-700 dark:text-purple-300",
    },
    "Family Coordinator": {
        bg: "bg-pink-100 dark:bg-pink-900/30",
        text: "text-pink-700 dark:text-pink-300",
    },
    "Special Services": {
        bg: "bg-orange-100 dark:bg-orange-900/30",
        text: "text-orange-700 dark:text-orange-300",
    },
};

export default function GuideProfile({ guide = {} }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const imageSrc = (() => {
        if (!guide.image)
            return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop";
        if (guide.image.startsWith("http") || guide.image.startsWith("/"))
            return guide.image;
        return `/assets/guides/${guide.image}`;
    })();

    const cat = categoryColors[guide.category] || {
        bg: "bg-gray-100 dark:bg-gray-800",
        text: "text-gray-600 dark:text-gray-400",
    };

    const services = [
        "Temple History & Significance",
        "Ritual & Spiritual Guidance",
        "Photography Assistance",
        "Local Food Recommendations",
        "Safe Navigation",
        "Emergency Support",
    ];

    const sampleReviews = [
        {
            name: "Rajesh Kumar",
            rating: 5,
            date: "2 weeks ago",
            text: "Outstanding guide! Very knowledgeable about temple history and rituals. Highly recommended!",
        },
        {
            name: "Priya Singh",
            rating: 5,
            date: "1 month ago",
            text: "Excellent experience. The guide was patient, informative, and made our pilgrimage memorable.",
        },
        {
            name: "Amit Patel",
            rating: 4,
            date: "6 weeks ago",
            text: "Very good service. Would have appreciated more details about certain rituals.",
        },
    ];

    return (
        <AppLayout>
            {/* ── BACK ── */}
            <button
                onClick={() => router.visit("/temple/guide")}
                className="inline-flex items-center gap-1.5 text-xs font-semibold mb-5 hover:underline"
                style={{ color: "#c33c01" }}
            >
                <Icon.Back /> Back to Guides
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* ── LEFT PANEL ── */}
                <div className="lg:col-span-1 space-y-4">
                    {/* Profile Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="relative h-72 bg-gray-100 dark:bg-gray-700">
                            <img
                                src={imageSrc}
                                alt={guide.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src =
                                        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop";
                                }}
                            />
                            <span className="absolute top-3 left-3 flex items-center gap-1 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                                <Icon.BadgeCheck /> Verified
                            </span>
                        </div>
                        <div className="p-4">
                            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
                                {guide.name}
                            </h1>
                            <span
                                className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${cat.bg} ${cat.text}`}
                            >
                                {guide.category}
                            </span>

                            {/* Rating */}
                            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                                <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {guide.rating}
                                </span>
                                <div>
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <span
                                                key={i}
                                                className={
                                                    i < Math.floor(guide.rating)
                                                        ? "text-amber-400"
                                                        : "text-gray-200 dark:text-gray-600"
                                                }
                                            >
                                                <Icon.Star className="w-3.5 h-3.5" />
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-0.5">
                                        {guide.reviews} reviews
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pricing Card */}
                    <div
                        className="rounded-2xl p-4 border"
                        style={{
                            backgroundColor: "rgba(195, 60, 1, 0.1)",
                            borderColor: "#c33c01",
                        }}
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <p className="text-[10px] text-gray-400 mb-0.5">
                                    Hourly Rate
                                </p>
                                <p
                                    className="text-2xl font-bold"
                                    style={{ color: "#c33c01" }}
                                >
                                    ₹{guide.hourlyRate}
                                    <span className="text-xs font-normal text-gray-400">
                                        /hr
                                    </span>
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-gray-400 mb-0.5">
                                    Group Rate
                                </p>
                                <p
                                    className="text-xl font-bold"
                                    style={{ color: "#c33c01" }}
                                >
                                    ₹{guide.groupRate}
                                    <span className="text-xs font-normal text-gray-400">
                                        /group
                                    </span>
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                if (!user) {
                                    router.visit("/login");
                                    return;
                                }
                            }}
                            className="w-full text-white py-2.5 rounded-xl text-sm font-semibold transition shadow-sm hover:opacity-90"
                            style={{ backgroundColor: "#c33c01" }}
                        >
                            Hire This Guide
                        </button>
                    </div>

                    {/* Details Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 space-y-3">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            Details
                        </h3>
                        {[
                            {
                                IconComp: Icon.Languages,
                                label: "Languages",
                                value: Array.isArray(guide.languages)
                                    ? guide.languages.join(", ")
                                    : guide.languages,
                            },
                            {
                                IconComp: Icon.Clock,
                                label: "Experience",
                                value: guide.experience,
                            },
                            {
                                IconComp: Icon.Users,
                                label: "Max Group",
                                value: guide.maxGroupSize
                                    ? `${guide.maxGroupSize} people`
                                    : "—",
                            },
                        ].map(({ IconComp, label, value }) => (
                            <div key={label} className="flex gap-3 items-start">
                                <span className="text-orange-500 dark:text-orange-400 mt-0.5 flex-shrink-0">
                                    <IconComp />
                                </span>
                                <div>
                                    <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                                        {label}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {value}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {guide.availability && (
                            <div className="flex gap-3 items-start">
                                <span className="text-orange-500 dark:text-orange-400 mt-0.5 flex-shrink-0">
                                    <Icon.Calendar />
                                </span>
                                <div>
                                    <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                        Availability
                                    </p>
                                    <div className="flex flex-wrap gap-1">
                                        {guide.availability.map((day) => (
                                            <span
                                                key={day}
                                                className="text-[10px] bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded-full font-medium"
                                            >
                                                {day}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── RIGHT PANEL ── */}
                <div className="lg:col-span-2 space-y-4">
                    {/* About */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 md:p-5">
                        <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">
                            About {guide.name?.split(" ")[0]}
                        </h2>
                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                            {guide.longDescription ||
                                guide.description ||
                                "Experienced guide dedicated to providing exceptional pilgrimage experiences."}
                        </p>
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2">
                            <p className="text-[10px] text-gray-400 mb-0.5">
                                Specialization
                            </p>
                            <p className="text-xs text-gray-700 dark:text-gray-300">
                                {guide.specialization}
                            </p>
                        </div>
                    </div>

                    {/* Services */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 md:p-5">
                        <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-3">
                            Services Offered
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {services.map((s, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-2 p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                                >
                                    <span className="w-5 h-5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0">
                                        <Icon.Check />
                                    </span>
                                    <span className="text-xs text-gray-700 dark:text-gray-300">
                                        {s}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Reviews */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 md:p-5">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">
                                Reviews
                            </h2>
                            <span className="text-xs text-gray-400">
                                {guide.reviews} reviews
                            </span>
                        </div>
                        <div className="space-y-3">
                            {sampleReviews.map((r, i) => (
                                <div
                                    key={i}
                                    className="pb-3 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0"
                                >
                                    <div className="flex items-start justify-between mb-1.5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-xs font-bold text-orange-600">
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
                                    <p className="text-xs text-gray-500 dark:text-gray-400 ml-9 leading-relaxed">
                                        {r.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
