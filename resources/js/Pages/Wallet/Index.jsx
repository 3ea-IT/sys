import AppLayout from '@/Layouts/AppLayout';
import { Link, usePage } from '@inertiajs/react';
import { Plus, ArrowDownToLine, ChevronRight, Armchair, RefreshCw, Building2, Gift, Wallet, ArrowLeft } from 'lucide-react';

/* ========================= HELPERS ========================= */

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount ?? 0);
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
    ' • ' +
    d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function txMeta(tx) {
  const desc = (tx.description ?? '').toLowerCase();

  if (desc.includes('hold') || desc.includes('seat') || desc.includes('vip')) {
    return {
      Icon: Armchair,
      iconBg: 'bg-brand-primary/10',
      iconColor: 'text-brand-primary',
      tag: tx.type === 'debit' ? 'HOLDING' : 'SETTLED',
    };
  }

  if (desc.includes('refund') || desc.includes('release')) {
    return {
      Icon: RefreshCw,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      tag: 'REFUNDED',
    };
  }

  if (desc.includes('wallet') || desc.includes('transfer')) {
    return {
      Icon: Building2,
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-600',
      tag: 'BANK TRANSFER',
    };
  }

  return {
    Icon: Armchair,
    iconBg: 'bg-brand-primary/10',
    iconColor: 'text-brand-primary',
    tag: tx.type === 'debit' ? 'SETTLED' : 'CREDITED',
  };
}

/* ========================= COMPONENTS ========================= */

function BalanceCard({ balance }) {
  return (
    <div className="relative rounded-lg p-6 mb-4 overflow-hidden bg-[#0F2A44]">
      <div className="absolute right-4 top-4 opacity-40 mt-2">
        <Wallet className="w-16 h-16 text-white" />
      </div>

      <p className="text-[10px] tracking-widest text-white/60 uppercase mb-1">
        Total Available Balance
      </p>

      <p className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
        {formatCurrency(balance)}
      </p>

      <div className="flex gap-2">
        <button className="flex-1 flex items-center justify-center gap-1.5 bg-white text-brand-primary text-xs font-semibold py-2.5 rounded-lg">
          <Plus className="w-4 h-4" />
          Add Money
        </button>
        <button className="flex-1 flex items-center justify-center gap-1.5 bg-white text-brand-primary text-xs font-semibold py-2.5 rounded-lg">
          <ArrowDownToLine className="w-4 h-4" />
          Withdraw
        </button>
      </div>
    </div>
  );
}

function MembershipBar({ points = 450, target = 500 }) {
  const pct = Math.min(100, Math.round((points / target) * 100));
  const remaining = target - points;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 shadow-card">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-yellow-400 flex items-center justify-center">
            <span className="text-white text-xs font-bold">G</span>
          </div>
          <span className="text-sm font-bold text-brand-primary dark:text-gray-100">Gold Member</span>
        </div>

        <span className="text-xs text-brand-secondary dark:text-gray-400 font-semibold">
          {points} / {target} PTS
        </span>
      </div>

      <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
        <div
          className="h-full bg-yellow-400 rounded-full"
          style={{ width: `₹{pct}%` }}
        />
      </div>

      <p className="text-[11px] text-brand-secondary dark:text-gray-400">
        Only {remaining} more points to unlock <span className="font-semibold text-brand-primary dark:text-blue-400">Platinum Benefits</span>
      </p>
    </div>
  );
}

function TransactionRow({ tx }) {
  const { Icon, iconBg, iconColor, tag } = txMeta(tx);
  const isCredit = tx.type === 'credit';
  const amountStr = (isCredit ? '+' : '-') + formatCurrency(tx.amount);

  return (
    <div className="flex items-center gap-3 py-3 border-b dark:border-gray-700 last:border-0">
      <div className={`w-9 h-9 rounded-full ${iconBg.includes('brand-primary') ? 'dark:bg-blue-900/20' : iconBg.includes('green') ? 'dark:bg-green-900/30' : iconBg.includes('gray') ? 'dark:bg-gray-700' : 'dark:opacity-50'} ${iconBg} flex items-center justify-center`}>
        <Icon className={`w-4 h-4 ${iconColor}`} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-brand-primary dark:text-gray-100 truncate">
          {tx.description}
        </p>
        <p className="text-[11px] text-brand-secondary dark:text-gray-400">
          {formatDate(tx.created_at)}
        </p>
      </div>

      <div className="text-right">
        <p className={`text-sm font-bold ${isCredit ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
          {amountStr}
        </p>
        <p className="text-[10px] uppercase text-brand-secondary dark:text-gray-400">{tag}</p>
      </div>
    </div>
  );
}

function ReferralBanner() {
  return (
    <div className="relative rounded-lg p-4 sm:p-5 mt-4 overflow-hidden bg-[#0F2A44]">
      <div className="absolute right-4 bottom-0 opacity-20">
        <Gift className="w-16 h-16 text-white mb-5" />
      </div>

      <div className="relative z-10 max-w-[70%]">
        <p className="text-base font-bold text-white mb-1">
          Refer a friend & get ₹25
        </p>
        <p className="text-[11px] text-white/70">
          Share your code with friends and get credits for your next reservation.
        </p>
      </div>
    </div>
  );
}

/* ========================= PAGE ========================= */

export default function Index({ wallet, transactions = [] }) {
  const { auth } = usePage().props;

  const points = Math.floor((wallet?.balance ?? 0) / 5);
  const pointsCapped = Math.min(points, 500);

  return (
    <AppLayout>

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => window.history.back()}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Wallet & Rewards
        </h1>
      </div>

      {/* BALANCE */}
      <BalanceCard balance={wallet?.balance} />

      {/* MEMBERSHIP */}
      <MembershipBar points={pointsCapped} target={500} />

      {/* RECENT ACTIVITY */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold text-brand-primary dark:text-gray-100">Recent Activity</h2>
          <Link href="/wallet/transactions" className="text-xs text-brand-secondary dark:text-gray-400">
            View All
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg px-4 shadow-card">
          {transactions.length === 0 ? (
            <div className="py-8 text-center text-sm text-brand-secondary dark:text-gray-400">
              No transactions yet.
            </div>
          ) : (
            transactions.slice(0, 5).map((tx) => (
              <TransactionRow key={tx.id} tx={tx} />
            ))
          )}
        </div>
      </div>

      {/* REFERRAL */}
      <ReferralBanner />

    </AppLayout>
  );
}
