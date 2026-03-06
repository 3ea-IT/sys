import AppLayout from '@/Layouts/AppLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Head, usePage, Link } from '@inertiajs/react';
import { User, Lock, Trash2, ChevronDown, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

// ─── Collapsible section wrapper ─────────────────────────────────────────────

function Section({ icon: Icon, title, subtitle, accentColor = 'text-brand-primary', iconBg = 'bg-brand-primary/10', children, defaultOpen = true, danger = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`rounded-lg overflow-hidden border shadow-card transition-all duration-200 ${
      danger ? 'border-brand-danger/20 bg-red-50/40' : 'border-brand-border bg-brand-card'
    }`}>

      {/* Section header — tap to collapse */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={`w-full flex items-center gap-3 px-4 py-4 text-left transition-colors ${
          danger ? 'hover:bg-red-50' : 'hover:bg-brand-background'
        }`}
      >
        {/* Icon badge */}
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
          <Icon className={`w-4 h-4 ${accentColor}`} />
        </div>

        {/* Title block */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-bold leading-tight ${danger ? 'text-brand-danger' : 'text-brand-primary'}`}>
            {title}
          </p>
          <p className="text-[11px] text-brand-secondary mt-0.5 leading-tight">{subtitle}</p>
        </div>

        {/* Chevron */}
        <ChevronDown
          className={`w-4 h-4 text-brand-secondary flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Divider */}
      {open && <div className={`h-px ${danger ? 'bg-brand-danger/10' : 'bg-brand-border'}`} />}

      {/* Content */}
      <div
        className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-4 py-4">
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Edit({ auth, mustVerifyEmail, status }) {
  const user = auth?.user;
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <AppLayout>
      <Head title="Profile" />

      {/* Header with Back Button */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          {/* Back Button */}
          <Link
            href="/profile"
            className="text-brand-secondary dark:text-gray-400 hover:text-brand-primary dark:hover:text-blue-400 transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>

          {/* Title */}
          <h1 className="text-2xl font-bold text-brand-primary">Profile Management</h1>
        </div>
        
        {/* Subtitle */}
        <p className="text-sm text-brand-secondary mt-2 ml-9">Manage your account information and security</p>
      </div>

      {/* ── Forms stack ── */}
      <div className="space-y-3 pb-6">

        {/* Profile Information */}
        <Section
          icon={User}
          title="Profile Information"
          subtitle="Update your name and email address"
          iconBg="bg-brand-primary/10"
          accentColor="text-brand-primary"
          defaultOpen={true}
        >
          {/* ✅ UNCHANGED — original Partial */}
          <UpdateProfileInformationForm
            mustVerifyEmail={mustVerifyEmail}
            status={status}
          />
        </Section>

        {/* Update Password */}
        <Section
          icon={Lock}
          title="Change Password"
          subtitle="Keep your account secure with a strong password"
          iconBg="bg-brand-success/10"
          accentColor="text-brand-success"
          defaultOpen={false}
        >
          {/* ✅ UNCHANGED — original Partial */}
          <UpdatePasswordForm />
        </Section>

        {/* Delete Account */}
        <Section
          icon={Trash2}
          title="Delete Account"
          subtitle="Permanently remove your account and all data"
          iconBg="bg-brand-danger/10"
          accentColor="text-brand-danger"
          defaultOpen={false}
          danger={true}
        >
          {/* ✅ UNCHANGED — original Partial */}
          <DeleteUserForm />
        </Section>

      </div>
    </AppLayout>
  );
}