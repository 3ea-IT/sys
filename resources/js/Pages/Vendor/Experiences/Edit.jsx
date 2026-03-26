import React, { useState } from 'react';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import VendorAppLayout from '@/Layouts/VendorAppLayout';
import { ArrowLeft, Upload, X, ImagePlus, Info } from 'lucide-react';

// Helper function to convert HTML list back to line-separated format
const parseHighlightsFromHtml = (htmlString) => {
    if (!htmlString) return '';
    
    // Create a temporary div to parse HTML
    const div = document.createElement('div');
    div.innerHTML = htmlString;
    
    // Get all li elements
    const listItems = div.querySelectorAll('li');
    
    if (listItems.length === 0) {
        return htmlString; // Return as-is if no list items found
    }
    
    // Extract text from each li and join with newlines
    return Array.from(listItems)
        .map(li => li.textContent.trim())
        .filter(text => text.length > 0)
        .join('\n');
};

const convertTo12Hour = (time24h) => {
    if (!time24h) return '';

    const [hourStr, minute] = time24h.split(':');
    let hour = parseInt(hourStr, 10);
    const period = hour >= 12 ? 'PM' : 'AM';

    hour = hour % 12 || 12;

    return `${String(hour).padStart(2, '0')}:${minute} ${period}`;
};

const convertTo24Hour = (time12h) => {
    if (!time12h) return '';

    const cleaned = time12h.trim().toUpperCase();
    const match = cleaned.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/);

    if (!match) return time12h;

    let [, hours, minutes, period] = match;
    hours = parseInt(hours, 10);

    if (period === 'AM') {
        if (hours === 12) hours = 0;
    } else {
        if (hours !== 12) hours += 12;
    }

    return `${String(hours).padStart(2, '0')}:${minutes}`;
};

