import React, { useState, useEffect } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import VendorAppLayout from '@/Layouts/VendorAppLayout';
import { ArrowLeft, Lock, Clock, Calendar, CreditCard, User, AlertCircle, CheckCircle2, Zap } from 'lucide-react';

export default function VendorHoldShow() {
    const { user, hold } = usePage().props;
    const experience = hold?.experience ?? {};
    const holdUser = hold?.user ?? {};
    
    const [secondsLeft, setSecondsLeft] = useState(() => {
        if (!hold?.expires_at) return 0;
        const expires = new Date(hold.expires_at).getTime();
        const now = Date.now();
        return Math.max(0, Math.floor((expires - now) / 1000));
    });
    
    const [expired, setExpired] = useState(() => secondsLeft <= 0);

    // Countdown timer
    useEffect(() => {
        if (secondsLeft <= 0) {
            setExpired(true);
            return;
        }
        const interval = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setExpired(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [secondsLeft]);

    const hours = String(Math.floor(secondsLeft / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, '0');
    const seconds = String(secondsLeft % 60).padStart(2, '0');

    const holdTokenAmount = parseFloat(experience.hold_token || 0);
    const experiencePrice = parseFloat(experience.price || 0);
    const createdDate = new Date(hold.created_at).toLocaleDateString('en-IN', { 
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
    const expiresDate = new Date(hold.expires_at).toLocaleDateString('en-IN', { 
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
    });

    const getStatusColor = () => {
        if (expired) return { bg: 'bg-red-100 dark:bg-red-900/40', text: 'text-red-700 dark:text-red-300', label: 'Expired' };
        if (secondsLeft < 300) return { bg: 'bg-yellow-100 dark:bg-yellow-900/40', text: 'text-yellow-700 dark:text-yellow-300', label: 'Expiring Soon' };
        return { bg: 'bg-green-100 dark:bg-green-900/40', text: 'text-green-700 dark:text-green-300', label: 'Active' };
    };

    const statusColor = getStatusColor();

    return (
        <VendorAppLayout user={user}>
            <Head title={`Hold Details - ${holdUser.name}`} />

            <div className="max-w-4xl mx-auto space-y-6 pb-8">
                
                {/* Header */}
                <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => window.history.back()}
                            className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-brand-secondary" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-brand-primary">Hold Details</h1>
                            <p className="text-xs text-brand-secondary mt-0.5">Hold ID: {hold.id}</p>
                        </div>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${statusColor.bg}`}>
                        <Lock className="w-4 h-4" />
                        <span className={`font-semibold text-sm ${statusColor.text}`}>{statusColor.label}</span>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Left Column - User & Experience Info */}
                    <div className="md:col-span-2 space-y-6">

                        {/* User Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-brand-border dark:border-gray-700 p-6 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-brand-primary to-brand-primary/80 flex items-center justify-center flex-shrink-0 text-white text-xl font-bold">
                                    {holdUser.name?.charAt(0)?.toUpperCase() ?? 'U'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-bold text-brand-primary">
                                        {holdUser.name}
                                    </h3>
                                    <div className="space-y-1 mt-2">
                                        <p className="text-sm text-brand-secondary flex items-center gap-2">
                                            <User className="w-3.5 h-3.5" />
                                            {holdUser.email}
                                        </p>
                                        {holdUser.phone && (
                                            <p className="text-sm text-brand-secondary flex items-center gap-2">
                                                📱 {holdUser.phone}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Experience Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-brand-border dark:border-gray-700 p-6 shadow-sm">
                            <h2 className="text-lg font-bold text-brand-primary mb-3 flex items-center gap-2">
                                <Zap className="w-5 h-5" />
                                Experience
                            </h2>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs font-semibold text-brand-secondary uppercase tracking-wide">Title</p>
                                    <p className="text-base font-bold text-brand-primary mt-1">{experience.title}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-brand-secondary uppercase tracking-wide">Description</p>
                                    <p className="text-sm text-brand-secondary mt-1">{experience.description || 'N/A'}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <div>
                                        <p className="text-xs font-semibold text-brand-secondary uppercase tracking-wide">Category</p>
                                        <p className="text-sm font-bold text-brand-primary mt-1">{experience.category}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-brand-secondary uppercase tracking-wide">Location</p>
                                        <p className="text-sm font-bold text-brand-primary mt-1">{experience.location}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column - Hold Details */}
                    <div className="space-y-6">

                        {/* Countdown Timer Card */}
                        {!expired && (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-brand-border dark:border-gray-700 p-6 shadow-sm">
                                <h2 className="text-sm font-bold text-brand-secondary uppercase tracking-wide mb-4 flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    Time Remaining
                                </h2>
                                <div className="flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-4xl font-black text-brand-primary font-mono tracking-tighter">
                                            {hours}:{minutes}:{seconds}
                                        </div>
                                        <p className="text-xs font-semibold text-brand-secondary uppercase tracking-widest mt-3">
                                            {secondsLeft < 300 ? '⚠️ Expiring Soon' : 'Active Hold'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {expired && (
                            <div className="bg-red-100 dark:bg-red-900/40 border border-red-200 dark:border-red-700 rounded-2xl p-6 shadow-sm">
                                <div className="flex items-center gap-3 mb-3">
                                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                                    <h2 className="text-sm font-bold text-red-600 dark:text-red-300 uppercase tracking-wide">Hold Expired</h2>
                                </div>
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    This hold has expired. The token has been refunded to the user's wallet.
                                </p>
                            </div>
                        )}

                        {/* Token Amount Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-brand-border dark:border-gray-700 p-6 shadow-sm">
                            <h2 className="text-sm font-bold text-brand-secondary uppercase tracking-wide mb-3 flex items-center gap-2">
                                <CreditCard className="w-4 h-4" />
                                Hold Token
                            </h2>
                            <div className="text-center">
                                <p className="text-3xl font-black text-brand-primary">
                                    ₹{holdTokenAmount.toFixed(2)}
                                </p>
                                <p className="text-xs text-brand-secondary mt-2">Amount held by user</p>
                            </div>
                        </div>

                        {/* Status Info Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-brand-border dark:border-gray-700 p-6 shadow-sm">
                            <h2 className="text-sm font-bold text-brand-secondary uppercase tracking-wide mb-3">Status Info</h2>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-brand-secondary font-semibold">Status</p>
                                    <p className={`text-sm font-bold mt-1 ${
                                        hold.status === 'active' ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'
                                    }`}>
                                        {hold.status?.charAt(0)?.toUpperCase() + hold.status?.slice(1)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-brand-secondary font-semibold">Created</p>
                                    <p className="text-xs text-brand-primary font-mono mt-1">{createdDate}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-brand-secondary font-semibold">Expires</p>
                                    <p className="text-xs text-brand-primary font-mono mt-1">{expiresDate}</p>
                                </div>
                            </div>
                        </div>

                        {/* Expected Completion Card */}
                        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-2xl p-6 shadow-sm">
                            <h3 className="text-sm font-bold text-blue-700 dark:text-blue-300 flex items-center gap-2 mb-2">
                                <CheckCircle2 className="w-4 h-4" />
                                Expected Action
                            </h3>
                            <p className="text-xs text-blue-600 dark:text-blue-400">
                                User will either confirm and complete the booking, or the hold will expire and automatically refund the token.
                            </p>
                        </div>

                    </div>
                </div>

                {/* Full Price Breakdown */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-brand-border dark:border-gray-700 p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-brand-primary mb-4">Price Breakdown</h2>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between py-2 border-b border-brand-border dark:border-gray-700">
                            <span className="text-brand-secondary">Full Experience Price</span>
                            <span className="font-bold text-brand-primary">₹{experiencePrice.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-brand-border dark:border-gray-700">
                            <span className="text-brand-secondary">Hold Token (Paid)</span>
                            <span className="font-bold text-green-600 dark:text-green-400">₹{holdTokenAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <span className="text-brand-secondary font-semibold">Remaining Balance Due</span>
                            <span className="font-bold text-brand-primary text-lg">
                                ₹{(experiencePrice - holdTokenAmount).toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Back Button */}
                <div className="flex">
                    <Link
                        href={route('vendor.bookings.index')}
                        className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-brand-border dark:border-gray-700 rounded-xl text-brand-primary font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Bookings & Holds
                    </Link>
                </div>

            </div>
        </VendorAppLayout>
    );
}
