import AdminAppLayout from "@/Layouts/AdminAppLayout";
import { Link, router } from "@inertiajs/react";
import { useState } from "react";

export default function TourismPackageCreate() {
    const [form, setForm] = useState({
        name: "",
        location: "",
        description: "",
        price: "",
        duration: "",
        rating: "",
        capacity: "20",
        image: null,
        status: "active",
    });
    const [preview, setPreview] = useState(null);

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
        router.post(route("admin.tourism-packages.store"), formData);
    };

    return (
        <AdminAppLayout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <Link href={route("admin.tourism-packages.index")} className="text-brand-primary hover:underline">
                        ← Back to Tourism Packages
                    </Link>
                </div>

                <h1 className="text-3xl font-bold text-brand-primary dark:text-gray-100 mb-8">
                    Create New Tourism Package
                </h1>

                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-brand-primary dark:text-gray-200 mb-2">Name *</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                                className="w-full px-4 py-2 border border-brand-border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                placeholder="Package name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-brand-primary dark:text-gray-200 mb-2">Location *</label>
                            <input
                                type="text"
                                value={form.location}
                                onChange={(e) => setForm({ ...form, location: e.target.value })}
                                required
                                className="w-full px-4 py-2 border border-brand-border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                placeholder="e.g. Rishikesh, Uttarakhand"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-brand-primary dark:text-gray-200 mb-2">Price per person *</label>
                            <input
                                type="number"
                                step="0.01"
                                value={form.price}
                                onChange={(e) => setForm({ ...form, price: e.target.value })}
                                required
                                className="w-full px-4 py-2 border border-brand-border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-brand-primary dark:text-gray-200 mb-2">Duration</label>
                            <input
                                type="text"
                                value={form.duration}
                                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                                className="w-full px-4 py-2 border border-brand-border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                placeholder="e.g. 3 Days / 2 Nights"
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-brand-primary dark:text-gray-200 mb-2">Rating</label>
                            <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="5"
                                value={form.rating}
                                onChange={(e) => setForm({ ...form, rating: e.target.value })}
                                className="w-full px-4 py-2 border border-brand-border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                placeholder="0.0"
                            />
                        </div>

                        <div>
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
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-brand-primary dark:text-gray-200 mb-2">Description</label>
                        <textarea
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="w-full px-4 py-2 border border-brand-border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                            rows="4"
                            placeholder="Package description"
                        />
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
                        <button
                            type="submit"
                            className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Create Package
                        </button>
                        <Link
                            href={route("admin.tourism-packages.index")}
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
