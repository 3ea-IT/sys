import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Armchair, RefreshCw, Building2, Wallet } from 'lucide-react';
import { useMemo, useState } from 'react';

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
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) +
    ' • ' +
    d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function txMeta(tx) {
  const desc = (tx.description ?? '').toLowerCase();

  if (desc.includes('hold') || desc.includes('seat') || desc.includes('vip')) {
    return {
      Icon: Armchair,
      iconBg: 'bg-brand-primary/10 dark:bg-blue-900/20',
      iconColor: 'text-brand-primary dark:text-blue-400',
      tag: tx.type === 'debit' ? 'HOLDING' : 'SETTLED',
    };
  }

  if (desc.includes('refund') || desc.includes('release')) {
    return {
      Icon: RefreshCw,
      iconBg: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400',
      tag: 'REFUNDED',
    };
  }

  if (desc.includes('wallet') || desc.includes('transfer')) {
    return {
      Icon: Building2,
      iconBg: 'bg-gray-100 dark:bg-gray-700',
      iconColor: 'text-gray-600 dark:text-gray-300',
      tag: 'BANK TRANSFER',
    };
  }

  return {
    Icon: Armchair,
    iconBg: 'bg-brand-primary/10 dark:bg-blue-900/20',
    iconColor: 'text-brand-primary dark:text-blue-400',
    tag: tx.type === 'debit' ? 'SETTLED' : 'CREDITED',
  };
}

/* ========================= COMPONENTS ========================= */

function TransactionRow({ tx }) {
  const { Icon, iconBg, iconColor, tag } = txMeta(tx);
  const isCredit = tx.type === 'credit';
  const amountStr = (isCredit ? '+' : '-') + formatCurrency(tx.amount);

  return (
    <div className="flex items-center gap-3 py-3 border-b dark:border-gray-700 last:border-0">
      <div className={`w-9 h-9 rounded-full ${iconBg} flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-4 h-4 ${iconColor}`} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-brand-primary dark:text-gray-100 truncate">
          {tx.description}
        </p>
        <p className="text-[11px] text-brand-secondary dark:text-gray-400">
          {formatDate(tx.date)}
        </p>
        {tx.booking_id && (
          <p className="text-[11px] text-brand-secondary dark:text-gray-400">
            {tx.booking_type ? `${tx.booking_type} · ` : ''}Booking #{tx.booking_id}
            {tx.booking_status ? ` · ${tx.booking_status}` : ''}
          </p>
        )}
      </div>

      <div className="text-right flex-shrink-0">
        <p className={`text-sm font-bold ${isCredit ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
          {amountStr}
        </p>
        <p className="text-[10px] uppercase text-brand-secondary dark:text-gray-400">{tag}</p>
      </div>
    </div>
  );
}

/* ========================= PAGE ========================= */

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'credit', label: 'Credited' },
  { key: 'debit', label: 'Debited' },
];

export default function Transactions({ wallet, transactions = [] }) {
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return transactions;
    return transactions.filter((tx) => tx.type === filter);
  }, [transactions, filter]);

  return (
    <AppLayout>
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/wallet"
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Wallet Logs
        </h1>
      </div>

      {/* BALANCE STRIP */}
      <div className="flex items-center gap-3 bg-[#0F2A44] rounded-lg p-4 mb-4">
        <Wallet className="w-8 h-8 text-white/70 flex-shrink-0" />
        <div>
          <p className="text-[10px] tracking-widest text-white/60 uppercase">Available Balance</p>
          <p className="text-xl font-bold text-white">{formatCurrency(wallet?.balance)}</p>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex gap-2 mb-3">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              filter === f.key
                ? 'bg-brand-primary text-white'
                : 'bg-white dark:bg-gray-800 text-brand-secondary dark:text-gray-400 border border-brand-border dark:border-gray-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* FULL LOG LIST */}
      <div className="bg-white dark:bg-gray-800 rounded-lg px-4 shadow-card mb-6">
        {filtered.length === 0 ? (
          <div className="py-10 text-center text-sm text-brand-secondary dark:text-gray-400">
            No {filter === 'all' ? '' : filter} transactions yet.
          </div>
        ) : (
          filtered.map((tx) => <TransactionRow key={tx.id} tx={tx} />)
        )}
      </div>
    </AppLayout>
  );
}
