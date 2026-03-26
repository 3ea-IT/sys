import AdminAppLayout from "@/Layouts/AdminAppLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";

export default function AdminUsersShow() {
  const { user: authUser, viewedUser } = usePage().props;

  const getStatusIcon = (status) => {
    if (status) {
      return <CheckCircle className="w-6 h-6 text-green-600" />;
    }
    return <AlertCircle className="w-6 h-6 text-red-600" />;
  };

  const getStatusColor = (status) => {
    if (status) {
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    }
    return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
  };

  const getStatusLabel = (status) => {
    return status ? 'Active' : 'Suspended';
  };

  return (
    <AdminAppLayout user={authUser}>
      <Head title={`${viewedUser.name} - User Details`} />

      {/* Header with Back Button */}
      <div className="mb-6">
        <a
          href="/admin/users"
          className="inline-flex items-center gap-2 text-brand-primary hover:text-brand-primary/80 text-sm font-medium mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Users
        </a>
        <h1 className="text-2xl md:text-3xl font-bold text-brand-primary dark:text-gray-100">
          {viewedUser.name}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* User Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-brand-border dark:border-gray-700 p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold text-brand-primary dark:text-gray-100 mb-4">
              User Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs md:text-sm font-semibold text-brand-secondary dark:text-gray-400 uppercase">
                  Name
                </label>
                <p className="text-sm md:text-base text-brand-primary dark:text-gray-100 mt-1">
                  {viewedUser.name}
                </p>
              </div>
              <div>
                <label className="text-xs md:text-sm font-semibold text-brand-secondary dark:text-gray-400 uppercase">
                  Email
                </label>
                <p className="text-sm md:text-base text-brand-primary dark:text-gray-100 mt-1">
                  {viewedUser.email}
                </p>
              </div>
              <div>
                <label className="text-xs md:text-sm font-semibold text-brand-secondary dark:text-gray-400 uppercase">
                  Phone
                </label>
                <p className="text-sm md:text-base text-brand-primary dark:text-gray-100 mt-1">
                  {viewedUser.phone || 'Not provided'}
                </p>
              </div>
              <div>
                <label className="text-xs md:text-sm font-semibold text-brand-secondary dark:text-gray-400 uppercase">
                  Joined
                </label>
                <p className="text-sm md:text-base text-brand-primary dark:text-gray-100 mt-1">
                  {new Date(viewedUser.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Location Info */}
          {(viewedUser.city || viewedUser.state || viewedUser.country) && (
            <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-brand-border dark:border-gray-700 p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-brand-primary dark:text-gray-100 mb-4">
                Location
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs md:text-sm font-semibold text-brand-secondary dark:text-gray-400 uppercase">
                    City
                  </label>
                  <p className="text-sm md:text-base text-brand-primary dark:text-gray-100 mt-1">
                    {viewedUser.city || 'Not provided'}
                  </p>
                </div>
                <div>
                  <label className="text-xs md:text-sm font-semibold text-brand-secondary dark:text-gray-400 uppercase">
                    State
                  </label>
                  <p className="text-sm md:text-base text-brand-primary dark:text-gray-100 mt-1">
                    {viewedUser.state || 'Not provided'}
                  </p>
                </div>
                <div>
                  <label className="text-xs md:text-sm font-semibold text-brand-secondary dark:text-gray-400 uppercase">
                    Country
                  </label>
                  <p className="text-sm md:text-base text-brand-primary dark:text-gray-100 mt-1">
                    {viewedUser.country || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Account Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-brand-border dark:border-gray-700 p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold text-brand-primary dark:text-gray-100 mb-4">
              Account Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs md:text-sm font-semibold text-brand-secondary dark:text-gray-400 uppercase">
                  Role
                </label>
                <p className="text-sm md:text-base text-brand-primary dark:text-gray-100 mt-1 capitalize">
                  {viewedUser.role || 'User'}
                </p>
              </div>
              <div>
                <label className="text-xs md:text-sm font-semibold text-brand-secondary dark:text-gray-400 uppercase">
                  Last Updated
                </label>
                <p className="text-sm md:text-base text-brand-primary dark:text-gray-100 mt-1">
                  {new Date(viewedUser.updated_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Status */}
        <div className="lg:col-span-1">
          {/* Status Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-brand-border dark:border-gray-700 p-4 md:p-6 sticky top-20">
            <h2 className="text-lg md:text-xl font-bold text-brand-primary dark:text-gray-100 mb-4">
              Account Details
            </h2>

            {/* Account Status */}
            <div>
              <label className="text-xs font-semibold text-brand-secondary dark:text-gray-400 uppercase block mb-2">
                Account Status
              </label>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(!viewedUser.is_suspended)}`}>
                {getStatusLabel(!viewedUser.is_suspended)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </AdminAppLayout>
  );
}
