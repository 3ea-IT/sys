import { Link } from '@inertiajs/react';
import { Gamepad2, Sparkles, X } from 'lucide-react';
import { useState } from 'react';

export default function PlayEarnFab() {
    const [open, setOpen] = useState(false);

    return (
        <div className="fixed bottom-24 right-4 z-[60] sm:bottom-28 sm:right-6">
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setOpen((prev) => !prev)}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-blue-600 text-white shadow-2xl transition hover:scale-105 active:scale-95"
                    aria-label="Play and earn"
                >
                    {open ? <X size={22} /> : <Gamepad2 size={22} />}
                </button>

                {open && (
                    <div className="absolute bottom-16 right-0 w-64 rounded-3xl border border-brand-border/60 bg-white p-3 shadow-2xl">
                        <div className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-brand-primary to-blue-600 px-3 py-2 text-white">
                            <Sparkles size={16} />
                            <div>
                                <p className="text-sm font-semibold">Play & Earn</p>
                                <p className="text-[11px] text-blue-100">Pick a game and start earning</p>
                            </div>
                        </div>
                        <div className="mt-3 space-y-2">
                            <Link href="/play-and-earn" onClick={() => setOpen(false)} className="flex items-center justify-between rounded-2xl border border-brand-border/50 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-blue-50">
                                <span>Browse all games</span>
                                <span className="text-brand-primary">→</span>
                            </Link>
                            <Link href="/games/tictactoe" onClick={() => setOpen(false)} className="flex items-center justify-between rounded-2xl border border-brand-border/50 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-blue-50">
                                <span>Tic Tac Toe</span>
                                <span className="text-brand-primary">▶</span>
                            </Link>
                            <Link href="/games/snake" onClick={() => setOpen(false)} className="flex items-center justify-between rounded-2xl border border-brand-border/50 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-blue-50">
                                <span>Snake</span>
                                <span className="text-brand-primary">▶</span>
                            </Link>
                            <Link href="/games/tetris" onClick={() => setOpen(false)} className="flex items-center justify-between rounded-2xl border border-brand-border/50 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-blue-50">
                                <span>Tetris</span>
                                <span className="text-brand-primary">▶</span>
                            </Link>
                            <Link href="/games/quizz" onClick={() => setOpen(false)} className="flex items-center justify-between rounded-2xl border border-brand-border/50 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-blue-50">
                                <span>Quiz</span>
                                <span className="text-brand-primary">▶</span>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
