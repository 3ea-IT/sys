import AdminAppLayout from "@/Layouts/AdminAppLayout";
import { Link, router } from "@inertiajs/react";

export default function AssistanceShow({ assistance }) {
    return (
        <AdminAppLayout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-brand-primary dark:text-gray-100">
                        {assistance.name}
                    </h1>
                    <Link
                        href={route("admin.assistance.index")}
                        className="px-4 py-2 bg-brand-background dark:bg-gray-700 text-brand-primary rounded-lg hover:opacity-90 transition-opacity"
                    >
                        Back to List
                    </Link>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-brand-secondary dark:text-gray-400 mb-2">
                                Temple
                            </label>
                            <p className="text-brand-primary dark:text-gray-200">
                                {assistance.temple?.name || "N/A"}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-brand-secondary dark:text-gray-400 mb-2">
                                Type
                            </label>
                            <p className="text-brand-primary dark:text-gray-200">
                                {assistance.type || "N/A"}
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-brand-secondary dark:text-gray-400 mb-2">
                                Price
                            </label>
                            <p className="text-brand-primary dark:text-gray-200">
                                ₹{assistance.price}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-brand-secondary dark:text-gray-400 mb-2">
                                Availability
                            </label>
                            <p className="text-brand-primary dark:text-gray-200">
                                {assistance.availability || "N/A"}
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-brand-secondary dark:text-gray-400 mb-2">
                                Status
                            </label>
                            <span
                                className={`px-3 py-1 rounded text-sm font-medium ${assistance.status === "active" ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200" : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"}`}
                            >
                                {assistance.status === "active"
                                    ? "Active"
                                    : "Inactive"}
                            </span>
                        </div>
                    </div>
                    {assistance.description && (
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-brand-secondary dark:text-gray-400 mb-2">
                                Description
                            </label>
                            <p className="text-brand-primary dark:text-gray-200">
                                {assistance.description}
                            </p>
                        </div>
                    )}
                    <div className="flex gap-3 mt-8">
                        <Link
                            href={route("admin.assistance.edit", assistance.id)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Edit
                        </Link>
                        <button
                            onClick={() => {
                                if (confirm("Are you sure?")) {
                                    router.delete(
                                        route(
                                            "admin.assistance.destroy",
                                            assistance.id,
                                        ),
                                    );
                                }
                            }}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </AdminAppLayout>
    );
}
