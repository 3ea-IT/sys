import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Trophy } from 'lucide-react';

export default function GameShell({ title, description, children, points = 0 }) {
    return (
        <AppLayout>
            <div className="flex items-center gap-3 mb-6">
                <Link
                    href="/play-and-earn"
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
                {points > 0 && (
                    <div className="ml-auto flex items-center gap-1 rounded-full bg-brand-primary/10 dark:bg-blue-900/20 px-3 py-1.5 text-xs font-semibold text-brand-primary dark:text-blue-400">
                        <Trophy size={14} />
                        {points} pts reward
                    </div>
                )}
            </div>
            {description && (
                <p className="mb-4 text-sm text-brand-secondary dark:text-gray-400">{description}</p>
            )}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-card">
                {children}
            </div>
        </AppLayout>
    );
}
