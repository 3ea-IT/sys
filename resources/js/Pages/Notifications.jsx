import AppLayout from "@/Layouts/AppLayout";
import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Star,
  ShieldAlert,
  MessageSquare,
  Dot,
  ArrowLeft
} from "lucide-react";

export default function Notifications() {
  const { auth } = usePage().props;
  const user = auth?.user;
  const [activeTab, setActiveTab] = useState("all");

  const notifications = [
    {
      type: "warning",
      title: "Hold Expiry Warning",
      description:
        "Your reservation for Wimbledon Finals - Row A expires in 14:59.",
      time: "2m ago",
      urgent: true,
      category: "urgent"
    },
    {
      type: "success",
      title: "Payment Confirmed",
      description:
        "Success! Your seat for The Eras Tour (Dublin) is secured. Your QR code is ready.",
      time: "1h ago",
      category: "all"
    },
    {
      type: "priority",
      title: "Priority Access Open",
      description:
        "VIP Early Access is now open for F1 Monaco Grand Prix 2026. Select your seats before the general public.",
      time: "3h ago",
      category: "all"
    },
    {
      type: "security",
      title: "New Device Login",
      description:
        "A new login was detected on an iPhone 15 Pro in London, UK. If this wasn't you, please secure your account.",
      time: "5h ago",
      category: "all"
    },
    {
      type: "info",
      title: "How was your experience?",
      description:
        "You recently attended Hamilton at the Apollo. We'd love your feedback on the seating.",
      time: "1d ago",
      category: "all"
    },
    {
      type: "info",
      title: "Seat Transfer Complete",
      description:
        "2 tickets for NBA All-Stars have been successfully transferred to Sarah Jenkins.",
      time: "1d ago",
      category: "all"
    }
  ];

  const filtered =
    activeTab === "all"
      ? notifications
      : notifications.filter((n) => n.category === activeTab);

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Notifications
        </h1>
        <div className="ml-auto flex items-center gap-1">
          <button className="text-xs text-brand-primary dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
            Clear All
          </button>
          <Link
            href="/profile"
            className="w-10 h-10 rounded-full bg-brand-border dark:bg-gray-700 flex items-center justify-center hover:shadow-md transition-shadow flex-shrink-0"
          >
            <span className="text-sm font-semibold text-brand-primary dark:text-gray-100">
              {user?.name?.charAt(0) || 'U'}
            </span>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar">
        <Tab label="All" active={activeTab === "all"} onClick={() => setActiveTab("all")} />
        <Tab label="Unread" active={activeTab === "unread"} onClick={() => setActiveTab("unread")} />
        <Tab label="Urgent" active={activeTab === "urgent"} onClick={() => setActiveTab("urgent")} />
        <Tab label="Promos" active={activeTab === "promos"} onClick={() => setActiveTab("promos")} />
      </div>

      {/* Notifications List */}
      <div className="space-y-4 pb-20">
        {filtered.map((n, index) => (
          <NotificationCard key={index} data={n} />
        ))}
      </div>
    </AppLayout>
  );
}

/* ================= Components ================= */

function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 text-xs rounded-full whitespace-nowrap font-semibold transition ${
        active
          ? "bg-brand-primary text-white"
          : "bg-brand-border dark:bg-gray-700 text-brand-secondary dark:text-gray-400"
      }`}
    >
      {label}
    </button>
  );
}

function NotificationCard({ data }) {
  const iconMap = {
    warning: <AlertTriangle className="text-brand-danger" size={18} />,
    success: <CheckCircle2 className="text-brand-success" size={18} />,
    priority: <Star className="text-brand-warning" size={18} />,
    security: <ShieldAlert className="text-brand-primary" size={18} />,
    info: <MessageSquare className="text-brand-secondary" size={18} />
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card border border-brand-border dark:border-gray-700 p-4">
      <div className="flex gap-3">
        <div className="w-9 h-9 rounded-full bg-brand-background dark:bg-gray-700 flex items-center justify-center">
          {iconMap[data.type]}
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-brand-primary dark:text-gray-100">
              {data.title}
            </h3>
            <div className="flex items-center">
              <span className="text-[10px] text-brand-secondary dark:text-gray-400">
                {data.time}
              </span>
              <Dot size={20} className="text-brand-primary dark:text-blue-400" />
            </div>
          </div>

          <p className="text-xs text-brand-secondary dark:text-gray-400 mt-1 leading-relaxed">
            {data.description}
          </p>

          {data.urgent && (
            <div className="mt-3 flex gap-2">
              <button className="px-4 py-1.5 text-xs rounded-lg bg-brand-primary text-white font-semibold">
                Confirm Now
              </button>
              <button className="px-4 py-1.5 text-xs rounded-lg bg-brand-border dark:bg-gray-700 text-brand-secondary dark:text-gray-400 font-semibold">
                Extend
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
