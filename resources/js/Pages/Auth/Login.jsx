import { useEffect, useState } from 'react';
import InputError from '@/Components/InputError';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';

// ─── Inline SVG: seated person icon (matches the image) ──────────────────────
// REMOVED - Now using imported secure_seat_logo.png image instead

// ─── Shield icon ──────────────────────────────────────────────────────────────
function ShieldIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5">
      <path
        d="M10 2L4 4.5V9C4 12.5 6.5 15.7 10 17C13.5 15.7 16 12.5 16 9V4.5L10 2Z"
        stroke="#5F6C7B"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M7.5 9.5L9 11L12.5 7.5" stroke="#5F6C7B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Login({ status, canResetPassword }) {
  // Get page errors (from redirects with withErrors)
  const { errors: pageErrors } = usePage().props;

  // ── All original form logic — UNCHANGED ─────────────────────────────────
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  useEffect(() => {
    return () => {
      reset('password');
    };
  }, []);

  const submit = (e) => {
    e.preventDefault();
    post(route('login'));
  };
  // ────────────────────────────────────────────────────────────────────────

  // UI-only tab state (cosmetic — Email tab just shows the email/password fields)
  const [activeTab, setActiveTab] = useState('email');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <Head title="Log in" />

      {/* ── Full screen white container ── */}
      <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center px-6 py-10">
        <div className="w-full max-w-[360px] flex flex-col items-center">

          {/* ── App icon ── */}
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center mb-3 shadow-lg overflow-hidden"
            style={{ background: '#0F2A44' }}
          >
            <img
              src="/assets/secure_seat_logo.png"
              alt="Secure Seat Logo"
              className="w-10 h-10 object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>

          {/* App name */}
          <p className="text-[11px] font-bold tracking-[0.22em] text-brand-secondary uppercase mb-8">
            Secure Seat
          </p>

          {/* ── Hero text ── */}
          <h1
            className="text-[2rem] font-black text-center leading-tight mb-3"
            style={{ color: '#0F2A44' }}
          >
            Secure First,<br />Decide Later
          </h1>
          <p className="text-sm text-brand-secondary text-center leading-relaxed mb-8 max-w-[260px]">
            Access premium seat reservations with total peace of mind and bank-level security.
          </p>

          {/* ── Status message (original) ── */}
          {status && (
            <div className="w-full mb-4 text-sm font-medium text-green-600 text-center">
              {status}
            </div>
          )}

          {/* ── Vendor Rejection Error ── */}
          {pageErrors.vendor_rejected && (
            <div className="w-full mb-4 p-4 rounded-lg bg-red-50 border border-red-300">
              <p className="text-sm font-medium text-red-800">
                ❌ {pageErrors.vendor_rejected}
              </p>
            </div>
          )}

          {/* ── Tab switcher (cosmetic UI only) ── */}
          {/* <div className="w-full flex bg-gray-100 rounded-xl p-1 mb-6">
            <button
              type="button"
              onClick={() => setActiveTab('mobile')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                activeTab === 'mobile'
                  ? 'bg-white text-brand-primary shadow-sm'
                  : 'text-brand-secondary'
              }`}
            >
              Mobile
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('email')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                activeTab === 'email'
                  ? 'bg-white text-brand-primary shadow-sm'
                  : 'text-brand-secondary'
              }`}
            >
              Email
            </button>
          </div> */}

          {/* ── Form (all original logic UNCHANGED) ── */}
          <form onSubmit={submit} className="w-full space-y-4">

            {/* Email field */}
            <div>
              <label
                htmlFor="email"
                className="block text-[10px] font-bold tracking-[0.14em] text-brand-secondary uppercase mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={data.email}
                autoComplete="username"
                autoFocus
                placeholder="you@example.com"
                onChange={(e) => setData('email', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-brand-border bg-white text-brand-primary placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
              />
              <InputError message={errors.email} className="mt-1.5" />
            </div>

            {/* Password field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-[10px] font-bold tracking-[0.14em] text-brand-secondary uppercase"
                >
                  Password
                </label>
                {canResetPassword && (
                  <Link
                    href={route('password.request')}
                    className="text-[11px] font-semibold text-brand-secondary hover:text-brand-primary transition-colors"
                  >
                    Forgot password?
                  </Link>
                )}
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={data.password}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  onChange={(e) => setData('password', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-brand-border bg-white text-brand-primary placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-secondary hover:text-brand-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <InputError message={errors.password} className="mt-1.5" />
            </div>

            {/* Helper text */}
            <p className="text-[11px] text-brand-secondary leading-relaxed">
              We'll verify your identity securely to access your account.
            </p>

            {/* Remember me (original — visually tucked, functionally intact) */}
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="w-4 h-4 rounded border border-brand-border flex items-center justify-center transition-all group-hover:border-brand-primary"
                style={{ background: data.remember ? '#0F2A44' : 'white' }}>
                {data.remember && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <input
                type="checkbox"
                name="remember"
                checked={data.remember}
                onChange={(e) => setData('remember', e.target.checked)}
                className="sr-only"
              />
              <span className="text-xs text-brand-secondary">Remember me</span>
            </label>

            {/* ── CONTINUE button ── */}
            <button
              type="submit"
              disabled={processing}
              className="w-full py-4 rounded-xl text-sm font-black tracking-[0.12em] text-white uppercase transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98]"
              style={{ background: '#0F2A44' }}
            >
              {processing ? 'Signing in…' : 'Continue'}
            </button>

            {/* Already Registered */}
            <div className="text-center mt-4 space-y-3">
              <div>
                <Link
                  href={route("register")}
                  className="text-xs text-brand-secondary hover:text-brand-primary transition-colors underline"
                >
                  Don't have account? Register
                </Link>
              </div>
              
              <div className="border-t border-brand-border pt-3">
                <p className="text-[11px] text-brand-secondary mb-2">Want to list your experiences?</p>
                <Link
                  href={route("register.vendor")}
                  className="inline-block px-4 py-2.5 rounded-lg bg-brand-primary text-white text-xs font-bold hover:opacity-90 transition-all"
                >
                  Register as Vendor
                </Link>
              </div>
            </div>

          </form>

          {/* ── Security footer ── */}
          <div className="mt-8 flex flex-col items-center gap-2">
            {/* <div className="flex items-center gap-1.5">
              <ShieldIcon />
              <span className="text-[10px] font-bold tracking-[0.14em] text-brand-secondary uppercase">
                Bank-Level 256-Bit Encryption
              </span>
            </div> */}
            <p className="text-[11px] text-brand-secondary text-center leading-relaxed">
              By continuing, you agree to our{' '}
              <Link href="/terms" className="underline hover:text-brand-primary transition-colors">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="underline hover:text-brand-primary transition-colors">
                Privacy Policy
              </Link>
              .
            </p>
          </div>

        </div>
      </div>
    </>
  );
}