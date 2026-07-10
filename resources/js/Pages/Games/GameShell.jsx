import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Trophy } from 'lucide-react';

export default function GameShell({ title, description, children, points = 0 }) {
    return (
        <AppLayout>
            <div className="mx-auto flex max-w-5xl flex-col gap-4 px-1 py-2 sm:px-2 md:px-4">
                <div className="rounded-3xl border border-brand-border/70 bg-white p-4 shadow-sm sm:p-6">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <Link href="/play-and-earn" className="rounded-full bg-brand-primary/10 p-2 text-brand-primary">
                                <ArrowLeft size={18} />
                            </Link>
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-primary">Play & Earn</p>
                                <h1 className="text-xl font-bold text-gray-900">{title}</h1>
                            </div>
                        </div>
                        {points > 0 && (
                            <div className="rounded-full bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700">
                                <span className="mr-1 inline-flex items-center"><Trophy size={14} /></span>
                                {points} pts reward
                            </div>
                        )}
                    </div>
                    {description && <p className="mt-3 text-sm text-gray-600">{description}</p>}
                </div>
                <div className="rounded-3xl border border-brand-border/70 bg-white p-3 shadow-sm sm:p-4">
                    {children}
                </div>
            </div>
        </AppLayout>
    );
}
