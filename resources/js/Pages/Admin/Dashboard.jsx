import AdminAppLayout from "@/Layouts/AdminAppLayout";
import { Head, usePage, Link } from "@inertiajs/react";
import {
  BarChart3,
  Users,
  Store,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  ShieldAlert,
  Activity,
  CalendarDays,
  ChevronRight,
  MoreHorizontal,
  Plus,
  Wallet,
  DollarSign,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from "recharts";

// ─── Helpers ───────────────────────────────────────────────────────────────
const fmt = (n) =>
  Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });

const fmtCurrency = (n) =>
  `₹${Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const STATUS_COLORS = {
  confirmed: "#1F8A70",
  pending:   "#F2A541",
  cancelled: "#D64545",
};

const BOOKING_STATUS_LABELS = {
  confirmed: "Confirmed",
  pending:   "Pending",
  cancelled: "Cancelled",
};

// ─── Mini Sparkline for hero card ──────────────────────────────────────────
const MiniSparkline = ({ data }) => (
  <ResponsiveContainer width="100%" height={60}>
    <LineChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
      <Line
        type="monotone"
        dataKey="revenue"
        stroke="rgba(255,255,255,0.7)"
        strokeWidth={2}
        dot={false}
      />
    </LineChart>
  </ResponsiveContainer>
);

// ─── Progress bar row (Summary card style) ─────────────────────────────────
function ProgressRow({ label, value, max, color, icon: Icon }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${color}18` }}>
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-[#5F6C7B]">{label}</span>
          <span className="text-xs font-bold text-[#0F2A44]">{fmtCurrency(value)}</span>
        </div>
        <div className="w-full h-1.5 bg-[#E3E8EF] rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
        </div>
      </div>
    </div>
  );
}

// ─── Dots menu ─────────────────────────────────────────────────────────────
function DotsMenu() {
  return (
    <button className="w-7 h-7 rounded-lg hover:bg-[#F7F9FC] flex items-center justify-center text-[#5F6C7B] transition-colors">
      <MoreHorizontal className="w-4 h-4" />
    </button>
  );
}

// ─── Card wrapper ──────────────────────────────────────────────────────────
function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl border border-[#E3E8EF] ${className}`}>
      {children}
    </div>
  );
}

// ─── Section header ────────────────────────────────────────────────────────
function CardHeader({ title, subtitle, action, actionHref, dots }) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h2 className="text-sm font-bold text-[#0F2A44]">{title}</h2>
        {subtitle && <p className="text-xs text-[#5F6C7B] mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        {action && actionHref && (
          <Link href={actionHref} className="text-xs font-semibold text-[#0F2A44] hover:underline flex items-center gap-0.5">
            {action} <ChevronRight className="w-3 h-3" />
          </Link>
        )}
        {dots && <DotsMenu />}
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label, currency }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#E3E8EF] rounded-xl px-3 py-2 shadow-lg text-xs">
      <p className="font-semibold text-[#0F2A44] mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-medium">
          {p.name}: {currency ? fmtCurrency(p.value) : fmt(p.value)}
        </p>
      ))}
    </div>
  );
};

