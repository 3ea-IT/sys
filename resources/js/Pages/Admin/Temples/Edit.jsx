import AdminAppLayout from "@/Layouts/AdminAppLayout";
import { Link, router, useForm } from "@inertiajs/react";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

export default function TempleEdit({ temple, crowdLevels = [] }) {
  const { data, setData, put, errors, processing } = useForm({
    name: temple.name || "",
    location: temple.location || "",
    city: temple.city || "",
    state: temple.state || "",
    main_deity: temple.main_deity || "",
    established: temple.established || "",
    significance: temple.significance || "",
    online_booking: !!temple.online_booking,
    booking_url: temple.booking_url || "",
    image: temple.image || "",
    rating: temple.rating ?? 4.5,
    crowd_level: temple.crowd_level || "Moderate",
    has_vip_darshan: !!temple.has_vip_darshan,
    instant_price: temple.instant_price ?? "",
    hold_token: temple.hold_token ?? "",
    description: temple.description || "",
    amenities: temple.amenities || [],
    timings: temple.timings || [],
    facilities: temple.facilities || [],
    status: temple.status || "active",
  });

  // Keep empty number inputs as "" (saved as null) instead of sending NaN
  const toNumber = (value) => (value === "" ? "" : parseFloat(value));

  const updateTiming = (index, field, value) => {
    setData(
      "timings",
      data.timings.map((t, i) => (i === index ? { ...t, [field]: value } : t))
    );
  };

  const addTiming = () => {
    setData("timings", [...data.timings, { name: "", time: "", type: "Regular" }]);
  };

  const removeTiming = (index) => {
    setData("timings", data.timings.filter((_, i) => i !== index));
  };

  const [amenityInput, setAmenityInput] = useState("");
  const [facilityInput, setFacilityInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    put(route("admin.temples.update", temple.id));
  };

  const addAmenity = () => {
    if (amenityInput.trim()) {
      setData("amenities", [...(data.amenities || []), amenityInput]);
      setAmenityInput("");
    }
  };

  const removeAmenity = (index) => {
    setData(
      "amenities",
      (data.amenities || []).filter((_, i) => i !== index)
    );
  };

  const addFacility = () => {
    if (facilityInput.trim()) {
      setData("facilities", [...(data.facilities || []), facilityInput]);
      setFacilityInput("");
    }
  };

  const removeFacility = (index) => {
    setData(
      "facilities",
      (data.facilities || []).filter((_, i) => i !== index)
    );
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
          <h1 className="text-3xl font-bold text-brand-primary dark:text-gray-100">Edit Temple</h1>
          <p className="text-brand-secondary dark:text-gray-400 mt-1">{temple.name}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 space-y-8">
          {/* Basic Info */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-brand-primary dark:text-gray-100">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-brand-primary dark:text-gray-200 mb-2">
                  Temple Name *
                </label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                  className="w-full px-4 py-2 border border-brand-border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
                {errors.name && <p className="mt-1 text-red-600 text-sm">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-primary dark:text-gray-200 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  value={data.location}
                  onChange={(e) => setData("location", e.target.value)}
                  className="w-full px-4 py-2 border border-brand-border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
                {errors.location && <p className="mt-1 text-red-600 text-sm">{errors.location}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-primary dark:text-gray-200 mb-2">
                  Image Path
                </label>
                <input
                  type="text"
                  value={data.image}
                  onChange={(e) => setData("image", e.target.value)}
                  className="w-full px-4 py-2 border border-brand-border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
                {errors.image && <p className="mt-1 text-red-600 text-sm">{errors.image}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-primary dark:text-gray-200 mb-2">
                  Rating (0-5) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={data.rating}
                  onChange={(e) => setData("rating", parseFloat(e.target.value))}
                  className="w-full px-4 py-2 border border-brand-border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
                {errors.rating && <p className="mt-1 text-red-600 text-sm">{errors.rating}</p>}
              </div>
            </div>
          </div>

          {/* Temple Details */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-brand-primary dark:text-gray-100">Temple Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                ["city", "City"],
                ["state", "State"],
                ["main_deity", "Main Deity"],
                ["established", "Established (Date/Century)"],
                ["significance", "Significance / Notes"],
                ["booking_url", "Booking / Verification URL"],
              ].map(([field, label]) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-brand-primary dark:text-gray-200 mb-2">
                    {label}
                  </label>
                  <input
                    type="text"
                    value={data[field]}
                    onChange={(e) => setData(field, e.target.value)}
                    className="w-full px-4 py-2 border border-brand-border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                  {errors[field] && <p className="mt-1 text-red-600 text-sm">{errors[field]}</p>}
                </div>
              ))}

              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.online_booking}
                    onChange={(e) => setData("online_booking", e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm font-medium text-brand-primary dark:text-gray-200">
                    Online Darshan / Puja Booking Available
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Pricing & Details */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-brand-primary dark:text-gray-100">Pricing & Availability</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-brand-primary dark:text-gray-200 mb-2">
                  Crowd Level *
                </label>
                <select
                  value={data.crowd_level}
                  onChange={(e) => setData("crowd_level", e.target.value)}
                  className="w-full px-4 py-2 border border-brand-border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                >
                  {crowdLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
                {errors.crowd_level && <p className="mt-1 text-red-600 text-sm">{errors.crowd_level}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-primary dark:text-gray-200 mb-2">
                  Instant Price (₹) *
                </label>
                <input
                  type="number"
                  value={data.instant_price}
                  onChange={(e) => setData("instant_price", toNumber(e.target.value))}
                  className="w-full px-4 py-2 border border-brand-border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
                {errors.instant_price && <p className="mt-1 text-red-600 text-sm">{errors.instant_price}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-primary dark:text-gray-200 mb-2">
                  Hold Token (₹)
                </label>
                <input
                  type="number"
                  value={data.hold_token}
                  onChange={(e) => setData("hold_token", toNumber(e.target.value))}
                  className="w-full px-4 py-2 border border-brand-border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.has_vip_darshan}
                    onChange={(e) => setData("has_vip_darshan", e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm font-medium text-brand-primary dark:text-gray-200">Has VIP Darshan</span>
                </label>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-brand-primary dark:text-gray-200 mb-2">
              Description
            </label>
            <textarea
              value={data.description}
              onChange={(e) => setData("description", e.target.value)}
              rows="4"
              className="w-full px-4 py-2 border border-brand-border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Timings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-brand-primary dark:text-gray-100">Timings</h2>
              <button
                type="button"
                onClick={addTiming}
                className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:opacity-90"
              >
                Add Timing
              </button>
            </div>
            {data.timings.map((timing, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_140px_auto] gap-2">
                <input
                  type="text"
                  value={timing.name || ""}
                  onChange={(e) => updateTiming(index, "name", e.target.value)}
                  placeholder="e.g., Morning Darshan"
                  className="px-4 py-2 border border-brand-border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
                <input
                  type="text"
                  value={timing.time || ""}
                  onChange={(e) => updateTiming(index, "time", e.target.value)}
                  placeholder="e.g., 6:00 AM – 12:00 PM"
                  className="px-4 py-2 border border-brand-border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
                <select
                  value={timing.type || "Regular"}
                  onChange={(e) => updateTiming(index, "type", e.target.value)}
                  className="px-4 py-2 border border-brand-border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                >
                  {["Regular", "Special", "Seasonal"].map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => removeTiming(index)}
                  className="px-3 py-2 text-red-600 dark:text-red-400 hover:opacity-75"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Amenities */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-brand-primary dark:text-gray-100">Amenities</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                placeholder="Add amenity"
                className="flex-1 px-4 py-2 border border-brand-border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
              <button
                type="button"
                onClick={addAmenity}
                className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:opacity-90"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(data.amenities || []).map((amenity, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm flex items-center gap-2">
                  {amenity}
                  <button type="button" onClick={() => removeAmenity(index)} className="text-xs hover:opacity-75">
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Facilities */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-brand-primary dark:text-gray-100">Facilities</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={facilityInput}
                onChange={(e) => setFacilityInput(e.target.value)}
                placeholder="Add facility"
                className="flex-1 px-4 py-2 border border-brand-border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
              <button
                type="button"
                onClick={addFacility}
                className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:opacity-90"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(data.facilities || []).map((facility, index) => (
                <span key={index} className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm flex items-center gap-2">
                  {facility}
                  <button type="button" onClick={() => removeFacility(index)} className="text-xs hover:opacity-75">
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-brand-primary dark:text-gray-200 mb-2">
              Status *
            </label>
            <select
              value={data.status}
              onChange={(e) => setData("status", e.target.value)}
              className="w-full px-4 py-2 border border-brand-border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-6 border-t border-brand-border dark:border-gray-700">
            <button
              type="submit"
              disabled={processing}
              className="flex-1 px-6 py-2 bg-brand-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50 font-medium"
            >
              {processing ? "Saving..." : "Save Changes"}
            </button>
            <Link
              href={route("admin.temples.index")}
              className="flex-1 px-6 py-2 border border-brand-border dark:border-gray-600 text-brand-primary dark:text-gray-300 rounded-lg hover:bg-brand-background dark:hover:bg-gray-700 text-center font-medium"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </AdminAppLayout>
  );
}
