import AppLayout from "@/Layouts/AppLayout";
import { Link, useForm } from "@inertiajs/react";
import {
  ArrowLeft,
  Send,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  X,
} from "lucide-react";
import { useState } from "react";

export default function RaiseQuery() {
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
    { value: "booking", label: "Booking Issues" },
    { value: "payment", label: "Payment Issues" },
    { value: "account", label: "Account & Profile" },
    { value: "hold", label: "Hold & Reservation" },
    { value: "refund", label: "Refunds & Wallet" },
    { value: "technical", label: "Technical Issues" },
    { value: "other website related issue", label: "Other Website Related Issue" },
  ];

  const priorities = [
    { value: "low", label: "Low", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
    { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300" },
    { value: "high", label: "High", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300" },
    { value: "urgent", label: "Urgent", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    post("/support-query", {
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
    <AppLayout>
      {/* Header */}
      <div className="mb-6 md:mb-8 pb-4 border-b border-brand-border dark:border-gray-700">
        <div className="flex items-center gap-2 mb-3">
          <Link
            href="/help"
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
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-brand-border dark:border-gray-700 p-6">
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
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={data.category}
                  onChange={(e) => setData("category", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-brand-border dark:border-gray-600 bg-white dark:bg-gray-700 text-brand-primary dark:text-gray-100 focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                >
                  <option value="">Select a category...</option>
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
                  placeholder="Brief summary of your issue"
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
                  placeholder="your@email.com"
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
                  placeholder="+91 xxxxx-xxxxx"
                  className="w-full px-4 py-2.5 rounded-lg border border-brand-border dark:border-gray-600 bg-white dark:bg-gray-700 text-brand-primary dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-semibold text-brand-primary dark:text-gray-100 mb-3">
                  Priority Level
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {priorities.map((pri) => (
                    <button
                      key={pri.value}
                      type="button"
                      onClick={() => setData("priority", pri.value)}
                      className={`py-2 px-3 rounded-lg font-medium text-sm transition-all ${
                        data.priority === pri.value
                          ? pri.color + " ring-2 ring-offset-2 dark:ring-offset-0"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
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
                  placeholder="Please provide detailed information about your issue..."
                  rows={6}
                  className="w-full px-4 py-2.5 rounded-lg border border-brand-border dark:border-gray-600 bg-white dark:bg-gray-700 text-brand-primary dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all resize-none"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
                <p className="text-xs text-brand-secondary dark:text-gray-400 mt-1">
                  {data.description.length}/1000 characters
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={processing}
                className="w-full bg-gradient-to-r from-brand-primary to-blue-600 hover:from-brand-primary/90 hover:to-blue-600/90 text-white font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                {processing ? "Submitting..." : "Submit Query"}
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar - Tips */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700/50 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <h3 className="font-bold text-blue-900 dark:text-blue-100">Tips for Faster Resolution</h3>
            </div>
            <ul className="space-y-3 text-sm text-blue-800 dark:text-blue-200">
              <li className="flex gap-2">
                <span className="text-blue-600 dark:text-blue-400 font-bold flex-shrink-0">•</span>
                <span>Provide as much detail as possible about your issue</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600 dark:text-blue-400 font-bold flex-shrink-0">•</span>
                <span>Include relevant booking or transaction IDs (if any)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600 dark:text-blue-400 font-bold flex-shrink-0">•</span>
                <span>Select the correct priority level</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600 dark:text-blue-400 font-bold flex-shrink-0">•</span>
                <span>Ensure your contact info is correct</span>
              </li>
            </ul>
          </div>

          {/* Response Time Info */}
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg border border-brand-border dark:border-gray-700 p-6">
            <h3 className="font-bold text-brand-primary dark:text-gray-100 mb-4">Expected Response Time</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-brand-secondary dark:text-gray-400">Urgent</span>
                <span className="text-sm font-semibold text-red-600 dark:text-red-400">1-2 hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-brand-secondary dark:text-gray-400">High</span>
                <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">4-6 hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-brand-secondary dark:text-gray-400">Medium</span>
                <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">24 hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-brand-secondary dark:text-gray-400">Low</span>
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">2-3 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-10"></div>

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
              Your query is submitted successfully. Our team will contact you within 24 hours.
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
    </AppLayout>
  );
}