export default function EditExperience() {
    const { user, experience, categories, bookingModes } = usePage().props;
    const { data, setData, post, transform, errors, processing } = useForm({
        title: experience.title || '',
        category: experience.category || '',
        location: experience.location || '',
        start_date: experience.start_date || '',
        start_time: convertTo12Hour(experience.start_time) || '',
        end_date: experience.end_date || '',
        end_time: convertTo12Hour(experience.end_time) || '',
        description: experience.description || '',
        highlights: parseHighlightsFromHtml(experience.highlights) || '',
        booking_mode: experience.booking_mode || 'both',
        price: experience.price || 0,
        instant_price: experience.instant_price || 0,
        hold_token: experience.hold_token || 0,
        hold_duration: experience.hold_duration || 60,
        capacity: experience.capacity || 0,
        instant_availability: experience.instant_availability || 0,
        priority_score: experience.priority_score || 0,
        status: experience.status || 'active',
        image: null,
        _method: 'PUT',
    });

    const [preview, setPreview] = useState(experience.image_url || null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            const reader = new FileReader();
            reader.onload = (event) => setPreview(event.target.result);
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setPreview(null);
        setData('image', null);
    };

    // Validation function to check if all required fields are filled
    const isFormComplete = () => {
        const hasBasicInfo = data.title && data.category && data.location && data.start_date && data.start_time;
        const hasDescription = data.description && data.highlights;
        const hasBookingMode = data.booking_mode;
        const hasCapacity = data.capacity > 0;
        
        // Check booking mode specific fields
        let hasBookingFields = true;
        if (['instant', 'both'].includes(data.booking_mode)) {
            hasBookingFields = data.instant_price > 0 && data.instant_availability > 0;
        }
        if (data.booking_mode === 'both') {
            hasBookingFields = hasBookingFields && data.hold_token > 0 && data.hold_duration;
        }
        
        return hasBasicInfo && hasDescription && hasBookingMode && hasBookingFields && hasCapacity;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isFormComplete()) {
            transform((formData) => ({
                ...formData,
                start_time: convertTo24Hour(formData.start_time),
                end_time: formData.end_time ? convertTo24Hour(formData.end_time) : null,
            }));

            post(route('vendor.experiences.update', experience.id), {
                onSuccess: () => {
                    router.visit(route('vendor.experiences.index'));
                },
            });
        }
    };

    // Fallback options for demo
    const displayCategories = categories ?? {
        adventure: 'Adventure',
        culinary: 'Culinary',
        wellness: 'Wellness',
        arts: 'Arts & Culture',
        education: 'Education',
        sports: 'Sports',
    };

    const displayBookingModes = bookingModes ?? {
        instant: 'Instant Booking Only',
        both: 'Both (Instant + Hold)',
    };

    const holdDurationOptions = {
        10: '10 minutes',
        60: '1 hour',
        360: '6 hours',
        1440: '24 hours',
    };

    return (
        <VendorAppLayout>
            <Head title={`Edit - ${experience.title}`} />

            <div className="space-y-5 pb-4">

                {/* Page Header */}
                <div className="flex flex-col gap-4 pt-1">
                    <button
                        onClick={() => router.visit(route('vendor.experiences.index'))}
                        className="flex items-center gap-2 text-brand-primary hover:opacity-80 transition-opacity bg-transparent border-0 cursor-pointer w-fit"
                    >
                        <ArrowLeft size={20} />
                        <span className="text-sm font-semibold">Back to Experiences</span>
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-brand-primary leading-tight">Edit Experience</h1>
                        <p className="text-xs text-brand-secondary mt-0.5">Update the details below</p>
                    </div>
                </div>

                {/* ── SECTION: Basic Information ── */}
                <SectionCard title="Basic Information">
                    <InputField
                        label="Experience Title"
                        name="title"
                        value={data.title}
                        onChange={(v) => setData('title', v)}
                        error={errors.title}
                        placeholder="e.g. City Sunset Kayak Tour"
                        required={true}
                    />
                    <SelectField
                        label="Category"
                        name="category"
                        value={data.category}
                        onChange={(v) => setData('category', v)}
                        options={displayCategories}
                        error={errors.category}
                        required={true}
                    />
                    <InputField
                        label="Location"
                        name="location"
                        value={data.location}
                        onChange={(v) => setData('location', v)}
                        error={errors.location}
                        placeholder="e.g. Marine Drive, Mumbai"
                        required={true}
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <InputField
                            label="Start Date"
                            name="start_date"
                            type="date"
                            value={data.start_date}
                            onChange={(v) => setData('start_date', v)}
                            error={errors.start_date}
                            required={true}
                        />
                        <InputField
                            label="Start Time"
                            name="start_time"
                            type="text"
                            value={data.start_time}
                            onChange={(v) => setData('start_time', v)}
                            error={errors.start_time}
                            placeholder="e.g. 02:30 PM"
                            required={true}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-brand-border/40">
                        <InputField
                            label="End Date (Optional)"
                            name="end_date"
                            type="date"
                            value={data.end_date}
                            onChange={(v) => setData('end_date', v)}
                            error={errors.end_date}
                            help="Leave blank for single-day events"
                        />
                        <InputField
                            label="End Time (Optional)"
                            name="end_time"
                            type="text"
                            value={data.end_time}
                            onChange={(v) => setData('end_time', v)}
                            error={errors.end_time}
                            placeholder="e.g. 05:00 PM"
                            help="Leave blank for single-day events"
                        />
                    </div>
                </SectionCard>

                {/* ── SECTION: Description ── */}
                <SectionCard title="Description">
                    <TextareaField
                        label="Description"
                        name="description"
                        value={data.description}
                        onChange={(v) => setData('description', v)}
                        error={errors.description}
                        placeholder="Describe your experience in detail..."
                        rows={4}
                        required={true}
                    />
                    <TextareaField
                        label="Highlights"
                        name="highlights"
                        value={data.highlights}
                        onChange={(v) => setData('highlights', v)}
                        error={errors.highlights}
                        placeholder="Enter one highlight per line..."
                        rows={3}
                        required={true}
                        help="Enter each highlight as a separate point (one per line). Each point will be displayed as a bullet in the list."
                    />
                </SectionCard>

                {/* ── SECTION: Image Upload ── */}
                <SectionCard title="Cover Image">
                    {preview ? (
                        <div className="relative">
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-full h-48 object-cover rounded-xl border border-brand-border"
                            />
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-red-50 transition-colors border border-brand-border"
                            >
                                <X className="w-4 h-4 text-brand-secondary" />
                            </button>
                        </div>
                    ) : (
                        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-brand-border rounded-xl cursor-pointer hover:border-brand-primary/40 hover:bg-brand-primary/5 transition-all group">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 rounded-2xl bg-brand-border flex items-center justify-center group-hover:bg-brand-primary/10 transition-colors">
                                    <ImagePlus className="w-6 h-6 text-brand-secondary group-hover:text-brand-primary transition-colors" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-semibold text-brand-primary">Upload a cover image</p>
                                    <p className="text-xs text-brand-secondary mt-0.5">PNG, JPG up to 5MB</p>
                                </div>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                    )}
                    {errors.image && <p className="text-xs mt-1.5" style={{ color: '#D64545' }}>{errors.image}</p>}
                </SectionCard>

                {/* ── SECTION: Booking Configuration ── */}
                <SectionCard title="Booking Configuration">
                    <SelectField
                        label="Booking Mode"
                        name="booking_mode"
                        value={data.booking_mode}
                        onChange={(v) => setData('booking_mode', v)}
                        options={displayBookingModes}
                        error={errors.booking_mode}
                        required={true}
                    />

                    {/* Instant Booking Fields */}
                    {['instant', 'both'].includes(data.booking_mode) && (
                        <div className="grid grid-cols-2 gap-3 pt-1">
                            <InputField
                                label="Instant Price(₹)"
                                name="instant_price"
                                type="number"
                                value={data.instant_price}
                                onChange={(v) => setData('instant_price', v)}
                                error={errors.instant_price}
                                placeholder="0"
                                required={true}
                            />
                            <InputField
                                label="Instant Seats"
                                name="instant_availability"
                                type="number"
                                value={data.instant_availability}
                                onChange={(v) => setData('instant_availability', v)}
                                error={errors.instant_availability}
                                placeholder="0"
                                required={true}
                            />
                        </div>
                    )}

                    {/* Hold Fields */}
                    {data.booking_mode === 'both' && (
                        <div className="grid grid-cols-2 gap-3 pt-1">
                            <InputField
                                label="Hold Token (₹)"
                                name="hold_token"
                                type="number"
                                value={data.hold_token}
                                onChange={(v) => setData('hold_token', v)}
                                error={errors.hold_token}
                                placeholder="0"
                                required={true}
                            />
                            <SelectField
                                label="Hold Duration"
                                name="hold_duration"
                                value={data.hold_duration}
                                onChange={(v) => setData('hold_duration', v)}
                                options={holdDurationOptions}
                                error={errors.hold_duration}
                                required={true}
                            />
                        </div>
                    )}
                </SectionCard>

                {/* ── SECTION: Capacity & Visibility ── */}
                <SectionCard title="Capacity & Visibility">
                    <div className="grid grid-cols-2 gap-3">
                        <InputField
                            label="Total Capacity"
                            name="capacity"
                            type="number"
                            value={data.capacity}
                            onChange={(v) => setData('capacity', v)}
                            error={errors.capacity}
                            placeholder="0"
                            required={true}
                        />
                        <InputField
                            label="Priority Score"
                            name="priority_score"
                            type="number"
                            value={data.priority_score}
                            onChange={(v) => setData('priority_score', v)}
                            error={errors.priority_score}
                            placeholder="0–100"
                            help="Higher score = shown first"
                        />
                    </div>
                </SectionCard>

                {/* ── Submit Buttons ── */}
                <div className="flex flex-col gap-3 pt-1">
                    <button
                        onClick={handleSubmit}
                        disabled={processing || !isFormComplete()}
                        className="w-full py-4 rounded-2xl bg-brand-primary text-white font-semibold text-sm shadow-card hover:bg-brand-primary/90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {processing ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                                Updating...
                            </span>
                        ) : (
                            '✓ Update Experience'
                        )}
                    </button>

                    <Link
                        href={route('vendor.experiences.index')}
                        className="w-full py-4 rounded-2xl bg-white border border-brand-border text-brand-secondary font-semibold text-sm text-center hover:bg-brand-border/30 active:scale-[0.98] transition-all"
                    >
                        Cancel
                    </Link>
                </div>

                {/* ── Priority Score Guide ── */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 space-y-4">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">🎯</span>
                        <h3 className="text-lg font-bold text-blue-900">Understanding Priority Score</h3>
                    </div>

                    <p className="text-sm text-blue-800 leading-relaxed">
                        The <span className="font-semibold">Priority Score</span> determines how prominently your experience appears in search results and explore pages. Higher scores get featured first.
                    </p>

                    <div className="space-y-2">
                        <p className="text-xs font-semibold text-blue-900 uppercase tracking-wider">Score Ranges:</p>
                        <div className="space-y-2">
                            <div className="flex items-start gap-3 text-sm text-blue-800">
                                <span className="font-bold text-blue-600 min-w-12">0–20</span>
                                <div>
                                    <p className="font-medium">New/Standard</p>
                                    <p className="text-xs opacity-80">Default for new experiences. Appears in general listings.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 text-sm text-blue-800">
                                <span className="font-bold text-blue-600 min-w-12">21–50</span>
                                <div>
                                    <p className="font-medium">Popular</p>
                                    <p className="text-xs opacity-80">Good reviews, steady bookings. Better visibility on explore page.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 text-sm text-blue-800">
                                <span className="font-bold text-blue-600 min-w-12">51–80</span>
                                <div>
                                    <p className="font-medium">Featured</p>
                                    <p className="text-xs opacity-80">High demand experiences. Appears in featured sections.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 text-sm text-blue-800">
                                <span className="font-bold text-amber-600 min-w-12">81–100</span>
                                <div>
                                    <p className="font-medium">Premium/VIP</p>
                                    <p className="text-xs opacity-80">Exclusive experiences. Featured at the top with priority badge.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/60 border border-blue-200 rounded-lg p-3 text-xs text-blue-800 space-y-1">
                        <p><span className="font-semibold">💡 Tip:</span> Start with 0 and let user reviews & bookings naturally increase your score over time. Admin may also adjust scores for special promotions.</p>
                    </div>
                </div>

            </div>
        </VendorAppLayout>
    );
}

