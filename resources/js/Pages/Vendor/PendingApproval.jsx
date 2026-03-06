import { Head, router } from "@inertiajs/react";
import { CheckCircle, ArrowLeft } from 'lucide-react';

export default function PendingApproval() {
  const handleLogout = () => {
    router.post(route('logout'), {}, {
      onSuccess: () => {
        router.visit(route('login'));
      }
    });
  };

  return (
    <>
      <Head title="Pending Admin Approval" />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full text-center">
          
          {/* Back to Login Button */}
          <div className="mb-8 flex justify-start">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-brand-primary hover:opacity-80 transition-opacity bg-transparent border-0 cursor-pointer"
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-semibold">Back to Login</span>
            </button>
          </div>

          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
                <CheckCircle size={56} className="text-blue-600" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-black mb-4" style={{ color: "#0F2A44" }}>
            Thank You!
          </h1>

          {/* Message */}
          <div className="bg-white rounded-xl border border-brand-border p-6 shadow-sm mb-6">
            <p className="text-base text-brand-secondary leading-relaxed">
              Your vendor account is currently <span className="font-semibold text-brand-primary">pending for admin approval</span>. 
            </p>
            <p className="text-base text-brand-secondary leading-relaxed mt-4">
              Once approved, you'll be able to list experiences and accept bookings.
            </p>
          </div>

          {/* Additional Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
            <p className="text-sm font-semibold text-brand-primary">What happens next?</p>
            <ul className="text-xs text-brand-secondary text-left space-y-2">
              <li className="flex gap-2">
                <span className="text-brand-primary font-bold">•</span>
                <span>Our admin team will review your business information</span>
              </li>
              <li className="flex gap-2">
                <span className="text-brand-primary font-bold">•</span>
                <span>You'll receive an email notification once approved</span>
              </li>
              <li className="flex gap-2">
                <span className="text-brand-primary font-bold">•</span>
                <span>Approval typically takes 1-2 business days</span>
              </li>
            </ul>
          </div>

          {/* Footer text */}
          <p className="text-xs text-brand-secondary mt-6">
            You can check your account status anytime by logging in to your vendor dashboard.
          </p>
        </div>
      </div>
    </>
  );
}
