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
    Sparkles,
    ChevronRight,
} from "lucide-react";

export default function AdminAppLayout({ children }) {
    const { url, props } = usePage();
    const user = props?.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date) =>
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const formatDate = (date) =>
        date.toLocaleDateString([], {
            weekday: "short",
            month: "short",
            day: "numeric",
        });

    // Redirect if user is not admin
    useEffect(() => {
        if (user?.role && user.role !== "admin") {
            if (user.role === "vendor") {
                router.visit("/vendor/dashboard");
            } else {
                router.visit("/dashboard");
            }
        }
    }, [user?.role]);

    const sidebarItems = [
        { href: "/admin/dashboard", icon: BarChart3, label: "Dashboard" },
        { href: "/admin/users", icon: Users, label: "Users" },
        { href: "/admin/vendors", icon: Store, label: "Vendors" },
        { href: "/admin/experiences", icon: Sparkles, label: "Experiences" },
        { href: "/admin/temples", icon: Store, label: "Temples" },
        { href: "/admin/tourism-packages", icon: Store, label: "Tourism Packages" },
        { href: "/admin/flights", icon: Store, label: "Flights" },
        { href: "/admin/restaurants", icon: Store, label: "Restaurants" },
        { href: "/admin/properties", icon: Store, label: "Properties" },
        { href: "/admin/bookings", icon: Calendar, label: "Bookings" },
        { href: "/admin/queries", icon: HelpCircle, label: "Support Queries" },
    ];

    useEffect(() => {
        setSidebarOpen(false);
    }, [url]);

    const getPageName = () => {
        if (url === "/admin/dashboard") return "Dashboard";
        if (url?.startsWith("/admin/users")) return "Users";
        if (url?.startsWith("/admin/vendors")) return "Vendors";
        if (url?.startsWith("/admin/experiences")) return "Experiences";
        if (url?.startsWith("/admin/temples")) return "Temples";
        if (url?.startsWith("/admin/tourism-packages")) return "Tourism Packages";
        if (url?.startsWith("/admin/flights")) return "Flights";
        if (url?.startsWith("/admin/restaurants")) return "Restaurants";
        if (url?.startsWith("/admin/dining-offers")) return "Dining Offers";
        if (url?.startsWith("/admin/properties")) return "Properties";
        if (url?.startsWith("/admin/room-types")) return "Room Types";
        if (url?.startsWith("/admin/property-bookings")) return "Property Bookings";
        if (url?.startsWith("/admin/bookings")) return "Bookings";
        return "Admin";
    };

    const restaurantSubTabs = [
        { href: "/admin/restaurants", label: "Overview" },
        { href: "/admin/dining-offers", label: "Offers" },
    ];

    const isRestaurantSection =
        url?.startsWith("/admin/restaurants") || url?.startsWith("/admin/dining-offers");

    const propertySubTabs = [
        { href: "/admin/properties", label: "Overview" },
        { href: "/admin/room-types", label: "Room Types" },
        { href: "/admin/property-bookings", label: "Bookings" },
    ];

    const isPropertySection =
        url?.startsWith("/admin/properties") ||
        url?.startsWith("/admin/room-types") ||
        url?.startsWith("/admin/property-bookings");

    const templeSubTabs = [
        { href: "/admin/temples", label: "Overview" },
        { href: "/admin/stays", label: "Stays" },
        { href: "/admin/transports", label: "Transports" },
        { href: "/admin/vips", label: "VIPs" },
        { href: "/admin/parkings", label: "Parkings" },
        { href: "/admin/guides", label: "Guides" },
        { href: "/admin/festival-shows", label: "Festival Shows" },
        { href: "/admin/assistance", label: "Assistance" },
    ];

    const isTempleSection =
        url?.startsWith("/admin/temples") ||
        url?.startsWith("/admin/stays") ||
        url?.startsWith("/admin/transports") ||
        url?.startsWith("/admin/vips") ||
        url?.startsWith("/admin/parkings") ||
        url?.startsWith("/admin/guides") ||
        url?.startsWith("/admin/festival-shows") ||
        url?.startsWith("/admin/assistance");

    const SidebarContent = ({ onClose }) => (
        <div
            className="flex flex-col h-full relative overflow-hidden"
            style={{ background: "var(--sidebar-bg, inherit)" }}
        >
            {/* Decorative background orbs */}
            <div
                className="absolute pointer-events-none"
                style={{
                    width: 180,
                    height: 180,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.06)",
                    top: -60,
                    right: -60,
                }}
            />
            <div
                className="absolute pointer-events-none"
                style={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.05)",
                    bottom: 80,
                    left: -40,
                }}
            />
            {/* Subtle dot grid pattern */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage:
                        "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                }}
            />

            {/* Logo */}
            <div
                className="relative px-6 py-5 flex items-center justify-between flex-shrink-0"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.12)" }}
            >
                <div>
                    <div className="flex items-center gap-2 mb-0.5">
                        <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: "rgba(255,255,255,0.2)" }}
                        >
                            <BarChart3 className="w-4 h-4 text-white" />
                        </div>
                        <h2 className="text-lg font-bold text-white tracking-tight">
                            Admin Portal
                        </h2>
                    </div>
                    <p
                        className="text-xs pl-9"
                        style={{ color: "rgba(255,255,255,0.55)" }}
                    >
                        Manage platform
                    </p>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ background: "rgba(255,255,255,0.1)" }}
                    >
                        <X className="w-4 h-4 text-white" />
                    </button>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto relative">
                <p
                    className="text-xs font-semibold uppercase tracking-widest px-4 mb-3"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                >
                    Navigation
                </p>
                {sidebarItems.map((item) => {
                    const isActive =
                        url === item.href || url?.startsWith(item.href + "/");
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className="flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200 group relative overflow-hidden"
                            style={
                                isActive
                                    ? {
                                          background: "rgba(255,255,255,0.95)",
                                          boxShadow:
                                              "0 2px 12px rgba(0,0,0,0.15)",
                                      }
                                    : {
                                          color: "rgba(255,255,255,0.75)",
                                      }
                            }
                        >
                            {/* Hover shimmer layer (non-active) */}
                            {!isActive && (
                                <span
                                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                    style={{
                                        background: "rgba(255,255,255,0.1)",
                                    }}
                                />
                            )}

                            {/* Icon container */}
                            <span
                                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200 relative z-10"
                                style={
                                    isActive
                                        ? { background: "rgba(0,0,0,0.07)" }
                                        : {
                                              background:
                                                  "rgba(255,255,255,0.1)",
                                          }
                                }
                            >
                                <item.icon
                                    className="w-4 h-4 transition-colors duration-200"
                                    style={{
                                        color: isActive
                                            ? "var(--color-brand-primary, #6366f1)"
                                            : "rgba(255,255,255,0.85)",
                                    }}
                                />
                            </span>

                            <span
                                className="font-semibold text-sm relative z-10 transition-colors duration-200"
                                style={{ color: isActive ? "#111" : "inherit" }}
                            >
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            {/* User Info + Logout */}
            <div
                className="relative p-4 flex-shrink-0"
                style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}
            >
                {/* User row */}
                <div
                    className="flex items-center gap-3 px-4 py-3 rounded-xl mb-2"
                    style={{ background: "rgba(255,255,255,0.08)" }}
                >
                    <div
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
                        style={{ background: "rgba(255,255,255,0.2)" }}
                    >
                        {user?.profile_image ? (
                            <img
                                src={`/assets/profile_images/${user.profile_image}`}
                                alt={user?.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-xs font-bold text-white">
                                {user?.name?.charAt(0).toUpperCase() || "A"}
                            </span>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">
                            {user?.name || "Admin"}
                        </p>
                        <p
                            className="text-xs truncate"
                            style={{ color: "rgba(255,255,255,0.5)" }}
                        >
                            Administrator
                        </p>
                    </div>
                </div>

                {/* Logout */}
                <button
                    onClick={() => router.post("/logout")}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group"
                    style={{ color: "rgba(255,255,255,0.65)" }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                            "rgba(255,80,80,0.15)";
                        e.currentTarget.style.color = "#fca5a5";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "rgba(255,255,255,0.65)";
                    }}
                >
                    <span
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: "rgba(255,255,255,0.08)" }}
                    >
                        <LogOut className="w-4 h-4" />
                    </span>
                    <span className="font-semibold text-sm">Logout</span>
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex bg-brand-background dark:bg-gray-900">
            {/* Mobile/Tablet Layout */}
            <div className="md:hidden relative w-full flex flex-col">
                {/* Top Bar — Mobile */}
                <header className="sticky top-0 z-20 bg-white dark:bg-gray-800 border-b border-brand-border dark:border-gray-700 px-4 py-3 flex items-center justify-between">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="w-9 h-9 flex items-center justify-center rounded-xl border border-brand-border dark:border-gray-600 hover:bg-brand-background dark:hover:bg-gray-700 transition-colors"
                    >
                        {sidebarOpen ? (
                            <X className="w-4 h-4" />
                        ) : (
                            <Menu className="w-4 h-4" />
                        )}
                    </button>

                    <div className="flex flex-col items-center">
                        <h1 className="text-sm font-bold text-brand-primary dark:text-gray-100 leading-tight">
                            {getPageName()}
                        </h1>
                        <span className="text-xs text-brand-secondary dark:text-gray-400">
                            Admin Portal
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Notification Bell */}
                        <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-brand-border dark:border-gray-600 hover:bg-brand-background dark:hover:bg-gray-700 transition-colors relative">
                            <Bell className="w-4 h-4 text-brand-secondary dark:text-gray-400" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-800"></span>
                        </button>
                        {/* Avatar */}
                        <div className="w-9 h-9 rounded-xl bg-brand-primary flex items-center justify-center flex-shrink-0 overflow-hidden ring-2 ring-brand-primary/20">
                            {user?.profile_image ? (
                                <img
                                    src={`/assets/profile_images/${user.profile_image}`}
                                    alt={user?.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-xs font-bold text-white">
                                    {user?.name?.charAt(0).toUpperCase() || "A"}
                                </span>
                            )}
                        </div>
                    </div>
                </header>

                {/* Sidebar Overlay for Mobile */}
                <div
                    className={`fixed top-0 left-0 right-0 bottom-0 z-40 transition-opacity duration-300 ${
                        sidebarOpen
                            ? "opacity-100 pointer-events-auto"
                            : "opacity-0 pointer-events-none"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                >
                    <div className="absolute inset-0 bg-black/50" />
                    <div
                        className={`absolute left-0 top-0 h-screen w-64 shadow-2xl transform transition-transform duration-300 z-50 bg-brand-primary ${
                            sidebarOpen ? "translate-x-0" : "-translate-x-full"
                        } flex flex-col`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <SidebarContent onClose={() => setSidebarOpen(false)} />
                    </div>
                </div>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto px-4 py-6">
                    {isTempleSection && (
                        <div className="mb-6 border-b border-brand-border dark:border-gray-700 -mx-4 px-4">
                            <div className="flex gap-2 overflow-x-auto pb-3">
                                {templeSubTabs.map((tab) => {
                                    const isActive = url === tab.href;
                                    return (
                                        <Link
                                            key={tab.href}
                                            href={tab.href}
                                            className={`px-3 py-2 font-medium text-xs whitespace-nowrap transition-colors rounded ${
                                                isActive
                                                    ? "text-brand-primary bg-brand-background dark:bg-gray-800"
                                                    : "text-brand-secondary hover:text-brand-primary"
                                            }`}
                                        >
                                            {tab.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                    {isRestaurantSection && (
                        <div className="mb-6 border-b border-brand-border dark:border-gray-700 -mx-4 px-4">
                            <div className="flex gap-2 overflow-x-auto pb-3">
                                {restaurantSubTabs.map((tab) => {
                                    const isActive = url === tab.href;
                                    return (
                                        <Link
                                            key={tab.href}
                                            href={tab.href}
                                            className={`px-3 py-2 font-medium text-xs whitespace-nowrap transition-colors rounded ${
                                                isActive
                                                    ? "text-brand-primary bg-brand-background dark:bg-gray-800"
                                                    : "text-brand-secondary hover:text-brand-primary"
                                            }`}
                                        >
                                            {tab.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                    {isPropertySection && (
                        <div className="mb-6 border-b border-brand-border dark:border-gray-700 -mx-4 px-4">
                            <div className="flex gap-2 overflow-x-auto pb-3">
                                {propertySubTabs.map((tab) => {
                                    const isActive = url === tab.href;
                                    return (
                                        <Link
                                            key={tab.href}
                                            href={tab.href}
                                            className={`px-3 py-2 font-medium text-xs whitespace-nowrap transition-colors rounded ${
                                                isActive
                                                    ? "text-brand-primary bg-brand-background dark:bg-gray-800"
                                                    : "text-brand-secondary hover:text-brand-primary"
                                            }`}
                                        >
                                            {tab.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                    {children}
                </main>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:flex w-full">
                {/* Sidebar */}
                <aside className="fixed left-0 top-0 w-64 h-screen flex flex-col z-30 bg-brand-primary">
                    <SidebarContent onClose={null} />
                </aside>

                {/* Main Content */}
                <div className="flex-1 ml-64 flex flex-col overflow-hidden">
                    {/* Top Bar — Desktop */}
                    <header
                        className="sticky top-0 z-20 bg-white dark:bg-gray-800 border-b border-brand-border dark:border-gray-700 px-6 py-0 flex items-center justify-between"
                        style={{ minHeight: "64px" }}
                    >
                        {/* Left: Breadcrumb + Page title */}
                        <div className="flex flex-col justify-center">
                            <div className="flex items-center gap-1.5 mb-0.5">
                                <span className="text-xs text-brand-secondary dark:text-gray-500 font-medium">
                                    Admin
                                </span>
                                <ChevronRight className="w-3 h-3 text-brand-secondary dark:text-gray-600" />
                                <span className="text-xs text-brand-primary dark:text-gray-400 font-semibold">
                                    {getPageName()}
                                </span>
                            </div>
                            {/* <h1 className="text-xl font-bold text-brand-primary dark:text-gray-100 leading-tight">{getPageName()}</h1> */}
                        </div>

                        {/* Right: Clock + Bell + Divider + User */}
                        <div className="flex items-center gap-3">
                            {/* Live clock */}
                            <div className="flex flex-col items-end mr-1">
                                <span className="text-sm font-semibold text-brand-primary dark:text-gray-200 tabular-nums leading-tight">
                                    {formatTime(currentTime)}
                                </span>
                                <span className="text-xs text-brand-secondary dark:text-gray-500 leading-tight">
                                    {formatDate(currentTime)}
                                </span>
                            </div>

                            {/* Divider */}
                            <div className="w-px h-8 bg-brand-border dark:bg-gray-700" />

                            {/* Notification Bell */}
                            {/* <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-brand-border dark:border-gray-600 hover:bg-brand-background dark:hover:bg-gray-700 transition-colors relative">
                <Bell className="w-4 h-4 text-brand-secondary dark:text-gray-400" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-800"></span>
              </button> */}

                            {/* Divider */}
                            {/* <div className="w-px h-8 bg-brand-border dark:bg-gray-700" /> */}

                            {/* User pill */}
                            <div className="flex items-center gap-2.5 pl-1">
                                <div className="flex flex-col items-end">
                                    <span className="text-sm font-semibold text-brand-primary dark:text-gray-100 leading-tight">
                                        {user?.name || "Admin"}
                                    </span>
                                    <span className="text-xs text-brand-secondary dark:text-gray-500 leading-tight">
                                        Administrator
                                    </span>
                                </div>
                                <div className="w-9 h-9 rounded-xl bg-brand-primary flex items-center justify-center flex-shrink-0 overflow-hidden ring-2 ring-brand-primary/20">
                                    {user?.profile_image ? (
                                        <img
                                            src={`/assets/profile_images/${user.profile_image}`}
                                            alt={user?.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-xs font-bold text-white">
                                            {user?.name
                                                ?.charAt(0)
                                                .toUpperCase() || "A"}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Content Area */}
                    <main className="flex-1 overflow-y-auto px-6 py-6">
                        {isTempleSection && (
                            <div className="mb-6 border-b border-brand-border dark:border-gray-700">
                                <div className="flex gap-4 overflow-x-auto">
                                    {templeSubTabs.map((tab) => {
                                        const isActive = url === tab.href;
                                        return (
                                            <Link
                                                key={tab.href}
                                                href={tab.href}
                                                className={`px-4 py-3 font-medium text-sm whitespace-nowrap transition-colors ${
                                                    isActive
                                                        ? "text-brand-primary border-b-2 border-brand-primary"
                                                        : "text-brand-secondary hover:text-brand-primary"
                                                }`}
                                            >
                                                {tab.label}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                        {isRestaurantSection && (
                            <div className="mb-6 border-b border-brand-border dark:border-gray-700">
                                <div className="flex gap-4 overflow-x-auto">
                                    {restaurantSubTabs.map((tab) => {
                                        const isActive = url === tab.href;
                                        return (
                                            <Link
                                                key={tab.href}
                                                href={tab.href}
                                                className={`px-4 py-3 font-medium text-sm whitespace-nowrap transition-colors ${
                                                    isActive
                                                        ? "text-brand-primary border-b-2 border-brand-primary"
                                                        : "text-brand-secondary hover:text-brand-primary"
                                                }`}
                                            >
                                                {tab.label}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                        {isPropertySection && (
                            <div className="mb-6 border-b border-brand-border dark:border-gray-700">
                                <div className="flex gap-4 overflow-x-auto">
                                    {propertySubTabs.map((tab) => {
                                        const isActive = url === tab.href;
                                        return (
                                            <Link
                                                key={tab.href}
                                                href={tab.href}
                                                className={`px-4 py-3 font-medium text-sm whitespace-nowrap transition-colors ${
                                                    isActive
                                                        ? "text-brand-primary border-b-2 border-brand-primary"
                                                        : "text-brand-secondary hover:text-brand-primary"
                                                }`}
                                            >
                                                {tab.label}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
