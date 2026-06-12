import AdminAppLayout from "@/Layouts/AdminAppLayout";
import { Link, router } from "@inertiajs/react";
import { useState } from "react";

export default function ParkingCreate({ temples }) {
    const [form, setForm] = useState({
        temple_id: "",
        name: "",
        location: "",
        capacity: "",
        price: "",
        description: "",
        status: "active",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(route("admin.parkings.store"), form);
    };

    return (
        <AdminAppLayout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <Link
                        href={route("admin.parkings.index")}
                        className="text-brand-primary hover:underline"
                    >
                        ← Back to Parkings
                    </Link>
                </div>
                <h1 className="text-3xl font-bold text-brand-primary dark:text-gray-100 mb-8">
                    Create New Parking
                </h1>
                <form
                    onSubmit={handleSubmit}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow p-8"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-brand-primary dark:text-gray-200 mb-2">
                                Temple *
                            </label>
                            <select
                                value={form.temple_id}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        temple_id: e.target.value,
                                    })
                                }
                                required
                                className="w-full px-4 py-2 border border-brand-border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                            >
                                <option value="">Select Temple</option>
                                {temples.map((temple) => (
                                    <option key={temple.id} value={temple.id}>
                                        {temple.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-brand-primary dark:text-gray-200 mb-2">
                                Name *
                            </label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) =>
                                    setForm({ ...form, name: e.target.value })
                                }
                                required
                                className="w-full px-4 py-2 border border-brand-border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                placeholder="Parking name"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-brand-primary dark:text-gray-200 mb-2">
                                Location *
                            </label>
                            <input
                                type="text"
                                value={form.location}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        location: e.target.value,
                                    })
                                }
                                required
                                className="w-full px-4 py-2 border border-brand-border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                placeholder="Parking location"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-brand-primary dark:text-gray-200 mb-2">
                                Capacity (slots) *
                            </label>
                            <input
                                type="number"
                                value={form.capacity}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        capacity: e.target.value,
                                    })
                                }
                                required
                                className="w-full px-4 py-2 border border-brand-border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                placeholder="Number of slots"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-brand-primary dark:text-gray-200 mb-2">
                                Price *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={form.price}
                                onChange={(e) =>
                                    setForm({ ...form, price: e.target.value })
                                }
                                required
                                className="w-full px-4 py-2 border border-brand-border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                placeholder="0.00"
                            />
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-brand-primary dark:text-gray-200 mb-2">
                            Description
                        </label>
                        <textarea
                            value={form.description}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    description: e.target.value,
                                })
                            }
                            className="w-full px-4 py-2 border border-brand-border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                            rows="4"
                            placeholder="Parking description"
                        />
                    </div>
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-brand-primary dark:text-gray-200 mb-2">
                            Status *
                        </label>
                        <select
                            value={form.status}
                            onChange={(e) =>
                                setForm({ ...form, status: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-brand-border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Create Parking
                        </button>
                        <Link
                            href={route("admin.parkings.index")}
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
