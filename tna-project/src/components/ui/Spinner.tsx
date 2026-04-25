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
        md: 'h-8 w-8 border-2',
        lg: 'h-14 w-14 border-4',
    };

    return (
        <div className={cn('flex flex-col items-center justify-center gap-3', className)} {...props}>
            <div
                className={cn(
                    'animate-spin rounded-full',
                    'border-neutral-200 border-t-primary',
                    sizes[size]
                )}
                role="status"
                aria-label={label ?? 'loading'}
            />
            {label && (
                <p className="text-caption text-neutral-400 font-medium animate-pulse">{label}</p>
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
