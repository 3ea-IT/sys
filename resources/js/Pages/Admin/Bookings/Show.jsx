import AdminAppLayout from "@/Layouts/AdminAppLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { ArrowLeft, CheckCircle, AlertCircle, Clock } from "lucide-react";

export default function AdminBookingsShow() {
  const { user: authUser, booking } = usePage().props;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-6 h-6 text-emerald-600" />;
      case 'pending':
        return <Clock className="w-6 h-6 text-amber-600" />;
      case 'cancelled':
        return <AlertCircle className="w-6 h-6 text-red-600" />;
      default:
        return <Clock className="w-6 h-6 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400';
      case 'pending':
        return 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400';
      case 'cancelled':
        return 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400';
    }
  };

  const getStatusLabel = (status) => {
    return status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Pending';
  };

  const getBookingTypeLabel = (type) => {
    switch (type) {
      case 'instant':
        return 'Instant Booking';
      case 'hold':
        return 'Hold → Confirmed';
      default:
        return type;
    }
  };

  const getBookingTypeColor = (type) => {
    switch (type) {
      case 'instant':
        return 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400';
      case 'hold':
        return 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400';
    }
  };

  return (
    <AdminAppLayout user={authUser}>
      <Head title={`Booking #${booking.id}`} />

      {/* Header with Back Button */}
      <div className="mb-6">
        <Link
          href="/admin/bookings"
          className="inline-flex items-center gap-2 text-brand-primary hover:text-brand-primary/80 text-sm font-medium mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Bookings
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-brand-primary dark:text-gray-100">
          Booking #{booking.id}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Booking Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-brand-border dark:border-gray-700 p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold text-brand-primary dark:text-gray-100 mb-4">
              Booking Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs md:text-sm font-semibold text-brand-secondary dark:text-gray-400 uppercase">
                  Booking Type
                </label>
                <p className="text-sm md:text-base text-brand-primary dark:text-gray-100 mt-1">
                  {getBookingTypeLabel(booking.booking_type)}
                </p>
              </div>
              <div>
                <label className="text-xs md:text-sm font-semibold text-brand-secondary dark:text-gray-400 uppercase">
                  Status
                </label>
                <p className="text-sm md:text-base text-brand-primary dark:text-gray-100 mt-1">
                  {getStatusLabel(booking.status)}
                </p>
              </div>
              <div>
                <label className="text-xs md:text-sm font-semibold text-brand-secondary dark:text-gray-400 uppercase">
                  Created At
                </label>
                <p className="text-sm md:text-base text-brand-primary dark:text-gray-100 mt-1">
                  {new Date(booking.created_at).toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <div>
                <label className="text-xs md:text-sm font-semibold text-brand-secondary dark:text-gray-400 uppercase">
                  Last Updated
                </label>
                <p className="text-sm md:text-base text-brand-primary dark:text-gray-100 mt-1">
                  {new Date(booking.updated_at).toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-brand-border dark:border-gray-700 p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold text-brand-primary dark:text-gray-100 mb-4">
              Payment Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs md:text-sm font-semibold text-brand-secondary dark:text-gray-400 uppercase">
                  Total Amount
                </label>
                <p className="text-sm md:text-base text-brand-primary dark:text-gray-100 mt-1 font-semibold">
                  ₹{Number(booking.total_amount).toFixed(2)}
                </p>
              </div>
              <div>
                <label className="text-xs md:text-sm font-semibold text-brand-secondary dark:text-gray-400 uppercase">
                  Paid Amount
                </label>
                <p className="text-sm md:text-base text-brand-primary dark:text-gray-100 mt-1 font-semibold">
                  ₹{Number(booking.paid_amount).toFixed(2)}
                </p>
              </div>
              {booking.hold_token_paid > 0 && (
                <div>
                  <label className="text-xs md:text-sm font-semibold text-brand-secondary dark:text-gray-400 uppercase">
                    Hold Token Paid
                  </label>
                  <p className="text-sm md:text-base text-brand-primary dark:text-gray-100 mt-1">
                    ₹{Number(booking.hold_token_paid).toFixed(2)}
                  </p>
                </div>
              )}
              <div>
                <label className="text-xs md:text-sm font-semibold text-brand-secondary dark:text-gray-400 uppercase">
                  Balance
                </label>
                <p className={`text-sm md:text-base mt-1 font-semibold ${
                  Number(booking.total_amount) === Number(booking.paid_amount)
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-amber-600 dark:text-amber-400'
                }`}>
                  ₹{(Number(booking.total_amount) - Number(booking.paid_amount)).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Experience Information */}
          {booking.experience && (
            <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-brand-border dark:border-gray-700 p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-brand-primary dark:text-gray-100 mb-4">
                Experience Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs md:text-sm font-semibold text-brand-secondary dark:text-gray-400 uppercase">
                    Title
                  </label>
                  <p className="text-sm md:text-base text-brand-primary dark:text-gray-100 mt-1">
                    {booking.experience.title}
                  </p>
                </div>
                <div>
                  <label className="text-xs md:text-sm font-semibold text-brand-secondary dark:text-gray-400 uppercase">
                    Location
                  </label>
                  <p className="text-sm md:text-base text-brand-primary dark:text-gray-100 mt-1">
                    {booking.experience.location || 'N/A'}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs md:text-sm font-semibold text-brand-secondary dark:text-gray-400 uppercase">
                    Description
                  </label>
                  <p className="text-sm md:text-base text-brand-primary dark:text-gray-100 mt-1">
                    {booking.experience.description || 'No description provided'}
                  </p>
                </div>
                <div>
                  <label className="text-xs md:text-sm font-semibold text-brand-secondary dark:text-gray-400 uppercase">
                    Regular Price
                  </label>
                  <p className="text-sm md:text-base text-brand-primary dark:text-gray-100 mt-1">
                    ₹{Number(booking.experience.price).toFixed(2)}
                  </p>
                </div>
                <div>
                  <label className="text-xs md:text-sm font-semibold text-brand-secondary dark:text-gray-400 uppercase">
                    Instant Price
                  </label>
                  <p className="text-sm md:text-base text-brand-primary dark:text-gray-100 mt-1">
                    ₹{Number(booking.experience.instant_price).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - User & Status */}
        <div className="lg:col-span-1 space-y-6">
          {/* User Info */}
          {booking.user && (
            <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-brand-border dark:border-gray-700 p-4 md:p-6 sticky top-20">
              <h2 className="text-lg md:text-xl font-bold text-brand-primary dark:text-gray-100 mb-4">
                User Information
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-brand-secondary dark:text-gray-400 uppercase block mb-1">
                    Name
                  </label>
                  <p className="text-sm text-brand-primary dark:text-gray-100">
                    {booking.user.name}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-brand-secondary dark:text-gray-400 uppercase block mb-1">
                    Email
                  </label>
                  <p className="text-sm text-brand-primary dark:text-gray-100 break-all">
                    {booking.user.email}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-brand-secondary dark:text-gray-400 uppercase block mb-1">
                    Phone
                  </label>
                  <p className="text-sm text-brand-primary dark:text-gray-100">
                    {booking.user.phone || 'Not provided'}
                  </p>
                </div>
                {(booking.user.city || booking.user.state || booking.user.country) && (
                  <div>
                    <label className="text-xs font-semibold text-brand-secondary dark:text-gray-400 uppercase block mb-1">
                      Location
                    </label>
                    <p className="text-sm text-brand-primary dark:text-gray-100">
                      {[booking.user.city, booking.user.state, booking.user.country]
                        .filter(Boolean)
                        .join(', ') || 'Not provided'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Status Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-brand-border dark:border-gray-700 p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold text-brand-primary dark:text-gray-100 mb-4">
              Status Details
            </h2>

            {/* Booking Status */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-brand-secondary dark:text-gray-400 uppercase block mb-2">
                Booking Status
              </label>
              <div className="flex items-center gap-2">
                {getStatusIcon(booking.status)}
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                  {getStatusLabel(booking.status)}
                </span>
              </div>
            </div>

            {/* Booking Type */}
            <div>
              <label className="text-xs font-semibold text-brand-secondary dark:text-gray-400 uppercase block mb-2">
                Booking Type
              </label>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getBookingTypeColor(booking.booking_type)}`}>
                {getBookingTypeLabel(booking.booking_type)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </AdminAppLayout>
  );
}
