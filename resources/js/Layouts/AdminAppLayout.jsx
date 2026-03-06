import { Link, usePage, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import {
  Menu,
  X,
  BarChart3,
  Users,
  Store,
  Calendar,
  HelpCircle,
  LogOut,
  Bell,
} from "lucide-react";

export default function AdminAppLayout({ children }) {
  const { user, url } = usePage().props;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect if user is not admin
  useEffect(() => {
    if (user?.role && user.role !== 'admin') {
      if (user.role === 'vendor') {
        router.visit('/vendor/dashboard');
      } else {
        router.visit('/dashboard');
      }
    }
  }, [user?.role]);

  const sidebarItems = [
    {
      href: "/admin/dashboard",
      icon: BarChart3,
      label: "Dashboard",
    },
    {
      href: "/admin/users",
      icon: Users,
      label: "Users",
    },
    {
      href: "/admin/vendors",
      icon: Store,
      label: "Vendors",
    },
    {
      href: "/admin/bookings",
      icon: Calendar,
      label: "Bookings",
    },
    {
      href: "/admin/queries",
      icon: HelpCircle,
      label: "Support Queries",
    },
  ];

  const bottomNavItems = [
    {
      href: "/admin/dashboard",
      icon: BarChart3,
      label: "Dashboard",
    },
    {
      href: "/admin/users",
      icon: Users,
      label: "Users",
    },
    {
      href: "/admin/vendors",
      icon: Store,
      label: "Vendors",
    },
    {
      href: "/admin/bookings",
      icon: Calendar,
      label: "Bookings",
    },
  ];

  useEffect(() => {
    setSidebarOpen(false);
  }, [url]);

  const getPageName = () => {
    if (url === '/admin/dashboard') return 'Dashboard';
    if (url?.startsWith('/admin/users')) return 'Users';
    if (url?.startsWith('/admin/vendors')) return 'Vendors';
    if (url?.startsWith('/admin/bookings')) return 'Bookings';
    return 'Admin';
  };

  return (
    <div className="min-h-screen flex bg-brand-background dark:bg-gray-900">
      {/* Mobile/Tablet Layout */}
      <div className="md:hidden relative w-full flex flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-white dark:bg-gray-800 border-b border-brand-border dark:border-gray-700 px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-brand-background dark:hover:bg-gray-700 rounded-lg"
          >
            {sidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          <h1 className="text-lg font-bold text-brand-primary dark:text-gray-100">{getPageName()}</h1>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-brand-background dark:hover:bg-gray-700 rounded-lg relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="w-10 h-10 rounded-full bg-brand-border dark:bg-gray-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {user?.profile_image ? (
                <img
                  src={`/assets/profile_images/${user.profile_image}`}
                  alt={user?.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm font-bold text-brand-primary dark:text-gray-100">
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Sidebar Overlay for Mobile */}
        <div
          className={`fixed top-0 left-0 right-0 bottom-0 z-40 transition-opacity duration-300 ${
            sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div
            className={`absolute left-0 top-0 h-screen w-64 bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 z-50 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } border-r border-brand-border dark:border-gray-700 flex flex-col`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Logo - with Close Button */}
            <div className="p-6 border-b border-brand-border dark:border-gray-700 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-primary to-brand-primary/70 flex items-center justify-center text-white font-bold">
                  SS
                </div>
                <div>
                  <p className="font-bold text-brand-primary dark:text-gray-100">Secure</p>
                  <p className="text-xs text-brand-secondary dark:text-gray-400">Admin</p>
                </div>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-brand-background dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {sidebarItems.map((item) => {
                const isActive = url === item.href || url?.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-brand-primary text-white"
                        : "text-brand-secondary dark:text-gray-400 hover:bg-brand-background dark:hover:bg-gray-700"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-brand-border dark:border-gray-700">
              <button
                onClick={() => {
                  setSidebarOpen(false);
                  router.post("/logout");
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto px-4 py-6 pb-24">
          {children}
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-brand-border dark:border-gray-700 flex justify-around items-center h-20 md:hidden">
          {bottomNavItems.map((item) => {
            const isActive = url === item.href || url?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex flex-col items-center justify-center gap-1 py-2 px-3 flex-1 ${
                  isActive
                    ? "text-brand-primary"
                    : "text-brand-secondary dark:text-gray-400"
                }`}
              >
                <item.icon className="w-6 h-6" />
                <span className="text-xs font-medium whitespace-nowrap">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex w-full">
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 w-64 h-screen bg-white dark:bg-gray-800 border-r border-brand-border dark:border-gray-700 flex flex-col z-30">
          {/* Logo */}
          <div className="px-6 py-4 border-b border-brand-border dark:border-gray-700">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-primary to-brand-primary/70 flex items-center justify-center text-white font-bold">
                SS
              </div>
              <div>
                <p className="font-bold text-brand-primary dark:text-gray-100">Secure</p>
                <p className="text-xs text-brand-secondary dark:text-gray-400">Admin</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {sidebarItems.map((item) => {
              const isActive = url === item.href || url?.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-brand-primary text-white"
                      : "text-brand-secondary dark:text-gray-400 hover:bg-brand-background dark:hover:bg-gray-700"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-brand-border dark:border-gray-700">
            <button
              onClick={() => router.post("/logout")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 ml-64 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <header className="sticky top-0 z-20 bg-white dark:bg-gray-800 border-b border-brand-border dark:border-gray-700 px-6 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-brand-primary dark:text-gray-100">{getPageName()}</h1>

            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-brand-background dark:hover:bg-gray-700 rounded-lg relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="w-10 h-10 rounded-full bg-brand-border dark:bg-gray-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {user?.profile_image ? (
                  <img
                    src={`/assets/profile_images/${user.profile_image}`}
                    alt={user?.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-bold text-brand-primary dark:text-gray-100">
                    {user?.name?.charAt(0).toUpperCase() || 'A'}
                  </span>
                )}
              </div>
            </div>
          </header>

          {/* Content Area */}
          <main className="flex-1 overflow-y-auto px-6 py-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
