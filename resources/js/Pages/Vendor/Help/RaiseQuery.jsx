import VendorAppLayout from "@/Layouts/VendorAppLayout";
import { Link, useForm, usePage } from "@inertiajs/react";
import {
  ArrowLeft,
  Send,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  X,
  Clock,
  Zap,
} from "lucide-react";
import { useState } from "react";

export default function VendorRaiseQuery() {
  const { user } = usePage().props;
  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    category: "",
    subject: "",
    email: "",
    phone: "",
    description: "",
    priority: "medium",
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const categories = [
    { value: "experience", label: "Experience Management" },
    { value: "booking", label: "Booking & Holds" },
    { value: "payment", label: "Payment & Settlement" },
    { value: "account", label: "Account & Verification" },
    { value: "customer", label: "Customer Issues" },
    { value: "technical", label: "Technical Issues" },
    { value: "other vendor related issue", label: "Other Vendor Related Issue" },
  ];

  const priorities = [
    { value: "low", label: "Low", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
    { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300" },
    { value: "high", label: "High", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300" },
    { value: "urgent", label: "Urgent", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" },
  ];

  const responseTimes = [
    { priority: "Urgent", time: "1-2 hours", emoji: "🔴" },
    { priority: "High", time: "4-6 hours", emoji: "🟠" },
    { priority: "Medium", time: "24 hours", emoji: "🟡" },
    { priority: "Low", time: "2-3 days", emoji: "🟢" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    post("/vendor-support-query", {
      onSuccess: () => {
        setShowSuccessModal(true);
        reset();
        // Auto close modal after 5 seconds
        setTimeout(() => {
          setShowSuccessModal(false);
        }, 5000);
      },
    });
  };

  const closeModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <VendorAppLayout user={user}>
      {/* Header */}
      <div className="mb-6 md:mb-8 pb-4 border-b border-brand-border dark:border-gray-700">
        <div className="flex items-center gap-2 mb-3">
          <Link
            href="/vendor/help"
            className="p-1.5 hover:bg-brand-border dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-brand-secondary dark:text-gray-400" />
          </Link>
          <h1 className="text-xl md:text-4xl lg:text-5xl font-bold text-brand-primary dark:text-gray-100">
            Raise a Query
          </h1>
        </div>
        <p className="text-sm text-brand-secondary dark:text-gray-400 px-1">
          Tell us about your issue and we'll help you resolve it
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-brand-border dark:border-gray-700 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-brand-primary dark:text-gray-100 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-4 py-2.5 rounded-lg border border-brand-border dark:border-gray-600 bg-white dark:bg-gray-700 text-brand-primary dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-brand-primary dark:text-gray-100 mb-2">
                  Issue Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={data.category}
                  onChange={(e) => setData("category", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-brand-border dark:border-gray-600 bg-white dark:bg-gray-700 text-brand-primary dark:text-gray-100 focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                )}
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-semibold text-brand-primary dark:text-gray-100 mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={data.subject}
                  onChange={(e) => setData("subject", e.target.value)}
                  placeholder="Brief subject of your issue"
                  className="w-full px-4 py-2.5 rounded-lg border border-brand-border dark:border-gray-600 bg-white dark:bg-gray-700 text-brand-primary dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                />
                {errors.subject && (
                  <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-brand-primary dark:text-gray-100 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => setData("email", e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-brand-border dark:border-gray-600 bg-white dark:bg-gray-700 text-brand-primary dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-brand-primary dark:text-gray-100 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={data.phone}
                  onChange={(e) => setData("phone", e.target.value)}
                  placeholder="Your phone number"
                  className="w-full px-4 py-2.5 rounded-lg border border-brand-border dark:border-gray-600 bg-white dark:bg-gray-700 text-brand-primary dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-semibold text-brand-primary dark:text-gray-100 mb-2">
                  Priority Level
                </label>
                <div className="flex gap-2 flex-wrap">
                  {priorities.map((pri) => (
                    <button
                      key={pri.value}
                      type="button"
                      onClick={() => setData("priority", pri.value)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        data.priority === pri.value
                          ? pri.color + " ring-2 ring-offset-2"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      {pri.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-brand-primary dark:text-gray-100 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={data.description}
                  onChange={(e) => setData("description", e.target.value)}
                  placeholder="Provide detailed information about your issue..."
                  maxLength={1000}
                  rows={6}
                  className="w-full px-4 py-2.5 rounded-lg border border-brand-border dark:border-gray-600 bg-white dark:bg-gray-700 text-brand-primary dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all resize-none"
                />
                <div className="text-xs text-brand-secondary dark:text-gray-400 mt-1">
                  {data.description.length}/1000 characters
                </div>
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={processing}
                className="w-full bg-brand-primary hover:bg-brand-primary/90 disabled:bg-gray-400 text-white font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {processing ? "Submitting..." : "Submit Query"}
              </button>
            </form>
          </div>
        </div>

        {/* Tips & Response Times Sidebar */}
        <div className="space-y-6">
          {/* Response Times */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-brand-border dark:border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-brand-primary" />
              <h3 className="font-bold text-brand-primary dark:text-gray-100">
                Expected Response Times
              </h3>
            </div>
            <div className="space-y-3">
              {responseTimes.map((item) => (
                <div key={item.priority} className="flex items-center justify-between p-2 bg-brand-background dark:bg-gray-700/30 rounded-lg">
                  <div>
                    <p className="text-sm font-semibold text-brand-primary dark:text-gray-100">
                      {item.emoji} {item.priority}
                    </p>
                  </div>
                  <p className="text-xs text-brand-secondary dark:text-gray-400 font-medium">
                    {item.time}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-bold text-blue-900 dark:text-blue-100">
                Tips for Faster Resolution
              </h3>
            </div>
            <ul className="space-y-2">
              {[
                "Be specific and detailed",
                "Include experience or booking IDs",
                "Attach screenshots if relevant",
                "Use appropriate priority level",
              ].map((tip, idx) => (
                <li key={idx} className="text-sm text-blue-800 dark:text-blue-200">
                  ✓ {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-8 transform transition-all">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>

            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>

            {/* Content */}
            <h2 className="text-2xl font-bold text-brand-primary dark:text-gray-100 text-center mb-3">
              Query Submitted Successfully!
            </h2>
            <p className="text-center text-brand-secondary dark:text-gray-400 mb-6">
              Your query has been submitted successfully. Our support team will contact you within the expected timeframe.
            </p>

            {/* Details */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-800 dark:text-green-200">
                We've received your query and will prioritize it based on the urgency level you selected. Thank you for reaching out!
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={closeModal}
              className="w-full bg-gradient-to-r from-brand-primary to-blue-600 hover:from-brand-primary/90 hover:to-blue-600/90 text-white font-semibold py-3 px-6 rounded-lg transition-all"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      <div className="h-10"></div>
    </VendorAppLayout>
  );
}
