import AppLayout from "@/Layouts/AppLayout";
import { Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";
import { MapPin, Star, Users, ArrowLeft, BedDouble, Check } from "lucide-react";

export default function AccommodationShow({ property, roomTypes = [] }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const gallery = property.image_url ? [property.image_url, ...(property.gallery || [])] : (property.gallery || []);

    const [selectedRoom, setSelectedRoom] = useState(roomTypes[0]?.id || null);
    const [activeImage, setActiveImage] = useState(0);
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [guestCount, setGuestCount] = useState(1);
    const [submitting, setSubmitting] = useState(false);

    const room = roomTypes.find((r) => r.id === selectedRoom);

    const nights =
        checkIn && checkOut && new Date(checkOut) > new Date(checkIn)
            ? Math.round((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))
            : 0;

    const handleBook = (e) => {
        e.preventDefault();
        if (!user) {
            router.visit("/login");
            return;
        }
        setSubmitting(true);
        router.post(
            route("accommodation.book", selectedRoom),
            { check_in: checkIn, check_out: checkOut, guest_count: guestCount },
            { onFinish: () => setSubmitting(false) }
        );
    };

    return (
        <AppLayout>
            <Link href={route("accommodation.index")} className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-4">
                <ArrowLeft className="w-4 h-4" /> Back to Accommodation
            </Link>

            <div
                className="h-56 md:h-72 rounded-2xl bg-gray-200 dark:bg-gray-700 bg-cover bg-center mb-2"
                style={gallery[activeImage] ? { backgroundImage: `url(${gallery[activeImage]})` } : {}}
            />
            {gallery.length > 1 && (
                <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
                    {gallery.map((src, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => setActiveImage(i)}
                            className={`flex-shrink-0 w-16 h-16 rounded-lg bg-cover bg-center border-2 transition-colors ${
                                activeImage === i ? "border-indigo-500" : "border-transparent opacity-70 hover:opacity-100"
                            }`}
                            style={{ backgroundImage: `url(${src})` }}
                            aria-label={`View photo ${i + 1}`}
                        />
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{property.type}</span>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{property.name}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {property.location}</span>
                        <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-current text-yellow-500" /> {property.rating}</span>
                    </div>

                    {property.description && (
                        <div className="mb-6">
                            <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">About</h2>
                            <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">{property.description}</p>
                        </div>
                    )}

                    {property.amenities?.length > 0 && (
                        <div className="mb-6">
                            <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Amenities</h2>
                            <div className="grid grid-cols-2 gap-2">
                                {property.amenities.map((a) => (
                                    <span key={a} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" /> {a}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mb-6">
                        <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Room Types</h2>
                        <div className="space-y-2">
                            {roomTypes.map((rt) => (
                                <button
                                    key={rt.id}
                                    type="button"
                                    onClick={() => setSelectedRoom(rt.id)}
                                    className={`w-full flex items-center justify-between text-left p-3 rounded-lg border transition-colors ${
                                        selectedRoom === rt.id
                                            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                                            : "border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <BedDouble className="w-4 h-4 text-gray-400" />
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{rt.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Up to {rt.capacity} guests</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">₹{rt.price.toLocaleString()}/night</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 h-fit">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Book: {room?.name}</h3>
                    <form onSubmit={handleBook} className="space-y-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Check-in</label>
                            <input
                                type="date"
                                required
                                value={checkIn}
                                onChange={(e) => setCheckIn(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Check-out</label>
                            <input
                                type="date"
                                required
                                value={checkOut}
                                onChange={(e) => setCheckOut(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Guests</label>
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-gray-400" />
                                <input
                                    type="number"
                                    min="1"
                                    max={room?.capacity || 10}
                                    value={guestCount}
                                    onChange={(e) => setGuestCount(Math.max(1, Number(e.target.value)))}
                                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm"
                                />
                            </div>
                        </div>
                        {nights > 0 && room && (
                            <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                                {nights} night(s) × ₹{room.price.toLocaleString()} = ₹{(nights * room.price).toLocaleString()}
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={submitting || !selectedRoom}
                            className="w-full py-2.5 rounded-xl font-semibold bg-indigo-500 text-white hover:bg-indigo-600 transition-colors disabled:opacity-60"
                        >
                            {user ? (submitting ? "Booking..." : "Book Now") : "Login to Book"}
                        </button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
