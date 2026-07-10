import AppLayout from '@/Layouts/AppLayout';
import { Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Coins, Gamepad2, Sparkles } from 'lucide-react';
import { playEarnGames } from './playEarnData';

export default function PlayAndEarn() {
    const { auth } = usePage().props;
    const balance = auth?.user?.wallet?.balance ?? auth?.user?.wallet_balance ?? 0;

    return (
        <AppLayout>
            <div className="mx-auto flex max-w-5xl flex-col gap-6 px-1 py-2 sm:px-2 md:px-4">
                <div className="rounded-3xl border border-brand-border/70 bg-white p-4 shadow-sm sm:p-6">
                    <div className="flex items-center gap-3">
                        <Link href="/dashboard" className="rounded-full bg-brand-primary/10 p-2 text-brand-primary">
                            <ArrowLeft size={18} />
                        </Link>
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-primary">Play & Earn</p>
                            <h1 className="text-2xl font-bold text-gray-900">Fun games, real rewards</h1>
                        </div>
                    </div>

                    <div className="mt-4 flex flex-col gap-3 rounded-2xl bg-gradient-to-r from-brand-primary to-blue-600 p-4 text-white sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="rounded-2xl bg-white/20 p-3">
                                <Coins size={22} />
                            </div>
                            <div>
                                <p className="text-sm text-blue-100">Available wallet balance</p>
                                <p className="text-2xl font-bold">₹{Number(balance).toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="rounded-2xl bg-white/15 px-3 py-2 text-sm text-blue-50">
                            Play, win, and convert rewards to your wallet.
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {playEarnGames.map((game) => (
                        <Link
                            key={game.id}
                            href={game.route}
                            className="group rounded-3xl border border-brand-border/60 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                        >
                            <div className={`rounded-2xl bg-gradient-to-r ${game.accent} p-4 text-white`}>
                                <div className="flex items-center justify-between">
                                    <div className="rounded-2xl bg-white/20 p-2">
                                        <Gamepad2 size={20} />
                                    </div>
                                    <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">+{game.points} pts</span>
                                </div>
                                <h2 className="mt-4 text-xl font-semibold">{game.title}</h2>
                                <p className="mt-2 text-sm text-blue-50">{game.description}</p>
                            </div>
                            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                                <span>Open game</span>
                                <span className="flex items-center gap-1 font-semibold text-brand-primary">
                                    Play now <Sparkles size={15} />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
