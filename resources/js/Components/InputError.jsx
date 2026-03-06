import { AlertCircle } from 'lucide-react';

export default function InputError({ message, className = '', ...props }) {
    return message ? (
        <p {...props} className={'text-sm text-red-600 dark:text-red-400 flex items-center gap-2 ' + className}>
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{message}</span>
        </p>
    ) : null;
}
