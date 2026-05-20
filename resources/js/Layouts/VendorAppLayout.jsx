// resources/js/Layouts/VendorAppLayout.jsx
import { Link, usePage, router } from "@inertiajs/react";
import { DollarSign, Calendar, Users, Ticket, Bell, User, Settings, HelpCircle, Menu, X, BarChart3, LogOut, CreditCard } from "lucide-react";
import { useState, useEffect } from "react";
import PWAInstallPrompt from "../Components/PWAInstallPrompt";
import AppLoader from "../Components/AppLoader";
import { useLoader } from "../Contexts/LoaderContext";

export default function VendorAppLayout({ children }) {
  const { url, props } = usePage();
  const user = props?.auth?.user || props?.user;
  const { isLoading } = useLoader();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      const isInstalled = localStorage.getItem('pwaInstalled');
      if (!isInstalled) {
        setShowInstallPrompt(true);
      }
    };

    const handleAppInstalled = () => {
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
      localStorage.setItem('pwaInstalled', 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  return (
    <div className="min-h-screen bg-brand-background dark:bg-gray-900 flex transition-colors">
      {/* App Loader */}
      {isLoading && <AppLoader />}

      {/* PWA Install Prompt */}
      {showInstallPrompt && (
        <PWAInstallPrompt
          deferredPrompt={deferredPrompt}
          onInstall={() => setShowInstallPrompt(false)}
          onDismiss={() => setShowInstallPrompt(false)}
        />
      )}

      {/* Responsive Container - Mobile-first PWA optimized, Desktop layout */}
      <div className="relative w-full lg:max-w-full bg-brand-background dark:bg-gray-900 lg:flex lg:h-screen">

        {/* Desktop Sidebar - Visible only on lg and above */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 xl:w-72 bg-white dark:bg-gray-800 border-r border-brand-border dark:border-gray-700 lg:fixed lg:inset-y-0 lg:left-0 lg:z-30">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-brand-border dark:border-gray-700">
            <h2 className="text-xl font-bold text-brand-primary dark:text-gray-100">Vendor Portal</h2>
            <p className="text-sm text-brand-secondary dark:text-gray-400 mt-1">Manage your business</p>
          </div>

          {/* Sidebar Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <SidebarLink
              href="/vendor/dashboard"
              icon={BarChart3}
              label="Dashboard"
              onClick={() => setSidebarOpen(false)}
              currentUrl={url}
            />
            <SidebarLink
              href="/vendor/experiences"
              icon={Ticket}
              label="Experiences"
              onClick={() => setSidebarOpen(false)}
              currentUrl={url}
            />
            <SidebarLink
              href="/vendor/bookings"
              icon={Calendar}
              label="Bookings and Holds"
              onClick={() => setSidebarOpen(false)}
              currentUrl={url}
            />
            <SidebarLink
              href="/vendor/analytics"
              icon={DollarSign}
              label="Revenue"
              onClick={() => setSidebarOpen(false)}
              currentUrl={url}
            />
            <SidebarLink
              href="/vendor/settlements"
              icon={CreditCard}
              label="Payment Settlements"
              onClick={() => setSidebarOpen(false)}
              currentUrl={url}
            />
            {/* <SidebarLink
              href="/vendor/notifications"
              icon={Bell}
              label="Notifications"
              onClick={() => setSidebarOpen(false)}
              currentUrl={url}
            /> */}
            <div className="my-4 border-t border-brand-border/50" />
            <SidebarLink
              href="/vendor/profile"
              icon={User}
              label="Profile & Settings"
              onClick={() => setSidebarOpen(false)}
              currentUrl={url}
            />
            <SidebarLink
              href="/vendor/help"
              icon={HelpCircle}
              label="Help & Support"
              onClick={() => setSidebarOpen(false)}
              currentUrl={url}
            />
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-brand-border dark:border-gray-700">
            <button
              onClick={() => {
                setSidebarOpen(false);
                router.post("/logout");
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium"
            >
              <LogOut className="w-5 h-5" />
              <span>Log Out</span>
            </button>
          </div>
        </aside>

        {/* Mobile/Tablet Layout */}
        <div className="lg:hidden relative w-full flex flex-col min-h-screen">
          {/* Header */}
          <header className="sticky top-0 z-20 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-b border-brand-border dark:border-gray-700 px-4 py-3 md:px-6 lg:px-8 flex items-center justify-between">
            {/* Hamburger Menu */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-brand-border dark:hover:bg-gray-700 rounded-xl transition-colors mr-2"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6 text-brand-primary dark:text-gray-100" />
              ) : (
                <Menu className="w-6 h-6 text-brand-secondary dark:text-gray-400" />
              )}
            </button>

            {/* Logo */}
            <Link href="/vendor/dashboard" className="flex items-center gap-2 flex-1">
              <span className="text-lg md:text-xl font-bold text-brand-primary dark:text-blue-400 bg-gradient-to-r from-brand-primary to-brand-primary/80 bg-clip-text">
                Vendor Hub
              </span>
            </Link>

            {/* Notifications & User Avatar */}
            <div className="flex items-center gap-2">
              <Link href="/vendor/notifications" className="relative p-2 hover:bg-brand-border dark:hover:bg-gray-700 rounded-xl transition-colors">
                <Bell className="w-6 h-6 text-brand-secondary dark:text-gray-400" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger rounded-full flex items-center justify-center text-xs font-bold text-white">3</span>
              </Link>
              
              <Link
                href="/vendor/profile"
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-brand-primary flex items-center justify-center hover:shadow-md transition-all flex-shrink-0 overflow-hidden border-2 border-white shadow-sm"
              >
                {user?.profile_image ? (
                  <img src={`/assets/profile_images/${user.profile_image}`} alt={user?.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-white" />
                )}
              </Link>
            </div>
          </header>

          {/* Sidebar - Mobile slide-in */}
          <div
            className={`fixed inset-0 z-40 transition-all duration-300 ${
              sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setSidebarOpen(false)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 dark:bg-black/80" />

            {/* Sidebar Panel */}
            <div
              className={`absolute left-0 top-0 h-screen w-64 md:w-72 bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 z-50 border-r border-brand-border overflow-y-auto ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Sidebar Header */}
              <div className="p-4 border-b border-brand-border dark:border-gray-700 flex items-center justify-between sticky top-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm z-10">
                <div>
                  <h2 className="text-xl font-bold text-brand-primary dark:text-gray-100">Vendor Portal</h2>
                  <p className="text-sm text-brand-secondary dark:text-gray-400 mt-1">Manage your business</p>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 hover:bg-brand-border dark:hover:bg-gray-700 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-brand-secondary dark:text-gray-400" />
                </button>
              </div>

              {/* Sidebar Navigation */}
              <nav className="p-4 space-y-1">
                <SidebarLink
                  href="/vendor/dashboard"
                  icon={BarChart3}
                  label="Dashboard"
                  onClick={() => setSidebarOpen(false)}
                  currentUrl={url}
                />
                <SidebarLink
                  href="/vendor/experiences"
                  icon={Ticket}
                  label="Experiences"
                  onClick={() => setSidebarOpen(false)}
                  currentUrl={url}
                />
                <SidebarLink
                  href="/vendor/bookings"
                  icon={Calendar}
                  label="Bookings and Holds"
                  onClick={() => setSidebarOpen(false)}
                  currentUrl={url}
                />
                <SidebarLink
                  href="/vendor/analytics"
                  icon={DollarSign}
                  label="Revenue"
                  onClick={() => setSidebarOpen(false)}
                  currentUrl={url}
                />
                <SidebarLink
                  href="/vendor/settlements"
                  icon={CreditCard}
                  label="Payment Settlements"
                  onClick={() => setSidebarOpen(false)}
                  currentUrl={url}
                />
                {/* <SidebarLink
                  href="/vendor/notifications"
                  icon={Bell}
                  label="Notifications"
                  onClick={() => setSidebarOpen(false)}
                  currentUrl={url}
                /> */}
                <div className="my-4 border-t border-brand-border/50" />
                <SidebarLink
                  href="/vendor/profile"
                  icon={User}
                  label="Profile & Settings"
                  onClick={() => setSidebarOpen(false)}
                  currentUrl={url}
                />
                <SidebarLink
                  href="/vendor/help"
                  icon={HelpCircle}
                  label="Help & Support"
                  onClick={() => setSidebarOpen(false)}
                  currentUrl={url}
                />
              </nav>

              {/* Logout */}
              <div className="p-4 md:p-6 border-t border-brand-border dark:border-gray-700 mt-4">
                <button
                  onClick={() => {
                    setSidebarOpen(false);
                    router.post("/logout");
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area - Mobile */}
          <main className="flex-1 px-4 pt-6 pb-32 md:pb-40 lg:pb-48 md:px-6 lg:px-8 overflow-y-auto">
            {children}
          </main>

          {/* Sticky Bottom Navigation - Mobile/Tablet Optimized */}
          <nav className="fixed inset-x-0 bottom-0 z-50">
            <div className="w-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-2xl border-t border-brand-border dark:border-gray-700 px-2 py-2">
              <div className="flex justify-around items-end gap-2">
                <FooterIcon href="/vendor/dashboard" icon={BarChart3} label="Dashboard" currentUrl={url} />
                <FooterIcon href="/vendor/experiences" icon={Ticket} label="Experiences" currentUrl={url} />
                {/* Center Elevated Analytics/Overview */}
                {/* <VendorCenterIcon href="/vendor/analytics" currentUrl={url} /> */}
                <FooterIcon href="/vendor/bookings" icon={Calendar} label="Bookings" currentUrl={url} />
                <FooterIcon href="/vendor/analytics" icon={DollarSign} label="Revenue" currentUrl={url} />
              </div>
            </div>
          </nav>
        </div>

        {/* Desktop Layout - Visible only on lg and above */}
        <div className="hidden lg:flex lg:flex-col lg:flex-1 lg:ml-64 xl:ml-72">
          {/* Desktop Header */}
          <header className="sticky top-0 z-20 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-b border-brand-border dark:border-gray-700 px-6 xl:px-8 py-4 flex items-center justify-between">
            {/* Logo/Title */}
            <Link href="/vendor/dashboard" className="flex items-center gap-2">
              <span className="text-xl font-bold text-brand-primary dark:text-blue-400">Dashboard</span>
            </Link>

            {/* Notifications & User Avatar */}
            <div className="flex items-center gap-4">
              {/* <Link href="/vendor/notifications" className="relative p-2 hover:bg-brand-border dark:hover:bg-gray-700 rounded-xl transition-colors">
                <Bell className="w-6 h-6 text-brand-secondary dark:text-gray-400" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger rounded-full flex items-center justify-center text-xs font-bold text-white">3</span>
              </Link> */}
              
              <Link
                href="/vendor/profile"
                className="w-12 h-12 rounded-full bg-brand-primary flex items-center justify-center hover:shadow-md transition-all flex-shrink-0 overflow-hidden border-2 border-white shadow-sm"
              >
                {user?.profile_image ? (
                  <img src={`/assets/profile_images/${user.profile_image}`} alt={user?.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-white" />
                )}
              </Link>
            </div>
          </header>

          {/* Desktop Main Content */}
          <main className="flex-1 px-6 xl:px-8 py-6 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

// Regular Footer Icon Component
function FooterIcon({ href, icon: Icon, label, currentUrl }) {
  const isActive = currentUrl === href || currentUrl?.startsWith(href + '/');

  return (
    <Link href={href}>
      <div
        className={`flex flex-col items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl transition-all duration-200 p-2 hover:scale-105 active:scale-95 ${
          isActive 
            ? "text-brand-primary" 
            : "text-brand-secondary dark:text-gray-400 hover:bg-brand-border/5"
        }`}
      >
        <Icon size={20} className="md:w-5 md:h-5" />
        <span className={`text-xs md:text-sm mt-1 font-semibold line-clamp-1 px-1 ${
          isActive ? "text-brand-primary" : "text-brand-secondary dark:text-gray-500"
        }`}>
          {label}
        </span>
      </div>
    </Link>
  );
}

// Elevated Center Vendor Icon (Revenue/Quick Stats)
function VendorCenterIcon({ href, currentUrl }) {
  const isActive = currentUrl === href || currentUrl?.startsWith(href + '/');

  return (
    <Link href={href} className="relative flex flex-col items-center w-16">
      {/* Elevated center circle */}
      <div
        className={`absolute -top-6 md:-top-8 w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center transition-all duration-200 shadow-2xl border-2 border-white/50 ${
          isActive ? "scale-105 shadow-brand-primary/25" : "hover:scale-105 active:scale-95"
        }`}
        style={{
          background: 'linear-gradient(135deg, var(--color-brand-primary) 0%, #1e4a6f 100%)',
        }}
      >
        <DollarSign size={22} className="text-white" strokeWidth={2.5} />
      </div>

      {/* Spacer */}
      <div className="h-10 md:h-12" />

      {/* Label */}
      <span
        className={`text-xs md:text-sm font-bold transition-colors ${
          isActive ? "text-brand-primary shadow-sm" : "text-brand-secondary dark:text-gray-500"
        }`}
      >
        Revenue
      </span>
    </Link>
  );
}

// Sidebar Link Component
function SidebarLink({ href, icon: Icon, label, onClick, currentUrl }) {
  const isActive = currentUrl === href || currentUrl?.startsWith(href + '/');

  return (
    <Link href={href} onClick={onClick}>
      <div
        className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
          isActive
            ? "bg-gradient-to-r from-brand-primary to-brand-primary/80 text-white shadow-lg"
            : "text-brand-secondary dark:text-gray-400 hover:bg-brand-background hover:text-brand-primary dark:hover:bg-gray-700/50"
        }`}
      >
        <Icon size={20} className={`${isActive ? "text-white" : "group-hover:text-brand-primary"}`} />
        <span className="font-semibold text-sm">{label}</span>
      </div>
    </Link>
  );
}
