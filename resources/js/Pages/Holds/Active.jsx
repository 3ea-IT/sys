// resources/js/Pages/Holds/Active.jsx
import AppLayout from '@/Layouts/AppLayout';
import { Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Lock, Clock, ShieldCheck, CreditCard } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Active({ hold = {} }) {
  const { auth } = usePage().props;
  const user = auth?.user;
  
  // ── Experience is nested inside hold (hold->load('experience')) ──
  const experience = hold?.experience ?? {};

  // ── Use dynamic hold duration from experience ──
  const holdDurationMinutes = experience.hold_duration || 30;
  const HOLD_DURATION = holdDurationMinutes * 60; // Convert to seconds

  const getSecondsRemaining = () => {
    if (!hold?.expires_at) return HOLD_DURATION;
    const expires = new Date(hold.expires_at).getTime();
    const now = Date.now();
    return Math.max(0, Math.floor((expires - now) / 1000));
  };

  const [secondsLeft, setSecondsLeft] = useState(getSecondsRemaining);
  const [expired, setExpired] = useState(() => getSecondsRemaining() <= 0);

  // ── Wallet integration ──
  const walletBalance = parseFloat(user?.wallet?.balance || 0);
  const holdTokenPaid = parseFloat(hold?.hold_token_paid || experience.hold_token || 0);
  const balanceDue = parseFloat(experience.price || 0) - holdTokenPaid;
  const hasSufficientBalance = walletBalance >= balanceDue;

  useEffect(() => {
    if (secondsLeft <= 0) {
      setExpired(true);
      return;
    }
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsLeft]);

  const hours = String(Math.floor(secondsLeft / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');

  // ── Full-circle SVG timer ──
  const SIZE = 300;
  const RADIUS = 130;
  const STROKE = 6;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const progress = secondsLeft / HOLD_DURATION; // 1 → 0
  const dashOffset = CIRCUMFERENCE * (1 - progress); // grows as time runs out

  // Ring colour shifts as urgency grows
  const ringColor = expired
    ? '#D64545'
    : progress > 0.4
    ? '#0F2A44'
    : progress > 0.2
    ? '#F2A541'
    : '#D64545';

  // ── Actions ──
  const handleConfirm = () => {
    if (!hasSufficientBalance) {
      alert(`Insufficient balance. Need ₹${balanceDue.toFixed(2)}. Current: ₹${walletBalance.toFixed(2)}`);
      return;
    }
    router.post(`/holds/${hold?.id}/confirm`);
  };

  const handleRelease = () => {
    if (confirm('Are you sure you want to release this hold? Your token will be refunded.')) {
      router.post(`/holds/${hold?.id}/release`);
    }
  };

  return (
    <AppLayout>
      {/* ── Header ── */}
      <div className="relative flex items-center justify-center mb-6 border-b border-brand-border dark:border-gray-700 pb-3">
        <button
          onClick={() => window.history.back()}
          className="absolute left-0 w-9 h-9 flex items-center justify-center rounded-full hover:bg-brand-border dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-brand-secondary dark:text-gray-400" />
        </button>
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-brand-success" />
          <span className="text-sm font-semibold text-brand-primary dark:text-gray-100">
            {expired ? 'Hold Expired' : 'Access Secured'}
          </span>
        </div>
      </div>

      {/* ── ACCESS SECURED badge ── */}
      <div className="flex justify-center mb-4">
        <div className={`flex items-center gap-2 text-xs font-semibold px-5 py-2 rounded-full shadow-sm ${
          expired 
            ? 'border-red-300 text-brand-danger bg-white/80 dark:bg-gray-800 dark:border-red-600' 
            : 'border-[#1F8A70] text-brand-success bg-white dark:bg-gray-800 dark:border-green-600'
        }`}>
          <span className={`w-2 h-2 rounded-full ${expired ? 'bg-brand-danger animate-pulse' : 'bg-brand-success animate-pulse'}`} />
          {expired ? 'HOLD EXPIRED' : 'ACCESS SECURED'}
        </div>
      </div>

      {/* ── Full-Circle Countdown Timer ── */}
      <div className="flex justify-center mb-6 select-none">
        <div className="relative" style={{ width: SIZE, height: SIZE }}>
          <svg
            width={SIZE}
            height={SIZE}
            className="absolute inset-0"
            style={{ transform: 'rotate(-90deg)' }}
          >
            {/* Background track – full grey circle */}
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="#E3E8EF"
              strokeWidth={STROKE}
              className="dark:stroke-gray-700"
            />
            {/* Animated progress ring */}
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke={ringColor}
              strokeWidth={STROKE + 1}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              style={{
                transition: 'stroke-dashoffset 0.9s linear, stroke 0.5s ease',
              }}
            />
          </svg>

          {/* Center labels */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
            <span className="text-[9px] font-semibold text-brand-secondary dark:text-gray-400 tracking-[0.28em] uppercase">
              Time Remaining
            </span>
            <span
              className="font-black leading-none tracking-tight tabular-nums"
              style={{
                fontSize: '3rem',
                color: ringColor,
                transition: 'color 0.5s',
              }}
            >
              {`${hours}:${minutes}:${seconds}`}
            </span>
            <span className="text-[9px] font-semibold text-brand-secondary tracking-[0.28em] uppercase">
              {expired ? 'Hold Expired' : `${holdDurationMinutes} min hold`}
            </span>
          </div>
        </div>
      </div>

      {/* ── Experience Card ── ENHANCED WITH DUAL MODE INFO */}
      <div className="bg-brand-card dark:bg-gray-800 rounded-xl shadow-card border border-brand-border dark:border-gray-700 p-4 mb-4">
        {/* Title + thumbnail */}
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-brand-primary dark:text-gray-100 leading-tight">
              {experience?.title || '—'}
            </h2>
            <p className="text-xs text-brand-secondary dark:text-gray-400 mt-0.5">
              {experience?.location || '—'}
            </p>
            <p className="text-[10px] text-brand-secondary dark:text-gray-400 mt-1">
              {experience?.category?.toUpperCase() || 'EXPERIENCE'}
            </p>
          </div>
          <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-brand-border dark:bg-gray-700">
            <img
              src={
                experience?.image
                  ? (experience.image.startsWith('/') ? experience.image : `/assets/experiences/${experience.image}`)
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      experience?.title || 'EX'
                    )}&background=E3E8EF&color=5F6C7B&size=56`
              }
              alt={experience?.title || 'Experience'}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="border-t border-brand-border dark:border-gray-700 my-4" />

        {/* ── Pricing Breakdown ── */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-brand-secondary dark:text-gray-400">Hold Token Paid</span>
            <span className="font-bold text-brand-primary">₹{holdTokenPaid.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-brand-border dark:border-gray-700">
            <span className="text-sm text-brand-secondary dark:text-gray-400">Balance Due</span>
            <span className={`font-bold ${hasSufficientBalance ? 'text-brand-primary' : 'text-brand-danger'}`}>
              ₹{balanceDue.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-brand-border dark:border-gray-700">
            <span className="text-sm font-semibold text-brand-secondary dark:text-gray-300">Total Price</span>
            <span className="text-xl font-black text-brand-primary">₹{parseFloat(experience.price || 0).toFixed(0)}</span>
          </div>
        </div>

        {/* ── Wallet Status ── */}
        <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
          <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-blue-800 dark:text-blue-200 font-medium">Wallet Balance</p>
            <p className={`text-sm font-bold ${hasSufficientBalance ? 'text-green-600 dark:text-green-400' : 'text-brand-danger'}`}>
              ₹{walletBalance.toFixed(2)}
              {walletBalance < balanceDue && (
                <span className="ml-1 text-[10px]">(Add Funds)</span>
              )}
            </p>
          </div>
        </div>

        {/* Booking Mode */}
        {experience.booking_mode && (
          <div className="mt-3 pt-3 border-t border-brand-border dark:border-gray-700">
            <span className="text-xs px-2 py-1 bg-brand-primary/10 text-brand-primary rounded-full">
              {experience.booking_mode === 'both' ? 'Hold Confirmed' : experience.booking_mode.toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* ── Disclaimer ── ENHANCED */}
      <div className="flex gap-2 mb-6 px-1">
        <span className="text-brand-secondary dark:text-gray-400 flex-shrink-0 leading-none mt-0.5 text-base">ⓘ</span>
        <p className="text-xs text-brand-secondary dark:text-gray-400 leading-relaxed">
          {expired 
            ? 'This hold has expired and the seat is now available to others.' 
            : `Your ₹${holdTokenPaid.toFixed(2)} hold token secures this seat. Confirm before timer expires to complete booking, or it auto-releases with full refund.`
          }
        </p>
      </div>

      {/* ── Confirm Booking ── ENHANCED */}
      <button
        onClick={handleConfirm}
        disabled={expired || !hasSufficientBalance}
        className={`w-full flex items-center justify-center gap-2 font-semibold py-4 rounded-lg text-base transition-all duration-200 shadow-md mb-3 ${
          expired || !hasSufficientBalance
            ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
            : 'bg-brand-success hover:bg-opacity-90 active:bg-opacity-80 text-white'
        }`}
      >
        <ShieldCheck className="w-5 h-5" />
        Confirm Booking (₹{balanceDue.toFixed(2)})
        <span>→</span>
      </button>

      {/* ── Release Hold ── */}
      {!expired && (
        <button
          onClick={handleRelease}
          className="w-full py-3 text-sm font-medium text-brand-secondary dark:text-gray-400 hover:text-brand-danger dark:hover:text-red-400 transition-colors rounded-lg hover:bg-brand-border dark:hover:bg-gray-700"
        >
          Release Hold (Refund Token)
        </button>
      )}
    </AppLayout>
  );
}

function DetailCell({ label, value }) {
  return (
    <div className="flex flex-col items-start">
      <span className="text-[10px] font-semibold text-brand-secondary dark:text-gray-400 uppercase tracking-wider mb-1">
        {label}
      </span>
      <span className="text-sm font-bold text-brand-primary dark:text-gray-100">{value}</span>
    </div>
  );
}
