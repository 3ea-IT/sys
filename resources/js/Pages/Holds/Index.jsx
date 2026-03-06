import AppLayout from "@/Layouts/AppLayout";
import { Link, router, usePage } from "@inertiajs/react";
import {
  ArrowLeft,
  Clock,
  ShieldCheck,
  AlertCircle,
  CheckCircle,
  XCircle,
  ListX,
  Zap,
  Timer,
  AlertTriangle,
  MapPin,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function HoldsIndex({ active = [], expiring = [], past = [], waitlist = [] }) {
  const [activeTab, setActiveTab] = useState("active");
  const [holdTimers, setHoldTimers] = useState({});

  useEffect(() => {
    const timers = {};
    active.forEach((hold) => {
      if (hold.expires_at) {
        const expires = new Date(hold.expires_at).getTime();
        const now = Date.now();
        timers[hold.id] = Math.max(0, Math.floor((expires - now) / 1000));
      }
    });
    setHoldTimers(timers);
  }, [active]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHoldTimers((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((key) => {
          updated[key] = Math.max(0, updated[key] - 1);
        });
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "—";
    }
  };

  const tabs = [
    { id: "active", label: "Active", count: active.length, icon: Clock },
    { id: "expiring", label: "Expiring Soon", count: expiring.length, icon: AlertTriangle },
    { id: "past", label: "Past", count: past.length, icon: CheckCircle },
    { id: "waitlist", label: "Waitlist", count: waitlist.length, icon: Zap },
  ];

  const HoldCard = ({ hold, type = "active" }) => {
    const experience = hold.experience || {};
    const secondsLeft = holdTimers[hold.id] || 0;
    const duration = experience.hold_duration || 30;
    const totalSeconds = duration * 60;
    const progress = (secondsLeft / totalSeconds) * 100;

    return (
      <Link
        href={`/holds/${hold.id}`}
        className="block bg-white dark:bg-gray-800 rounded-xl border border-brand-border dark:border-gray-700 hover:shadow-lg transition-all duration-200"
      >
        <div className="p-4 md:p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-bold text-base text-brand-primary dark:text-gray-100 line-clamp-1">
                {experience.title || "—"}
              </h3>
              <p className="text-xs text-brand-secondary dark:text-gray-400 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {experience.location || "—"}
              </p>
            </div>

            <div className="ml-2 flex-shrink-0">
              {type === "active" && (
                <span className="text-xs font-bold px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full whitespace-nowrap">
                  ACTIVE
                </span>
              )}
              {type === "expiring" && (
                <span className="text-xs font-bold px-2 py-1 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded-full whitespace-nowrap">
                  EXPIRING
                </span>
              )}
              {type === "past" && hold.status === "confirmed" && (
                <span className="text-xs font-bold px-2 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-full whitespace-nowrap">
                  CONFIRMED
                </span>
              )}
              {type === "past" && hold.status === "released" && (
                <span className="text-xs font-bold px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full whitespace-nowrap">
                  RELEASED
                </span>
              )}
              {type === "past" && hold.status === "expired" && (
                <span className="text-xs font-bold px-2 py-1 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded-full whitespace-nowrap">
                  EXPIRED
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between py-2 border-t border-b border-brand-border dark:border-gray-700">
            <span className="text-xs text-brand-secondary dark:text-gray-400">Price</span>
            <span className="font-bold text-brand-primary dark:text-gray-100">
              ₹{parseFloat(experience.price || 0).toFixed(0)}
            </span>
          </div>

          {type === "active" && (
            <div className="mt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-brand-secondary dark:text-gray-400 flex items-center gap-1">
                  <Timer className="w-3 h-3" />
                  Time Remaining
                </span>
                <span
                  className={`font-mono font-bold text-sm ${
                    secondsLeft > 300
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {formatTime(secondsLeft)}
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${
                    progress > 20
                      ? "bg-brand-success"
                      : progress > 10
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {type === "past" && (
            <div className="mt-3 text-xs text-brand-secondary dark:text-gray-400 flex items-center gap-2">
              <Calendar className="w-3 h-3" />
              {hold.status === "confirmed"
                ? `Confirmed on ${formatDate(hold.confirmed_at)}`
                : hold.status === "released"
                ? `Released on ${formatDate(hold.released_at)}`
                : `Expired on ${formatDate(hold.expired_at)}`}
            </div>
          )}

          {type === "expiring" && (
            <div className="mt-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Expires Soon
                </span>
                <span className="font-mono font-bold text-sm text-red-600 dark:text-red-400">
                  {formatTime(secondsLeft)}
                </span>
              </div>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                Confirm within {Math.ceil(secondsLeft / 60)} minutes
              </p>
            </div>
          )}

          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-brand-secondary dark:text-gray-400">
              {type === "active"
                ? "Click to confirm or release"
                : type === "past"
                ? "View details"
                : "Action required"}
            </span>
            <ChevronRight className="w-4 h-4 text-brand-secondary dark:text-gray-500" />
          </div>
        </div>
      </Link>
    );
  };

  const WaitlistCard = ({ item }) => {
    const experience = item.experience || {};
    const isOffered = item.status === "offered";
    const offerMinutesLeft = isOffered
      ? Math.max(0, Math.ceil((new Date(item.offer_expires_at) - Date.now()) / 60000))
      : 0;

    return (
      <div className="block bg-white dark:bg-gray-800 rounded-xl border border-brand-border dark:border-gray-700 p-4 md:p-5 hover:shadow-lg transition-all duration-200">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-bold text-base text-brand-primary dark:text-gray-100 line-clamp-1">
              {experience.title || "—"}
            </h3>
            <p className="text-xs text-brand-secondary dark:text-gray-400 mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {experience.location || "—"}
            </p>
          </div>

          {isOffered ? (
            <span className="text-xs font-bold px-2 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-full whitespace-nowrap ml-2">
              OFFERED
            </span>
          ) : (
            <span className="text-xs font-bold px-2 py-1 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 rounded-full whitespace-nowrap ml-2">
              IN QUEUE #{item.position}
            </span>
          )}
        </div>

        <div className="py-2 border-t border-brand-border dark:border-gray-700 mb-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-brand-primary dark:text-gray-100">
              Position in queue
            </span>
            <span className="text-xl font-black text-blue-600 dark:text-blue-400">#{item.position}</span>
          </div>
          <p className="text-xs text-brand-secondary dark:text-gray-400 mt-1">
            ₹{parseFloat(experience.price || 0).toFixed(0)}
          </p>
        </div>

        {isOffered && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-3 mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-green-700 dark:text-green-300">
                Slot Offered!
              </span>
              <span className="text-xs font-bold text-green-600 dark:text-green-400">
                {offerMinutesLeft}m left
              </span>
            </div>
            <p className="text-xs text-green-600 dark:text-green-400">
              Accept this offer to create a new hold. Offer expires in {offerMinutesLeft} minutes.
            </p>
          </div>
        )}

        <div className="flex gap-2">
          {isOffered ? (
            <>
              <button
                onClick={() => console.log("Accept offer", item.id)}
                className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Accept Offer
              </button>
              <button
                onClick={() => console.log("Reject offer", item.id)}
                className="flex-1 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm font-semibold rounded-lg transition-colors"
              >
                Reject
              </button>
            </>
          ) : (
            <div className="w-full text-center py-2 text-sm text-brand-secondary dark:text-gray-400">
              Waiting for available seat...
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <AppLayout>
      <div className="sticky top-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm z-30 -mx-4 -mt-6 px-4">
        {/* <div className="flex items-center justify-center mb-4 pb-3 border-b border-brand-border dark:border-gray-700">
          <Link
            href="/dashboard"
            className="absolute left-0 w-9 h-9 flex items-center justify-center rounded-full hover:bg-brand-border dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-brand-secondary dark:text-gray-400" />
          </Link>
          <h1 className="text-lg font-bold text-brand-primary dark:text-gray-100">
            My Holds & Queue
          </h1>
        </div> */}

        <div className="flex gap-2 overflow-x-auto pb-3 my-4 -mx-4 px-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all flex-shrink-0 ${
                  isActive
                    ? "bg-brand-primary text-white shadow-md"
                    : "bg-brand-border dark:bg-gray-700 text-brand-secondary dark:text-gray-400 hover:bg-opacity-80"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.count > 0 && (
                  <span className={`ml-1 font-bold text-xs ${
                    isActive ? "bg-white/30" : "bg-gray-300 dark:bg-gray-600"
                  } px-1.5 py-0.5 rounded-full`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3 pb-20">
        {activeTab === "active" && (
          <>
            {active.length > 0 ? (
              active.map((hold) => <HoldCard key={hold.id} hold={hold} type="active" />)
            ) : (
              <EmptyState
                icon={Clock}
                title="No Active Holds"
                description="You don't have any active holds. Explore experiences and secure your spot!"
                actionLabel="Explore Experiences"
                actionHref="/explore"
              />
            )}
          </>
        )}

        {activeTab === "expiring" && (
          <>
            {expiring.length > 0 ? (
              expiring.map((hold) => <HoldCard key={hold.id} hold={hold} type="expiring" />)
            ) : (
              <EmptyState
                icon={AlertCircle}
                title="No Expiring Holds"
                description="Great! You don't have any holds expiring soon."
              />
            )}
          </>
        )}

        {activeTab === "past" && (
          <>
            {past.length > 0 ? (
              past.map((hold) => <HoldCard key={hold.id} hold={hold} type="past" />)
            ) : (
              <EmptyState
                icon={ListX}
                title="No Past Holds"
                description="Your hold history will appear here."
              />
            )}
          </>
        )}

        {activeTab === "waitlist" && (
          <>
            {waitlist.length > 0 ? (
              waitlist.map((item) => <WaitlistCard key={item.id} item={item} />)
            ) : (
              <EmptyState
                icon={Zap}
                title="Not in Any Queue"
                description="When you run out of available seats, you'll be added to the waitlist automatically."
                actionLabel="Browse Experiences"
                actionHref="/explore"
              />
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}

function EmptyState({ icon: Icon, title, description, actionLabel, actionHref }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 bg-brand-border dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-brand-secondary dark:text-gray-400" />
      </div>
      <h2 className="text-lg font-bold text-brand-primary dark:text-gray-100 mb-2">{title}</h2>
      <p className="text-sm text-brand-secondary dark:text-gray-400 max-w-xs mb-4">
        {description}
      </p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="px-4 py-2 bg-brand-primary hover:bg-opacity-90 text-white font-semibold rounded-lg transition-all"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
