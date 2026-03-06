import React from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import VendorAppLayout from '@/Layouts/VendorAppLayout';
import { Landmark, CreditCard, Download, Eye, ArrowLeft } from 'lucide-react';

export default function BankFinancial() {
    const { user, vendorKyc } = usePage().props;

    return (
        <VendorAppLayout user={user}>
            <Head title="Bank & Financial" />

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
                        <h1 className="text-2xl font-bold text-brand-primary">Bank & Financial</h1>
                        <p className="text-sm text-brand-secondary mt-0.5">View your bank details</p>
                    </div>
                </div>

                {/* Information Card */}
                {vendorKyc ? (
                    <Card>
                        <InfoRow icon={Landmark} label="Account Number" value={vendorKyc.account_number} />
                        <Divider />
                        <InfoRow icon={CreditCard} label="IFSC Code" value={vendorKyc.ifsc_code} />
                        {vendorKyc.bank_document_path && <>
                            <Divider />
                            <div className="px-4 py-4">
                                <p className="text-[10px] font-semibold text-brand-secondary uppercase tracking-wider mb-3">Bank Document</p>
                                <div className="flex gap-3">
                                    <a
                                        href={vendorKyc.bank_document_path?.startsWith('/') ? vendorKyc.bank_document_path : `/${vendorKyc.bank_document_path}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-brand-primary text-white rounded-xl text-sm font-semibold hover:bg-brand-primary/90 transition-colors"
                                    >
                                        <Eye size={16} />
                                        View
                                    </a>
                                    <a
                                        href={vendorKyc.bank_document_path?.startsWith('/') ? vendorKyc.bank_document_path : `/${vendorKyc.bank_document_path}`}
                                        download
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 border border-brand-primary text-brand-primary rounded-xl text-sm font-semibold hover:bg-brand-primary/10 transition-colors"
                                    >
                                        <Download size={16} />
                                        Download
                                    </a>
                                </div>
                            </div>
                        </>}
                    </Card>
                ) : (
                    <div className="p-4 bg-brand-warning/10 border border-brand-warning/20 rounded-2xl text-center">
                        <p className="text-sm text-brand-warning">No bank information available</p>
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
