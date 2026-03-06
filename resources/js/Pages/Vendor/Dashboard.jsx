import React, { useState, useEffect } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import VendorAppLayout from '@/Layouts/VendorAppLayout';
import { Plus, TrendingUp, AlertTriangle, ChevronRight, BarChart3, PieChart, Activity, Clock } from 'lucide-react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart as RechartsPie,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

// Real-time countdown component for alerts
function CountdownTimer({ expiresAt }) {
    const [timeLeft, setTimeLeft] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const expiryTime = new Date(expiresAt).getTime();
            const now = new Date().getTime();
            const difference = expiryTime - now;

            if (difference > 0) {
                setTimeLeft({
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / (1000 * 60)) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            } else {
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, [expiresAt]);

    return (
        <div className="flex items-center gap-1 text-xs font-semibold text-brand-danger">
            <Clock className="w-3 h-3" />
            <span>
                {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
            </span>
        </div>
    );
}

export default function VendorDashboard() {
    const { user, stats, recentBookings, vendorStatus, liveInventory, criticalAlerts, chartData } = usePage().props;
    const [isLoading, setIsLoading] = useState(false);

    // Theme colors from tailwind.config.js
    const themeColors = {
        primary: '#0F2A44',
        secondary: '#5F6C7B',
        success: '#1F8A70',
        warning: '#F2A541',
        danger: '#D64545',
        border: '#E3E8EF',
    };

    // Different color palettes for different charts
    const REVENUE_COLORS = [themeColors.success]; // Green for revenue
    const BOOKINGS_COLORS = [themeColors.success, themeColors.warning]; // Green for bookings, Orange for holds
    const EXPERIENCE_COLORS = [themeColors.primary, themeColors.secondary]; // Navy for top experiences
    const PIE_COLORS = [themeColors.success, themeColors.warning, themeColors.danger, themeColors.primary, themeColors.secondary]; // All colors for pie chart
    const OCCUPANCY_COLORS = [themeColors.success, themeColors.warning]; // Green for confirmed, orange for holds

    const lineColor = themeColors.success;
    const gridColor = themeColors.border;

    const fillPercent = (booked, total) => Math.round((booked / total) * 100);

    // Auto-refresh dashboard every 60 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['stats', 'chartData', 'liveInventory', 'criticalAlerts'] });
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <VendorAppLayout>
            <Head title="Vendor Dashboard" />

            <div className="space-y-4 pb-4">

                {/* Welcome Header */}
                <div className="flex items-center justify-between pt-1 pb-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-border flex items-center justify-center overflow-hidden flex-shrink-0">
                            <span className="text-brand-primary font-bold text-sm">
                                {user?.name?.[0] ?? 'A'}
                            </span>
                        </div>
                        <div>
                            <p className="text-xs text-brand-secondary uppercase tracking-wider font-medium">Welcome Back</p>
                            <p className="text-sm font-bold text-brand-primary leading-tight">
                                {user?.business_name ?? user?.name ?? 'Adventure Hub Pro'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Vendor Status Alert */}
                {vendorStatus && vendorStatus !== 'approved' && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-2xl">
                        <p className="text-yellow-800 text-sm">
                            ⚠️ Your vendor account is <strong>{vendorStatus}</strong>.
                            {vendorStatus === 'pending' && ' Contact support for approval.'}
                        </p>
                    </div>
                )}

                {/* Add New Experience CTA */}
                <Link
                    href={route('vendor.experiences.create')}
                    className="flex items-center justify-center gap-2 w-full bg-brand-primary text-white py-4 rounded-xl font-semibold text-sm hover:bg-brand-primary/90 active:scale-[0.98] transition-all shadow-card"
                >
                    <Plus className="w-5 h-5" strokeWidth={2.5} />
                    Add New Experience
                </Link>

                {/* Total Revenue Card */}
                <div className="bg-brand-primary rounded-lg p-5 shadow-card relative overflow-hidden">
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full border-[20px] border-white" />
                        <div className="absolute -right-4 bottom-4 w-24 h-24 rounded-full border-[12px] border-white" />
                    </div>

                    <div className="relative">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-white/60 text-xs font-semibold uppercase tracking-widest">
                                Total Revenue (Monthly)
                            </p>
                            <TrendingUp className="w-5 h-5 text-white/40" />
                        </div>
                        <p className="text-4xl font-bold text-white mb-2">
                            ₹{(stats?.totalRevenue || 0).toLocaleString('en-IN', {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                            })}
                        </p>
                    </div>
                </div>

                {/* Key Metrics Cards - Enhanced */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {/* Active Holds */}
                    <div className="bg-white rounded-lg p-4 shadow-card border border-brand-border/50">
                        <p className="text-brand-secondary text-xs font-semibold uppercase tracking-wider mb-2">
                            Active Holds
                        </p>
                        <p className="text-3xl font-bold text-brand-primary">
                            {stats?.activeHolds ?? 0}
                        </p>
                        {stats?.expiringHoldsSoon > 0 && (
                            <p className="text-[11px] text-brand-danger font-medium mt-1.5">
                                {stats.expiringHoldsSoon} expiring soon
                            </p>
                        )}
                    </div>

                    {/* Bookings */}
                    <div className="bg-white rounded-lg p-4 shadow-card border border-brand-border/50">
                        <p className="text-brand-secondary text-xs font-semibold uppercase tracking-wider mb-2">
                            Bookings
                        </p>
                        <p className="text-3xl font-bold text-brand-primary">
                            {stats?.totalBookings ?? 0}
                        </p>
                        <p className="text-[11px] font-medium mt-1.5" style={{ color: '#1F8A70' }}>
                            Active
                        </p>
                    </div>

                    {/* Occupancy */}
                    <div className="bg-white rounded-lg p-4 shadow-card border border-brand-border/50">
                        <p className="text-brand-secondary text-xs font-semibold uppercase tracking-wider mb-2">
                            Occupancy
                        </p>
                        <p className="text-3xl font-bold text-brand-primary">
                            {stats?.occupancyPercent ?? 0}%
                        </p>
                        <p className="text-[11px] font-medium mt-1.5">
                            {stats?.bookedSeats ?? 0}/{stats?.totalCapacity ?? 0} seats
                        </p>
                    </div>

                    {/* Experiences */}
                    <div className="bg-white rounded-lg p-4 shadow-card border border-brand-border/50">
                        <p className="text-brand-secondary text-xs font-semibold uppercase tracking-wider mb-2">
                            Experiences
                        </p>
                        <p className="text-3xl font-bold text-brand-primary">
                            {stats?.totalExperiences ?? 0}
                        </p>
                        {stats?.pendingExperiences > 0 && (
                            <p className="text-[11px] text-orange-600 font-medium mt-1.5">
                                {stats.pendingExperiences} pending
                            </p>
                        )}
                    </div>
                </div>

                {/* Charts Row 1: Revenue and Bookings Trends */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Revenue Trend Chart */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-brand-border dark:border-gray-700 p-4 shadow-card">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-base font-bold text-brand-primary">Revenue Trend</h3>
                            <BarChart3 className="w-4 h-4 text-brand-secondary" />
                        </div>
                        {chartData?.revenueTrend && chartData.revenueTrend.length > 0 ? (
                            <ResponsiveContainer width="100%" height={240}>
                                <LineChart data={chartData.revenueTrend}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                                    <XAxis
                                        dataKey="date"
                                        tick={{ fill: '#5F6C7B', fontSize: 10 }}
                                        tickLine={{ stroke: gridColor }}
                                    />
                                    <YAxis tick={{ fill: '#5F6C7B', fontSize: 10 }} tickLine={{ stroke: gridColor }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: `1px solid ${gridColor}`,
                                            borderRadius: '8px',
                                            fontSize: '11px',
                                        }}
                                        formatter={(value) => `₹${parseFloat(value).toLocaleString('en-IN')}`}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke={lineColor}
                                        strokeWidth={2}
                                        dot={{ fill: lineColor, r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-240 flex items-center justify-center text-brand-secondary text-xs">
                                No revenue data available yet
                            </div>
                        )}
                    </div>

                    {/* Bookings & Holds Trend Chart */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-brand-border dark:border-gray-700 p-4 shadow-card">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-base font-bold text-brand-primary">Bookings & Holds Trend</h3>
                            <Activity className="w-4 h-4 text-brand-secondary" />
                        </div>
                        {chartData?.bookingsTrend && chartData.bookingsTrend.length > 0 ? (
                            <ResponsiveContainer width="100%" height={240}>
                                <BarChart data={chartData.bookingsTrend}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                                    <XAxis
                                        dataKey="date"
                                        tick={{ fill: '#5F6C7B', fontSize: 10 }}
                                        tickLine={{ stroke: gridColor }}
                                    />
                                    <YAxis tick={{ fill: '#5F6C7B', fontSize: 10 }} tickLine={{ stroke: gridColor }} />
                                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: `1px solid ${gridColor}`, borderRadius: '8px', fontSize: '11px' }} />
                                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                                    <Bar dataKey="bookings" fill={BOOKINGS_COLORS[0]} name="Bookings" />
                                    <Bar dataKey="holds" fill={BOOKINGS_COLORS[1]} name="Holds" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-240 flex items-center justify-center text-brand-secondary text-xs">
                                No booking data available yet
                            </div>
                        )}
                    </div>
                </div>

                {/* Charts Row 2: Top Experiences and Status Distribution */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Top Experiences Chart */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-brand-border dark:border-gray-700 p-4 shadow-card">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-base font-bold text-brand-primary">Top Performing Experiences</h3>
                            <TrendingUp className="w-4 h-4 text-brand-secondary" />
                        </div>
                        {chartData?.topExperiences && chartData.topExperiences.length > 0 ? (
                            <ResponsiveContainer width="100%" height={240}>
                                <BarChart
                                    data={chartData.topExperiences}
                                    layout="vertical"
                                    margin={{ top: 5, right: 15, left: 60, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                                    <XAxis type="number" tick={{ fill: '#5F6C7B', fontSize: 9 }} tickLine={{ stroke: gridColor }} />
                                    <YAxis dataKey="title" type="category" width={55} tick={{ fill: '#5F6C7B', fontSize: 8 }} tickLine={{ stroke: gridColor }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: `1px solid ${gridColor}`,
                                            borderRadius: '8px',
                                            fontSize: '11px',
                                        }}
                                        formatter={(value) => `₹${parseFloat(value).toLocaleString('en-IN')}`}
                                    />
                                    <Bar dataKey="revenue" fill={EXPERIENCE_COLORS[0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-240 flex items-center justify-center text-brand-secondary text-xs">
                                No experience data available yet
                            </div>
                        )}
                    </div>

                    {/* Booking Status Distribution */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-brand-border dark:border-gray-700 p-3 shadow-card overflow-hidden">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-bold text-brand-primary">Booking Status</h3>
                            <PieChart className="w-3.5 h-3.5 text-brand-secondary" />
                        </div>
                        {chartData?.bookingStatusDistribution && Array.isArray(chartData.bookingStatusDistribution) && chartData.bookingStatusDistribution.length > 0 ? (
                            <>
                                <ResponsiveContainer width="100%" height={160}>
                                    <RechartsPie
                                        data={chartData.bookingStatusDistribution}
                                        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                                    >
                                        <Pie
                                            data={chartData.bookingStatusDistribution}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={65}
                                            paddingAngle={2}
                                            dataKey="value"
                                            label={false}
                                        >
                                            {chartData.bookingStatusDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#fff',
                                                border: `1px solid ${gridColor}`,
                                                borderRadius: '6px',
                                                fontSize: '10px',
                                                padding: '4px 8px',
                                            }}
                                            formatter={(value) => `${value} booking${value !== 1 ? 's' : ''}`}
                                        />
                                    </RechartsPie>
                                </ResponsiveContainer>
                                
                                {/* Legend Stats - Compact */}
                                <div className="mt-2 space-y-1">
                                    {chartData.bookingStatusDistribution.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-2 px-2 py-0.5 rounded bg-brand-border/20">
                                            <div
                                                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                                style={{ background: PIE_COLORS[idx % PIE_COLORS.length] }}
                                            />
                                            <div className="flex-1 flex items-center justify-between min-w-0">
                                                <p className="text-[10px] font-semibold text-brand-primary truncate">{item.name}</p>
                                                <p className="text-[10px] font-bold text-brand-primary ml-1 flex-shrink-0">{item.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="h-40 flex items-center justify-center text-brand-secondary text-xs">
                                No status data available yet
                            </div>
                        )}
                    </div>
                </div>

                {/* Occupancy Rates Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-brand-border dark:border-gray-700 p-4 shadow-card">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-base font-bold text-brand-primary">Live Experience Occupancy Breakdown</h3>
                        <Activity className="w-4 h-4 text-brand-secondary" />
                    </div>
                    {chartData?.occupancyRates && chartData.occupancyRates.length > 0 ? (
                        <ResponsiveContainer width="100%" height={240}>
                            <BarChart
                                data={chartData.occupancyRates}
                                margin={{ top: 5, right: 15, left: 60, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                                <XAxis type="number" tick={{ fill: '#5F6C7B', fontSize: 9 }} tickLine={{ stroke: gridColor }} />
                                <YAxis dataKey="experience" type="category" width={55} tick={{ fill: '#5F6C7B', fontSize: 8 }} tickLine={{ stroke: gridColor }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: `1px solid ${gridColor}`,
                                        borderRadius: '8px',
                                        fontSize: '11px',
                                    }}
                                    formatter={(value) => `${value}%`}
                                />
                                <Legend wrapperStyle={{ fontSize: '11px' }} />
                                <Bar dataKey="confirmedPercent" fill={OCCUPANCY_COLORS[0]} name="Confirmed %" />
                                <Bar dataKey="holdsPercent" fill={OCCUPANCY_COLORS[1]} name="Holds %" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-240 flex items-center justify-center text-brand-secondary text-xs">
                            No occupancy data available yet
                        </div>
                    )}
                </div>

                {/* Live Inventory Section */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-base font-bold text-brand-primary">Live Inventory</h2>
                        <Link
                            href={route('vendor.experiences.index')}
                            className="flex items-center gap-0.5 text-xs text-brand-secondary font-medium hover:text-brand-primary transition-colors"
                        >
                            View All
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {liveInventory && liveInventory.length > 0 ? (
                            liveInventory.map((item) => {
                                const percent = fillPercent(item.seatsBooked, item.totalSeats);
                                const isLive = item.status === 'active';

                                return (
                                    <div
                                        key={item.id}
                                        className="bg-white rounded-lg p-4 shadow-card border border-brand-border/50"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div
                                                className="w-14 h-14 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center"
                                                style={{ background: isLive ? '#1F4D30' : '#E3E8EF' }}
                                            >
                                                {item.image ? (
                                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-2xl">{isLive ? '🚣' : '🥾'}</span>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2 mb-0.5">
                                                    <p className="text-sm font-bold text-brand-primary truncate">{item.title}</p>
                                                    <span
                                                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0 ${
                                                            isLive
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-brand-border text-brand-secondary'
                                                        }`}
                                                    >
                                                        {item.status}
                                                    </span>
                                                </div>

                                                <div className="space-y-2">
                                                    {/* Seats Filled Progress */}
                                                    <div className="space-y-0.5">
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-[11px] text-brand-secondary font-medium">
                                                                Seats Filled: {item.confirmedBookings}/{item.totalSeats}
                                                            </p>
                                                            <p className="text-[11px] font-semibold text-brand-primary">{item.confirmedPercent}%</p>
                                                        </div>
                                                        <div className="h-1.5 bg-brand-border rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full rounded-full transition-all"
                                                                style={{
                                                                    width: `${item.confirmedPercent}%`,
                                                                    background: '#1F8A70',
                                                                }}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Seats Hold Progress */}
                                                    <div className="space-y-0.5">
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-[11px] text-brand-secondary font-medium">
                                                                Seats Hold: {item.activeHolds}/{item.totalSeats}
                                                            </p>
                                                            <p className="text-[11px] font-semibold text-brand-primary">{item.holdsPercent}%</p>
                                                        </div>
                                                        <div className="h-1.5 bg-brand-border rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full rounded-full transition-all"
                                                                style={{
                                                                    width: `${item.holdsPercent}%`,
                                                                    background: '#F4A261',
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-6 text-brand-secondary">
                                No live experiences yet
                            </div>
                        )}
                    </div>
                </div>

                {/* Critical Alerts Section */}
                {criticalAlerts && criticalAlerts.length > 0 && (
                    <div>
                        <h2 className="text-base font-bold text-brand-primary mb-3">Critical Alerts</h2>
                        <div className="space-y-3">
                            {criticalAlerts.map((alert) => (
                                <div
                                    key={alert.id}
                                    className="rounded-lg p-4 border flex items-start gap-3"
                                    style={{ background: '#FFF8EE', borderColor: '#F2A541' }}
                                >
                                    <div
                                        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                                        style={{ background: '#F2A541' }}
                                    >
                                        <AlertTriangle className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-brand-primary mb-0.5">
                                            {alert.title}
                                        </p>
                                        <p className="text-xs text-brand-secondary leading-relaxed mb-2">
                                            {alert.message}
                                        </p>
                                        {alert.expiresAt && (
                                            <CountdownTimer expiresAt={alert.expiresAt} />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </VendorAppLayout>
    );
}