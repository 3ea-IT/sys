import React, { useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import VendorAppLayout from '@/Layouts/VendorAppLayout';
import { Plus, Search, AlertTriangle, Edit, ToggleLeft, ToggleRight } from 'lucide-react';

// Utility function to convert 24-hour time to 12-hour AM/PM format
const formatTime12Hour = (time) => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

export default function ExperiencesIndex() {
    const { user, experiences } = usePage().props;
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Demo data matching the screenshot
    const demoExperiences = [
        {
            id: 1,
            title: 'Executive Leadership Seminar',
            date: 'Oct 24, 2023',
            time: '09:00 AM',
            status: 'active',
            approval_status: 'approved',
            bookedSeats: 45,
            totalSeats: 50,
            activeHolds: 3,
            availableSeats: 5,
            acceptingBookings: true,
            lowAvailability: true,
            image: null,
        },
        {
            id: 2,
            title: 'Digital Transformation Workshop',
            date: 'Oct 28, 2023',
            time: '02:00 PM',
            status: 'paused',
            approval_status: 'approved',
            bookedSeats: 12,
            totalSeats: 30,
            activeHolds: 0,
            availableSeats: 18,
            acceptingBookings: false,
            lowAvailability: false,
            image: null,
        },
    ];

    const allExperiences = (experiences?.data ?? demoExperiences);
    const totalCount = allExperiences.length;

    const filters = [
        { key: 'all', label: `All (${totalCount})` },
        { key: 'active', label: 'Active' },
        { key: 'inactive', label: 'Inactive' },
    ];

    const filtered = allExperiences.filter((exp) => {
        const matchesFilter =
            activeFilter === 'all' ||
            (activeFilter === 'active' && exp.status === 'active') ||
            (activeFilter === 'inactive' && exp.status !== 'active');
        const matchesSearch = exp.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const fillPercent = (booked, total) => (total > 0 ? Math.round((booked / total) * 100) : 0);

    const handleToggleBookings = (id) => {
        router.post(route('vendor.experiences.toggle', id), {}, { preserveScroll: true });
    };

    return (
        <VendorAppLayout>
            <Head title="Manage Listings" />

            <div className="space-y-4 pb-4">

                {/* Page Header */}
                <div className="flex items-center justify-between pt-1">
                    <h1 className="text-2xl font-bold text-brand-primary">Manage Listings</h1>
                    <Link
                        href={route('vendor.experiences.create')}
                        className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center shadow-card hover:bg-brand-primary/90 active:scale-95 transition-all flex-shrink-0"
                    >
                        <Plus className="w-5 h-5 text-white" strokeWidth={2.5} />
                    </Link>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-secondary/60" />
                    <input
                        type="text"
                        placeholder="Search experiences..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-brand-border rounded-2xl text-sm text-brand-primary placeholder-brand-secondary/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/30 transition-all shadow-sm"
                    />
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap gap-2">
                    {filters.map((f) => (
                        <button
                            key={f.key}
                            onClick={() => setActiveFilter(f.key)}
                            className={`px-3 py-1 rounded-full text-sm font-semibold transition-all ${
                                activeFilter === f.key
                                    ? 'bg-brand-primary text-white shadow-sm'
                                    : 'bg-white border border-brand-border text-brand-secondary hover:border-brand-primary/30'
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* Experience Cards */}
                <div className="space-y-4">
                    {filtered.length === 0 && (
                        <div className="bg-white rounded-2xl p-8 text-center border border-brand-border shadow-card">
                            <p className="text-brand-secondary text-sm">No experiences found.</p>
                            <Link
                                href={route('vendor.experiences.create')}
                                className="mt-3 inline-block text-brand-primary text-sm font-semibold hover:bg-brand-primary/10 transition-all"
                            >
                                + Create your first experience
                            </Link>
                        </div>
                    )}

                    {filtered.map((exp) => {
                        const isActive = exp.status === 'active';
                        const isPaused = exp.status === 'paused';
                        const percent = fillPercent(exp.bookedSeats ?? exp.bookings_count ?? 0, exp.totalSeats ?? exp.capacity ?? 0);
                        const isLow = (exp.availableSeats ?? exp.available_seats ?? 0) <= 5 && percent > 70;

                        return (
                            <div
                                key={exp.id}
                                className="bg-white rounded-2xl shadow-card border border-brand-border/50 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                                onClick={() => router.visit(route('vendor.experiences.show', exp.id))}
                            >
                                {/* Card Top: Image + Title + Status */}
                                <div className="p-4 pb-3">
                                    <div className="flex items-start gap-3">
                                        {/* Thumbnail */}
                                        <div className="w-16 h-16 rounded-xl flex-shrink-0 overflow-hidden bg-brand-border flex items-center justify-center">
                                            {exp.image ? (
                                                <img src={exp.image} alt={exp.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-2xl">{isActive ? '🎓' : '💻'}</span>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <h3 className="text-sm font-bold text-brand-primary leading-snug pr-1">
                                                    {exp.title}
                                                </h3>
                                                <span
                                                    className={`flex-shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                                        isActive
                                                            ? 'bg-green-100 text-green-700'
                                                            : isPaused
                                                            ? 'bg-brand-border text-brand-secondary'
                                                            : 'bg-yellow-100 text-yellow-700'
                                                    }`}
                                                >
                                                    {exp.status}
                                                </span>
                                            </div>
                                            {exp.description && (
                                                <p className="text-xs text-brand-secondary mt-1 line-clamp-2">
                                                    {exp.description}
                                                </p>
                                            )}
                                            <p className="text-xs text-brand-secondary mt-1">
                                                {exp.start_date ? new Date(exp.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : exp.date} 
                                                {exp.start_time && ` • ${formatTime12Hour(exp.start_time)}`}
                                                {exp.time && !exp.start_time && ` • ${exp.time}`}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-brand-border/50 mx-4" />

                                {/* Capacity Utilization */}
                                <div className="px-4 py-3 space-y-2">
                                    {/* Confirmed Bookings */}
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="text-xs text-brand-secondary font-medium">Seats Filled (Confirmed)</p>
                                            <p className="text-xs font-semibold text-brand-primary">
                                                {exp.confirmedBookings ?? 0} / {exp.totalSeats ?? exp.capacity ?? 0}
                                            </p>
                                        </div>
                                        <div className="h-1.5 bg-brand-border rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all"
                                                style={{
                                                    width: `${exp.confirmedPercent ?? 0}%`,
                                                    background: '#1F8A70',
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Active Holds */}
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="text-xs text-brand-secondary font-medium">Seats Hold (Reserved)</p>
                                            <p className="text-xs font-semibold text-brand-primary">
                                                {exp.activeHolds ?? 0} / {exp.totalSeats ?? exp.capacity ?? 0}
                                            </p>
                                        </div>
                                        <div className="h-1.5 bg-brand-border rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all"
                                                style={{
                                                    width: `${exp.holdsPercent ?? 0}%`,
                                                    background: '#F4A261',
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Total Occupancy */}
                                    <div className="pt-1 border-t border-brand-border/50 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs text-brand-secondary font-medium font-semibold">Total Occupancy</p>
                                            <p className="text-xs font-semibold text-brand-primary">
                                                {exp.totalPercent ?? 0}%
                                            </p>
                                        </div>
                                        <div className="h-2 bg-brand-border rounded-full overflow-hidden">
                                            <div className="h-full rounded-full transition-all flex overflow-hidden">
                                                <div
                                                    style={{
                                                        width: `${exp.confirmedPercent ?? 0}%`,
                                                        background: '#1F8A70',
                                                    }}
                                                />
                                                <div
                                                    style={{
                                                        width: `${exp.holdsPercent ?? 0}%`,
                                                        background: '#F4A261',
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Low Availability Warning */}
                                    {(exp.totalPercent ?? 0) >= 80 && (
                                        <div className="flex items-center gap-1.5 mt-2">
                                            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#F2A541' }} />
                                            <span className="text-xs font-semibold" style={{ color: '#F2A541' }}>
                                                Low Availability
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Divider */}
                                <div className="border-t border-brand-border/50 mx-4" />

                                {/* Holds & Available & Booked */}
                                <div className="px-4 py-3 grid grid-cols-3 gap-2">
                                    <div>
                                        <p className="text-[10px] text-brand-secondary uppercase tracking-wider font-semibold mb-0.5">
                                            Booked
                                        </p>
                                        <p className="text-lg font-bold text-brand-primary">
                                            {exp.bookedSeats ?? exp.bookings_count ?? 0}
                                        </p>
                                        <p className="text-[11px] text-brand-secondary">confirmed</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-brand-secondary uppercase tracking-wider font-semibold mb-0.5">
                                            Active Holds
                                        </p>
                                        <p className="text-lg font-bold text-brand-primary">
                                            {exp.activeHolds ?? exp.holds_count ?? 0}
                                        </p>
                                        <p className="text-[11px] text-brand-secondary">pending</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-brand-secondary uppercase tracking-wider font-semibold mb-0.5">
                                            Available
                                        </p>
                                        <p className="text-lg font-bold text-brand-primary">
                                            {exp.availableSeats ?? exp.available_seats ?? 0}
                                        </p>
                                        <p className="text-[11px] text-brand-secondary">left</p>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-brand-border/50 mx-4" />

                                {/* Toggle + Edit */}
                                <div className="px-4 py-3 flex items-center justify-between">
                                    {/* Toggle Switch */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleToggleBookings(exp.id);
                                        }}
                                        className="flex items-center gap-2.5 group"
                                    >
                                        {/* Custom Toggle */}
                                        <div
                                            className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                                                isActive ? 'bg-brand-primary' : 'bg-brand-border'
                                            }`}
                                        >
                                            <div
                                                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${
                                                    isActive ? 'translate-x-5' : 'translate-x-0'
                                                }`}
                                            />
                                        </div>
                                        <span className="text-xs font-semibold text-brand-secondary group-hover:text-brand-primary transition-colors">
                                            {isActive ? 'Accepting Bookings' : 'Reservations Paused'}
                                        </span>
                                    </button>

                                    {/* Edit Link */}
                                    <Link
                                        href={route('vendor.experiences.edit', exp.id)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="flex items-center gap-1.5 text-xs font-semibold text-brand-secondary hover:text-brand-primary transition-colors"
                                    >
                                        <Edit className="w-3.5 h-3.5" />
                                        EDIT
                                    </Link>
                                </div>

                            </div>
                        );
                    })}
                </div>

                {/* Pagination */}
                {experiences?.links && filtered.length > 0 && (
                    <div className="flex items-center justify-center gap-1 sm:gap-2 pt-2 overflow-x-auto px-2">
                        {experiences.links.map((link, key) => (
                            <div key={key}>
                                {link.url ? (
                                    <Link
                                        href={link.url}
                                        className={`min-w-7 h-7 sm:min-w-9 sm:h-9 flex items-center justify-center rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all flex-shrink-0 ${
                                            link.active
                                                ? 'bg-brand-primary text-white shadow-card'
                                                : 'bg-white border border-brand-border text-brand-secondary hover:border-brand-primary/30'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span
                                        className="min-w-7 h-7 sm:min-w-9 sm:h-9 flex items-center justify-center rounded-lg sm:rounded-xl text-xs sm:text-sm text-brand-border flex-shrink-0"
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