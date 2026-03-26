import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import VendorAppLayout from '@/Layouts/VendorAppLayout';
import { Check, Clock, DollarSign, Percent, AlertCircle } from 'lucide-react';

export default function Settlements() {
    const { user, totalEarnings, settlements } = usePage().props;

    return (
        <VendorAppLayout user={user}>
            <Head title="Payment Settlements" />
            <div className="space-y-4 pb-4">
                <h1 className="text-2xl font-bold text-brand-primary pt-1">Payment Settlements</h1>

                    {/* Total Earnings Card */}
                <div className="bg-gradient-to-r from-brand-primary to-brand-primary/80 rounded-lg shadow-card p-6 text-white">
                    <p className="text-sm font-semibold opacity-90 uppercase tracking-wide">Total Earnings</p>
                    <p className="text-4xl font-bold mt-3">₹{totalEarnings?.toLocaleString() || '0'}</p>
                    <p className="text-sm opacity-75 mt-2">From all confirmed bookings</p>
                </div>

                {/* Settlement History */}
                <div className="bg-white rounded-lg shadow-sm border border-brand-border overflow-hidden">
                    <div className="p-4 border-b border-brand-border">
                        <h2 className="text-lg font-bold text-brand-primary">Settlement History</h2>
                        <p className="text-xs text-brand-secondary mt-1">Earnings from confirmed bookings grouped by date</p>
                    </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-brand-background border-b border-brand-border">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-brand-secondary uppercase tracking-wider">Settlement Date</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-brand-secondary uppercase tracking-wider">Booking Count</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-brand-secondary uppercase tracking-wider">Amount</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-brand-secondary uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand-border">
                                    {settlements.data?.map((settlement, index) => (
                                        <tr key={index} className="hover:bg-brand-background/50 transition-colors">
                                            <td className="px-4 py-3 text-sm font-medium text-brand-primary">
                                                {new Date(settlement.settlement_date).toLocaleDateString('en-IN', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-brand-primary">
                                                {settlement.booking_count} bookings
                                            </td>
                                            <td className="px-4 py-3 text-sm font-semibold text-brand-primary">
                                                ₹{settlement.amount?.toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-success/10 text-brand-success border border-brand-success/20">
                                                    Settled
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {settlements.data?.length === 0 && (
                                <div className="p-8 text-center text-brand-secondary">
                                    No settlements yet. Confirmed bookings will appear here.
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {settlements.links && (
                            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-brand-border">
                                <div className="flex gap-2">
                                    {settlements.links.map((link, key) => (
                                        <a
                                            key={key}
                                            href={link.url}
                                            className={`px-3 py-1 rounded text-sm font-semibold transition-all ${
                                                link.active
                                                    ? 'bg-brand-primary text-white'
                                                    : link.url ? 'bg-brand-background text-brand-primary hover:bg-brand-border' : 'bg-brand-background text-brand-secondary'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Settlement Information */}
                    <div className="bg-gradient-to-br from-brand-primary/10 to-brand-primary/5 border border-brand-primary/20 rounded-lg p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-brand-primary/20 flex items-center justify-center">
                                <AlertCircle size={16} className="text-brand-primary" />
                            </div>
                            <h3 className="text-sm font-bold text-brand-primary uppercase tracking-wider">Settlement Information</h3>
                        </div>
                        
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 pl-2">
                                <Check size={16} className="text-brand-success flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-brand-primary">Settlements are processed for <span className="font-semibold">confirmed bookings only</span></p>
                            </div>
                            <div className="flex items-start gap-3 pl-2">
                                <Check size={16} className="text-brand-success flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-brand-primary">Payments are transferred to your <span className="font-semibold">registered bank account</span></p>
                            </div>
                            <div className="flex items-start gap-3 pl-2">
                                <Check size={16} className="text-brand-success flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-brand-primary">Settlement cycles are processed <span className="font-semibold">weekly</span></p>
                            </div>
                            <div className="flex items-start gap-3 pl-2">
                                <Check size={16} className="text-brand-success flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-brand-primary">Platform fee deductions will be applied <span className="font-semibold">as per agreement</span></p>
                            </div>
                        </div>
                    </div>
            </div>
        </VendorAppLayout>
    );
}
