import AdminAppLayout from "@/Layouts/AdminAppLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { Search, Eye, Package2, Pencil } from "lucide-react";
import { useState } from "react";

export default function AdminExperiencesIndex() {
  const { user, experiences, search: initialSearch, approval_status: initialApprovalStatus } = usePage().props;
  const [search, setSearch] = useState(initialSearch);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (initialApprovalStatus !== 'all') params.append('approval_status', initialApprovalStatus);
    window.location.href = `/admin/experiences${params.toString() ? `?${params.toString()}` : ''}`;
  };

  const handleApprovalStatusChange = (newApprovalStatus) => {
    const params = new URLSearchParams();
    if (newApprovalStatus !== 'all') params.append('approval_status', newApprovalStatus);
    if (search) params.append('search', search);
    window.location.href = `/admin/experiences${params.toString() ? `?${params.toString()}` : ''}`;
  };

  const getStatusValue = (status) => {
    // Handle both string and enum object
    return typeof status === 'string' ? status : status?.value || '';
  };

  const getStatusColor = (status) => {
    const value = getStatusValue(status);
    switch (value) {
      case 'active':
        return 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400';
      case 'inactive':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  const getStatusLabel = (status) => {
    const value = getStatusValue(status);
    if (!value) return 'Unknown';
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  return (
    <AdminAppLayout user={user}>
      <Head title="Experiences Management" />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-brand-primary dark:text-gray-100 mb-1">
          Experiences Management
        </h1>
        <p className="text-sm md:text-base text-brand-secondary dark:text-gray-400">
          Manage all platform experiences
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
                placeholder="Search by title, location, or category..."
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
            <button
              onClick={() => handleApprovalStatusChange('all')}
              className={`px-3 md:px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                initialApprovalStatus === 'all'
                  ? 'bg-brand-primary text-white'
                  : 'bg-brand-background dark:bg-gray-700 text-brand-primary dark:text-gray-100 hover:bg-brand-border dark:hover:bg-gray-600'
              }`}
            >
              All
            </button>
            {['pending', 'approved', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => handleApprovalStatusChange(status)}
                className={`px-3 md:px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  initialApprovalStatus === status
                    ? 'bg-brand-primary text-white'
                    : 'bg-brand-background dark:bg-gray-700 text-brand-primary dark:text-gray-100 hover:bg-brand-border dark:hover:bg-gray-600'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Experiences Table - Responsive */}
      <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-brand-border dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="bg-brand-background dark:bg-gray-700 sticky top-0">
              <tr>
                <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-brand-primary dark:text-gray-100 whitespace-nowrap">
                  Title
                </th>
                <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-brand-primary dark:text-gray-100 whitespace-nowrap">
                  Vendor
                </th>
                <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-brand-primary dark:text-gray-100 whitespace-nowrap">
                  Category
                </th>
                <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-brand-primary dark:text-gray-100 whitespace-nowrap">
                  Location
                </th>
                <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-brand-primary dark:text-gray-100 whitespace-nowrap">
                  Price
                </th>
                <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-brand-primary dark:text-gray-100 whitespace-nowrap">
                  Status
                </th>
                <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-brand-primary dark:text-gray-100 whitespace-nowrap">
                  Approval Status
                </th>
                <th className="px-4 md:px-6 py-4 text-center text-xs md:text-sm font-semibold text-brand-primary dark:text-gray-100 whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border dark:divide-gray-700">
              {experiences.data && experiences.data.length > 0 ? (
                experiences.data.map((experience) => (
                  <tr
                    key={experience.id}
                    className="hover:bg-brand-background dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-4 md:px-6 py-4 text-sm text-brand-primary dark:text-gray-100 font-medium">
                      <div className="flex items-center gap-3">
                        {experience.image && (
                          <img
                            src={experience.image_url}
                            alt={experience.title}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        )}
                        <span className="truncate">{experience.title}</span>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-sm text-brand-secondary dark:text-gray-400">
                      {experience.vendor?.name || 'N/A'}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-sm text-brand-secondary dark:text-gray-400">
                      {experience.category}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-sm text-brand-secondary dark:text-gray-400">
                      {experience.location}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-sm text-brand-primary dark:text-gray-100 font-medium">
                      ₹{experience.instant_price}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-sm">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          experience.status
                        )}`}
                      >
                        {getStatusLabel(experience.status)}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-sm">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          experience.approval_status === 'approved'
                            ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                            : experience.approval_status === 'rejected'
                            ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                            : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                        }`}
                      >
                        {experience.approval_status
                          ? experience.approval_status.charAt(0).toUpperCase() + experience.approval_status.slice(1)
                          : 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/admin/experiences/${experience.id}`}
                          className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-primary/90 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="hidden sm:inline">View</span>
                        </Link>
                        <Link
                          href={`/admin/experiences/${experience.id}/edit`}
                          className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                          <span className="hidden sm:inline">Edit</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-4 md:px-6 py-12 text-center">
                    <p className="text-brand-secondary dark:text-gray-400">No experiences found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {experiences.links && experiences.links.length > 0 && (
          <div className="border-t border-brand-border dark:border-gray-700 px-4 md:px-6 py-4 flex items-center justify-between">
            <div className="text-sm text-brand-secondary dark:text-gray-400">
              Showing {experiences.from} to {experiences.to} of {experiences.total} experiences
            </div>
            <div className="flex gap-1">
              {experiences.links.map((link, idx) => {
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
