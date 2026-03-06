import AppLayout from "@/Layouts/AppLayout";
import { Link, router, usePage } from "@inertiajs/react";
import { Calendar, Clock, MapPin, Ticket, ShieldCheck, XCircle, Loader, ArrowLeft } from "lucide-react";
import { useState } from "react";

export default function BookingsIndex({ bookings = null }) {
  const { auth } = usePage().props;
  const user = auth?.user;

  const [loadingBookingId, setLoadingBookingId] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(null);

  // Filter bookings by status
  const confirmedBookings = bookings?.data.filter(b => b.status === 'confirmed') || [];
  const pendingBookings = bookings?.data.filter(b => b.status === 'pending') || [];
  const cancelledBookings = bookings?.data.filter(b => b.status === 'cancelled') || [];

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    setLoadingBookingId(bookingId);
    
    try {
      await router.post(`/bookings/${bookingId}/cancel`);
    } catch (error) {
      console.error('Cancel failed:', error);
    } finally {
      setLoadingBookingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      confirmed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-700',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700',
      cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600'
    };
    return badges[status] || badges.cancelled;
  };

  const getBookingTypeLabel = (type) => {
    return type === 'instant' ? '⚡ Instant' : '🔒 Hold Confirmed';
  };

  if (!bookings) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
          <Ticket className="w-16 h-16 md:w-20 md:h-20 text-brand-secondary mb-4 opacity-50" />
          <h1 className="text-2xl md:text-3xl font-bold text-brand-primary dark:text-gray-100 mb-2">
            No Bookings Yet
          </h1>
          <p className="text-sm md:text-base text-brand-secondary dark:text-gray-400 max-w-md mb-6">
            Your confirmed bookings will appear here. Secure your access to exclusive experiences!
          </p>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-primary/90 transition-all"
          >
            Explore Experiences
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-6 md:mb-8 pb-4 border-b border-brand-border dark:border-gray-700">
        <div className="flex items-center gap-2 mb-3">
          <Link
            href="/"
            className="p-1.5 hover:bg-brand-border dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-brand-secondary dark:text-gray-400" />
          </Link>
          <h1 className="text-xl md:text-4xl lg:text-5xl font-bold text-brand-primary dark:text-gray-100">
            My Bookings
          </h1>
        </div>
        <div className="flex items-center justify-between px-1">
          <p className="text-sm text-brand-secondary dark:text-gray-400">Total Bookings</p>
          <p className="text-2xl md:text-3xl font-black text-brand-primary dark:text-gray-100">
            {bookings.total}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6 md:mb-10">
        <button
          onClick={() => setSelectedFilter(selectedFilter === 'confirmed' ? null : 'confirmed')}
          className={`rounded-xl p-3 md:p-6 shadow-card border-2 transition-all ${
            selectedFilter === 'confirmed'
              ? 'bg-green-50 dark:bg-green-900/20 border-green-600 dark:border-green-400'
              : 'bg-white dark:bg-gray-800 border-brand-border dark:border-gray-700 hover:border-green-600 dark:hover:border-green-400'
          }`}
        >
          <div className="flex flex-col items-center text-center">
            <p className="text-xs md:text-sm font-semibold text-brand-secondary dark:text-gray-400">Confirmed</p>
            <p className="text-lg md:text-3xl font-bold text-green-600 dark:text-green-400">
              {confirmedBookings.length}
            </p>
          </div>
        </button>

        <button
          onClick={() => setSelectedFilter(selectedFilter === 'pending' ? null : 'pending')}
          className={`rounded-xl p-3 md:p-6 shadow-card border-2 transition-all ${
            selectedFilter === 'pending'
              ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-600 dark:border-yellow-400'
              : 'bg-white dark:bg-gray-800 border-brand-border dark:border-gray-700 hover:border-yellow-600 dark:hover:border-yellow-400'
          }`}
        >
          <div className="flex flex-col items-center text-center">
            <p className="text-xs md:text-sm font-semibold text-brand-secondary dark:text-gray-400">Pending</p>
            <p className="text-lg md:text-3xl font-bold text-yellow-600 dark:text-yellow-400">
              {pendingBookings.length}
            </p>
          </div>
        </button>

        <button
          onClick={() => setSelectedFilter(selectedFilter === 'cancelled' ? null : 'cancelled')}
          className={`rounded-xl p-3 md:p-6 shadow-card border-2 transition-all ${
            selectedFilter === 'cancelled'
              ? 'bg-gray-100 dark:bg-gray-700 border-gray-600 dark:border-gray-400'
              : 'bg-white dark:bg-gray-800 border-brand-border dark:border-gray-700 hover:border-gray-600 dark:hover:border-gray-400'
          }`}
        >
          <div className="flex flex-col items-center text-center">
            <p className="text-xs md:text-sm font-semibold text-brand-secondary dark:text-gray-400">Cancelled</p>
            <p className="text-lg md:text-3xl font-bold text-gray-600 dark:text-gray-400">
              {cancelledBookings.length}
            </p>
          </div>
        </button>
      </div>

      {/* Confirmed Bookings */}
      {(!selectedFilter || selectedFilter === 'confirmed') && confirmedBookings.length > 0 && (
        <section className="mb-8 md:mb-10">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-brand-primary dark:text-gray-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 md:w-7 md:h-7 text-green-600" />
              <span className="hidden sm:inline">Confirmed Bookings</span>
              <span className="sm:hidden">Confirmed</span>
            </h2>
            {confirmedBookings.length > 3 && (
              <Link href="#confirmed" className="text-sm font-medium text-brand-primary hover:text-brand-primary/80 transition-colors">
                View all ({confirmedBookings.length})
              </Link>
            )}
          </div>

          <div className="space-y-4">
            {confirmedBookings.slice(0, 3).map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onCancel={handleCancelBooking}
                loading={loadingBookingId === booking.id}
                type="confirmed"
              />
            ))}
          </div>
        </section>
      )}

      {/* Pending Bookings */}
      {(!selectedFilter || selectedFilter === 'pending') && pendingBookings.length > 0 && (
        <section className="mb-8 md:mb-10">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-brand-primary dark:text-gray-100 flex items-center gap-2">
              <Clock className="w-5 h-5 md:w-7 md:h-7 text-yellow-600" />
              <span className="hidden sm:inline">Pending Holds</span>
              <span className="sm:hidden">Pending</span>
            </h2>
            {pendingBookings.length > 3 && (
              <Link href="#pending" className="text-sm font-medium text-brand-primary hover:text-brand-primary/80 transition-colors">
                View all ({pendingBookings.length})
              </Link>
            )}
          </div>

          <div className="space-y-4">
            {pendingBookings.slice(0, 3).map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onCancel={handleCancelBooking}
                loading={loadingBookingId === booking.id}
                type="pending"
              />
            ))}
          </div>
        </section>
      )}

      {/* Cancelled Bookings */}
      {(!selectedFilter || selectedFilter === 'cancelled') && cancelledBookings.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-brand-primary dark:text-gray-100 flex items-center gap-2">
              <XCircle className="w-5 h-5 md:w-7 md:h-7 text-gray-500" />
              <span className="hidden sm:inline">Cancelled</span>
              <span className="sm:hidden">Cancelled</span>
            </h2>
            {cancelledBookings.length > 3 && (
              <Link href="#cancelled" className="text-sm font-medium text-brand-primary hover:text-brand-primary/80 transition-colors">
                View all ({cancelledBookings.length})
              </Link>
            )}
          </div>

          <div className="space-y-4">
            {cancelledBookings.slice(0, 3).map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                type="cancelled"
              />
            ))}
          </div>
        </section>
      )}

      {/* Empty State for Pagination */}
      {bookings?.data.length === 0 && (
        <div className="text-center py-20">
          <Ticket className="w-16 h-16 mx-auto mb-6 text-brand-secondary opacity-50" />
          <h3 className="text-xl font-semibold text-brand-primary dark:text-gray-100 mb-2">
            No bookings found
          </h3>
          <p className="text-brand-secondary dark:text-gray-400 mb-6">
            Start securing your experiences to see them here.
          </p>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-primary/90 transition-all"
          >
            Find Experiences
          </Link>
        </div>
      )}
    </AppLayout>
  );
}

