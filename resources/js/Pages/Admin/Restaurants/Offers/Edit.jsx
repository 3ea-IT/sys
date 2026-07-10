import AdminAppLayout from "@/Layouts/AdminAppLayout";
import { Link, router } from "@inertiajs/react";
import { useState } from "react";

export default function DiningOfferEdit({ offer, restaurants }) {
    const [form, setForm] = useState({
        restaurant_id: offer.restaurant_id,
        title: offer.title,
        description: offer.description || "",
        discount_percent: offer.discount_percent || "",
        valid_until: offer.valid_until ? offer.valid_until.slice(0, 10) : "",
        image: null,
        status: offer.status,
    });
    const [preview, setPreview] = useState(offer.image ? `/banner/${offer.image}` : null);

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
        router.post(route("admin.dining-offers.update", offer.id), formData);
    };

    return (
        <AdminAppLayout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <Link href={route("admin.dining-offers.index")} className="text-brand-primary hover:underline">
                        ← Back to Offers
                    </Link>
                </div>

                <h1 className="text-3xl font-bold text-brand-primary dark:text-gray-100 mb-8">
                    Edit Offer: {offer.title}
                </h1>

                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-brand-primary dark:text-gray-200 mb-2">Restaurant *</label>
                            <select
                                value={form.restaurant_id}
                                onChange={(e) => setForm({ ...form, restaurant_id: e.target.value })}
                                required
                                className="w-full px-4 py-2 border border-brand-border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                            >
                                <option value="">Select Restaurant</option>
                                {restaurants.map((r) => (
                                    <option key={r.id} value={r.id}>{r.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-brand-primary dark:text-gray-200 mb-2">Title *</label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                required
                                className="w-full px-4 py-2 border border-brand-border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-brand-primary dark:text-gray-200 mb-2">Discount %</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={form.discount_percent}
                                onChange={(e) => setForm({ ...form, discount_percent: e.target.value })}
                                className="w-full px-4 py-2 border border-brand-border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-brand-primary dark:text-gray-200 mb-2">Valid Until</label>
                            <input
                                type="date"
                                value={form.valid_until}
                                onChange={(e) => setForm({ ...form, valid_until: e.target.value })}
                                className="w-full px-4 py-2 border border-brand-border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-brand-primary dark:text-gray-200 mb-2">Description</label>
                        <textarea
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="w-full px-4 py-2 border border-brand-border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                            rows="4"
                        />
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
                            Update Offer
                        </button>
                        <Link
                            href={route("admin.dining-offers.index")}
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
