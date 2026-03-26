import React from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import VendorAppLayout from '@/Layouts/VendorAppLayout';
import {
    ArrowLeft,
    MapPin,
    Tag,
    Zap,
    Clock,
    Users,
    BarChart2,
    TrendingUp,
    Star,
    ChevronRight,
    Ticket,
    CalendarCheck,
    AlertCircle,
} from 'lucide-react';

// Utility function to convert 24-hour time to 12-hour AM/PM format
const formatTime12Hour = (time) => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

export default function ShowExperience() {
    const { user, experience, stats, bookings, holds } = usePage().props;

    const statusStyles = {
        active: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500', label: 'Active' },
        inactive: { bg: 'bg-red-50', text: 'text-red-600', dot: 'bg-red-500', label: 'Inactive' },
        draft: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400', label: 'Draft' },
    };

    const bookingStatusStyle = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-700';
            case 'pending': return 'bg-amber-100 text-amber-700';
            case 'cancelled': return 'bg-red-100 text-red-600';
            default: return 'bg-brand-border text-brand-secondary';
        }
    };

    const status = statusStyles[experience.status] ?? statusStyles.draft;
    const occupancy = stats?.occupancyRate ?? 0;

    return (
        <VendorAppLayout>
            <Head title={experience.title} />

            <div className="space-y-5 pb-6">

                {/* ── Page Header ── */}
                <div className="flex flex-col gap-4 pt-1">
                    <button
                        onClick={() => router.visit(route('vendor.experiences.index'))}
                        className="flex items-center gap-2 text-brand-primary hover:opacity-80 transition-opacity bg-transparent border-0 cursor-pointer w-fit"
                    >
                        <ArrowLeft size={20} />
                        <span className="text-sm font-semibold">Back to Experiences</span>
                    </button>

                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            <h1 className="text-xl font-bold text-brand-primary leading-tight truncate">
                                {experience.title}
                            </h1>
                            <div className="space-y-1 mt-1">
                                <div className="flex items-center gap-1.5">
                                    <MapPin size={13} className="text-brand-secondary flex-shrink-0" />
                                    <p className="text-xs text-brand-secondary truncate">{experience.location}</p>
                                </div>
                                {experience.start_date && (
                                    <div className="flex items-center gap-1.5">
                                        <CalendarCheck size={13} className="text-brand-secondary flex-shrink-0" />
                                        <p className="text-xs text-brand-secondary">
                                            {new Date(experience.start_date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                            {experience.end_date && ` to ${new Date(experience.end_date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}`}
                                        </p>
                                    </div>
                                )}
                                {experience.start_time && (
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={13} className="text-brand-secondary flex-shrink-0" />
                                        <p className="text-xs text-brand-secondary">
                                            {formatTime12Hour(experience.start_time)}
                                            {experience.end_time && ` to ${formatTime12Hour(experience.end_time)}`}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full flex-shrink-0 ${status.bg}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                            <span className={`text-xs font-semibold ${status.text}`}>{status.label}</span>
                        </div>
                    </div>
                </div>

                {/* ── Cover Image ── */}
                {experience.image_url && (
                    <div className="rounded-2xl overflow-hidden border border-brand-border/50 shadow-card">
                        <img
                            src={experience.image_url}
                            alt={experience.title}
                            className="w-full h-52 object-cover"
                        />
                    </div>
                )}

                {/* ── Stats Row ── */}
                <div className="grid grid-cols-2 gap-3">
                    <StatCard
                        icon={<CalendarCheck size={18} className="text-brand-primary" />}
                        label="Total Bookings"
                        value={stats?.totalBookings ?? 0}
                    />
                    <StatCard
                        icon={<Clock size={18} className="text-amber-500" />}
                        label="Active Holds"
                        value={stats?.totalHolds ?? 0}
                    />
                    <StatCard
                        icon={<Users size={18} className="text-blue-500" />}
                        label="Booked / Total"
                        value={`${stats?.totalBookings ?? 0} / ${stats?.totalCapacity ?? experience.capacity}`}
                    />
                    <StatCard
                        icon={<TrendingUp size={18} className="text-green-600" />}
                        label="Occupancy Rate"
                        value={`${occupancy}%`}
                    />
                </div>

                {/* ── Occupancy Bar ── */}
                <SectionCard title="Capacity Overview">
                    <div className="space-y-3">
                        {/* Seats Filled Progress */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-brand-secondary font-medium">Seats Filled (Confirmed)</span>
                                <span className="text-xs font-bold text-brand-primary">{stats?.confirmedPercent ?? 0}%</span>
                            </div>
                            <div className="w-full h-2.5 bg-brand-border rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all"
                                    style={{
                                        width: `${Math.min(stats?.confirmedPercent ?? 0, 100)}%`,
                                        background: '#1F8A70',
                                    }}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-brand-secondary/70">
                                <span>{stats?.confirmedBookings ?? 0} seats</span>
                                <span>{experience.capacity} seats total</span>
                            </div>
                        </div>

                        {/* Seats Hold Progress */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-brand-secondary font-medium">Seats Hold (Reserved)</span>
                                <span className="text-xs font-bold text-brand-primary">{stats?.holdsPercent ?? 0}%</span>
                            </div>
                            <div className="w-full h-2.5 bg-brand-border rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all"
                                    style={{
                                        width: `${Math.min(stats?.holdsPercent ?? 0, 100)}%`,
                                        background: '#F4A261',
                                    }}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-brand-secondary/70">
                                <span>{stats?.activeHolds ?? 0} seats</span>
                                <span>{experience.capacity} seats total</span>
                            </div>
                        </div>

                        {/* Total Occupancy */}
                        <div className="pt-2 border-t border-brand-border/50 space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-brand-secondary font-medium font-semibold">Total Occupancy</span>
                                <span className="text-xs font-bold text-brand-primary">{stats?.occupancyRate ?? 0}%</span>
                            </div>
                            <div className="w-full h-3 bg-brand-border rounded-full overflow-hidden">
                                <div className="h-full rounded-full transition-all flex overflow-hidden">
                                    <div
                                        style={{
                                            width: `${Math.min(stats?.confirmedPercent ?? 0, 100)}%`,
                                            background: '#1F8A70',
                                        }}
                                    />
                                    <div
                                        style={{
                                            width: `${Math.min(stats?.holdsPercent ?? 0, 100)}%`,
                                            background: '#F4A261',
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </SectionCard>

                {/* ── Basic Info ── */}
                <SectionCard title="Basic Information">
                    <InfoRow icon={<Tag size={15} />} label="Category" value={experience.category} capitalize />
                    <InfoRow icon={<MapPin size={15} />} label="Location" value={experience.location} />
                    <InfoRow
                        icon={<Zap size={15} />}
                        label="Booking Mode"
                        value={experience.booking_mode?.replace('_', ' ')}
                        capitalize
                    />
                    <InfoRow icon={<Star size={15} />} label="Priority Score" value={experience.priority_score ?? 0} />
                </SectionCard>

                {/* ── Description ── */}
                <SectionCard title="Description">
                    {experience.description && experience.description.includes('<li>') ? (
                        <div className="space-y-1.5">
                            {parseHighlightsFromHTML(experience.description).map((line, i) => (
                                <div key={i} className="flex items-start gap-2">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-secondary flex-shrink-0" />
                                    <span className="text-sm text-brand-secondary">{line}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-brand-secondary leading-relaxed">{experience.description}</p>
                    )}

                    {experience.highlights && (
                        <div className="pt-3 border-t border-brand-border/50 space-y-2">
                            <p className="text-xs font-semibold text-brand-secondary uppercase tracking-wider">Highlights</p>
                            <div className="space-y-1.5">
                                {parseHighlightsFromHTML(experience.highlights).map((h, i) => (
                                    <div key={i} className="flex items-start gap-2">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-primary flex-shrink-0" />
                                        <span className="text-sm text-brand-secondary">{h}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </SectionCard>

                {/* ── Pricing & Capacity ── */}
                <SectionCard title="Pricing & Capacity">
                    <div className="space-y-2">
                        {['instant', 'both'].includes(experience.booking_mode) && (
                            <PriceRow
                                label="Instant Booking Price"
                                value={`₹${experience.instant_price}`}
                                sublabel={`${experience.instant_availability} seats available`}
                            />
                        )}
                        {experience.booking_mode === 'both' && (
                            <PriceRow
                                label="Hold Token Amount"
                                value={`₹${experience.hold_token}`}
                                sublabel={`Hold duration: ${formatDuration(experience.hold_duration)}`}
                            />
                        )}
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                            <span className="text-xs font-semibold text-brand-secondary uppercase tracking-wider">Total Capacity</span>
                            <span className="text-sm font-semibold text-brand-primary">{experience.capacity} seats</span>
                        </div>
                    </div>
                </SectionCard>

                {/* ── Recent Bookings ── */}
                <SectionCard
                    title="Recent Bookings"
                    action={
                        <Link
                            href={route('vendor.experiences.bookings', experience.id)}
                            className="flex items-center gap-1 text-xs font-semibold text-brand-primary hover:opacity-70 transition-opacity"
                        >
                            View all <ChevronRight size={14} />
                        </Link>
                    }
                >
                    {bookings?.data?.length > 0 ? (
                        <div className="space-y-3">
                            {bookings.data.slice(0, 5).map((booking) => (
                                <div key={booking.id} className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-8 h-8 rounded-full bg-brand-border flex items-center justify-center flex-shrink-0">
                                            <span className="text-xs font-bold text-brand-secondary">
                                                {booking.user?.name?.[0]?.toUpperCase() ?? '?'}
                                            </span>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-brand-primary truncate">{booking.user?.name}</p>
                                            <p className="text-xs text-brand-secondary capitalize">{booking.booking_type}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${bookingStatusStyle(booking.status)}`}>
                                            {booking.status}
                                        </span>
                                        <span className="text-sm font-bold text-brand-primary">₹{booking.paid_amount}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 gap-2">
                            <Ticket size={32} className="text-brand-border" />
                            <p className="text-sm text-brand-secondary">No bookings yet</p>
                        </div>
                    )}
                </SectionCard>

                {/* ── Edit Button ── */}
                {/* <div className="pt-1">
                    <Link
                        href={route('vendor.experiences.edit', experience.id)}
                        className="w-full py-4 rounded-2xl bg-brand-primary text-white font-semibold text-sm text-center shadow-card hover:bg-brand-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        ✏️ Edit Experience
                    </Link>
                </div> */}

            </div>
        </VendorAppLayout>
    );
}

/* ── Helpers ── */

function formatDuration(minutes) {
    if (!minutes) return '—';
    if (minutes < 60) return `${minutes} min`;
    if (minutes === 60) return '1 hour';
    if (minutes < 1440) return `${minutes / 60} hours`;
    return '24 hours';
}

function parseHighlightsFromHTML(htmlString) {
    if (!htmlString) return [];
    
    // Check if it contains HTML <li> tags
    if (htmlString.includes('<li>')) {
        const liRegex = /<li[^>]*>(.*?)<\/li>/gi;
        const matches = [];
        let match;
        while ((match = liRegex.exec(htmlString)) !== null) {
            // Remove any nested HTML tags and get text content
            const text = match[1].replace(/<[^>]*>/g, '').trim();
            if (text) matches.push(text);
        }
        return matches.length > 0 ? matches : htmlString.split('\n').filter(Boolean);
    }
    
    // Fallback to newline splitting
    return htmlString.split('\n').filter(Boolean);
}

/* ── Sub-components ── */

function SectionCard({ title, children, action }) {
    return (
        <div className="bg-white rounded-lg shadow-card border border-brand-border/50 overflow-hidden">
            <div className="px-4 py-3 border-b border-brand-border/50 flex items-center justify-between">
                <h2 className="text-sm font-bold text-brand-primary uppercase tracking-wider">{title}</h2>
                {action && <div>{action}</div>}
            </div>
            <div className="px-4 py-4 space-y-4">
                {children}
            </div>
        </div>
    );
}

function StatCard({ icon, label, value }) {
    return (
        <div className="bg-white rounded-lg shadow-card border border-brand-border/50 p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-brand-background flex items-center justify-center">
                    {icon}
                </div>
            </div>
            <div>
                <p className="text-2xl font-bold text-brand-primary leading-tight">{value}</p>
                <p className="text-xs text-brand-secondary mt-0.5">{label}</p>
            </div>
        </div>
    );
}

function InfoRow({ icon, label, value, capitalize }) {
    return (
        <div className="flex items-center justify-between gap-3 py-1">
            <div className="flex items-center gap-2 text-brand-secondary">
                {icon}
                <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
            </div>
            <span className={`text-sm font-semibold text-brand-primary ${capitalize ? 'capitalize' : ''}`}>
                {value ?? '—'}
            </span>
        </div>
    );
}

function PriceRow({ label, value, sublabel }) {
    return (
        <div className="flex items-center justify-between gap-3 p-3 bg-brand-background rounded-lg">
            <div className="flex-1">
                <p className="text-xs font-semibold text-brand-secondary uppercase tracking-wider">{label}</p>
                {sublabel && <p className="text-xs text-brand-secondary/60 mt-1">{sublabel}</p>}
            </div>
            <span className="text-sm font-semibold text-brand-primary whitespace-nowrap">{value}</span>
        </div>
    );
}