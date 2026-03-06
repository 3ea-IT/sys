import { useEffect, useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import { Eye, EyeOff } from 'lucide-react';

/* ─── Vendor Registration Page ───────────────────────────────── */
export default function VendorRegister() {

  /* ── FORM LOGIC ── */
  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    business_name: "",
    business_type: "",
    role: "vendor", // Auto-set to vendor
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  useEffect(() => {
    return () => {
      reset("password", "password_confirmation");
    };
  }, []);

  const submit = (e) => {
    e.preventDefault();
    post(route("register.vendor"));
  };

  return (
    <>
      <Head title="Register as Vendor" />

      <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center px-6 py-10">
        <div className="w-full max-w-[360px] flex flex-col items-center">

          {/* App Icon */}
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center mb-3 shadow-lg overflow-hidden"
            style={{ background: "#0F2A44" }}
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

          {/* App Name */}
          <p className="text-[11px] font-bold tracking-[0.22em] text-brand-secondary uppercase mb-8">
            Secure Seat
          </p>

          {/* Hero Text */}
          <h1
            className="text-[2rem] font-black text-center leading-tight mb-3"
            style={{ color: "#0F2A44" }}
          >
            List Your<br />Experiences
          </h1>
          <p className="text-sm text-brand-secondary text-center leading-relaxed mb-8 max-w-[260px]">
            Join as a vendor to list your premium experiences and grow your business.
          </p>

          {/* Form */}
          <form onSubmit={submit} className="w-full space-y-4">

            {/* Name */}
            <div>
              <label className="block text-[10px] font-bold tracking-[0.14em] text-brand-secondary uppercase mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={data.name}
                autoFocus
                onChange={(e) => setData("name", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-brand-border bg-white text-brand-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                placeholder="your name"
                required
              />
              <InputError message={errors.name} className="mt-1.5" />
            </div>

            {/* Email */}
            <div>
              <label className="block text-[10px] font-bold tracking-[0.14em] text-brand-secondary uppercase mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => setData("email", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-brand-border bg-white text-brand-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                placeholder="your@email.com"
                required
              />
              <InputError message={errors.email} className="mt-1.5" />
            </div>

            {/* Business Name */}
            <div>
              <label className="block text-[10px] font-bold tracking-[0.14em] text-brand-secondary uppercase mb-2">
                Business Name
              </label>
              <input
                type="text"
                value={data.business_name}
                onChange={(e) => setData("business_name", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-brand-border bg-white text-brand-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                placeholder="Your business name"
                required
              />
              <InputError message={errors.business_name} className="mt-1.5" />
            </div>

            {/* Business Type */}
            <div>
              <label className="block text-[10px] font-bold tracking-[0.14em] text-brand-secondary uppercase mb-2">
                Business Type
              </label>
              <select
                value={data.business_type}
                onChange={(e) => setData("business_type", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-brand-border bg-white text-brand-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                required
              >
                <option value="">Select business type</option>
                <option value="Entertainment">Entertainment (Movies, Concerts, Shows)</option>
                <option value="Professional Events">Professional Events (Seminars, Workshops)</option>
                <option value="Religious & Wellness">Religious & Wellness (Temple, Spiritual)</option>
                <option value="Dining Access">Dining Access (Restaurants, Cafes)</option>
                <option value="Travel & Attractions">Travel & Attractions (Tickets, Access)</option>
              </select>
              <InputError message={errors.business_type} className="mt-1.5" />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-bold tracking-[0.14em] text-brand-secondary uppercase mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={data.password}
                  onChange={(e) => setData("password", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-brand-border bg-white text-brand-primary text-sm placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                  placeholder="••••••••"
                  required
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

            {/* Confirm Password */}
            <div>
              <label className="block text-[10px] font-bold tracking-[0.14em] text-brand-secondary uppercase mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPasswordConfirm ? 'text' : 'password'}
                  value={data.password_confirmation}
                  onChange={(e) => setData("password_confirmation", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-brand-border bg-white text-brand-primary text-sm placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-secondary hover:text-brand-primary transition-colors"
                >
                  {showPasswordConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <InputError message={errors.password_confirmation} className="mt-1.5" />
            </div>

            {/* Terms & Conditions */}
            <p className="text-[11px] text-brand-secondary leading-relaxed text-center">
              By registering, you agree to our{' '}
              <Link href="/terms" className="underline hover:text-brand-primary transition-colors">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="underline hover:text-brand-primary transition-colors">
                Privacy Policy
              </Link>
              . Your account will need admin approval before going live.
            </p>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={processing}
              className="w-full py-4 rounded-xl text-sm font-black tracking-[0.12em] text-white uppercase transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98]"
              style={{ background: "#0F2A44" }}
            >
              {processing ? "Creating Account..." : "Register as Vendor"}
            </button>

            {/* Already Registered */}
            <div className="text-center mt-4">
              <Link
                href={route("login")}
                className="text-xs text-brand-secondary hover:text-brand-primary transition-colors underline"
              >
                Already registered? Sign in
              </Link>
            </div>

          </form>
        </div>
      </div>
    </>
  );
}
