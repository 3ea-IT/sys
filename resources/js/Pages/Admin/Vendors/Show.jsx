import AdminAppLayout from "@/Layouts/AdminAppLayout";
import { Head, usePage } from "@inertiajs/react";
import { ArrowLeft, CheckCircle, AlertCircle, Clock } from "lucide-react";

export default function AdminVendorsShow() {
  const { vendor, user } = usePage().props;

  const kyc = vendor.vendor_kyc;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'rejected':
        return <AlertCircle className="w-6 h-6 text-red-600" />;
      case 'submitted':
        return <Clock className="w-6 h-6 text-yellow-600" />;
      default:
        return <Clock className="w-6 h-6 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'rejected':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'submitted':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <AdminAppLayout user={user}>
      <Head title={`${vendor.name} - Vendor Details`} />

      {/* Header with Back Button */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <a
            href="/admin/vendors"
            className="inline-flex items-center gap-2 text-brand-primary hover:text-brand-primary/80 text-sm font-medium mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Vendors
          </a>
          <h1 className="text-2xl md:text-3xl font-bold text-brand-primary dark:text-gray-100">
            {vendor.name}
          </h1>
        </div>
        {/* <a
          href={`/admin/vendors/${vendor.id}/edit`}
          className="px-4 py-2 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-lg font-medium text-sm transition-colors"
        >
          Edit
        </a> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vendor Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-brand-border dark:border-gray-700 p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold text-brand-primary dark:text-gray-100 mb-4">
              Vendor Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs md:text-sm font-semibold text-brand-secondary dark:text-gray-400 uppercase">
                  Name
                </label>
                <p className="text-sm md:text-base text-brand-primary dark:text-gray-100 mt-1">
                  {vendor.name}
                </p>
              </div>
              <div>
                <label className="text-xs md:text-sm font-semibold text-brand-secondary dark:text-gray-400 uppercase">
                  Email
                </label>
                <p className="text-sm md:text-base text-brand-primary dark:text-gray-100 mt-1">
                  {vendor.email}
                </p>
              </div>
              <div>
                <label className="text-xs md:text-sm font-semibold text-brand-secondary dark:text-gray-400 uppercase">
                  Joined
                </label>
                <p className="text-sm md:text-base text-brand-primary dark:text-gray-100 mt-1">
                  {new Date(vendor.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Business Info */}
          {kyc && (
            <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-brand-border dark:border-gray-700 p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-brand-primary dark:text-gray-100 mb-4">
                Business Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs md:text-sm font-semibold text-brand-secondary dark:text-gray-400 uppercase">
                    Business Name
                  </label>
                  <p className="text-sm md:text-base text-brand-primary dark:text-gray-100 mt-1">
                    {kyc.business_name}
                  </p>
                </div>
                <div>
                  <label className="text-xs md:text-sm font-semibold text-brand-secondary dark:text-gray-400 uppercase">
                    Business Type
                  </label>
                  <p className="text-sm md:text-base text-brand-primary dark:text-gray-100 mt-1">
                    {kyc.business_type}
                  </p>
                </div>
                <div>
                  <label className="text-xs md:text-sm font-semibold text-brand-secondary dark:text-gray-400 uppercase">
                    Business Description
                  </label>
                  <p className="text-sm md:text-base text-brand-primary dark:text-gray-100 mt-1">
                    {kyc.business_description || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Contact & Address */}
          {kyc && (
            <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-brand-border dark:border-gray-700 p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-brand-primary dark:text-gray-100 mb-4">
                Contact & Address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs md:text-sm font-semibold text-brand-secondary dark:text-gray-400 uppercase">
                    Phone
                  </label>
                  <p className="text-sm md:text-base text-brand-primary dark:text-gray-100 mt-1">
                    {kyc.phone || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-xs md:text-sm font-semibold text-brand-secondary dark:text-gray-400 uppercase">
                    Address
                  </label>
                  <p className="text-sm md:text-base text-brand-primary dark:text-gray-100 mt-1">
                    {kyc.address || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-xs md:text-sm font-semibold text-brand-secondary dark:text-gray-400 uppercase">
                    City
                  </label>
                  <p className="text-sm md:text-base text-brand-primary dark:text-gray-100 mt-1">
                    {kyc.city || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-xs md:text-sm font-semibold text-brand-secondary dark:text-gray-400 uppercase">
                    State
                  </label>
                  <p className="text-sm md:text-base text-brand-primary dark:text-gray-100 mt-1">
                    {kyc.state || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-xs md:text-sm font-semibold text-brand-secondary dark:text-gray-400 uppercase">
                    Postal Code
                  </label>
                  <p className="text-sm md:text-base text-brand-primary dark:text-gray-100 mt-1">
                    {kyc.postal_code || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-xs md:text-sm font-semibold text-brand-secondary dark:text-gray-400 uppercase">
                    Country
                  </label>
                  <p className="text-sm md:text-base text-brand-primary dark:text-gray-100 mt-1">
                    {kyc.country || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Bank Details */}
          {kyc && (
            <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-brand-border dark:border-gray-700 p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-brand-primary dark:text-gray-100 mb-4">
                Bank Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs md:text-sm font-semibold text-brand-secondary dark:text-gray-400 uppercase">
                    Account Number
                  </label>
                  <p className="text-sm md:text-base text-brand-primary dark:text-gray-100 mt-1">
                    {kyc.account_number || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-xs md:text-sm font-semibold text-brand-secondary dark:text-gray-400 uppercase">
                    IFSC Code
                  </label>
                  <p className="text-sm md:text-base text-brand-primary dark:text-gray-100 mt-1">
                    {kyc.ifsc_code || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-xs md:text-sm font-semibold text-brand-secondary dark:text-gray-400 uppercase">
                    Business License
                  </label>
                  <p className="text-sm md:text-base text-brand-primary dark:text-gray-100 mt-1">
                    {kyc.business_license_number || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-xs md:text-sm font-semibold text-brand-secondary dark:text-gray-400 uppercase">
                    Tax ID
                  </label>
                  <p className="text-sm md:text-base text-brand-primary dark:text-gray-100 mt-1">
                    {kyc.tax_id || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Rejection Reason (if rejected) */}
          {kyc && kyc.status === 'rejected' && kyc.rejection_reason && (
            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl md:rounded-2xl border border-red-200 dark:border-red-800 p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-red-700 dark:text-red-400 mb-4">
                Rejection Reason
              </h2>
              <p className="text-sm md:text-base text-red-600 dark:text-red-300">
                {kyc.rejection_reason}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar - Status */}
        <div className="lg:col-span-1">
          {kyc && (
            <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-brand-border dark:border-gray-700 p-4 md:p-6 sticky top-20">
              <h2 className="text-lg md:text-xl font-bold text-brand-primary dark:text-gray-100 mb-4">
                KYC Status
              </h2>

              {/* Current Status */}
              <div className="flex items-center gap-3 mb-2">
                {getStatusIcon(kyc.status)}
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(kyc.status)}`}>
                  {kyc.status.charAt(0).toUpperCase() + kyc.status.slice(1)}
                </span>
              </div>
              {kyc.submitted_at && (
                <p className="text-xs md:text-sm text-brand-secondary dark:text-gray-400 mt-2">
                  Submitted: {new Date(kyc.submitted_at).toLocaleString()}
                </p>
              )}
              {kyc.approved_at && (
                <p className="text-xs md:text-sm text-green-600 dark:text-green-400 mt-1">
                  Approved: {new Date(kyc.approved_at).toLocaleString()}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminAppLayout>
  );
}
