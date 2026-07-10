import AppLayout from '@/Layouts/AppLayout';
import { Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Coins, Gamepad2, Sparkles, Wallet } from 'lucide-react';
import { playEarnGames } from './playEarnData';

export default function PlayAndEarn() {
    const { auth } = usePage().props;
    const balance = auth?.user?.wallet?.balance ?? auth?.user?.wallet_balance ?? 0;

    return (
        <AppLayout>
            {/* HEADER */}
            <div className="flex items-center gap-3 mb-6">
                <Link
                    href="/dashboard"
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Play & Earn
                </h1>
            </div>

            {/* BALANCE CARD */}
            <div className="relative rounded-lg p-6 mb-6 overflow-hidden bg-[#0F2A44]">
                <div className="absolute right-4 top-4 opacity-40 mt-2">
                    <Coins className="w-16 h-16 text-white" />
                </div>

                <p className="text-[10px] tracking-widest text-white/60 uppercase mb-1">
                    Available wallet balance
                </p>

                <p className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
                    ₹{Number(balance).toLocaleString()}
                </p>

                <div className="flex items-center gap-2 text-xs text-white/70">
                    <Sparkles className="w-3.5 h-3.5" />
                    Play, win, and convert rewards to your wallet.
                </div>
            </div>

            {/* GAMES GRID */}
            <div className="mb-3">
                <h2 className="text-sm font-bold text-brand-primary dark:text-gray-100 mb-2">
                    Choose a game
                </h2>

                <div className="grid gap-3 sm:grid-cols-2">
                    {playEarnGames.map((game) => (
                        <Link
                            key={game.id}
                            href={game.route}
                            className="group flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-card hover:-translate-y-0.5 transition-transform"
                        >
                            <div className="w-12 h-12 rounded-full bg-brand-primary/10 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                                <Gamepad2 className="w-6 h-6 text-brand-primary dark:text-blue-400" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-brand-primary dark:text-gray-100 truncate">
                                    {game.title}
                                </p>
                                <p className="text-[11px] text-brand-secondary dark:text-gray-400 truncate">
                                    {game.description}
                                </p>
                            </div>

                            <span className="flex-shrink-0 rounded-full bg-brand-primary/10 dark:bg-blue-900/20 px-2.5 py-1 text-[11px] font-semibold text-brand-primary dark:text-blue-400">
                                +{game.points} pts
                            </span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* WALLET BANNER */}
            <Link
                href="/wallet"
                className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-card"
            >
                <div className="w-10 h-10 rounded-full bg-brand-primary/10 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                    <Wallet className="w-5 h-5 text-brand-primary dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-brand-primary dark:text-gray-100">
                        View wallet & logs
                    </p>
                    <p className="text-[11px] text-brand-secondary dark:text-gray-400">
                        See every credit and debit from your games.
                    </p>
                </div>
            </Link>
        </AppLayout>
    );
}
