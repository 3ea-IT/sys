import AdminAppLayout from "@/Layouts/AdminAppLayout";
import { Link, router } from "@inertiajs/react";
import { useState } from "react";

export default function PropertyCreate({ types, amenityOptions = [] }) {
    const [form, setForm] = useState({
        name: "",
        type: "Hotel",
        location: "",
        description: "",
        price_per_night: "",
        rating: "",
        amenities: [],
        image: null,
        gallery: [],
        status: "active",
    });
    const [preview, setPreview] = useState(null);
    const [galleryPreviews, setGalleryPreviews] = useState([]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm({ ...form, image: file });
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleGalleryChange = (e) => {
        const files = Array.from(e.target.files);
        setForm({ ...form, gallery: files });
        setGalleryPreviews(files.map((f) => URL.createObjectURL(f)));
    };

    const toggleAmenity = (a) => {
        setForm((prev) => ({
            ...prev,
            amenities: prev.amenities.includes(a)
                ? prev.amenities.filter((x) => x !== a)
                : [...prev.amenities, a],
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => {
            if (key === "image") {
                if (value) formData.append("image", value);
            } else if (key === "gallery") {
                value.forEach((file) => formData.append("gallery[]", file));
            } else if (key === "amenities") {
                value.forEach((a) => formData.append("amenities[]", a));
            } else {
                formData.append(key, value);
            }
        });
        router.post(route("admin.properties.store"), formData);
    };

    return (
        <AdminAppLayout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <Link href={route("admin.properties.index")} className="text-brand-primary hover:underline">
                        ← Back to Properties
                    </Link>
                </div>

                <h1 className="text-3xl font-bold text-brand-primary dark:text-gray-100 mb-8">
                    Create New Property
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
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-brand-primary dark:text-gray-200 mb-2">Type *</label>
                            <select
                                value={form.type}
                                onChange={(e) => setForm({ ...form, type: e.target.value })}
                                className="w-full px-4 py-2 border border-brand-border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                            >
                                {types.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-brand-primary dark:text-gray-200 mb-2">Location *</label>
                            <input
                                type="text"
                                value={form.location}
                                onChange={(e) => setForm({ ...form, location: e.target.value })}
                                required
                                className="w-full px-4 py-2 border border-brand-border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-brand-primary dark:text-gray-200 mb-2">Price per Night *</label>
                            <input
                                type="number"
                                step="0.01"
                                value={form.price_per_night}
                                onChange={(e) => setForm({ ...form, price_per_night: e.target.value })}
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
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-brand-primary dark:text-gray-200 mb-2">Amenities</label>
                        <div className="flex flex-wrap gap-2">
                            {amenityOptions.map((a) => (
                                <button
                                    type="button"
                                    key={a}
                                    onClick={() => toggleAmenity(a)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                                        form.amenities.includes(a)
                                            ? "bg-brand-primary border-brand-primary text-white"
                                            : "bg-white dark:bg-gray-700 border-brand-border dark:border-gray-600 text-brand-primary dark:text-gray-200"
                                    }`}
                                >
                                    {a}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-brand-primary dark:text-gray-200 mb-2">Cover Image</label>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full px-4 py-2 border border-brand-border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                />
                                <p className="text-xs text-gray-500 mt-1">JPG, PNG, WebP (Max 5MB) — shown on listing cards</p>
                            </div>
                            {preview && (
                                <div className="w-24 h-24 rounded-lg overflow-hidden border border-brand-border">
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mb-8">
                        <label className="block text-sm font-medium text-brand-primary dark:text-gray-200 mb-2">Gallery Images</label>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleGalleryChange}
                            className="w-full px-4 py-2 border border-brand-border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                        />
                        <p className="text-xs text-gray-500 mt-1">Additional photos shown on the property's detail page</p>
                        {galleryPreviews.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                {galleryPreviews.map((src, i) => (
                                    <div key={i} className="w-16 h-16 rounded-lg overflow-hidden border border-brand-border">
                                        <img src={src} alt="" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <button type="submit" className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:opacity-90 transition-opacity">
                            Create Property
                        </button>
                        <Link
                            href={route("admin.properties.index")}
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
