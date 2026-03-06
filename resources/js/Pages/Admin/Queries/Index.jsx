import AdminAppLayout from "@/Layouts/AdminAppLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { Search, Eye, AlertCircle, Clock, CheckCircle } from "lucide-react";
import { useState } from "react";

export default function AdminQueriesIndex() {
  const { user, queries, search: initialSearch, filter } = usePage().props;
  const [search, setSearch] = useState(initialSearch);

  const handleSearch = (e) => {
    e.preventDefault();
    window.location.href = `/admin/queries${search ? `?search=${search}` : ''}`;
  };

  const handleFilterChange = (newFilter) => {
    window.location.href = `/admin/queries?filter=${newFilter}${search ? `&search=${search}` : ''}`;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'resolved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'resolved':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'rejected':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-50 dark:bg-red-900/30';
      case 'high':
        return 'text-orange-600 bg-orange-50 dark:bg-orange-900/30';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30';
      case 'low':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-900/30';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/30';
    }
  };

  return (
    <AdminAppLayout user={user}>
      <Head title="Support Queries" />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-brand-primary dark:text-gray-100 mb-1">
          Support Queries
        </h1>
        <p className="text-sm md:text-base text-brand-secondary dark:text-gray-400">
          Manage user and vendor support queries
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
                placeholder="Search by subject, name, or email..."
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
            {['all', 'pending', 'resolved', 'rejected'].map((f) => (
              <button
                key={f}
                onClick={() => handleFilterChange(f)}
                className={`px-3 md:px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  filter === f
                    ? 'bg-brand-primary text-white'
                    : 'bg-brand-background dark:bg-gray-700 text-brand-primary dark:text-gray-100 hover:bg-brand-border dark:hover:bg-gray-600'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Queries Table - Responsive */}
      <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-brand-border dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="bg-brand-background dark:bg-gray-700 sticky top-0">
              <tr>
                <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-brand-primary dark:text-gray-100 whitespace-nowrap">
                  Subject
                </th>
                <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-brand-primary dark:text-gray-100 whitespace-nowrap">
                  From
                </th>
                <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-brand-primary dark:text-gray-100 whitespace-nowrap">
                  Priority
                </th>
                <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-brand-primary dark:text-gray-100 whitespace-nowrap">
                  Status
                </th>
                <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-brand-primary dark:text-gray-100 whitespace-nowrap">
                  Date
                </th>
                <th className="px-4 md:px-6 py-4 text-center text-xs md:text-sm font-semibold text-brand-primary dark:text-gray-100 whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border dark:divide-gray-700">
              {queries.data.length > 0 ? (
                queries.data.map((q) => (
                  <tr key={q.id} className="hover:bg-brand-background dark:hover:bg-gray-700/50">
                    <td className="px-4 md:px-6 py-4 text-xs md:text-sm text-brand-primary dark:text-gray-100 font-medium whitespace-nowrap">
                      {q.subject}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-xs md:text-sm text-brand-secondary dark:text-gray-400 whitespace-nowrap">
                      <div>
                        <p className="font-medium">{q.name}</p>
                        <p className="text-xs">{q.email}</p>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-xs md:text-sm whitespace-nowrap">
                      <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(q.priority)}`}>
                        {q.priority.charAt(0).toUpperCase() + q.priority.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-xs md:text-sm whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(q.status)}
                        <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(q.status)}`}>
                          {q.status.charAt(0).toUpperCase() + q.status.slice(1).replace('-', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-xs md:text-sm text-brand-secondary dark:text-gray-400 whitespace-nowrap">
                      {new Date(q.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-xs md:text-sm whitespace-nowrap">
                      <div className="flex items-center justify-center">
                        <Link
                          href={`/admin/queries/${q.id}`}
                          className="p-1.5 md:p-2 hover:bg-brand-background dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <Eye className="w-3 h-3 md:w-4 md:h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-brand-secondary dark:text-gray-400">
                    No queries found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 md:px-6 py-4 border-t border-brand-border dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs md:text-sm text-brand-secondary dark:text-gray-400 text-center sm:text-left">
            Showing {queries.data.length} of {queries.total} queries
          </p>
          <div className="flex gap-1 flex-wrap justify-center">
            {queries.links.map((link, idx) => (
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
