import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import VendorAppLayout from '@/Layouts/VendorAppLayout';
import { ArrowLeft, Calendar, CreditCard, Mail, Phone, MapPin, CheckCircle2, XCircle, Clock, Ticket, User } from 'lucide-react';

export default function BookingShow() {
    const { user, booking } = usePage().props;

    const getStatusBadge = (status) => {
        switch (status) {
            case 'confirmed':
                return { color: 'bg-brand-success/10 text-brand-success border border-brand-success/20', label: 'Confirmed' };
            case 'validated':
                return { color: 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20', label: 'Validated' };
            case 'cancelled':
                return { color: 'bg-brand-danger/10 text-brand-danger border border-brand-danger/20', label: 'Cancelled' };
            default:
                return { color: 'bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/20', label: status };
        }
    };

    const statusBadge = getStatusBadge(booking.status);

    return (
        <VendorAppLayout user={user}>
            <Head title="Booking Details" />

            <div className="space-y-6 pb-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('vendor.bookings.index')}
                            className="p-2 hover:bg-brand-border dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-brand-primary" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-brand-primary">Booking Details</h1>
                            <p className="text-xs text-brand-secondary mt-1">ID: {booking.id}</p>
                        </div>
                    </div>
                    <div className={`px-4 py-2 rounded-lg font-semibold text-sm ${statusBadge.color}`}>
                        {statusBadge.label}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content - 2 columns */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Booking Information */}
                        <div className="bg-white rounded-xl border border-brand-border shadow-sm p-6">
                            <h2 className="text-lg font-bold text-brand-primary mb-4">Booking Information</h2>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs font-semibold text-brand-secondary uppercase tracking-wider mb-1">Booking Type</p>
                                        <p className="text-sm font-bold text-brand-primary capitalize">{booking.booking_type}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-brand-secondary uppercase tracking-wider mb-1">Status</p>
                                        <p className="text-sm font-bold text-brand-primary">{booking.status}</p>
                                    </div>
                                </div>
                                <div className="border-t border-brand-border pt-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs font-semibold text-brand-secondary uppercase tracking-wider mb-1 flex items-center gap-1">
                                                <CreditCard className="w-3 h-3" /> Paid Amount
                                            </p>
                                            <p className="text-sm font-bold text-brand-primary">₹{booking.paid_amount}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-brand-secondary uppercase tracking-wider mb-1 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" /> Booking Date
                                            </p>
                                            <p className="text-sm font-bold text-brand-primary">
                                                {new Date(booking.created_at).toLocaleDateString('en-IN', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Experience Information */}
                        <div className="bg-white rounded-xl border border-brand-border shadow-sm p-6">
                            <h2 className="text-lg font-bold text-brand-primary mb-4 flex items-center gap-2">
                                <Ticket className="w-5 h-5" /> Experience Details
                            </h2>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs font-semibold text-brand-secondary uppercase tracking-wider mb-1">Experience Name</p>
                                    <p className="text-base font-bold text-brand-primary">{booking.experience?.title}</p>
                                </div>
                                <div className="border-t border-brand-border pt-3">
                                    <p className="text-xs font-semibold text-brand-secondary uppercase tracking-wider mb-1">Description</p>
                                    <p className="text-sm text-brand-secondary">{booking.experience?.description}</p>
                                </div>
                                <div className="border-t border-brand-border pt-3 grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs font-semibold text-brand-secondary uppercase tracking-wider mb-1">Price</p>
                                        <p className="text-sm font-bold text-brand-primary">₹{booking.experience?.instant_price}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-brand-secondary uppercase tracking-wider mb-1">Capacity</p>
                                        <p className="text-sm font-bold text-brand-primary">{booking.experience?.capacity} seats</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - User Information */}
                    <div className="space-y-6">
                        {/* User Info Card */}
                        <div className="bg-white rounded-xl border border-brand-border shadow-sm p-6">
                            <h2 className="text-lg font-bold text-brand-primary mb-4 flex items-center gap-2">
                                <User className="w-5 h-5" /> Customer Information
                            </h2>
                            <div className="space-y-4">
                                {/* Name */}
                                <div className="text-center border-b border-brand-border pb-3">
                                    <h3 className="text-base font-bold text-brand-primary">{booking.user?.name}</h3>
                                    <p className="text-xs text-brand-secondary mt-1 capitalize">{booking.user?.role}</p>
                                </div>
                                {/* Contact Info */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 p-2 bg-brand-background rounded-lg">
                                        <Mail className="w-4 h-4 text-brand-secondary flex-shrink-0" />
                                        <p className="text-xs font-medium text-brand-primary truncate">{booking.user?.email}</p>
                                    </div>
                                    {booking.user?.phone && (
                                        <div className="flex items-center gap-2 p-2 bg-brand-background rounded-lg">
                                            <Phone className="w-4 h-4 text-brand-secondary flex-shrink-0" />
                                            <p className="text-xs font-medium text-brand-primary">{booking.user?.phone}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* User Booking Stats */}
                        <div className="bg-white rounded-xl border border-brand-border shadow-sm p-6">
                            <h3 className="font-bold text-brand-primary mb-3">Booking Summary</h3>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between p-2 bg-brand-background rounded">
                                    <span className="text-xs text-brand-secondary font-medium">Total Bookings</span>
                                    <span className="text-sm font-bold text-brand-primary">-</span>
                                </div>
                                <div className="flex items-center justify-between p-2 bg-brand-background rounded">
                                    <span className="text-xs text-brand-secondary font-medium">Total Spent</span>
                                    <span className="text-sm font-bold text-brand-primary">-</span>
                                </div>
                                <div className="flex items-center justify-between p-2 bg-brand-background rounded">
                                    <span className="text-xs text-brand-secondary font-medium">Join Date</span>
                                    <span className="text-sm font-bold text-brand-primary">
                                        {new Date(booking.user?.created_at).toLocaleDateString('en-IN')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-2">
                            <Link
                                href={route('vendor.bookings.check-in', booking.id)}
                                method="post"
                                as="button"
                                className="w-full px-4 py-3 bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                Validate Booking
                            </Link>
                            <Link
                                href={route('vendor.bookings.index')}
                                className="w-full px-4 py-3 bg-brand-border hover:bg-brand-border/80 text-brand-primary font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Bookings
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </VendorAppLayout>
    );
}
