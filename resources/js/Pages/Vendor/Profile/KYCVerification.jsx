import React from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import VendorAppLayout from '@/Layouts/VendorAppLayout';
import { ShieldCheck, Check, Clock, AlertCircle, ArrowLeft } from 'lucide-react';

export default function KYCVerification() {
    const { user, vendor, vendorKyc } = usePage().props;

    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown';
        try {
            const dateStr = String(dateString).trim();
            const match = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
            if (match) {
                const [, year, month, day] = match;
                const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                if (!isNaN(date.getTime())) {
                    return date.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }).replace(/(\d+\s+\w+)\s+(\d+)/, '$1, $2');
                }
            }
            const date = new Date(dateStr);
            if (!isNaN(date.getTime())) {
                return date.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }).replace(/(\d+\s+\w+)\s+(\d+)/, '$1, $2');
            }
            return 'Unknown';
        } catch (error) {
            return 'Unknown';
        }
    };

    const kycStyles = {
        incomplete: { pill: 'bg-brand-warning/10 text-brand-warning border border-brand-warning/20', dot: 'bg-brand-warning' },
        submitted:  { pill: 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20', dot: 'bg-brand-primary' },
        approved:   { pill: 'bg-brand-success/10 text-brand-success border border-brand-success/20', dot: 'bg-brand-success' },
        rejected:   { pill: 'bg-brand-danger/10 text-brand-danger border border-brand-danger/20', dot: 'bg-brand-danger' },
    };

    const vendorStyles = {
        pending:   { pill: 'bg-brand-warning/10 text-brand-warning border border-brand-warning/20', dot: 'bg-brand-warning' },
        approved:  { pill: 'bg-brand-success/10 text-brand-success border border-brand-success/20', dot: 'bg-brand-success' },
        rejected:  { pill: 'bg-brand-danger/10 text-brand-danger border border-brand-danger/20', dot: 'bg-brand-danger' },
        suspended: { pill: 'bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/20', dot: 'bg-brand-secondary' },
    };

    const StatusBadge = ({ status, map }) => {
        const s = map[status] ?? map[Object.keys(map)[0]];
        return (
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full inline-flex items-center gap-1 ${s.pill}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                {status}
            </span>
        );
    };

    return (
        <VendorAppLayout user={user}>
            <Head title="KYC & Verification" />

            <div className="pb-10 space-y-6">
                {/* Header with Back Button */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.visit('/vendor/profile')}
                        className="p-2 hover:bg-brand-background rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} className="text-brand-primary" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-brand-primary">KYC & Verification</h1>
                        <p className="text-sm text-brand-secondary mt-0.5">View your verification status</p>
                    </div>
                </div>

                {/* Information Card */}
                <Card>
                    <div className="flex items-center justify-between px-4 py-4">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-brand-background rounded-xl flex items-center justify-center">
                                <ShieldCheck size={18} className="text-brand-primary" />
                            </div>
                            <p className="text-sm font-semibold text-brand-primary">KYC Status</p>
                        </div>
                        <StatusBadge status={vendorKyc?.status ?? 'incomplete'} map={kycStyles} />
                    </div>
                    {vendor?.vendor_status && <>
                        <Divider />
                        <div className="flex items-center justify-between px-4 py-4">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-brand-background rounded-xl flex items-center justify-center">
                                    <Check size={18} className="text-brand-primary" />
                                </div>
                                <p className="text-sm font-semibold text-brand-primary">Account Status</p>
                            </div>
                            <StatusBadge status={vendor.vendor_status} map={vendorStyles} />
                        </div>
                    </>}
                    {vendorKyc?.submitted_at && <>
                        <Divider />
                        <InfoRow icon={Clock} label="KYC Submitted" value={formatDate(vendorKyc.submitted_at)} />
                    </>}
                    {vendorKyc?.approved_at && <>
                        <Divider />
                        <InfoRow icon={Clock} label="Approved Date" value={formatDate(vendorKyc.approved_at)} />
                    </>}
                </Card>

                {/* Rejection Reason */}
                {(vendorKyc?.rejection_reason || vendor?.vendor_rejection_reason) && (
                    <div className="p-4 bg-brand-danger/10 border border-brand-danger/20 rounded-2xl flex gap-3">
                        <AlertCircle className="w-4 h-4 text-brand-danger flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs font-bold text-brand-danger uppercase tracking-wider mb-0.5">Rejection Reason</p>
                            <p className="text-sm text-brand-danger/80">{vendorKyc?.rejection_reason || vendor?.vendor_rejection_reason}</p>
                        </div>
                    </div>
                )}

                <div className="h-4" />
            </div>
        </VendorAppLayout>
    );
}

function Card({ children }) {
    return <div className="bg-white rounded-lg shadow-sm border border-brand-border overflow-hidden">{children}</div>;
}

function Divider() {
    return <div className="h-px bg-brand-border" />;
}

function InfoRow({ icon: Icon, label, value }) {
    return (
        <div className="flex items-center gap-3 px-4 py-4">
            <div className="w-9 h-9 bg-brand-background rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon size={18} className="text-brand-primary" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold text-brand-secondary uppercase tracking-wider mb-0.5">{label}</p>
                <p className="text-sm font-semibold text-brand-primary truncate">{value || '—'}</p>
            </div>
        </div>
    );
}
