import React from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import VendorAppLayout from '@/Layouts/VendorAppLayout';
import {
    User, Building2, ShieldCheck, Landmark, MapPin, Edit, Loader, LogOut
} from 'lucide-react';
import { useRef, useState } from 'react';

export default function VendorProfile() {
    const { user, vendor, vendorKyc } = usePage().props;
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('profile_image', file);

        try {
            await router.post('/profile/upload-image', formData, {
                onSuccess: () => {
                    setUploading(false);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                    // Reload to reflect image in VendorAppLayout
                    router.reload();
                },
                onError: () => {
                    setUploading(false);
                    alert('Failed to upload image');
                }
            });
        } catch (error) {
            console.error('Upload error:', error);
            setUploading(false);
        }
    };

    const sections = [
        {
            id: 'personal-info',
            title: 'Personal Information',
            icon: User,
            route: '/vendor/profile/personal-information'
        },
        {
            id: 'business-info',
            title: 'Business Information',
            icon: Building2,
            route: '/vendor/profile/business-information'
        },
        {
            id: 'kyc-verification',
            title: 'KYC & Verification',
            icon: ShieldCheck,
            route: '/vendor/profile/kyc-verification'
        },
        {
            id: 'bank-financial',
            title: 'Bank & Financial',
            icon: Landmark,
            route: '/vendor/profile/bank-financial'
        },
        {
            id: 'contact-location',
            title: 'Contact & Location',
            icon: MapPin,
            route: '/vendor/profile/contact-location'
        }
    ];

    return (
        <VendorAppLayout user={user}>
            <Head title="Profile" />

            <div className="pb-10 space-y-6">
                {/* Avatar Section */}
                <div className="flex flex-col items-center mt-2">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-full bg-brand-primary flex items-center justify-center text-white text-3xl font-bold shadow-card overflow-hidden">
                            {user?.profile_image ? (
                                <img src={`/assets/profile_images/${user.profile_image}`} alt={user?.name} className="w-full h-full object-cover" />
                            ) : (
                                <span>{user?.name?.charAt(0)?.toUpperCase() ?? 'V'}</span>
                            )}
                        </div>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="absolute bottom-1 right-1 w-7 h-7 bg-brand-primary rounded-full flex items-center justify-center border-2 border-white shadow-md hover:bg-brand-primary/90 transition-colors disabled:opacity-50"
                        >
                            {uploading ? (
                                <Loader size={14} className="text-white animate-spin" />
                            ) : (
                                <Edit size={14} className="text-white" />
                            )}
                        </button>
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" />
                    </div>
                    <h2 className="text-lg font-bold text-brand-primary mt-3">{user?.name ?? 'Vendor Name'}</h2>
                    <p className="text-xs text-brand-secondary mt-1">{vendorKyc?.business_name || vendor?.business_name || 'Business Account'}</p>
                </div>

                {/* Sections Menu */}
                <SectionTitle title="Profile Sections" />
                <Card>
                    {sections.map((section, index) => (
                        <React.Fragment key={section.id}>
                            <button
                                onClick={() => router.visit(section.route)}
                                className="w-full flex items-center justify-between px-4 py-3 hover:bg-brand-background transition-colors text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-brand-background rounded-xl flex items-center justify-center">
                                        <section.icon size={18} className="text-brand-primary" />
                                    </div>
                                    <p className="text-sm font-semibold text-brand-primary">{section.title}</p>
                                </div>
                                <svg className="w-5 h-5 text-brand-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                            {index < sections.length - 1 && <Divider />}
                        </React.Fragment>
                    ))}
                </Card>

                {/* Sign Out Button */}
                <div className="mt-6">
                    <button
                        onClick={() => router.post('/logout')}
                        className="w-full bg-white border border-brand-border rounded-2xl py-3 text-brand-danger font-semibold flex items-center justify-center gap-2 hover:bg-brand-danger/5 transition-colors"
                    >
                        <LogOut size={16} />
                        Log Out
                    </button>
                </div>

                <div className="h-6" />
            </div>
        </VendorAppLayout>
    );
}

/* ═══════════════ SHARED COMPONENTS ═══════════════ */

function SectionTitle({ title }) {
    return <p className="text-[11px] tracking-widest text-brand-secondary uppercase mb-2">{title}</p>;
}

function Card({ children }) {
    return <div className="bg-white rounded-2xl shadow-sm border border-brand-border overflow-hidden">{children}</div>;
}

function Divider() {
    return <div className="h-px bg-brand-border" />;
}