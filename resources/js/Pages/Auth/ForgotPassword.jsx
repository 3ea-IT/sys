import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <>
            <Head title="Forgot Password" />

            <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center px-6 py-10">
                <div className="w-full max-w-[360px] flex flex-col items-center">

                    {/* Hero Text */}
                    <h1
                        className="text-[2rem] font-black text-center leading-tight mb-3"
                        style={{ color: '#0F2A44' }}
                    >
                        Reset Your<br />Password
                    </h1>
                    <p className="text-sm text-brand-secondary text-center leading-relaxed mb-8 max-w-[280px]">
                        No problem. Just let us know your email address and we'll send you a password reset link.
                    </p>

                    {/* Status Message */}
                    {status && (
                        <div className="w-full mb-4 p-4 text-sm font-medium text-brand-success bg-green-50 rounded-xl border border-green-200 text-center">
                            {status}
                        </div>
                    )}

                    {/* Form */}
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
                                autoComplete="email"
                                autoFocus
                                placeholder="you@example.com"
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-brand-border bg-white text-brand-primary placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                            />
                            <InputError message={errors.email} className="mt-1.5" />
                        </div>

                        {/* Helper text */}
                        <p className="text-[11px] text-brand-secondary leading-relaxed">
                            We'll send you a secure reset link to recover your account.
                        </p>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-4 rounded-xl text-sm font-black tracking-[0.12em] text-white uppercase transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98]"
                            style={{ background: '#0F2A44' }}
                        >
                            {processing ? 'Sending Link...' : 'Send Reset Link'}
                        </button>

                        {/* Back to Login */}
                        <div className="text-center mt-4">
                            <Link
                                href={route('login')}
                                className="text-xs text-brand-secondary hover:text-brand-primary transition-colors underline"
                            >
                                Back to Sign In
                            </Link>
                        </div>

                    </form>

                </div>
            </div>
        </>
    );
}
