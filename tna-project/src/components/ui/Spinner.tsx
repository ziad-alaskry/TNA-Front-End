import React from 'react';
import { cn } from '@/lib/utils/cn';

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: 'sm' | 'md' | 'lg';
    label?: string;
}

/**
 * Branded spinner — SPATIAL: cyan border / navy top-border.
 * Full-page centered when no className is provided.
 */
export default function Spinner({ className, size = 'md', label, ...props }: SpinnerProps) {
    const sizes = {
        sm: 'h-5 w-5 border-2',
        md: 'h-10 w-10 border-2',
        lg: 'h-16 w-16 border-4',
    };

    return (
        <div className={cn('flex flex-col items-center justify-center gap-4', className)} {...props}>
            <div
                className={cn(
                    'animate-spin rounded-full',
                    'border-divider border-t-primary',
                    sizes[size]
                )}
                role="status"
                aria-label={label ?? 'loading'}
            />
            {label && (
                <p className="text-xs text-text-placeholder font-bold uppercase tracking-widest animate-pulse ps-1">{label}</p>
            )}
        </div>
    );
}

/** Full-page centered spinner — use inside async page wrappers */
export function PageSpinner({ label }: { label?: string }) {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Spinner size="lg" label={label} />
        </div>
    );
}