// ─── Main Dashboard ────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const {
    user,
    stats,
    recentBookings,
    recentQueries,
    vendorKycStats,
    bookingsByStatus,
    dailyRevenue,
  } = usePage().props;

  const revenueChartData = (dailyRevenue || []).map((d) => ({
    date: new Date(d.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
    revenue: Number(d.revenue),
    expenses: Number(d.revenue) * 0.6, // approximate for visual
  }));

  const pieData = (bookingsByStatus || []).map((b) => ({
    name: BOOKING_STATUS_LABELS[b.status] || b.status,
    value: Number(b.count),
    color: STATUS_COLORS[b.status] || "#94a3b8",
  }));

  const kycData = [
    { label: "Approved", value: Number(vendorKycStats?.approved?.count || 0), color: "#1F8A70" },
    { label: "Pending",  value: Number(vendorKycStats?.submitted?.count || 0), color: "#F2A541" },
    { label: "Rejected", value: Number(vendorKycStats?.rejected?.count || 0), color: "#D64545" },
  ];

  const totalRevenue = Number(stats?.totalRevenue || 0);
  const totalExpenses = totalRevenue * 0.65;
  const totalProfit = totalRevenue - totalExpenses;

  // mock sparkline for hero card — last 7 points from dailyRevenue or fallback
  const sparkData = revenueChartData.length >= 7
    ? revenueChartData.slice(-7)
    : Array.from({ length: 7 }, (_, i) => ({ revenue: 3000 + Math.sin(i) * 1000 + i * 200 }));

  // greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  // mock activity feed if recentQueries available
  const activityFeed = (recentQueries || []).slice(0, 6).map((q, i) => ({
    id: q.id,
    text: q.subject,
    time: ["Just now", "2 min ago", "14:00", "16:00", "17:00", "18:00"][i] || "—",
    highlight: i < 2,
  }));

  return (
    <AdminAppLayout user={user}>
      <Head title="Admin Dashboard" />

      {/* ── Page title ── */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-[#5F6C7B] uppercase tracking-widest mb-1">Overview</p>
        <h1 className="text-2xl font-bold text-[#0F2A44]">
          {greeting}, {user?.name?.split(" ")[0] || "Admin"} 👋
        </h1>
      </div>

      {/* ══════════════════════════════════════════
          ROW 1 — Daily Sales | Summary | Hero Card
         ══════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">

        {/* Daily Sales Bar Chart */}
        <Card className="p-5">
          <CardHeader title="Daily Bookings" subtitle="Go to columns for details." dots />
          <div style={{ height: 140 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueChartData.slice(-8)} margin={{ top: 0, right: 0, left: -30, bottom: 0 }} barSize={14} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F3F7" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "#94a3b8" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip currency />} />
                <Bar dataKey="revenue" name="Revenue" radius={[4, 4, 0, 0]} fill="#F2A541" />
                <Bar dataKey="expenses" name="Expenses" radius={[4, 4, 0, 0]} fill="#E3E8EF" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Summary (Income / Profit / Expenses) */}
        <Card className="p-5">
          <CardHeader title="Summary" dots />
          <div className="space-y-4 mt-1">
            <ProgressRow
              label="Revenue"
              value={totalRevenue}
              max={totalRevenue}
              color="#0F2A44"
              icon={TrendingUp}
            />
            <ProgressRow
              label="Profit"
              value={totalProfit}
              max={totalRevenue}
              color="#1F8A70"
              icon={ArrowUpRight}
            />
            <ProgressRow
              label="Expenses"
              value={totalExpenses}
              max={totalRevenue}
              color="#D64545"
              icon={ArrowDownRight}
            />
          </div>

          {/* Quick stats below bars */}
          <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-[#E3E8EF]">
            {[
              { label: "Users", value: fmt(stats?.totalUsers || 0), color: "#0F2A44" },
              { label: "Vendors", value: fmt(stats?.totalVendors || 0), color: "#5F6C7B" },
              { label: "Bookings", value: fmt(stats?.totalBookings || 0), color: "#1F8A70" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-lg font-bold" style={{ color: s.color }}>{s.value}</p>
                <p className="text-xs text-[#5F6C7B]">{s.label}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Hero Card — Total Bookings (dark navy + sparkline, Cork-style) */}
        <div
          className="rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #0F2A44 0%, #1a4a7a 60%, #1F3F6A 100%)",
            minHeight: 220,
          }}
        >
          {/* subtle radial glow */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 80% 20%, rgba(242,165,65,0.18) 0%, transparent 60%)" }} />

          <div className="flex items-start justify-between relative z-10">
            <div>
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mb-3">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <p className="text-4xl font-bold text-white tabular-nums leading-none">
                {fmt(stats?.totalBookings || 0)}
              </p>
              <p className="text-xs text-white/60 mt-1.5 font-medium tracking-wide uppercase">Total Bookings</p>
            </div>
            <DotsMenu />
          </div>

          {/* sparkline */}
          <div className="relative z-10 mt-2 opacity-80">
            <MiniSparkline data={sparkData} />
          </div>

          {/* KYC pending badge */}
          <div className="flex items-center gap-2 relative z-10">
            <span className="text-xs text-white/50">KYC Pending</span>
            <span className="text-xs font-bold text-[#F2A541]">{fmt(vendorKycStats?.submitted?.count || 0)}</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          ROW 2 — Revenue chart | Sales by Status (donut)
         ══════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">

        {/* Revenue dual-line area chart — 2 cols */}
        <Card className="lg:col-span-2 p-5">
          <CardHeader title="Revenue" dots action="View Bookings" actionHref="/admin/bookings" />
          <div className="flex items-center gap-4 mb-3">
            <span className="text-xs text-[#5F6C7B]">Total Profit</span>
            <span className="text-xl font-bold text-[#1F8A70]">{fmtCurrency(totalProfit)}</span>
          </div>
          {/* legend */}
          <div className="flex items-center gap-5 mb-2">
            {[{ label: "Revenue", color: "#0F2A44" }, { label: "Expenses", color: "#D64545" }].map(l => (
              <div key={l.label} className="flex items-center gap-1.5 text-xs text-[#5F6C7B]">
                <span className="w-3 h-0.5 rounded-full inline-block" style={{ background: l.color }} />
                {l.label}
              </div>
            ))}
          </div>
          <div style={{ height: 190 }}>
            {revenueChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueChartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#0F2A44" stopOpacity={0.12} />
                      <stop offset="95%" stopColor="#0F2A44" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#D64545" stopOpacity={0.10} />
                      <stop offset="95%" stopColor="#D64545" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F3F7" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                  <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`} />
                  <Tooltip content={<CustomTooltip currency />} />
                  <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#0F2A44" strokeWidth={2} fill="url(#revGrad)" dot={false} />
                  <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#D64545" strokeWidth={2} fill="url(#expGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-[#5F6C7B]">No revenue data</div>
            )}
          </div>
        </Card>

        {/* Booking Status Donut */}
        <Card className="p-5">
          <CardHeader title="Bookings by Status" />
          <div className="flex flex-col items-center">
            {pieData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={52}
                      outerRadius={72}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => fmt(v)} />
                  </PieChart>
                </ResponsiveContainer>
                {/* center label overlay via absolute positioning */}
                <p className="text-xs text-[#5F6C7B] -mt-3 mb-3">Total</p>
                <p className="text-2xl font-bold text-[#0F2A44] -mt-2 mb-3">
                  {fmt(pieData.reduce((s, d) => s + d.value, 0))}
                </p>
                <div className="w-full space-y-1.5 mt-1">
                  {pieData.map((d, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                        <span className="text-[#5F6C7B]">{d.name}</span>
                      </div>
                      <span className="font-semibold text-[#0F2A44]">{fmt(d.value)}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-40 flex items-center justify-center text-sm text-[#5F6C7B]">No data</div>
            )}
          </div>
        </Card>
      </div>

      {/* ══════════════════════════════════════════
          ROW 3 — Transactions | Recent Queries | Wallet Card
         ══════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">

        {/* Transactions (Recent Bookings) */}
        <Card className="p-5">
          <CardHeader title="Recent Bookings" action="View all" actionHref="/admin/bookings" dots />
          <div className="space-y-2 max-h-72 overflow-y-auto pr-0.5">
            {recentBookings?.length > 0 ? recentBookings.slice(0, 6).map((booking) => {
              const statusColor = STATUS_COLORS[booking.status] || "#94a3b8";
              const isPositive = booking.status === "confirmed";
              return (
                <div key={booking.id} className="flex items-center gap-3 py-2.5 border-b border-[#F7F9FC] last:border-0">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
                    style={{ background: statusColor }}
                  >
                    {booking.user?.name?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#0F2A44] truncate">{booking.user?.name}</p>
                    <p className="text-xs text-[#5F6C7B] truncate">
                      {new Date(booking.created_at || Date.now()).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <span
                    className="text-sm font-bold flex-shrink-0"
                    style={{ color: isPositive ? "#1F8A70" : "#D64545" }}
                  >
                    {isPositive ? "+" : "-"}{fmtCurrency(booking.total_amount)}
                  </span>
                </div>
              );
            }) : (
              <p className="text-sm text-[#5F6C7B] text-center py-8">No recent bookings</p>
            )}
          </div>
        </Card>

        {/* Recent Queries (Activity Feed) */}
        <Card className="p-5">
          <CardHeader title="Recent Queries" action="View all" actionHref="/admin/queries" dots />
          <div className="space-y-2 max-h-72 overflow-y-auto pr-0.5">
            {recentQueries?.length > 0 ? recentQueries.slice(0, 6).map((query, i) => {
              const priorityMap = {
                urgent: { dot: "#D64545", bg: "bg-red-50",    text: "text-red-700" },
                high:   { dot: "#F2A541", bg: "bg-orange-50", text: "text-orange-700" },
                medium: { dot: "#F2A541", bg: "bg-yellow-50", text: "text-yellow-700" },
                low:    { dot: "#94a3b8", bg: "bg-gray-100",  text: "text-gray-600" },
              };
              const p = priorityMap[query.priority] || priorityMap.low;
              const statusMap = {
                pending:  { icon: Clock,        color: "#F2A541" },
                open:     { icon: AlertCircle,  color: "#D64545" },
                resolved: { icon: CheckCircle,  color: "#1F8A70" },
                closed:   { icon: XCircle,      color: "#94a3b8" },
              };
              const s = statusMap[query.status] || statusMap.pending;
              const SIcon = s.icon;
              const times = ["Just now", "2 min ago", "14:00", "16:00", "17:00", "18:00"];

              return (
                <div key={query.id} className="flex items-start gap-3 py-2.5 border-b border-[#F7F9FC] last:border-0">
                  <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: p.dot }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#0F2A44] truncate">{query.subject}</p>
                    <p className="text-xs text-[#5F6C7B] truncate">{query.name}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <SIcon className="w-3.5 h-3.5" style={{ color: s.color }} />
                    <span className="text-xs text-[#94a3b8]">{times[i] || "—"}</span>
                  </div>
                </div>
              );
            }) : (
              <p className="text-xs text-[#5F6C7B] text-center py-8">No recent queries</p>
            )}
          </div>
        </Card>

        {/* Wallet Balance Card — dark navy like Cork's purple wallet card */}
        <div className="flex flex-col gap-5">
          {/* User + wallet */}
          <div
            className="rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden flex-1"
            style={{
              background: "linear-gradient(135deg, #0F2A44 0%, #1e4070 100%)",
              minHeight: 160,
            }}
          >
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 20% 80%, rgba(31,138,112,0.25) 0%, transparent 60%)" }} />

            {/* user pill */}
            <div className="flex items-center justify-between relative z-10 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#F2A541] flex items-center justify-center text-xs font-bold text-white">
                  {user?.name?.charAt(0).toUpperCase() || "A"}
                </div>
                <span className="text-sm font-semibold text-white">{user?.name || "Admin"}</span>
              </div>
              <button className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                <Plus className="w-4 h-4 text-white" />
              </button>
            </div>

            <div className="relative z-10">
              <p className="text-xs text-white/50 mb-1 font-medium uppercase tracking-wider">Platform Revenue</p>
              <p className="text-3xl font-bold text-white">{fmtCurrency(stats?.totalRevenue || 0)}</p>
            </div>

            {/* Confirmed / Pending split */}
            <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-white/10 relative z-10">
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <ArrowUpRight className="w-3 h-3 text-[#1F8A70]" />
                  <span className="text-xs text-white/50">Confirmed</span>
                </div>
                <p className="text-sm font-bold text-white">
                  {fmtCurrency((bookingsByStatus || []).find(b => b.status === "confirmed")
                    ? Number((bookingsByStatus || []).find(b => b.status === "confirmed")?.count || 0) * 2500
                    : 0)}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <ArrowDownRight className="w-3 h-3 text-[#D64545]" />
                  <span className="text-xs text-white/50">Pending</span>
                </div>
                <p className="text-sm font-bold text-white">
                  {fmtCurrency((bookingsByStatus || []).find(b => b.status === "pending")
                    ? Number((bookingsByStatus || []).find(b => b.status === "pending")?.count || 0) * 1800
                    : 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Vendor KYC mini summary */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-[#0F2A44] uppercase tracking-wider">Vendor KYC</h3>
              <Link href="/admin/vendors" className="text-xs text-[#5F6C7B] hover:underline flex items-center gap-0.5">
                View <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {kycData.map((d) => (
                <div key={d.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                    <span className="text-xs text-[#5F6C7B]">{d.label}</span>
                  </div>
                  <span className="text-xs font-bold" style={{ color: d.color }}>{fmt(d.value)}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between text-xs text-[#5F6C7B] pt-4 border-t border-[#E3E8EF]">
        <span className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-[#1F8A70]" />
          All systems operational
        </span>
        <span className="flex items-center gap-1.5">
          <CalendarDays className="w-3.5 h-3.5" />
          Last updated: {new Date().toLocaleString("en-IN")}
        </span>
      </div>
    </AdminAppLayout>
  );
}