import React from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import VendorAppLayout from '@/Layouts/VendorAppLayout';
import { User, Mail, ShieldCheck, Clock, ArrowLeft } from 'lucide-react';

export default function PersonalInformation() {
    const { user } = usePage().props;

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

    return (
        <VendorAppLayout user={user}>
            <Head title="Personal Information" />

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
                        <h1 className="text-2xl font-bold text-brand-primary">Personal Information</h1>
                        <p className="text-sm text-brand-secondary mt-0.5">View your personal details</p>
                    </div>
                </div>

                {/* Information Card */}
                <Card>
                    <InfoRow icon={User} label="Full Name" value={user.name} />
                    <Divider />
                    <InfoRow icon={Mail} label="Email" value={user.email} />
                    <Divider />
                    <InfoRow icon={ShieldCheck} label="Role" value={user.role} />
                    {user.last_login && <>
                        <Divider />
                        <InfoRow icon={Clock} label="Last Login" value={formatDate(user.last_login)} />
                    </>}
                </Card>

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
