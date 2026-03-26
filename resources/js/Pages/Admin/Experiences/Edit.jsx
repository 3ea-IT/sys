import AdminAppLayout from "@/Layouts/AdminAppLayout";
import { Head, useForm, usePage, router } from "@inertiajs/react";
import { ArrowLeft, CheckCircle, AlertCircle, Clock, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

export default function AdminExperiencesEdit() {
  const { experience, user, flash } = usePage().props;
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [successMessage, setSuccessMessage] = useState(flash?.success || null);

  const { post, data, setData, processing } = useForm({
    rejection_reason: '',
  });

  // Show success message and redirect after status change
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        router.visit('/admin/experiences', { method: 'get' });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleApprove = () => {
    setSuccessMessage(null);
    post(`/admin/experiences/${experience.id}/approve`, {
      onSuccess: () => {
        setSuccessMessage('Experience Approved! Redirecting...');
      },
    });
  };

  const handleReject = () => {
    if (!data.rejection_reason.trim()) {
      alert('Please enter a rejection reason');
      return;
    }
    setSuccessMessage(null);
    post(`/admin/experiences/${experience.id}/reject`, {
      onSuccess: () => {
        setSuccessMessage('Experience Rejected! Redirecting...');
      },
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'rejected':
        return <AlertCircle className="w-5 h-5 text-rose-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-amber-500" />;
      default:
        return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusBadge = (status) => {
    const base = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase";
    switch (status) {
      case 'approved':
        return `${base} bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:ring-emerald-800`;
      case 'rejected':
        return `${base} bg-rose-50 text-rose-700 ring-1 ring-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:ring-rose-800`;
      case 'pending':
        return `${base} bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:ring-amber-800`;
      default:
        return `${base} bg-slate-100 text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700`;
    }
  };

  const SectionCard = ({ title, icon: Icon, children, className = "" }) => (
    <div className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden ${className}`}>
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
        <div className="p-1.5 bg-brand-primary/10 dark:bg-brand-primary/20 rounded-lg">
          <Icon className="w-4 h-4 text-brand-primary dark:text-brand-primary/80" />
        </div>
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 tracking-tight">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );

  const InfoRow = ({ label, value }) => (
    <div className="group">
      <dt className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 dark:text-gray-500 mb-0.5">{label}</dt>
      <dd className="text-sm text-gray-800 dark:text-gray-200 font-medium">{value || <span className="text-gray-300 dark:text-gray-600 font-normal italic text-xs">Not provided</span>}</dd>
    </div>
  );

  return (
    <AdminAppLayout user={user}>
      <Head title={`Edit ${experience.title} - Experience Details`} />

      {/* Success Notification */}
      {successMessage && (
        <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 z-50 px-4 py-3 bg-emerald-500 text-white rounded-lg shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium text-sm md:text-base">{successMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <a
          href="/admin/experiences"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-brand-primary dark:text-gray-400 dark:hover:text-brand-primary transition-colors mb-4 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          Back to Experiences
        </a>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
              {experience.title}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{experience.location}</p>
          </div>
          {experience.approval_status && (
            <div className={getStatusBadge(experience.approval_status)}>
              {getStatusIcon(experience.approval_status)}
              {experience.approval_status.charAt(0).toUpperCase() + experience.approval_status.slice(1)}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-5">
        {/* Approval Status Management */}
        <SectionCard title="Approval Status Management" icon={Sparkles}>
          {experience.approval_status === 'pending' ? (
            <div className="space-y-3">
              <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 dark:text-gray-500 mb-3">Change Approval Status</p>

              <button
                onClick={handleApprove}
                disabled={processing}
                className="w-full px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm transition-all duration-150 shadow-sm hover:shadow-emerald-200 dark:hover:shadow-emerald-900/30 flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                {processing ? 'Processing…' : 'Approve Experience'}
              </button>

              <button
                onClick={() => setShowRejectReason(!showRejectReason)}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 hover:bg-rose-50 dark:hover:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 rounded-xl font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-2"
              >
                <AlertCircle className="w-4 h-4" />
                {showRejectReason ? 'Cancel' : 'Reject Experience'}
              </button>

              {showRejectReason && (
                <div className="pt-4 mt-1 border-t border-gray-100 dark:border-gray-800 space-y-3">
                  <label className="text-xs font-semibold tracking-widest uppercase text-gray-400 dark:text-gray-500">
                    Rejection Reason
                  </label>
                  <textarea
                    value={data.rejection_reason}
                    onChange={(e) => setData('rejection_reason', e.target.value)}
                    placeholder="Explain why this experience is being rejected…"
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/60 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-700 resize-none transition-all"
                    rows="4"
                    maxLength={500}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 dark:text-gray-600">{data.rejection_reason.length}/500</span>
                  </div>
                  <button
                    onClick={handleReject}
                    disabled={processing}
                    className="w-full px-4 py-2.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm transition-all duration-150 shadow-sm flex items-center justify-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {processing ? 'Submitting…' : 'Submit Rejection'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={`flex items-center gap-2.5 p-3.5 rounded-xl text-sm font-medium ${
              experience.approval_status === 'approved'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                : 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400'
            }`}>
              {getStatusIcon(experience.approval_status)}
              {experience.approval_status === 'approved'
                ? 'This experience has been approved'
                : 'This experience has been rejected'}
            </div>
          )}
        </SectionCard>

        {/* Experience Info */}
        <SectionCard title="Experience Information" icon={Sparkles}>
          <dl className="space-y-4">
            <InfoRow label="Title" value={experience.title} />
            <InfoRow label="Category" value={experience.category} />
            <InfoRow label="Location" value={experience.location} />
            <InfoRow label="Date" value={new Date(experience.start_date).toLocaleDateString()} />
          </dl>
        </SectionCard>

        {/* Description */}
        {experience.description && (
          <SectionCard title="Description" icon={Sparkles}>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {experience.description}
            </p>
          </SectionCard>
        )}

        {/* Highlights */}
        {experience.highlights && (
          <SectionCard title="Highlights" icon={Sparkles}>
            {Array.isArray(experience.highlights) ? (
              <ul className="space-y-2">
                {experience.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-brand-primary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {highlight}
                    </span>
                  </li>
                ))}
              </ul>
            ) : typeof experience.highlights === 'string' && experience.highlights.includes('<li') ? (
              <ul className="space-y-2">
                {experience.highlights
                  .split('</li>')
                  .filter(item => item.trim())
                  .map((item, idx) => {
                    const textContent = item
                      .replace(/<li[^>]*>/g, '')
                      .replace(/<[^>]*>/g, '')
                      .trim();
                    return textContent ? (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 bg-brand-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {textContent}
                        </span>
                      </li>
                    ) : null;
                  })}
              </ul>
            ) : (
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {experience.highlights}
              </p>
            )}
          </SectionCard>
        )}

        {/* Pricing & Booking Details */}
        <SectionCard title="Pricing & Booking Details" icon={Sparkles}>
          <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4">
            <InfoRow label="Instant Price" value={`₹${experience.instant_price}`} />
            <InfoRow label="Regular Price" value={`₹${experience.price}`} />
            <InfoRow label="Booking Mode" value={experience.booking_mode} />
            <InfoRow label="Capacity" value={`${experience.capacity} people`} />
            <InfoRow label="Hold Token" value={`₹${experience.hold_token}`} />
            <InfoRow label="Hold Duration" value={`${experience.hold_duration} minutes`} />
            <InfoRow label="Instant Availability" value={`${experience.instant_availability} seats`} />
            <InfoRow label="Priority Score" value={experience.priority_score} />
          </dl>
        </SectionCard>

        {/* Vendor Info */}
        {experience.vendor && (
          <SectionCard title="Vendor Information" icon={Sparkles}>
            <dl className="space-y-4">
              <InfoRow label="Vendor Name" value={experience.vendor.name} />
              <InfoRow label="Email" value={experience.vendor.email} />
            </dl>
          </SectionCard>
        )}

        {/* Rejection Reason */}
        {experience.approval_status === 'rejected' && experience.rejection_reason && (
          <div className="rounded-2xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-900/10 overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-rose-200 dark:border-rose-900 bg-rose-100/50 dark:bg-rose-900/20">
              <AlertCircle className="w-4 h-4 text-rose-500" />
              <h2 className="text-sm font-semibold text-rose-700 dark:text-rose-400 tracking-tight">Rejection Reason</h2>
            </div>
            <p className="px-5 py-4 text-sm text-rose-700 dark:text-rose-300 leading-relaxed">
              {experience.rejection_reason}
            </p>
          </div>
        )}
      </div>
    </AdminAppLayout>
  );
}
