import AdminAppLayout from "@/Layouts/AdminAppLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { Search, Eye, Lock, Unlock } from "lucide-react";
import { useState } from "react";

export default function AdminUsersIndex() {
  const { user, users, search: initialSearch, filter } = usePage().props;
  const [search, setSearch] = useState(initialSearch);

  const handleSearch = (e) => {
    e.preventDefault();
    window.location.href = `/admin/users${search ? `?search=${search}` : ''}`;
  };

  const handleFilterChange = (newFilter) => {
    window.location.href = `/admin/users?filter=${newFilter}${search ? `&search=${search}` : ''}`;
  };

  return (
    <AdminAppLayout user={user}>
      <Head title="Users Management" />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-brand-primary dark:text-gray-100 mb-1">
          Users Management
        </h1>
        <p className="text-sm md:text-base text-brand-secondary dark:text-gray-400">
          Manage platform users
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
            {['all', 'active', 'suspended'].map((f) => (
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

      {/* Users Table - Responsive */}
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
                  Joined
                </th>
                <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-brand-primary dark:text-gray-100 whitespace-nowrap">
                  Status
                </th>
                <th className="px-4 md:px-6 py-4 text-center text-xs md:text-sm font-semibold text-brand-primary dark:text-gray-100 whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border dark:divide-gray-700">
              {users.data.length > 0 ? (
                users.data.map((u) => (
                  <tr key={u.id} className="hover:bg-brand-background dark:hover:bg-gray-700/50">
                    <td className="px-4 md:px-6 py-4 text-xs md:text-sm text-brand-primary dark:text-gray-100 font-medium whitespace-nowrap">
                      {u.name}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-xs md:text-sm text-brand-secondary dark:text-gray-400 whitespace-nowrap">
                      {u.email}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-xs md:text-sm text-brand-secondary dark:text-gray-400 whitespace-nowrap">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-xs md:text-sm whitespace-nowrap">
                      <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold inline-block ${
                        u.is_suspended
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      }`}>
                        {u.is_suspended ? 'Suspended' : 'Active'}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-xs md:text-sm whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1 md:gap-2">
                        <Link
                          href={`/admin/users/${u.id}`}
                          className="p-1.5 md:p-2 hover:bg-brand-background dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <Eye className="w-3 h-3 md:w-4 md:h-4" />
                        </Link>
                        <form
                          method="post"
                          action={`/admin/users/${u.id}/toggle-status`}
                          className="inline"
                        >
                          <button
                            type="submit"
                            className="p-1.5 md:p-2 hover:bg-brand-background dark:hover:bg-gray-700 rounded-lg transition-colors"
                          >
                            {u.is_suspended ? (
                              <Unlock className="w-3 h-3 md:w-4 md:h-4 text-green-600" />
                            ) : (
                              <Lock className="w-3 h-3 md:w-4 md:h-4 text-red-600" />
                            )}
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 md:px-6 py-8 text-center text-brand-secondary dark:text-gray-400">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 md:px-6 py-4 border-t border-brand-border dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs md:text-sm text-brand-secondary dark:text-gray-400 text-center sm:text-left">
            Showing {users.data.length} of {users.total} users
          </p>
          <div className="flex gap-1 flex-wrap justify-center">
            {users.links.map((link, idx) => (
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
