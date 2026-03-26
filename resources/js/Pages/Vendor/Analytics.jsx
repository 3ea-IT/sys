import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import VendorAppLayout from '@/Layouts/VendorAppLayout';
import { BarChart2, TrendingUp, Tag, Calendar, CreditCard } from 'lucide-react';

export default function Analytics() {
    const { user, bookingsByStatus, bookingsByCategory, dailyRevenue } = usePage().props;

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'confirmed': return { bar: 'from-brand-success to-brand-success/70', dot: 'bg-brand-success', pill: 'bg-brand-success/10 text-brand-success border border-brand-success/20' };
            case 'cancelled': return { bar: 'from-brand-danger to-brand-danger/70', dot: 'bg-brand-danger', pill: 'bg-brand-danger/10 text-brand-danger border border-brand-danger/20' };
            default: return { bar: 'from-brand-warning to-brand-warning/70', dot: 'bg-brand-warning', pill: 'bg-brand-warning/10 text-brand-warning border border-brand-warning/20' };
        }
    };

    const categoryColors = [
        'from-brand-primary to-brand-primary/70',
        'from-brand-success to-brand-success/70',
        'from-brand-warning to-brand-warning/70',
        'from-brand-danger to-brand-danger/70',
        'from-brand-secondary to-brand-secondary/70',
    ];

    const maxStatus = Math.max(...(bookingsByStatus?.map(b => b.count) ?? [1]), 1);
    const maxRevenue = Math.max(...(dailyRevenue?.map(d => d.revenue) ?? [1]), 1);
    const maxCategory = Math.max(...(bookingsByCategory?.map(c => c.count) ?? [1]), 1);

    const totalRevenue = dailyRevenue?.reduce((sum, d) => sum + Number(d.revenue), 0) ?? 0;
    const totalBookings = bookingsByStatus?.reduce((sum, s) => sum + Number(s.count), 0) ?? 0;

    return (
        <VendorAppLayout user={user}>
            <Head title="Analytics & Reports" />

            <style>{`
                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(12px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes barGrow {
                    from { width: 0%; }
                    to { width: var(--bar-width); }
                }
                .anim-card { animation: fadeSlideUp 0.35s ease both; }
                .anim-card:nth-child(1) { animation-delay: 0.00s; }
                .anim-card:nth-child(2) { animation-delay: 0.08s; }
                .anim-card:nth-child(3) { animation-delay: 0.16s; }
                .bar-fill { animation: barGrow 0.7s cubic-bezier(0.34,1.2,0.64,1) both; }
            `}</style>

            <div className="space-y-5 pb-8">

                {/* ── Page Header ── */}
                <div className="flex items-center justify-between pt-1">
                    <div>
                        <h1 className="text-2xl font-bold text-brand-primary tracking-tight">Analytics</h1>
                        <p className="text-xs text-brand-secondary mt-0.5">Performance overview</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-primary/70 flex items-center justify-center shadow-md shadow-brand-primary/20">
                        <BarChart2 className="w-5 h-5 text-white" />
                    </div>
                </div>

                {/* ── Bookings by Status ── */}
                <div className="anim-card bg-white rounded-lg border border-brand-border shadow-sm overflow-hidden">
                    <div className="px-5 pt-5 pb-4 flex items-center gap-2.5 border-b border-brand-border/60">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-primary to-brand-primary/70 flex items-center justify-center text-white shadow-sm">
                            <BarChart2 className="w-4 h-4" />
                        </div>
                        <h2 className="text-base font-bold text-brand-primary">Bookings by Status</h2>
                    </div>
                    <div className="p-5 space-y-4">
                        {bookingsByStatus?.map((item, index) => {
                            const style = getStatusStyle(item.status);
                            const pct = (item.count / maxStatus) * 100;
                            return (
                                <div key={index}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${style.pill}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                                            {item.status}
                                        </span>
                                        <span className="text-sm font-bold text-brand-primary">{item.count}</span>
                                    </div>
                                    <div className="w-full bg-brand-border/40 rounded-full h-2.5 overflow-hidden">
                                        <div
                                            className={`bar-fill h-2.5 rounded-full bg-gradient-to-r ${style.bar}`}
                                            style={{ '--bar-width': `${pct}%`, width: `${pct}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                        {!bookingsByStatus?.length && (
                            <p className="text-brand-secondary text-sm text-center py-4">No data available</p>
                        )}
                    </div>
                </div>

                {/* ── Bookings by Category ── */}
                <div className="anim-card bg-white rounded-lg border border-brand-border shadow-sm overflow-hidden">
                    <div className="px-5 pt-5 pb-4 flex items-center gap-2.5 border-b border-brand-border/60">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-warning to-brand-warning/70 flex items-center justify-center text-white shadow-sm">
                            <Tag className="w-4 h-4" />
                        </div>
                        <h2 className="text-base font-bold text-brand-primary">Bookings by Category</h2>
                    </div>
                    <div className="p-5 space-y-3">
                        {bookingsByCategory?.map((item, index) => {
                            const grad = categoryColors[index % categoryColors.length];
                            const pct = (item.count / maxCategory) * 100;
                            return (
                                <div key={index} className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${grad} flex-shrink-0 flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
                                        {(item.category || 'U').charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-sm font-semibold text-brand-primary truncate">{item.category || 'Unknown'}</span>
                                            <span className="text-sm font-bold text-brand-primary ml-2 flex-shrink-0">{item.count}</span>
                                        </div>
                                        <div className="w-full bg-brand-border/40 rounded-full h-2 overflow-hidden">
                                            <div
                                                className="bar-fill h-2 rounded-full bg-gradient-to-r from-brand-success to-brand-success/70"
                                                style={{ '--bar-width': `${pct}%`, width: `${pct}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {!bookingsByCategory?.length && (
                            <p className="text-brand-secondary text-sm text-center py-4">No data available</p>
                        )}
                    </div>
                </div>

                {/* ── Daily Revenue ── */}
                <div className="anim-card bg-white rounded-lg border border-brand-border shadow-sm overflow-hidden">
                    <div className="px-5 pt-5 pb-4 flex items-center gap-2.5 border-b border-brand-border/60">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-success to-brand-success/70 flex items-center justify-center text-white shadow-sm">
                            <TrendingUp className="w-4 h-4" />
                        </div>
                        <h2 className="text-base font-bold text-brand-primary">Revenue — Last 30 Days</h2>
                    </div>
                    <div className="p-5 space-y-3">
                        {dailyRevenue?.map((item, index) => {
                            const pct = (item.revenue / maxRevenue) * 100;
                            const isTop = item.revenue === maxRevenue;
                            return (
                                <div key={index}>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-xs font-semibold text-brand-secondary flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                        </span>
                                        <span className={`text-xs font-bold ${isTop ? 'text-brand-success' : 'text-brand-primary'}`}>
                                            ₹{Number(item.revenue).toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                    <div className="w-full bg-brand-border/40 rounded-full h-2 overflow-hidden">
                                        <div
                                            className="bar-fill h-2 rounded-full bg-gradient-to-r from-emerald-400 to-green-500"
                                            style={{ '--bar-width': `${pct}%`, width: `${pct}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                        {!dailyRevenue?.length && (
                            <p className="text-brand-secondary text-sm text-center py-4">No revenue data available</p>
                        )}
                    </div>
                </div>

            </div>
        </VendorAppLayout>
    );
}