import React from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import VendorAppLayout from '@/Layouts/VendorAppLayout';
import { Building2, Hash, FileText, ArrowLeft } from 'lucide-react';

export default function BusinessInformation() {
    const { user, vendor, vendorKyc } = usePage().props;

    return (
        <VendorAppLayout user={user}>
            <Head title="Business Information" />

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
                        <h1 className="text-2xl font-bold text-brand-primary">Business Information</h1>
                        <p className="text-sm text-brand-secondary mt-0.5">View your business details</p>
                    </div>
                </div>

                {/* Information Card */}
                <Card>
                    <InfoRow icon={Building2} label="Business Name" value={vendorKyc?.business_name || vendor?.business_name} />
                    <Divider />
                    <InfoRow icon={Hash} label="Business Type" value={vendorKyc?.business_type || vendor?.business_type} />
                    <Divider />
                    <InfoRow icon={FileText} label="License Number" value={vendorKyc?.business_license_number || vendor?.business_license_number} />
                    <Divider />
                    <InfoRow icon={Hash} label="Tax ID" value={vendorKyc?.tax_id || vendor?.tax_id} />
                    {(vendorKyc?.business_description || vendor?.business_description) && <>
                        <Divider />
                        <div className="px-4 py-4">
                            <p className="text-[10px] font-semibold text-brand-secondary uppercase tracking-wider mb-2">Description</p>
                            <p className="text-sm text-brand-primary leading-relaxed">{vendorKyc?.business_description || vendor?.business_description}</p>
                        </div>
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
