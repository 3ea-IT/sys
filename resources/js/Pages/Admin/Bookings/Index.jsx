import AdminAppLayout from "@/Layouts/AdminAppLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { Search, Eye, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { useState } from "react";

export default function AdminBookingsIndex() {
  const { user, bookings, search: initialSearch, booking_type: initialBookingType, status: initialStatus } = usePage().props;
  const [search, setSearch] = useState(initialSearch);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (initialBookingType !== 'all') params.append('booking_type', initialBookingType);
    if (initialStatus !== 'all') params.append('status', initialStatus);
    window.location.href = `/admin/bookings${params.toString() ? `?${params.toString()}` : ''}`;
  };

  const handleBookingTypeChange = (newBookingType) => {
    const params = new URLSearchParams();
    if (newBookingType !== 'all') params.append('booking_type', newBookingType);
    if (initialStatus !== 'all') params.append('status', initialStatus);
    if (search) params.append('search', search);
    window.location.href = `/admin/bookings${params.toString() ? `?${params.toString()}` : ''}`;
  };

  const handleStatusChange = (newStatus) => {
    const params = new URLSearchParams();
    if (initialBookingType !== 'all') params.append('booking_type', initialBookingType);
    if (newStatus !== 'all') params.append('status', newStatus);
    if (search) params.append('search', search);
    window.location.href = `/admin/bookings${params.toString() ? `?${params.toString()}` : ''}`;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-amber-600" />;
      case 'cancelled':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
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

  const getBookingTypeLabel = (type) => {
    switch (type) {
      case 'instant':
        return 'Instant';
      case 'hold':
        return 'Hold → Confirmed';
      default:
        return type;
    }
  };

  // Sort bookings by ID in increasing order
  const sortedBookings = bookings.data ? [...bookings.data].sort((a, b) => a.id - b.id) : [];

  return (
    <AdminAppLayout user={user}>
      <Head title="Bookings Management" />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-brand-primary dark:text-gray-100 mb-1">
          Bookings Management
        </h1>
        <p className="text-sm md:text-base text-brand-secondary dark:text-gray-400">
          Manage all booking and hold confirmations
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-brand-border dark:border-gray-700 p-4 md:p-6 mb-6">
        <div className="flex flex-col gap-3 md:gap-4">
          <form onSubmit={handleSearch} className="flex flex-row gap-2">
            <div className="flex-1 flex items-center gap-2 px-3 md:px-4 py-0 bg-brand-background dark:bg-gray-700 rounded-lg min-w-0">
              <Search className="w-4 h-4 text-brand-secondary flex-shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by user name, email, or experience..."
                className="bg-transparent outline-none flex-1 text-sm min-w-0"
              />
            </div>
            <button
              type="submit"
              className="px-3 md:px-6 py-2 bg-brand-primary text-white rounded-lg font-medium text-sm hover:bg-brand-primary/90 transition-colors flex-shrink-0 whitespace-nowrap"
            >
              Search
            </button>
          </form>

          <div className="flex flex-col gap-2 md:flex-row md:flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-brand-secondary dark:text-gray-400 uppercase w-10 flex-shrink-0">Type:</span>
              <div className="flex flex-wrap gap-2">
                {['all', 'instant', 'hold'].map((type) => (
                  <button
                    key={type}
                    onClick={() => handleBookingTypeChange(type)}
                    className={`px-3 md:px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                      initialBookingType === type
                        ? 'bg-brand-primary text-white'
                        : 'bg-brand-background dark:bg-gray-700 text-brand-primary dark:text-gray-100 hover:bg-brand-border dark:hover:bg-gray-600'
                    }`}
                  >
                    {type === 'all' ? 'All' : getBookingTypeLabel(type)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-brand-secondary dark:text-gray-400 uppercase w-10 flex-shrink-0 md:w-auto">Status:</span>
              <div className="flex flex-wrap gap-2">
                {['all', 'pending', 'confirmed', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(st)}
                    className={`px-3 md:px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                      initialStatus === st
                        ? 'bg-brand-primary text-white'
                        : 'bg-brand-background dark:bg-gray-700 text-brand-primary dark:text-gray-100 hover:bg-brand-border dark:hover:bg-gray-600'
                    }`}
                  >
                    {st === 'all' ? 'All' : st.charAt(0).toUpperCase() + st.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Table - Responsive */}
      <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-brand-border dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="bg-brand-background dark:bg-gray-700 sticky top-0">
              <tr>
                <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-brand-primary dark:text-gray-100 whitespace-nowrap">
                  ID
                </th>
                <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-brand-primary dark:text-gray-100 whitespace-nowrap">
                  User
                </th>
                <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-brand-primary dark:text-gray-100 whitespace-nowrap">
                  Experience
                </th>
                <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-brand-primary dark:text-gray-100 whitespace-nowrap">
                  Type
                </th>
                <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-brand-primary dark:text-gray-100 whitespace-nowrap">
                  Status
                </th>
                <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-brand-primary dark:text-gray-100 whitespace-nowrap">
                  Total Amount
                </th>
                <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-brand-primary dark:text-gray-100 whitespace-nowrap">
                  Paid Amount
                </th>
                <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-brand-primary dark:text-gray-100 whitespace-nowrap">
                  Date
                </th>
                <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-brand-primary dark:text-gray-100 whitespace-nowrap">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border dark:divide-gray-700">
              {sortedBookings && sortedBookings.length > 0 ? (
                sortedBookings.map((booking, index) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-brand-background dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-4 md:px-6 py-4 text-sm text-brand-primary dark:text-gray-100 font-medium">
                      {index + 1}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-sm text-brand-secondary dark:text-gray-400">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-brand-primary dark:text-gray-100">
                          {booking.user?.name || 'N/A'}
                        </span>
                        <span className="text-xs">{booking.user?.email || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-sm text-brand-secondary dark:text-gray-400">
                      {booking.experience?.title || 'N/A'}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-sm">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getBookingTypeColor(
                          booking.booking_type
                        )}`}
                      >
                        {getBookingTypeLabel(booking.booking_type)}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(booking.status)}
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : 'Pending'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-sm text-brand-primary dark:text-gray-100 font-medium">
                      ₹{Number(booking.total_amount).toFixed(2)}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-sm text-brand-primary dark:text-gray-100 font-medium">
                      ₹{Number(booking.paid_amount).toFixed(2)}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-sm text-brand-secondary dark:text-gray-400 whitespace-nowrap">
                      {new Date(booking.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-sm">
                      <Link
                        href={`/admin/bookings/${booking.id}`}
                        className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-primary/90 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">View</span>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-4 md:px-6 py-12 text-center">
                    <p className="text-brand-secondary dark:text-gray-400">No bookings found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {bookings.links && bookings.links.length > 0 && (
          <div className="border-t border-brand-border dark:border-gray-700 px-4 md:px-6 py-4 flex items-center justify-between">
            <div className="text-sm text-brand-secondary dark:text-gray-400">
              Showing {bookings.from} to {bookings.to} of {bookings.total} bookings
            </div>
            <div className="flex gap-1">
              {bookings.links.map((link, idx) => {
                if (link.label.includes('Previous')) {
                  return (
                    <Link
                      key={idx}
                      href={link.url || '#'}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        link.active
                          ? 'bg-brand-primary text-white'
                          : link.url
                          ? 'bg-brand-background dark:bg-gray-700 text-brand-primary dark:text-gray-100 hover:bg-brand-border dark:hover:bg-gray-600'
                          : 'bg-brand-background dark:bg-gray-700 text-brand-secondary dark:text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      ← Prev
                    </Link>
                  );
                } else if (link.label.includes('Next')) {
                  return (
                    <Link
                      key={idx}
                      href={link.url || '#'}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        link.active
                          ? 'bg-brand-primary text-white'
                          : link.url
                          ? 'bg-brand-background dark:bg-gray-700 text-brand-primary dark:text-gray-100 hover:bg-brand-border dark:hover:bg-gray-600'
                          : 'bg-brand-background dark:bg-gray-700 text-brand-secondary dark:text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Next →
                    </Link>
                  );
                }
                return null;
              })}
            </div>
          </div>
        )}
      </div>
    </AdminAppLayout>
  );
}