/* ── Reusable Sub-Components ── */

function SectionCard({ title, children }) {
    return (
        <div className="bg-white rounded-lg shadow-card border border-brand-border/50 overflow-hidden">
            {/* Section Header */}
            <div className="px-4 py-3 border-b border-brand-border/50">
                <h2 className="text-sm font-bold text-brand-primary uppercase tracking-wider">{title}</h2>
            </div>
            <div className="px-4 py-4 space-y-4">
                {children}
            </div>
        </div>
    );
}

function InputField({ label, name, type = 'text', value, onChange, error, placeholder, required, help }) {
    return (
        <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-brand-secondary uppercase tracking-wider">
                {label} {required && <span style={{ color: '#D64545' }}>*</span>}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`w-full px-4 py-3 rounded-xl border text-sm text-brand-primary placeholder-brand-secondary/40 bg-brand-background focus:outline-none focus:ring-2 transition-all ${
                    error
                        ? 'border-red-400 focus:ring-red-200'
                        : 'border-brand-border focus:ring-brand-primary/20 focus:border-brand-primary/40'
                }`}
            />
            {help && (
                <p className="flex items-start gap-1 text-xs text-brand-secondary/70">
                    <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    {help}
                </p>
            )}
            {error && <p className="text-xs font-medium" style={{ color: '#D64545' }}>{error}</p>}
        </div>
    );
}

