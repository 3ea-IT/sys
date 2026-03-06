import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import VendorAppLayout from '@/Layouts/VendorAppLayout';
import { Search, Download, Ticket, CheckCircle2, ScanLine, ChevronRight, Calendar, CreditCard, Tag, Clock } from 'lucide-react';

export default function BookingsIndex() {
    const { user, bookings, stats } = usePage().props;
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const getStatusStyle = (status) => {
        switch (status) {
            case 'confirmed': return { pill: `text-brand-success border border-brand-success/20 bg-brand-success/10`, dot: 'bg-brand-success' };
            case 'cancelled': return { pill: `text-brand-danger border border-brand-danger/20 bg-brand-danger/10`, dot: 'bg-brand-danger' };
            case 'validated': return { pill: `text-brand-primary border border-brand-primary/20 bg-brand-primary/10`, dot: 'bg-brand-primary' };
            case 'on_hold': return { pill: `text-brand-warning border border-brand-warning/20 bg-brand-warning/10`, dot: 'bg-brand-warning' };
            default: return { pill: `text-brand-secondary border border-brand-secondary/20 bg-brand-secondary/10`, dot: 'bg-brand-secondary' };
        }
    };

    const allBookings = bookings?.data ?? [];
    const totalCount = allBookings.length;

    const filters = [
        { key: 'all', label: 'All', count: stats?.totalBookings + stats?.totalHolds ?? totalCount },
        { key: 'confirmed', label: 'Confirmed', count: stats?.confirmedBookings ?? 0 },
        { key: 'on_hold', label: 'On Hold', count: stats?.totalHolds ?? 0 },
        { key: 'cancelled', label: 'Cancelled', count: stats?.cancelledBookings ?? 0 },
        { key: 'validated', label: 'Validated', count: stats?.validatedBookings ?? 0 },
    ];

    const filtered = allBookings.filter((booking) => {
        const matchesFilter = statusFilter === 'all' || booking.status === statusFilter;
        const matchesSearch =
            (booking.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (booking.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (booking.experience?.title?.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesFilter && matchesSearch;
    });

    const avatarColors = ['from-brand-primary to-brand-primary/80', 'from-brand-success to-brand-success/80', 'from-brand-warning to-brand-warning/80', 'from-brand-danger to-brand-danger/80', 'from-brand-secondary to-brand-secondary/80'];
    const getAvatarColor = (name) => {
        const i = (name?.charCodeAt(0) ?? 0) % avatarColors.length;
        return avatarColors[i];
    };

    const getTimeRemaining = (expiresAt) => {
        if (!expiresAt) return null;
        const now = new Date();
        const expires = new Date(expiresAt);
        const diffMs = expires - now;
        
        if (diffMs <= 0) return 'Expired';
        
        const minutes = Math.floor(diffMs / 60000);
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes % 60}m left`;
        }
        return `${minutes}m left`;
    };

    return (
        <VendorAppLayout user={user}>
            <Head title="Manage Bookings & Holds" />

            <style>{`
                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(12px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .booking-card {
                    animation: fadeSlideUp 0.3s ease both;
                }
                .booking-card:nth-child(1) { animation-delay: 0.04s; }
                .booking-card:nth-child(2) { animation-delay: 0.08s; }
                .booking-card:nth-child(3) { animation-delay: 0.12s; }
                .booking-card:nth-child(4) { animation-delay: 0.16s; }
                .booking-card:nth-child(5) { animation-delay: 0.20s; }
                .booking-card:nth-child(n+6) { animation-delay: 0.24s; }
                .checkin-btn:active { transform: scale(0.96); }
                .filter-pill:active { transform: scale(0.95); }
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            <div className="space-y-5 pb-8">

                {/* ── Page Header ── */}
                <div className="flex items-center justify-between pt-1">
                    <div>
                        <h1 className="text-2xl font-bold text-brand-primary tracking-tight">Bookings & Holds</h1>
                        <p className="text-xs text-brand-secondary mt-0.5">{filtered.length} of {totalCount} shown</p>
                    </div>
                    <Link
                        href={route('vendor.bookings.export')}
                        className="flex items-center gap-1.5 bg-brand-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-primary/90 active:scale-95 transition-all shadow-md shadow-brand-primary/20"
                    >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Export CSV</span>
                    </Link>
                </div>

                {/* ── Search ── */}
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-secondary/50 group-focus-within:text-brand-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search name, email or experience…"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 bg-white border border-brand-border rounded-2xl text-sm text-brand-primary placeholder-brand-secondary/40 focus:outline-none focus:ring-2 focus:ring-brand-primary/15 focus:border-brand-primary/40 transition-all shadow-sm"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-secondary/50 hover:text-brand-primary transition-colors text-lg leading-none"
                        >
                            ×
                        </button>
                    )}
                </div>

                {/* ── Filter Pills ── */}
                <div className="flex gap-2 overflow-x-auto pb-1 -mx-0.5 px-0.5 hide-scrollbar">
                    {filters.map((f) => (
                        <button
                            key={f.key}
                            onClick={() => setStatusFilter(f.key)}
                            className={`filter-pill flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                                statusFilter === f.key
                                    ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/25'
                                    : 'bg-white border border-brand-border text-brand-secondary hover:border-brand-primary/30 hover:text-brand-primary'
                            }`}
                        >
                            {f.label}
                            <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                                statusFilter === f.key ? 'bg-white/20 text-white' : 'bg-brand-border text-brand-secondary'
                            }`}>
                                {f.count}
                            </span>
                        </button>
                    ))}
                </div>

                {/* ── Booking Cards ── */}
                <div className="space-y-3">
                    {filtered.length === 0 && (
                        <div className="bg-white rounded-2xl p-12 text-center border border-brand-border shadow-sm">
                            <div className="text-4xl mb-3">🎫</div>
                            <p className="text-brand-primary font-semibold">No bookings found</p>
                            <p className="text-brand-secondary text-sm mt-1">Try adjusting your search or filter</p>
                        </div>
                    )}

                    {filtered.map((booking) => {
                        const isValidated = booking.status === 'validated';
                        const isOnHold = booking.status === 'on_hold';
                        const statusStyle = getStatusStyle(booking.status);
                        const avatarGrad = getAvatarColor(booking.user?.name);

                        return (
                            <div
                                key={booking.id}
                                className="booking-card bg-white rounded-lg border border-brand-border/60 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                            >
                                {/* Top Section */}
                                <div className="p-4">
                                    <div className="flex items-start gap-3">
                                        {/* Avatar */}
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${avatarGrad} flex-shrink-0 flex items-center justify-center text-lg font-bold text-white shadow-sm`}>
                                            {booking.user?.name?.charAt(0)?.toUpperCase() ?? 'B'}
                                        </div>

                                        {/* User Info + Status */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <h3 className="text-sm font-bold text-brand-primary truncate leading-snug">
                                                        {booking.user?.name}
                                                    </h3>
                                                    <p className="text-xs text-brand-secondary mt-0.5 truncate">
                                                        {booking.user?.email}
                                                    </p>
                                                </div>
                                                <span className={`flex-shrink-0 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${statusStyle.pill}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                                                    {isOnHold ? 'On Hold' : booking.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Experience Title */}
                                    <div className="mt-3 pl-1">
                                        <p className="text-xs font-semibold text-brand-secondary flex items-center gap-1 mb-0.5">
                                            <Ticket className="w-3 h-3" /> Experience
                                        </p>
                                        <p className="text-sm font-semibold text-brand-primary leading-snug">
                                            {booking.experience?.title}
                                        </p>
                                    </div>
                                </div>

                                {/* Meta Row */}
                                <div className="mx-4 border-t border-dashed border-brand-border/60" />
                                <div className="px-4 py-3 grid grid-cols-3 gap-2">
                                    <div className="flex flex-col gap-0.5">
                                        <p className="text-[10px] text-brand-secondary flex items-center gap-1 font-semibold uppercase tracking-wider">
                                            <Tag className="w-3 h-3" /> Type
                                        </p>
                                        <p className="text-xs font-bold text-brand-primary capitalize">{isOnHold ? 'Hold Token' : booking.booking_type === 'hold_confirmed' ? 'Confirmed' : booking.booking_type}</p>
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <p className="text-[10px] text-brand-secondary flex items-center gap-1 font-semibold uppercase tracking-wider">
                                            <CreditCard className="w-3 h-3" /> {isOnHold ? 'Token' : 'Paid'}
                                        </p>
                                        <p className="text-xs font-bold text-brand-primary">₹{booking.paid_amount}</p>
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <p className="text-[10px] text-brand-secondary flex items-center gap-1 font-semibold uppercase tracking-wider">
                                            {isOnHold ? <Clock className="w-3 h-3" /> : <Calendar className="w-3 h-3" />}
                                            {isOnHold ? 'Expires' : 'Date'}
                                        </p>
                                        <p className="text-xs font-bold text-brand-primary">
                                            {isOnHold 
                                                ? getTimeRemaining(booking.expires_at)
                                                : new Date(booking.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                                            }
                                        </p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="px-4 pb-4 flex gap-2">
                                    {isOnHold ? (
                                        // Hold actions - view hold details
                                        <Link
                                            href={route('vendor.holds.show', booking.hold_id)}
                                            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-brand-primary bg-brand-primary/8 hover:bg-brand-primary/15 rounded-xl py-2.5 transition-colors border border-brand-primary/15"
                                        >
                                            View Hold <ChevronRight className="w-3.5 h-3.5" />
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                href={route('vendor.bookings.show', booking.id.replace('booking-', ''))}
                                                className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-brand-primary bg-brand-primary/8 hover:bg-brand-primary/15 rounded-xl py-2.5 transition-colors border border-brand-primary/15"
                                            >
                                                View Details <ChevronRight className="w-3.5 h-3.5" />
                                            </Link>
                                            {!isValidated && (
                                                <Link
                                                    href={route('vendor.bookings.check-in', booking.id.replace('booking-', ''))}
                                                    method="post"
                                                    as="button"
                                                    className="checkin-btn flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-white bg-brand-primary hover:bg-brand-primary/90 rounded-xl py-2.5 transition-all shadow-sm shadow-brand-primary/20"
                                                >
                                                    <ScanLine className="w-3.5 h-3.5" /> Validate
                                                </Link>
                                            )}
                                            {isValidated && (
                                                <div className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-brand-success bg-brand-success/10 rounded-xl py-2.5 border border-brand-success/20">
                                                    <CheckCircle2 className="w-3.5 h-3.5" /> Validated
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ── Pagination ── */}
                {bookings?.links && filtered.length > 0 && (
                    <div className="flex items-center justify-center gap-1.5 pt-2 overflow-x-auto px-2">
                        {bookings.links.map((link, key) => (
                            <div key={key}>
                                {link.url ? (
                                    <Link
                                        href={link.url}
                                        className={`min-w-9 h-9 flex items-center justify-center rounded-xl text-sm font-semibold transition-all ${
                                            link.active
                                                ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/25'
                                                : 'bg-white border border-brand-border text-brand-secondary hover:border-brand-primary/30 hover:text-brand-primary'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span
                                        className="min-w-9 h-9 flex items-center justify-center rounded-xl text-sm text-brand-border/50"
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </VendorAppLayout>
    );
}