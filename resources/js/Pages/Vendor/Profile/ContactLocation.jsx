import React from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import VendorAppLayout from '@/Layouts/VendorAppLayout';
import { Phone, Globe, MapPin, FileText, ArrowLeft, Loader } from 'lucide-react';

export default function ContactLocation() {
    const { user, vendor, vendorKyc } = usePage().props;
    const { data, setData, post, errors, processing } = useForm({
        phone: vendor.phone || vendorKyc?.phone || '',
        address: vendor.address || vendorKyc?.address || '',
        city: vendor.city || vendorKyc?.city || '',
        state: vendor.state || vendorKyc?.state || '',
        postal_code: vendor.postal_code || vendorKyc?.postal_code || '',
        country: vendor.country || vendorKyc?.country || '',
        business_description: vendor.business_description || vendorKyc?.business_description || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('vendor.profile.update'));
    };

    return (
        <VendorAppLayout user={user}>
            <Head title="Contact & Location" />

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
                        <h1 className="text-2xl font-bold text-brand-primary">Contact & Location</h1>
                        <p className="text-sm text-brand-secondary mt-0.5">Edit your contact and location details</p>
                    </div>
                </div>

                {/* Form Card */}
                <Card>
                    <form onSubmit={handleSubmit}>
                        <EditField icon={Phone} label="Phone" name="phone" data={data} setData={setData} errors={errors} type="tel" />
                        <Divider />
                        <EditField icon={Globe} label="Country" name="country" data={data} setData={setData} errors={errors} />
                        <Divider />
                        <EditField icon={MapPin} label="State" name="state" data={data} setData={setData} errors={errors} />
                        <Divider />
                        <EditField icon={MapPin} label="City" name="city" data={data} setData={setData} errors={errors} />
                        <Divider />
                        <EditField icon={MapPin} label="Postal Code" name="postal_code" data={data} setData={setData} errors={errors} />
                        <Divider />
                        <EditField icon={MapPin} label="Address" name="address" data={data} setData={setData} errors={errors} />
                        <Divider />
                        <div className="px-4 py-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-9 h-9 bg-brand-background rounded-xl flex items-center justify-center">
                                    <FileText size={18} className="text-brand-primary" />
                                </div>
                                <label className="text-sm font-semibold text-brand-primary">Business Description</label>
                            </div>
                            <textarea
                                name="business_description"
                                value={data.business_description}
                                onChange={(e) => setData('business_description', e.target.value)}
                                rows="4"
                                className="w-full px-3 py-2.5 border border-brand-border rounded-xl text-sm text-brand-primary placeholder-brand-secondary/40 focus:outline-none focus:ring-2 focus:ring-brand-primary/15 focus:border-brand-primary/40 transition-all resize-none bg-brand-background"
                                placeholder="Enter business description..."
                            />
                            {errors.business_description && <p className="text-xs text-brand-danger mt-1">{errors.business_description}</p>}
                        </div>

                        <Divider />
                        <div className="px-4 py-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-brand-primary text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-primary/90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {processing ? (
                                    <>
                                        <Loader size={16} className="animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </button>
                        </div>
                    </form>
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

function EditField({ icon: Icon, label, name, data, setData, errors, type = 'text' }) {
    return (
        <div className="px-4 py-4">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 bg-brand-background rounded-xl flex items-center justify-center">
                    <Icon size={18} className="text-brand-primary" />
                </div>
                <label className="text-sm font-semibold text-brand-primary">{label}</label>
            </div>
            <input
                type={type}
                value={data[name]}
                onChange={(e) => setData(name, e.target.value)}
                className={`w-full px-3 py-2.5 border rounded-xl text-sm text-brand-primary placeholder-brand-secondary/40 focus:outline-none focus:ring-2 focus:ring-brand-primary/15 focus:border-brand-primary/40 transition-all bg-brand-background ${errors[name] ? 'border-brand-danger' : 'border-brand-border'}`}
            />
            {errors[name] && <p className="text-xs text-brand-danger mt-1">{errors[name]}</p>}
        </div>
    );
}
