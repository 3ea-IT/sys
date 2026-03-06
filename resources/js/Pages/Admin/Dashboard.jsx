import AdminAppLayout from "@/Layouts/AdminAppLayout";
import { Head, usePage } from "@inertiajs/react";
import { BarChart3, Users, Store, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

export default function AdminDashboard() {
  const { user, stats, recentBookings, recentQueries } = usePage().props;

  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Total Vendors",
      value: stats.totalVendors,
      icon: Store,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      label: "Total Bookings",
      value: stats.totalBookings,
      icon: BarChart3,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`,
      icon: TrendingUp,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <AdminAppLayout user={user}>
      <Head title="Admin Dashboard" />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-primary dark:text-gray-100 mb-2">
          Welcome, Admin
        </h1>
        <p className="text-brand-secondary dark:text-gray-400">
          Here's an overview of your platform
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-brand-border dark:border-gray-700 p-6 hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-brand-secondary dark:text-gray-400 uppercase tracking-wider">
                {card.label}
              </p>
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-brand-primary dark:text-gray-100">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-brand-border dark:border-gray-700 p-6">
          <h2 className="text-lg font-bold text-brand-primary dark:text-gray-100 mb-4">
            Recent Bookings
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {recentBookings.length > 0 ? (
              recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-3 bg-brand-background dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-brand-primary dark:text-gray-100">
                      {booking.user?.name}
                    </p>
                    <p className="text-xs text-brand-secondary dark:text-gray-400">
                      {booking.experience?.title}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-brand-primary dark:text-gray-100">
                      ₹{booking.total_amount}
                    </p>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-brand-secondary dark:text-gray-400 text-center py-4">
                No recent bookings
              </p>
            )}
          </div>
        </div>

        {/* Pending Queries */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-brand-border dark:border-gray-700 p-6">
          <h2 className="text-lg font-bold text-brand-primary dark:text-gray-100 mb-4">
            Support Stats
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700/50">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <p className="text-sm font-semibold text-red-900 dark:text-red-200">
                  Pending Queries
                </p>
              </div>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {stats.pendingQueries}
              </p>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700/50">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                <p className="text-sm font-semibold text-green-900 dark:text-green-200">
                  Total Queries
                </p>
              </div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.totalQueries}
              </p>
            </div>
          </div>

          {/* Recent Queries */}
          <div className="mt-6">
            <h3 className="text-sm font-bold text-brand-primary dark:text-gray-100 mb-3">
              Recent Queries
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {recentQueries.length > 0 ? (
                recentQueries.map((query) => (
                  <div
                    key={query.id}
                    className="text-xs p-2 bg-brand-background dark:bg-gray-700/50 rounded-lg"
                  >
                    <p className="font-semibold text-brand-primary dark:text-gray-100 truncate">
                      {query.subject}
                    </p>
                    <p className="text-brand-secondary dark:text-gray-400 truncate">
                      {query.name}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-brand-secondary dark:text-gray-400 text-center py-2">
                  No queries
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-brand-secondary dark:text-gray-400">
        <p>Last updated: {new Date().toLocaleString()}</p>
      </div>
    </AdminAppLayout>
  );
}
