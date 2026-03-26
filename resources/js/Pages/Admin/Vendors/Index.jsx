import AdminAppLayout from "@/Layouts/AdminAppLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { Search, Eye, CheckCircle, AlertCircle, Clock, Edit, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function AdminVendorsIndex() {
  const { user, vendors, search: initialSearch, filter, flash } = usePage().props;
  const [search, setSearch] = useState(initialSearch);
  const [notification, setNotification] = useState(flash?.success || flash?.error || null);
  const [notificationType, setNotificationType] = useState(flash?.success ? 'success' : 'error');

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleSearch = (e) => {
    e.preventDefault();
    window.location.href = `/admin/vendors${search ? `?search=${search}` : ''}`;
  };

  const handleFilterChange = (newFilter) => {
    window.location.href = `/admin/vendors?filter=${newFilter}${search ? `&search=${search}` : ''}`;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'submitted':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
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
      <Head title="Vendors Management" />

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 left-4 right-4 md:left-auto md:right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-4 ${
          notificationType === 'success'
            ? 'bg-green-500 text-white'
            : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center gap-2">
            {notificationType === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span className="font-medium text-sm md:text-base">{notification}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-brand-primary dark:text-gray-100 mb-1">
          Vendors Management
        </h1>
        <p className="text-sm md:text-base text-brand-secondary dark:text-gray-400">
          Manage vendor accounts and KYC verification
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
                placeholder="Search by name or email..."
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

          <div className="flex flex-wrap gap-2">
            {['all', 'approved', 'submitted', 'rejected'].map((f) => (
              <button
                key={f}
                onClick={() => handleFilterChange(f)}
                className={`px-3 md:px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  filter === f
                    ? 'bg-brand-primary text-white'
                    : 'bg-brand-background dark:bg-gray-700 text-brand-primary dark:text-gray-100 hover:bg-brand-border dark:hover:bg-gray-600'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Vendors Table - Responsive */}
      <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-brand-border dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="bg-brand-background dark:bg-gray-700 sticky top-0">
              <tr>
                <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-brand-primary dark:text-gray-100 whitespace-nowrap">
                  Name
                </th>
                <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-brand-primary dark:text-gray-100 whitespace-nowrap">
                  Email
                </th>
                <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-brand-primary dark:text-gray-100 whitespace-nowrap">
                  KYC Status
                </th>
                <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-brand-primary dark:text-gray-100 whitespace-nowrap">
                  Joined
                </th>
                <th className="px-4 md:px-6 py-4 text-center text-xs md:text-sm font-semibold text-brand-primary dark:text-gray-100 whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border dark:divide-gray-700">
              {vendors.data.length > 0 ? (
                vendors.data.map((v) => (
                  <tr key={v.id} className="hover:bg-brand-background dark:hover:bg-gray-700/50">
                    <td className="px-4 md:px-6 py-4 text-xs md:text-sm text-brand-primary dark:text-gray-100 font-medium whitespace-nowrap">
                      {v.name}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-xs md:text-sm text-brand-secondary dark:text-gray-400 whitespace-nowrap">
                      {v.email}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-xs md:text-sm whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(v.vendor_kyc?.status || 'submitted')}
                        <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold inline-block ${getStatusColor(v.vendor_kyc?.status || 'submitted')}`}>
                          {(v.vendor_kyc?.status || 'submitted').charAt(0).toUpperCase() + (v.vendor_kyc?.status || 'submitted').slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-xs md:text-sm text-brand-secondary dark:text-gray-400 whitespace-nowrap">
                      {new Date(v.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-xs md:text-sm whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/admin/vendors/${v.id}`}
                          className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-primary/90 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="hidden sm:inline">View</span>
                        </Link>
                        <Link
                          href={`/admin/vendors/${v.id}/edit`}
                          className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          <span className="hidden sm:inline">Edit</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 md:px-6 py-8 text-center text-brand-secondary dark:text-gray-400">
                    No vendors found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 md:px-6 py-4 border-t border-brand-border dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs md:text-sm text-brand-secondary dark:text-gray-400 text-center sm:text-left">
            Showing {vendors.data.length} of {vendors.total} vendors
          </p>
          <div className="flex gap-1 flex-wrap justify-center">
            {vendors.links.map((link, idx) => (
              <Link
                key={idx}
                href={link.url || "#"}
                className={`px-2 md:px-3 py-1 rounded text-sm ${
                  link.active
                    ? 'bg-brand-primary text-white'
                    : 'bg-brand-background dark:bg-gray-700 hover:bg-brand-border dark:hover:bg-gray-600'
                } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                dangerouslySetInnerHTML={{ __html: link.label }}
              />
            ))}
          </div>
        </div>
      </div>
    </AdminAppLayout>
  );
}