function BookingCard({ booking, onCancel, loading = false, type = 'confirmed' }) {
  const getStatusBadge = (status) => {
    const badges = {
      confirmed: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', icon: '✅' },
      pending: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-300', icon: '⏳' },
      cancelled: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-400', icon: '❌' }
    };
    return badges[status] || badges.cancelled;
  };

  const badge = getStatusBadge(booking.status);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card border border-brand-border dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all">
      <div className="p-3 md:p-6 flex flex-col">
        {/* Experience Info */}
        <Link
          href={`/bookings/${booking.id}`}
          className="flex-1 min-w-0 mb-3"
        >
          <div className="flex gap-3">
            {/* Thumbnail */}
            <div className="w-14 h-14 md:w-20 md:h-20 rounded-lg overflow-hidden flex-shrink-0 bg-brand-border dark:bg-gray-700">
              {booking.experience?.image ? (
                <img
                  src={booking.experience.image.startsWith('/') ? booking.experience.image : `/assets/experiences/${booking.experience.image}`}
                  alt={booking.experience?.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-sm font-bold">
                  No Image
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm md:text-lg font-bold text-brand-primary dark:text-gray-100 line-clamp-2">
                {booking.experience?.title || 'Experience'}
              </h3>
              <p className="text-xs text-brand-secondary dark:text-gray-400 flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3" />
                {booking.experience?.location || '—'}
              </p>
              <div className="mt-2">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${badge.bg} ${badge.text}`}>
                  <span>{badge.icon}</span>
                  <span>{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
                </span>
              </div>
            </div>
          </div>
        </Link>

        {/* Price & Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <div>
            <p className="text-xs text-brand-secondary dark:text-gray-400">Amount</p>
            <p className="text-xl md:text-3xl font-bold text-brand-primary dark:text-gray-100">
              ₹{parseFloat(booking.total_amount || 0).toFixed(0)}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 flex-row sm:items-center">
            <Link
              href={`/bookings/${booking.id}`}
              className="px-3 py-2 md:px-4 md:py-2 bg-brand-primary text-white rounded-lg text-xs md:text-sm font-semibold hover:bg-brand-primary/90 transition-colors whitespace-nowrap text-center"
            >
              View
            </Link>

            {booking.status === 'confirmed' && (
              <button
                onClick={() => onCancel(booking.id)}
                disabled={loading}
                className="px-3 py-2 md:px-4 md:py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg text-xs md:text-sm font-semibold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50 flex items-center justify-center gap-1 whitespace-nowrap"
              >
                {loading ? (
                  <>
                    <Loader className="w-3 h-3 animate-spin" />
                  </>
                ) : (
                  <>Cancel</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}