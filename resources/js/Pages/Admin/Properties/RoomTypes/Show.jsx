import AdminAppLayout from "@/Layouts/AdminAppLayout";
import { Link, router } from "@inertiajs/react";

export default function RoomTypeShow({ roomType }) {
    return (
        <AdminAppLayout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-brand-primary dark:text-gray-100">{roomType.name}</h1>
                    <Link
                        href={route("admin.room-types.index")}
                        className="px-4 py-2 bg-brand-background dark:bg-gray-700 text-brand-primary rounded-lg hover:opacity-90 transition-opacity"
                    >
                        Back to List
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    {roomType.image && (
                        <img
                            src={`/banner/${roomType.image}`}
                            alt={roomType.name}
                            className="w-full h-56 object-cover rounded-lg mb-6"
                        />
                    )}

                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-brand-secondary dark:text-gray-400 mb-2">Property</label>
                            <p className="text-brand-primary dark:text-gray-200">{roomType.property?.name || "N/A"}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-brand-secondary dark:text-gray-400 mb-2">Price/Night</label>
                            <p className="text-brand-primary dark:text-gray-200">₹{roomType.price}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-brand-secondary dark:text-gray-400 mb-2">Capacity</label>
                            <p className="text-brand-primary dark:text-gray-200">{roomType.capacity} guests</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-brand-secondary dark:text-gray-400 mb-2">Rooms Available</label>
                            <p className="text-brand-primary dark:text-gray-200">{roomType.room_count}</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-brand-secondary dark:text-gray-400 mb-2">Status</label>
                        <span
                            className={`px-3 py-1 rounded text-sm font-medium ${
                                roomType.status === "active"
                                    ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                                    : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                            }`}
                        >
                            {roomType.status === "active" ? "Active" : "Inactive"}
                        </span>
                    </div>

                    <div className="flex gap-3 mt-8">
                        <Link
                            href={route("admin.room-types.edit", roomType.id)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Edit
                        </Link>
                        <button
                            onClick={() => {
                                if (confirm("Are you sure?")) {
                                    router.delete(route("admin.room-types.destroy", roomType.id));
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
