import AdminAppLayout from "@/Layouts/AdminAppLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { ArrowLeft, CheckCircle, AlertCircle, Clock } from "lucide-react";

export default function AdminExperiencesShow() {
  const { user, experience } = usePage().props;

  const handleEdit = () => {
    window.location.href = `/admin/experiences/${experience.id}/edit`;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'inactive':
        return <AlertCircle className="w-6 h-6 text-red-600" />;
      default:
        return <Clock className="w-6 h-6 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'inactive':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getApprovalStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'rejected':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <AdminAppLayout user={user}>
      <Head title={`${experience.title} - Experience Details`} />

      {/* Header with Back Button */}
      <div className="mb-6">
        <a
          href="/admin/experiences"
          className="inline-flex items-center gap-2 text-brand-primary hover:text-brand-primary/80 text-sm font-medium mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Experiences
        </a>
        <h1 className="text-2xl md:text-3xl font-bold text-brand-primary dark:text-gray-100">
          {experience.title}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero Image */}
          {experience.image_url && (
            <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-brand-border dark:border-gray-700 overflow-hidden">
              <img
                src={experience.image_url}
                alt={experience.title}
                className="w-full h-96 object-cover"
              />
            </div>
          )}

          {/* Experience Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-brand-border dark:border-gray-700 p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold text-brand-primary dark:text-gray-100 mb-4">
              Experience Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs md:text-sm font-semibold text-brand-secondary dark:text-gray-400 uppercase">
                  Title
                </label>
                <p className="text-sm md:text-base text-brand-primary dark:text-gray-100 mt-1">
                  {experience.title}
                </p>
              </div>
              <div>
                <label className="text-xs md:text-sm font-semibold text-brand-secondary dark:text-gray-400 uppercase">
                  Category
                </label>
                <p className="text-sm md:text-base text-brand-primary dark:text-gray-100 mt-1">
                  {experience.category}
                </p>
              </div>
              <div>
                <label className="text-xs md:text-sm font-semibold text-brand-secondary dark:text-gray-400 uppercase">
                  Location
                </label>
                <p className="text-sm md:text-base text-brand-primary dark:text-gray-100 mt-1">
                  {experience.location}
                </p>
              </div>
              <div>
                <label className="text-xs md:text-sm font-semibold text-brand-secondary dark:text-gray-400 uppercase">
                  Date
                </label>
                <p className="text-sm md:text-base text-brand-primary dark:text-gray-100 mt-1">
                  {new Date(experience.start_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-brand-border dark:border-gray-700 p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold text-brand-primary dark:text-gray-100 mb-4">
              Description
            </h2>
            <p className="text-sm md:text-base text-brand-primary dark:text-gray-100 whitespace-pre-wrap">
              {experience.description || 'No description available'}
            </p>
          </div>

          {/* Highlights */}
          {experience.highlights && (
            <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-brand-border dark:border-gray-700 p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-brand-primary dark:text-gray-100 mb-4">
                Highlights
              </h2>
              {Array.isArray(experience.highlights) ? (
                <ul className="space-y-2">
                  {experience.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 bg-brand-primary rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm md:text-base text-brand-primary dark:text-gray-100">
                        {highlight}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : typeof experience.highlights === 'string' && experience.highlights.includes('<li') ? (
                <ul className="space-y-2">
                  {experience.highlights
                    .split('</li>')
                    .filter(item => item.trim())
                    .map((item, idx) => {
                      const textContent = item
                        .replace(/<li[^>]*>/g, '')
                        .replace(/<[^>]*>/g, '')
                        .trim();
                      return textContent ? (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="w-1.5 h-1.5 bg-brand-primary rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm md:text-base text-brand-primary dark:text-gray-100">
                            {textContent}
                          </span>
                        </li>
                      ) : null;
                    })}
                </ul>
              ) : (
                <p className="text-sm md:text-base text-brand-primary dark:text-gray-100">
                  {experience.highlights}
                </p>
              )}
            </div>
          )}

          {/* Booking & Pricing Details */}
          <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-brand-border dark:border-gray-700 p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold text-brand-primary dark:text-gray-100 mb-4">
              Booking & Pricing Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs md:text-sm font-semibold text-brand-secondary dark:text-gray-400 uppercase">
                  Booking Mode
                </label>
                <p className="text-sm md:text-base text-brand-primary dark:text-gray-100 mt-1 capitalize">
                  {experience.booking_mode || 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-xs md:text-sm font-semibold text-brand-secondary dark:text-gray-400 uppercase">
                  Instant Price
                </label>
                <p className="text-sm md:text-base text-brand-primary dark:text-gray-100 mt-1">
                  ₹{experience.instant_price}
                </p>
              </div>
              <div>
                <label className="text-xs md:text-sm font-semibold text-brand-secondary dark:text-gray-400 uppercase">
                  Regular Price
                </label>
                <p className="text-sm md:text-base text-brand-primary dark:text-gray-100 mt-1">
                  ₹{experience.price}
                </p>
              </div>
              <div>
                <label className="text-xs md:text-sm font-semibold text-brand-secondary dark:text-gray-400 uppercase">
                  Capacity
                </label>
                <p className="text-sm md:text-base text-brand-primary dark:text-gray-100 mt-1">
                  {experience.capacity} people
                </p>
              </div>
              <div>
                <label className="text-xs md:text-sm font-semibold text-brand-secondary dark:text-gray-400 uppercase">
                  Hold Duration
                </label>
                <p className="text-sm md:text-base text-brand-primary dark:text-gray-100 mt-1">
                  {experience.hold_duration} minutes
                </p>
              </div>
              <div>
                <label className="text-xs md:text-sm font-semibold text-brand-secondary dark:text-gray-400 uppercase">
                  Hold Token
                </label>
                <p className="text-sm md:text-base text-brand-primary dark:text-gray-100 mt-1">
                  ₹{experience.hold_token}
                </p>
              </div>
              <div>
                <label className="text-xs md:text-sm font-semibold text-brand-secondary dark:text-gray-400 uppercase">
                  Instant Availability
                </label>
                <p className="text-sm md:text-base text-brand-primary dark:text-gray-100 mt-1">
                  {experience.instant_availability} seats
                </p>
              </div>
              <div>
                <label className="text-xs md:text-sm font-semibold text-brand-secondary dark:text-gray-400 uppercase">
                  Priority Score
                </label>
                <p className="text-sm md:text-base text-brand-primary dark:text-gray-100 mt-1">
                  {experience.priority_score}
                </p>
              </div>
            </div>
          </div>

          {/* Rejection Reason (if rejected) */}
          {experience.approval_status === 'rejected' && experience.rejection_reason && (
            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl md:rounded-2xl border border-red-200 dark:border-red-800 p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-red-700 dark:text-red-400 mb-4">
                Rejection Reason
              </h2>
              <p className="text-sm md:text-base text-red-600 dark:text-red-300">
                {experience.rejection_reason}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar - Status & Vendor */}
        <div className="lg:col-span-1">
          {/* Vendor Info */}
          {experience.vendor && (
            <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-brand-border dark:border-gray-700 p-4 md:p-6 mb-6">
              <h2 className="text-lg md:text-xl font-bold text-brand-primary dark:text-gray-100 mb-4">
                Vendor
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs md:text-sm font-semibold text-brand-secondary dark:text-gray-400 uppercase">
                    Name
                  </label>
                  <p className="text-sm md:text-base text-brand-primary dark:text-gray-100 font-medium">
                    {experience.vendor.name}
                  </p>
                </div>
                {experience.vendor?.vendor_kyc?.business_type && (
                  <div className="flex justify-between items-center">
                    <label className="text-xs md:text-sm font-semibold text-brand-secondary dark:text-gray-400 uppercase">
                      Business Type
                    </label>
                    <p className="text-sm md:text-base text-brand-primary dark:text-gray-100 font-medium">
                      {experience.vendor.vendor_kyc.business_type}
                    </p>
                  </div>
                )}
              </div>
              <div className="border-t border-brand-border dark:border-gray-700 my-4" />
              <Link
                href={`/admin/vendors/${experience.vendor.id}`}
                className="w-full px-4 py-2 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-lg font-medium text-sm transition-colors text-center block"
              >
                View Vendor Details
              </Link>
            </div>
          )}

          {/* Status */}
          <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-brand-border dark:border-gray-700 p-4 md:p-6 sticky top-20">
            <h2 className="text-lg md:text-xl font-bold text-brand-primary dark:text-gray-100 mb-4">
              Status
            </h2>

            {/* Experience Status */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-brand-secondary dark:text-gray-400 uppercase block mb-2">
                Experience Status
              </label>
              <div className="flex items-center gap-3">
                {getStatusIcon(experience.status)}
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(experience.status)}`}>
                  {experience.status ? experience.status.charAt(0).toUpperCase() + experience.status.slice(1) : 'Unknown'}
                </span>
              </div>
            </div>

            <div className="border-t border-brand-border dark:border-gray-700 my-4" />

            {/* Approval Status */}
            <div>
              <label className="text-xs font-semibold text-brand-secondary dark:text-gray-400 uppercase block mb-2">
                Approval Status
              </label>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getApprovalStatusColor(experience.approval_status)}`}>
                  {experience.approval_status ? experience.approval_status.charAt(0).toUpperCase() + experience.approval_status.slice(1) : 'Pending'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminAppLayout>
  );
}
