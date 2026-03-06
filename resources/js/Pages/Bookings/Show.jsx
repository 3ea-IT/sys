import AppLayout from "@/Layouts/AppLayout";
import { Link, router, usePage } from "@inertiajs/react";
import { ArrowLeft, Calendar, Clock, MapPin, Ticket, Printer, Download, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function BookingShow({ booking = {} }) {
  const { auth } = usePage().props;
  const experience = booking?.experience || {};
  const [isLoading, setIsLoading] = useState(false);

  // Utility function to convert HTML to plain text
  const htmlToPlainText = (html) => {
    if (!html) return "No description available";
    
    // Create a temporary div element
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    // Get text content and clean up
    let text = temp.textContent || temp.innerText || '';
    
    // Remove extra whitespace
    text = text.replace(/\s+/g, ' ').trim();
    
    return text;
  };

  const handleCancel = () => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    setIsLoading(true);
    router.post(`/bookings/${booking.id}/cancel`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "—";
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "—";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-GB", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "—";
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      confirmed: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-700 dark:text-green-300",
        icon: "✅",
        label: "Confirmed",
      },
      pending: {
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
        text: "text-yellow-700 dark:text-yellow-300",
        icon: "⏳",
        label: "Pending",
      },
      cancelled: {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-700 dark:text-red-300",
        icon: "❌",
        label: "Cancelled",
      },
    };
    return badges[status] || badges.cancelled;
  };

  const badge = getStatusBadge(booking.status);
  const bookingType = booking.booking_type === "instant" ? "⚡ Instant Booking" : "🔒 Hold Confirmed";

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-brand-border dark:border-gray-700">
        <button
          onClick={() => window.history.back()}
          className="p-2 hover:bg-brand-border dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-brand-secondary dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-brand-primary dark:text-gray-100">
            Booking Details
          </h1>
          <p className="text-sm text-brand-secondary dark:text-gray-400 mt-1">
            Booking ID: <span className="font-mono">#{booking.id}</span>
          </p>
        </div>
      </div>

      {/* Status Banner */}
      <div className={`rounded-lg mb-6 border overflow-hidden shadow-sm ${badge.bg} ${badge.text}`}>
        <div className="p-3 md:p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl flex-shrink-0">{badge.icon}</span>
            <div className="flex-1">
              <h3 className="text-base font-bold">{badge.label}</h3>
              <div className="text-xs opacity-80 mt-0.5">
                {booking.status === "confirmed" && booking.confirmed_at ? (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span className="font-medium">
                      {formatDateTime(booking.confirmed_at)}
                    </span>
                  </div>
                ) : booking.status === "cancelled" && booking.cancelled_at ? (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span className="font-medium">
                      {formatDateTime(booking.cancelled_at)}
                    </span>
                  </div>
                ) : booking.status === "confirmed" ? (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span className="font-medium">
                      {formatDateTime(booking.created_at)}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Awaiting confirmation</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Experience Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card border border-brand-border dark:border-gray-700 overflow-hidden mb-6">
        {/* Experience Image */}
        <div className="relative h-64 md:h-80 overflow-hidden bg-gray-300 dark:bg-gray-700">
          {experience.image ? (
            <img
              src={experience.image.startsWith('/') ? experience.image : `/assets/experiences/${experience.image}`}
              alt={experience.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-gray-400">No Image Available</span>
            </div>
          )}
          {/* Overlay Badge */}
          <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-lg">
            <p className="text-sm font-bold text-brand-primary">{bookingType}</p>
          </div>
        </div>

        {/* Experience Info */}
        <div className="p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-primary dark:text-gray-100 mb-4">
            {experience.title}
          </h2>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-0 text-sm md:text-base text-brand-secondary dark:text-gray-400">
              <span className="text-lg">🏷️</span>
              <span className="font-semibold">Category:</span>
              <span className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-xs font-medium capitalize">
                {experience.category || "—"}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm md:text-base text-brand-secondary dark:text-gray-400">
              <MapPin className="w-5 h-5 flex-shrink-0" />
              <span>{experience.location || "—"}</span>
            </div>
          </div>

          <p className="text-brand-secondary dark:text-gray-400 leading-relaxed mb-6">
            {htmlToPlainText(experience.description)}
          </p>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Booking Info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card border border-brand-border dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-primary to-blue-500 dark:from-blue-700 dark:to-blue-900 p-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Ticket className="w-5 h-5" />
              Booking Information
            </h3>
          </div>

          {/* Content */}
          <div className="p-6 space-y-1">
            <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
              <DetailRow label="Booking ID" value={`#${booking.id}`} mono />
            </div>
            <div className="py-4 border-b border-gray-200 dark:border-gray-700">
              <DetailRow label="Booking Type" value={bookingType} />
            </div>
            <div className="py-4 border-b border-gray-200 dark:border-gray-700">
              <DetailRow label="Status" value={badge.label} />
            </div>
            <div className="py-4 border-b border-gray-200 dark:border-gray-700">
              <DetailRow
                label="Booked On"
                value={formatDateTime(booking.created_at)}
              />
            </div>
            {booking.confirmed_at && (
              <div className="py-4">
                <DetailRow
                  label="Confirmed On"
                  value={formatDateTime(booking.confirmed_at)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Pricing Info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card border border-brand-border dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-700 dark:to-teal-700 p-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              💰 Payment Details
            </h3>
          </div>

          {/* Content */}
          <div className="p-6 space-y-1">
            <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
              <DetailRow
                label="Total Amount"
                value={`₹${parseFloat(booking.total_amount || 0).toFixed(2)}`}
                highlight
              />
            </div>
            <div className="py-4 border-b border-gray-200 dark:border-gray-700">
              <DetailRow
                label="Paid Amount"
                value={`₹${parseFloat(booking.paid_amount || 0).toFixed(2)}`}
              />
            </div>

            {booking.status === "confirmed" && (
              <div className="pt-4">
                <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                  <span className="text-2xl flex-shrink-0">✅</span>
                  <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                    Payment received & confirmed
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cancellation Policy */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6 mb-8 flex gap-4">
        <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-2">Cancellation Policy</h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Free cancellation up to 7 days before the experience</li>
            <li>• 50% refund for cancellation 3-7 days before</li>
            <li>• No refund for cancellations within 72 hours</li>
          </ul>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 flex-col sm:flex-row pb-20">
        {booking.status === "confirmed" && (
          <>
            <button
              onClick={() => window.print()}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-white dark:bg-gray-800 border border-brand-border dark:border-gray-700 rounded-lg font-semibold text-brand-primary dark:text-blue-400 hover:bg-brand-background dark:hover:bg-gray-700 transition-all"
            >
              <Printer className="w-5 h-5" />
              Print Ticket
            </button>

            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg font-semibold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <span className="inline-block animate-spin">⚙️</span>
                  Cancelling...
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5" />
                  Cancel Booking
                </>
              )}
            </button>
          </>
        )}

        {booking.status === "cancelled" && (
          <Link
            href="/bookings"
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-brand-primary text-white rounded-lg font-semibold hover:bg-brand-primary/90 transition-all"
          >
            Back to Bookings
          </Link>
        )}
      </div>

      {/* Print Hidden Section */}
      <div className="hidden print:block">
        <style>{`
          @media print {
            body { padding: 20px; }
            .no-print { display: none; }
          }
        `}</style>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">🎫 Your Booking Ticket</h1>
          <p className="text-gray-600">SecureSeat Reservations</p>
        </div>

        <div className="border-4 border-black p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">{experience.title}</h2>
          <p className="text-lg mb-2">📍 {experience.location}</p>
          <p className="text-lg mb-8">Booking: #{booking.id}</p>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-sm font-bold text-gray-600">Amount Paid</p>
              <p className="text-2xl font-bold">₹{parseFloat(booking.paid_amount || 0).toFixed(0)}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-600">Confirmation</p>
              <p className="text-2xl font-bold">✅ CONFIRMED</p>
            </div>
          </div>

          <p className="text-center text-sm text-gray-600">
            Booking Date: {formatDateTime(booking.confirmed_at)}
          </p>
        </div>
      </div>
    </AppLayout>
  );
}

function DetailRow({ label, value, mono = false, highlight = false }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm md:text-base text-brand-secondary dark:text-gray-400 font-medium">{label}</span>
      <span
        className={`text-sm md:text-base font-bold ${
          highlight ? "text-emerald-600 dark:text-emerald-400 text-lg" : "text-gray-900 dark:text-gray-100"
        } ${mono ? "font-mono text-xs md:text-sm" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