function TextareaField({ label, name, value, onChange, error, placeholder, rows = 4, help, required = false }) {
    return (
        <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-brand-secondary uppercase tracking-wider">
                {label} {required && <span style={{ color: '#D64545' }}>*</span>}
            </label>
            <textarea
                name={name}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows={rows}
                placeholder={placeholder}
                className={`w-full px-4 py-3 rounded-xl border text-sm text-brand-primary placeholder-brand-secondary/40 bg-brand-background focus:outline-none focus:ring-2 transition-all resize-none ${
                    error
                        ? 'border-red-400 focus:ring-red-200'
                        : 'border-brand-border focus:ring-brand-primary/20 focus:border-brand-primary/40'
                }`}
            />
            {help && (
                <p className="flex items-start gap-1 text-xs text-brand-secondary/70">
                    <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    {help}
                </p>
            )}
            {error && <p className="text-xs font-medium" style={{ color: '#D64545' }}>{error}</p>}
        </div>
    );
}

function SelectField({ label, name, value, onChange, options, error, required }) {
    return (
        <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-brand-secondary uppercase tracking-wider">
                {label} {required && <span style={{ color: '#D64545' }}>*</span>}
            </label>
            <div className="relative">
                <select
                    name={name}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border text-sm text-brand-primary bg-brand-background appearance-none focus:outline-none focus:ring-2 transition-all ${
                        error
                            ? 'border-red-400 focus:ring-red-200'
                            : 'border-brand-border focus:ring-brand-primary/20 focus:border-brand-primary/40'
                    }`}
                    required={required}
                >
                    <option value="">Select {label}</option>
                    {Object.entries(options).map(([key, val]) => (
                        <option key={key} value={key}>{val}</option>
                    ))}
                </select>
                {/* Custom chevron */}
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                    <svg className="w-4 h-4 text-brand-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
            {error && <p className="text-xs font-medium" style={{ color: '#D64545' }}>{error}</p>}
        </div>
    );
}