import AdminAppLayout from "@/Layouts/AdminAppLayout";
import { Link, router } from "@inertiajs/react";
import { ArrowLeft, Edit2, Trash2, MapPin, Star } from "lucide-react";

export default function TempleShow({ temple }) {
  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this temple?")) {
      router.delete(route("admin.temples.destroy", temple.id));
    }
  };

  return (
    <AdminAppLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={route("admin.temples.index")}
            className="inline-flex items-center gap-2 text-brand-primary dark:text-gray-300 hover:opacity-75 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Temples
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-brand-primary dark:text-gray-100">{temple.name}</h1>
              <div className="flex items-center gap-2 text-brand-secondary dark:text-gray-400 mt-2">
                <MapPin className="w-4 h-4" />
                {temple.location}
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                href={route("admin.temples.edit", temple.id)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Image */}
          <div className="lg:col-span-1">
            {temple.image_url && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden mb-6">
                <img
                  src={temple.image_url}
                  alt={temple.name}
                  className="w-full h-48 object-cover"
                />
              </div>
            )}

            {/* Quick Info Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
              <div>
                <p className="text-sm text-brand-secondary dark:text-gray-400">Rating</p>
                <div className="flex items-center gap-2 mt-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-2xl font-bold text-brand-primary dark:text-gray-100">{temple.rating}</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-brand-secondary dark:text-gray-400">Crowd Level</p>
                <p className="text-lg font-semibold text-brand-primary dark:text-gray-100 mt-1">
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm">
                    {temple.crowd_level}
                  </span>
                </p>
              </div>

              <div>
                <p className="text-sm text-brand-secondary dark:text-gray-400">Status</p>
                <p className="mt-1">
                  <span className={`px-2 py-1 rounded text-sm font-medium ${
                    temple.status === 'active'
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                      : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                  }`}>
                    {temple.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </p>
              </div>

              <div>
                <p className="text-sm text-brand-secondary dark:text-gray-400">VIP Darshan</p>
                <p className="text-lg font-semibold text-brand-primary dark:text-gray-100 mt-1">
                  {temple.has_vip_darshan ? (
                    <span className="text-green-600 dark:text-green-400">Available</span>
                  ) : (
                    <span className="text-red-600 dark:text-red-400">Not Available</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pricing */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-brand-primary dark:text-gray-100 mb-4">Pricing</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-brand-secondary dark:text-gray-400">Instant Price</p>
                  <p className="text-2xl font-bold text-brand-primary dark:text-gray-100 mt-1">
                    {temple.instant_price != null ? `₹${temple.instant_price}` : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-brand-secondary dark:text-gray-400">Hold Token</p>
                  <p className="text-2xl font-bold text-brand-primary dark:text-gray-100 mt-1">
                    {temple.hold_token != null ? `₹${temple.hold_token}` : "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Temple Details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-brand-primary dark:text-gray-100 mb-4">Temple Details</h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  ["City", temple.city],
                  ["State", temple.state],
                  ["Main Deity", temple.main_deity],
                  ["Established", temple.established],
                  ["Significance", temple.significance],
                  ["Online Booking", temple.online_booking ? "Available" : "Not Available"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-sm text-brand-secondary dark:text-gray-400">{label}</dt>
                    <dd className="text-brand-primary dark:text-gray-100 mt-1">{value || "—"}</dd>
                  </div>
                ))}
                {temple.booking_url && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm text-brand-secondary dark:text-gray-400">Booking URL</dt>
                    <dd className="mt-1 break-all">
                      <a
                        href={temple.booking_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {temple.booking_url}
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Description */}
            {temple.description && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-brand-primary dark:text-gray-100 mb-4">Description</h2>
                <p className="text-brand-secondary dark:text-gray-400 leading-relaxed">{temple.description}</p>
              </div>
            )}

            {/* Amenities */}
            {temple.amenities && temple.amenities.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-brand-primary dark:text-gray-100 mb-4">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {temple.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Timings */}
            {temple.timings && temple.timings.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-brand-primary dark:text-gray-100 mb-4">Timings</h2>
                <div className="space-y-3">
                  {temple.timings.map((timing, index) => (
                    <div key={index} className="border-l-4 border-brand-primary pl-4">
                      <p className="font-semibold text-brand-primary dark:text-gray-100">{timing.name}</p>
                      <p className="text-sm text-brand-secondary dark:text-gray-400">{timing.time}</p>
                      {timing.type && (
                        <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded mt-2 inline-block">
                          {timing.type}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Facilities */}
            {temple.facilities && temple.facilities.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-brand-primary dark:text-gray-100 mb-4">Facilities</h2>
                <div className="flex flex-wrap gap-2">
                  {temple.facilities.map((facility, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm"
                    >
                      {facility}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-brand-primary dark:text-gray-100 mb-4">Information</h2>
              <div className="space-y-2 text-sm text-brand-secondary dark:text-gray-400">
                <p>
                  <span className="font-medium">Created:</span> {temple.created_at}
                </p>
                <p>
                  <span className="font-medium">Last Updated:</span> {temple.updated_at}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminAppLayout>
  );
}
