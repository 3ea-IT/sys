import { useEffect, useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import { Eye, EyeOff } from 'lucide-react';
// import secureSeatLogo from '/assets/secure_seat_logo.png';

/* ─── Seated Person Icon (REMOVED - Using imported secure_seat_logo.png instead) ─── */
/* Previously used custom SVG, now using imported image */

/* ─── Page ───────────────────────────────── */
export default function Register() {

  /* ── ORIGINAL FORM LOGIC (UNCHANGED) ── */
  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
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
    post(route("register"));
  };
  /* ───────────────────────────────────── */

  return (
    <>
      <Head title="Register" />

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
            Create Your<br />Secure Account
          </h1>
          <p className="text-sm text-brand-secondary text-center leading-relaxed mb-8 max-w-[260px]">
            Join Secure Seat to access premium seat reservations with complete peace of mind.
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
                required
              />
              <InputError message={errors.email} className="mt-1.5" />
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
                  className="w-full px-4 py-3 rounded-xl border border-brand-border bg-white text-brand-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
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
                  className="w-full px-4 py-3 rounded-xl border border-brand-border bg-white text-brand-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={processing}
              className="w-full py-4 rounded-xl text-sm font-black tracking-[0.12em] text-white uppercase transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98]"
              style={{ background: "#0F2A44" }}
            >
              {processing ? "Creating..." : "Register"}
            </button>

            {/* Already Registered */}
            <div className="text-center mt-4 space-y-3">
              <div>
                <Link
                  href={route("login")}
                  className="text-xs text-brand-secondary hover:text-brand-primary transition-colors underline"
                >
                  Already registered? Sign in
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
        </div>
      </div>
    </>
  );
}
