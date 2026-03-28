import { Link, usePage, router } from "@inertiajs/react";
import { Home, User, Search, Ticket, Bell, LogOut, Settings, Film, HelpCircle, Menu, X, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import PWAInstallPrompt from "../Components/PWAInstallPrompt";
import AppLoader from "../Components/AppLoader";
import { useLoader } from "../Contexts/LoaderContext";

export default function AppLayout({ children }) {
  const { url } = usePage();
  const { isLoading } = useLoader();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Razorpay script is now loaded globally from the blade template
  // This effect just verifies it's loaded
  useEffect(() => {
    // Check if Razorpay is available (loaded from CDN)
    const checkRazorpay = setInterval(() => {
      if (window.Razorpay) {
        console.log('✅ Razorpay is available');
        clearInterval(checkRazorpay);
      }
    }, 500);

    // Stop checking after 10 seconds
    setTimeout(() => {
      clearInterval(checkRazorpay);
      if (!window.Razorpay) {
        console.warn('⚠️ Razorpay did not load within 10 seconds');
      }
    }, 10000);

    return () => clearInterval(checkRazorpay);
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing
      e.preventDefault();
      // Store the event for later use
      setDeferredPrompt(e);
      // Check if app is already installed
      const isInstalled = localStorage.getItem('pwaInstalled');
      if (!isInstalled) {
        // Show install prompt immediately
        setShowInstallPrompt(true);
      }
    };

    const handleAppInstalled = () => {
      // Hide the install prompt
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
      // Mark app as installed in localStorage
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

      {/* Responsive Container - Mobile-first, Desktop layout */}
      <div className="relative w-full lg:max-w-full bg-brand-background dark:bg-gray-900 lg:flex lg:h-screen">

        {/* Desktop Sidebar - Visible only on lg and above */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 xl:w-72 bg-white dark:bg-gray-800 border-r border-brand-border dark:border-gray-700 lg:fixed lg:inset-y-0 lg:left-0 lg:z-30">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-brand-border dark:border-gray-700">
            <h2 className="text-xl font-bold text-brand-primary dark:text-gray-100">Menu</h2>
            {/* <p className="text-sm text-brand-secondary dark:text-gray-400 mt-1">Navigate & Explore</p> */}
          </div>

          {/* Sidebar Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <SidebarLink
              href="/dashboard"
              icon={Home}
              label="Home"
              onClick={() => setSidebarOpen(false)}
              currentUrl={url}
            />
            {/* {usePage().props.auth?.user && (
              <SidebarLink
                href="/holds"
                icon={Ticket}
                label="My Seats"
                onClick={() => setSidebarOpen(false)}
                currentUrl={url}
              />
            )} */}
            <SidebarLink
              href="/explore"
              icon={Search}
              label="Explore"
              onClick={() => setSidebarOpen(false)}
              currentUrl={url}
            />
            <SidebarLink
              href={usePage().props.auth?.user ? "/notifications" : "/login"}
              icon={Bell}
              label="Notifications"
              onClick={() => setSidebarOpen(false)}
              currentUrl={url}
            />
            {usePage().props.auth?.user && (
              <SidebarLink
                href="/profile"
                icon={User}
                label="Profile"
                onClick={() => setSidebarOpen(false)}
                currentUrl={url}
              />
            )}
            {usePage().props.auth?.user && (
              <SidebarLink
                href="/bookings"
                icon={Calendar}
                label="My Bookings"
                onClick={() => setSidebarOpen(false)}
                currentUrl={url}
              />
            )}
            <SidebarLink
              href="/help"
              icon={HelpCircle}
              label="Help & Support"
              onClick={() => setSidebarOpen(false)}
              currentUrl={url}
            />
            <div className="my-4 border-t border-brand-border/50" />
          </nav>

          {/* Logout/Login/Sign Up */}
          <div className="p-4 border-t border-brand-border dark:border-gray-700">
            {usePage().props.auth?.user ? (
              <button
                onClick={() => {
                  setSidebarOpen(false);
                  router.post("/logout");
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/login"
                  onClick={() => setSidebarOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-brand-primary dark:bg-blue-600 text-white hover:bg-brand-primary/90 dark:hover:bg-blue-700 transition-colors font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Login</span>
                </Link>
                <Link
                  href="/register"
                  onClick={() => setSidebarOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border-2 border-brand-primary dark:border-blue-600 text-brand-primary dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors font-medium"
                >
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>
        </aside>

        {/* Mobile/Tablet Layout */}
        <div className="lg:hidden relative w-full flex flex-col min-h-screen">
        <header className="sticky top-0 z-20 bg-white dark:bg-gray-800 border-b border-brand-border dark:border-gray-700 px-4 py-3 md:px-6 lg:px-8 flex items-center justify-between">
          {/* Hamburger Menu */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-brand-border dark:hover:bg-gray-700 rounded-lg transition-colors mr-2"
          >
            {sidebarOpen ? (
              <X className="w-6 h-6 text-brand-primary dark:text-gray-100" />
            ) : (
              <Menu className="w-6 h-6 text-brand-secondary dark:text-gray-400" />
            )}
          </button>

          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 flex-1">
            <span className="text-lg md:text-xl font-bold text-brand-primary dark:text-blue-400">
              Secure My Seat
            </span>
          </Link>

          {/* User Avatar */}
          <div className="flex items-center justify-end">
            <Link
              href={usePage().props.auth?.user ? "/profile" : "/login"}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-brand-border dark:bg-gray-700 flex items-center justify-center hover:shadow-md transition-shadow flex-shrink-0 overflow-hidden"
            >
              {usePage().props.auth?.user?.profile_image ? (
                <img
                  src={`/assets/profile_images/${usePage().props.auth.user.profile_image}`}
                  alt={usePage().props.auth.user?.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm md:text-base font-bold text-brand-primary dark:text-gray-100">
                  {usePage().props.auth?.user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              )}
            </Link>
          </div>
        </header>

        {/* Sidebar */}
        <div
          className={`fixed inset-0 z-40 transition-opacity duration-300 ${
            sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setSidebarOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 dark:bg-black/70" />

          {/* Sidebar Panel */}
          <div
            className={`absolute left-0 top-0 h-screen w-64 md:w-72 bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 z-50 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } overflow-y-auto`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sidebar Header */}
            <div className="p-4 md:p-6 border-b border-brand-border dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-lg md:text-xl font-bold text-brand-primary dark:text-gray-100">Menu</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 hover:bg-brand-border dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-brand-secondary dark:text-gray-400" />
              </button>
            </div>

            {/* Sidebar Links */}
            <nav className="p-4 md:p-6 space-y-2">
              <SidebarLink
                href="/dashboard"
                icon={Home}
                label="Home"
                onClick={() => setSidebarOpen(false)}
                currentUrl={url}
              />
              {/* {usePage().props.auth?.user && (
                <SidebarLink
                  href="/holds"
                  icon={Ticket}
                  label="My Seats"
                  onClick={() => setSidebarOpen(false)}
                  currentUrl={url}
                />
              )} */}
              <SidebarLink
                href="/explore"
                icon={Search}
                label="Explore"
                onClick={() => setSidebarOpen(false)}
                currentUrl={url}
              />
              <SidebarLink
                href={usePage().props.auth?.user ? "/notifications" : "/login"}
                icon={Bell}
                label="Notifications"
                onClick={() => setSidebarOpen(false)}
                currentUrl={url}
              />
              {usePage().props.auth?.user && (
                <SidebarLink
                  href="/profile"
                  icon={User}
                  label="Profile"
                  onClick={() => setSidebarOpen(false)}
                  currentUrl={url}
                />
              )}
              {usePage().props.auth?.user && (
                <SidebarLink
                  href="/bookings"
                  icon={Calendar}
                  label="My Bookings"
                  onClick={() => setSidebarOpen(false)}
                  currentUrl={url}
                />
              )}
              <SidebarLink
                href="/help"
                icon={HelpCircle}
                label="Help & Support"
                onClick={() => setSidebarOpen(false)}
                currentUrl={url}
              />

              {/* Divider */}
              <div className="my-4 border-t border-brand-border dark:border-gray-700" />

              {/* Logout/Login/Sign Up */}
              {usePage().props.auth?.user ? (
                <button
                  onClick={() => {
                    setSidebarOpen(false);
                    router.post("/logout");
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/login"
                    onClick={() => setSidebarOpen(false)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-brand-primary dark:bg-blue-600 text-white hover:bg-brand-primary/90 dark:hover:bg-blue-700 transition-colors font-medium"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Login</span>
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setSidebarOpen(false)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border-2 border-brand-primary dark:border-blue-600 text-brand-primary dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors font-medium"
                  >
                    <span>Sign Up</span>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 px-4 pt-2 pb-32 md:pb-40 lg:pb-48 md:px-6 overflow-y-auto overflow-x-hidden">
          {children}
        </main>

        {/* Sticky Bottom Navigation */}
        <nav className="fixed inset-x-0 bottom-0 flex justify-center z-50">
          <div className="w-full bg-white dark:bg-gray-800 shadow-xl px-1 py-1.5 md:p-2 rounded-xs border-t md:border border-brand-border dark:border-gray-700">
            <div className="flex justify-between items-end gap-0.5 md:gap-1">
              <FooterIcon href="/dashboard"     icon={Home}   label="Home"     currentUrl={url} />
              {/* <FooterIcon href={usePage().props.auth?.user ? "/holds" : "/login"}         icon={Ticket} label="My Seats" currentUrl={url} /> */}
              <FooterIcon href="/movies" icon={Film}   label="Movies"   currentUrl={url} />
              {/* ── Centre elevated Explore circle ── */}
              <ExploreIcon href="/explore" currentUrl={url} />
              <FooterIcon href={usePage().props.auth?.user ? "/bookings" : "/login"} icon={Calendar}   label="Bookings"   currentUrl={url} />
              <FooterIcon href={usePage().props.auth?.user ? "/profile" : "/login"}       icon={User}   label="Profile"  currentUrl={url} />
            </div>
          </div>
        </nav>
        </div>

        {/* Desktop Layout - Visible only on lg and above */}
        <div className="hidden lg:flex lg:flex-col lg:flex-1 lg:ml-64 xl:ml-72">
          {/* Desktop Header */}
          <header className="sticky top-0 z-20 bg-white dark:bg-gray-800 border-b border-brand-border dark:border-gray-700 px-6 xl:px-8 py-4 flex items-center justify-between">
            {/* Logo/Title */}
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="text-xl font-bold text-brand-primary dark:text-blue-400">Secure My Seat</span>
            </Link>

            {/* User Avatar */}
            <div className="flex items-center justify-end">
              <Link
                href={usePage().props.auth?.user ? "/profile" : "/login"}
                className="w-12 h-12 rounded-full bg-brand-border dark:bg-gray-700 flex items-center justify-center hover:shadow-md transition-shadow flex-shrink-0 overflow-hidden"
              >
                {usePage().props.auth?.user?.profile_image ? (
                  <img
                    src={`/assets/profile_images/${usePage().props.auth.user.profile_image}`}
                    alt={usePage().props.auth.user?.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-base font-bold text-brand-primary dark:text-gray-100">
                    {usePage().props.auth?.user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                )}
              </Link>
            </div>
          </header>

          {/* Desktop Main Content */}
          <main className="flex-1 px-6 xl:px-8 py-6 overflow-y-auto overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

// ─── Regular footer icon ──────────────────────────────────────────────────────

function FooterIcon({ href, icon: Icon, label, currentUrl }) {
  const isActive = currentUrl === href || currentUrl?.startsWith(href + '/');

  return (
    <Link href={href}>
      <div
        className={`flex flex-col items-center justify-center w-12 sm:w-14 rounded-md md:rounded-lg transition-all duration-200 py-0.5 sm:py-1 md:py-2 ${
          isActive ? "text-brand-primary dark:text-blue-400" : "text-brand-secondary dark:text-gray-400"
        }`}
      >
        <Icon size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
        <span className="text-[10px] sm:text-xs md:text-sm mt-0.5 sm:mt-1 font-medium line-clamp-1">{label}</span>
      </div>
    </Link>
  );
}

// ─── Elevated centre Explore icon ────────────────────────────────────────────

function ExploreIcon({ href, currentUrl }) {
  const isActive = currentUrl === href || currentUrl?.startsWith(href + '/');

  return (
    <Link href={href} className="relative flex flex-col items-center w-12 sm:w-14">

      {/* Dark filled circle with white ring border, floating above nav bar */}
      <div
        className={`absolute -top-5 sm:-top-6 md:-top-8 w-11 sm:w-13 rounded-full flex items-center justify-center transition-all duration-200 ${
          isActive ? "scale-105" : "hover:opacity-90 active:scale-95"
        }`}
        style={{
          background: '#0F2A44',
          boxShadow: '0 4px 18px rgba(15,42,68,0.5), 0 0 0 3px #ffffff',
          height: '44px',
          width: '52px'
        }}
      >
        <Search size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" strokeWidth={2.5} />
      </div>

      {/* Spacer — keeps nav row height consistent */}
      <div className="h-6 sm:h-8" />

      {/* Label */}
      <span
        className={`text-[10px] sm:text-xs md:text-sm font-semibold mb-0.5 transition-colors ${
          isActive ? "text-brand-primary" : "text-brand-secondary"
        }`}
      >
        Explore
      </span>

    </Link>
  );
}

// ─── Sidebar link ────────────────────────────────────────────────────────────

function SidebarLink({ href, icon: Icon, label, onClick, currentUrl }) {
  const isActive = currentUrl === href || currentUrl?.startsWith(href + '/');

  return (
    <Link href={href} onClick={onClick}>
      <div
        className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
          isActive
            ? "bg-gradient-to-r from-brand-primary to-brand-primary/80 text-white shadow-lg dark:bg-gradient-to-r dark:from-blue-600 dark:to-blue-700"
            : "text-brand-secondary dark:text-gray-400 hover:bg-brand-background hover:text-brand-primary dark:hover:bg-gray-700/50"
        }`}
      >
        <Icon size={20} className={`${isActive ? "text-white" : "group-hover:text-brand-primary dark:group-hover:text-blue-400"}`} />
        <span className="font-semibold text-sm">{label}</span>
      </div>
    </Link>
  );
}