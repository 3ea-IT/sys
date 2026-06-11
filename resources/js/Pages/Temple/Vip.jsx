import AppLayout from "@/Layouts/AppLayout";
import { usePage, router } from "@inertiajs/react";
import { useState } from "react";

export default function Vip({ vipDarshans = [] }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [searchQuery, setSearchQuery] = useState("");
    const [templeFilter, setTempleFilter] = useState("all");

    // SEARCH & FILTER LOGIC
    const filteredVips = vipDarshans.filter((vip) => {
        const matchesSearch =
            searchQuery.trim() === "" ||
            vip.temple_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            vip.location.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesTemple = templeFilter === "all";

        return matchesSearch && matchesTemple;
    });

    const temples = [...new Set(vipDarshans.map((v) => v.temple_name))];

    return (
        <AppLayout>
            {/* ── HEADER ── */}
            <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
                    VIP Darshan
                </h1>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
                    Premium access to temples with dedicated guides
                </p>
            </div>

            {/* ── SEARCH BAR ── */}
            <div className="relative mb-6">
                <input
                    type="text"
                    placeholder="Search temples or locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 border-0 focus:ring-2 focus:ring-offset-0 text-sm md:text-base"
                    style={{ "--tw-ring-color": "#c33c01" }}
                />
                <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
            </div>

            {/* ── TEMPLE FILTER ── */}
            {temples.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2">
                    {temples.map((temple) => (
                        <button
                            key={temple}
                            className="px-4 py-2 rounded-full text-sm font-medium text-white whitespace-nowrap"
                            style={{ backgroundColor: "#c33c01" }}
                        >
                            {temple}
                        </button>
                    ))}
                </div>
            )}

            {/* ── RESULTS COUNT ── */}
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                [OK] {filteredVips.length} VIP darshan options available
            </div>

            {/* ── VIP GRID ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVips.map((vip) => (
                    <div
                        key={vip.id}
                        className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-card hover:shadow-lg transition-shadow"
                    >
                        {/* Image Section */}
                        <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                            <img
                                src={vip.image}
                                alt={vip.temple_name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = "/banner/kashi-temple.png";
                                }}
                            />
                            {/* VIP Badge */}
                            <div
                                className="absolute top-3 left-3 text-white px-3 py-1 rounded-full text-xs font-bold"
                                style={{ backgroundColor: "#c33c01" }}
                            >
                                [VIP] Access
                            </div>
                            {/* Rating Badge */}
                            <div className="absolute top-3 right-3 bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                                Rating: {vip.rating}
                                <span className="text-xs font-normal">
                                    ({vip.reviews})
                                </span>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-4">
                            {/* Name & Location */}
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
                                {vip.temple_name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                Location: {vip.location}
                            </p>

                            {/* Duration & Details */}
                            <div className="flex items-center gap-4 mb-3 pb-3 border-b border-gray-200 dark:border-gray-700 text-sm">
                                <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                    Duration: {vip.duration}
                                </span>
                            </div>

                            {/* Includes */}
                            <div className="mb-3">
                                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Includes:
                                </p>
                                <div className="space-y-1">
                                    {vip.includes.map((item, idx) => (
                                        <p
                                            key={idx}
                                            className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2"
                                        >
                                            <span className="text-green-500 font-bold">
                                                [✓]
                                            </span>
                                            {item}
                                        </p>
                                    ))}
                                </div>
                            </div>

                            {/* Pricing & Button */}
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        VIP Price
                                    </p>
                                    <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                        ₹{vip.vip_price}
                                    </p>
                                    {vip.regular_price > 0 && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 line-through">
                                            Regular: ₹{vip.regular_price}
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={() => {
                                        if (!user) {
                                            router.visit("/login");
                                            return;
                                        }
                                        router.visit(`/temple/vip/${vip.id}`);
                                    }}
                                    className="text-white py-2 px-4 rounded-lg font-semibold text-sm transition-colors hover:opacity-90"
                                    style={{ backgroundColor: "#c33c01" }}
                                >
                                    Book Now
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── EMPTY STATE ── */}
            {filteredVips.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                        No VIP darshan found. Try adjusting your search.
                    </p>
                </div>
            )}
        </AppLayout>
    );
}
