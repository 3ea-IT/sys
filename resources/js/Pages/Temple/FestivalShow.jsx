import AppLayout from "@/Layouts/AppLayout";
import { Link, Head } from "@inertiajs/react";

export default function FestivalShow({ festival }) {
    // Safety check to avoid reading properties of null while page mounts
    if (!festival) {
        return (
            <AppLayout>
                <div className="p-6 text-center text-gray-500">
                    Loading festival details...
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <Head title={`${festival.name} - Festival Details`} />

            {/* Back Button Link Navigation */}
            <div className="mb-4">
                <Link
                    href="/temple"
                    className="text-xs font-medium inline-flex items-center gap-1 hover:underline"
                    style={{ color: "#c33c01" }}
                >
                    ← Back to Temples
                </Link>
            </div>

            {/* Festival Main Showcase Header Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm mb-6">
                <div className="h-52 md:h-72 bg-gray-100 dark:bg-gray-700 relative">
                    <img
                        src={festival.image || "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&fit=crop"}
                        alt={festival.name}
                        className="w-full h-full object-cover"
                    />
                    <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                        Crowd Level: {festival.crowd_level}
                    </span>
                </div>

                {/* Body Content Container Block */}
                <div className="p-5 md:p-6">
                    <div className="mb-4">
                        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block mb-1">
                            Upcoming Holy Celebration
                        </span>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                            {festival.name}
                        </h1>
                    </div>

                    {/* Metadata Badges Info Section Grid */}
                    <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 mb-5">
                        <div>
                            <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Location</p>
                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-0.5">
                                {festival.location}
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Celebration Date</p>
                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-0.5">
                                {festival.date}
                            </p>
                        </div>
                    </div>

                    {/* Description Text Segment */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1.5">
                            About the Festival
                        </h3>
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            {festival.description || "Join us for this divine occasion. Experience the deep spiritual heritage, ancient traditional rituals, and profound community devotional energy during this sacred festival timeline."}
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}