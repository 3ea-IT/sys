import AdminAppLayout from "@/Layouts/AdminAppLayout";
import { Link, router, useForm } from "@inertiajs/react";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import ImageSourceInput from "@/Components/ImageSourceInput";

export default function TempleCreate({ crowdLevels = [] }) {
  const { data, setData, post, errors, processing } = useForm({
    name: "",
    location: "",
    image: "",
    image_file: null,
    rating: 4.5,
    crowd_level: "Moderate",
    has_vip_darshan: false,
    instant_price: 100,
    hold_token: 50,
    description: "",
    amenities: [],
    timings: [],
    facilities: [],
    status: "active",
  });

  const [amenityInput, setAmenityInput] = useState("");
  const [facilityInput, setFacilityInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route("admin.temples.store"));
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
          <h1 className="text-3xl font-bold text-brand-primary dark:text-gray-100">Create New Temple</h1>
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
                  placeholder="e.g., Kashi Vishwanath"
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
                  placeholder="e.g., Varanasi, Uttar Pradesh"
                />
                {errors.location && <p className="mt-1 text-red-600 text-sm">{errors.location}</p>}
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

              <ImageSourceInput data={data} setData={setData} errors={errors} label="Temple Image" />
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
                  onChange={(e) => setData("instant_price", parseFloat(e.target.value))}
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
                  onChange={(e) => setData("hold_token", parseFloat(e.target.value))}
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
              placeholder="Temple description..."
            />
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
              {processing ? "Creating..." : "Create Temple"}
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
