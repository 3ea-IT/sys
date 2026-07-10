import AdminAppLayout from "@/Layouts/AdminAppLayout";
import { Link, router } from "@inertiajs/react";
import { useState } from "react";

const toLocalInput = (value) => {
    if (!value) return "";
    const d = new Date(value);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export default function FlightEdit({ flight }) {
    const [form, setForm] = useState({
        airline: flight.airline,
        flight_number: flight.flight_number,
        origin: flight.origin,
        destination: flight.destination,
        departure_time: toLocalInput(flight.departure_time),
        arrival_time: toLocalInput(flight.arrival_time),
        duration_minutes: flight.duration_minutes,
        seat_class: flight.seat_class,
        price: flight.price,
        capacity: flight.capacity,
        image: null,
        status: flight.status,
    });
    const [preview, setPreview] = useState(flight.image ? `/banner/${flight.image}` : null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm({ ...form, image: file });
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => {
            if (key === "image") {
                if (value) formData.append("image", value);
            } else {
                formData.append(key, value);
            }
        });
        formData.append("_method", "PUT");
        router.post(route("admin.flights.update", flight.id), formData);
    };

    return (
        <AdminAppLayout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <Link href={route("admin.flights.index")} className="text-brand-primary hover:underline">
                        ← Back to Flights
                    </Link>
                </div>

                <h1 className="text-3xl font-bold text-brand-primary dark:text-gray-100 mb-8">
                    Edit Flight: {flight.airline} {flight.flight_number}
                </h1>

                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-brand-primary dark:text-gray-200 mb-2">Airline *</label>
                            <input
                                type="text"
                                value={form.airline}
                                onChange={(e) => setForm({ ...form, airline: e.target.value })}
                                required
                                className="w-full px-4 py-2 border border-brand-border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-brand-primary dark:text-gray-200 mb-2">Flight Number *</label>
                            <input
                                type="text"
                                value={form.flight_number}
                                onChange={(e) => setForm({ ...form, flight_number: e.target.value })}
                                required
                                className="w-full px-4 py-2 border border-brand-border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-brand-primary dark:text-gray-200 mb-2">Origin *</label>
                            <input
                                type="text"
                                value={form.origin}
                                onChange={(e) => setForm({ ...form, origin: e.target.value })}
                                required
                                className="w-full px-4 py-2 border border-brand-border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-brand-primary dark:text-gray-200 mb-2">Destination *</label>
                            <input
                                type="text"
                                value={form.destination}
                                onChange={(e) => setForm({ ...form, destination: e.target.value })}
                                required
                                className="w-full px-4 py-2 border border-brand-border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-brand-primary dark:text-gray-200 mb-2">Departure Time *</label>
                            <input
                                type="datetime-local"
                                value={form.departure_time}
                                onChange={(e) => setForm({ ...form, departure_time: e.target.value })}
                                required
                                className="w-full px-4 py-2 border border-brand-border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-brand-primary dark:text-gray-200 mb-2">Arrival Time *</label>
                            <input
                                type="datetime-local"
                                value={form.arrival_time}
                                onChange={(e) => setForm({ ...form, arrival_time: e.target.value })}
                                required
                                className="w-full px-4 py-2 border border-brand-border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-brand-primary dark:text-gray-200 mb-2">Duration (min) *</label>
                            <input
                                type="number"
                                min="1"
                                value={form.duration_minutes}
                                onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })}
                                required
                                className="w-full px-4 py-2 border border-brand-border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-brand-primary dark:text-gray-200 mb-2">Class *</label>
                            <select
                                value={form.seat_class}
                                onChange={(e) => setForm({ ...form, seat_class: e.target.value })}
                                className="w-full px-4 py-2 border border-brand-border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                            >
                                <option value="economy">Economy</option>
                                <option value="business">Business</option>
                                <option value="first">First</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-brand-primary dark:text-gray-200 mb-2">Price *</label>
                            <input
                                type="number"
                                step="0.01"
                                value={form.price}
                                onChange={(e) => setForm({ ...form, price: e.target.value })}
                                required
                                className="w-full px-4 py-2 border border-brand-border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-brand-primary dark:text-gray-200 mb-2">Capacity *</label>
                            <input
                                type="number"
                                min="1"
                                value={form.capacity}
                                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                                required
                                className="w-full px-4 py-2 border border-brand-border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-brand-primary dark:text-gray-200 mb-2">Status *</label>
                        <select
                            value={form.status}
                            onChange={(e) => setForm({ ...form, status: e.target.value })}
                            className="w-full px-4 py-2 border border-brand-border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    <div className="mb-8">
                        <label className="block text-sm font-medium text-brand-primary dark:text-gray-200 mb-2">Image</label>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full px-4 py-2 border border-brand-border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                />
                                <p className="text-xs text-gray-500 mt-1">JPG, PNG, WebP (Max 5MB)</p>
                            </div>
                            {preview && (
                                <div className="w-24 h-24 rounded-lg overflow-hidden border border-brand-border">
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button type="submit" className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:opacity-90 transition-opacity">
                            Update Flight
                        </button>
                        <Link
                            href={route("admin.flights.index")}
                            className="px-6 py-2 bg-brand-background dark:bg-gray-700 text-brand-primary rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </AdminAppLayout>
    );
}
