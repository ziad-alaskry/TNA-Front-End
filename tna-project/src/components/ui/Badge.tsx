import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'success' | 'pending' | 'warning' | 'unlinked' | 'error';
}

export default function Badge({ className, variant = 'unlinked', ...props }: BadgeProps) {
    const variants = {
        success: 'bg-success-light text-success',
        pending: 'bg-pending-light text-pending',
        warning: 'bg-warning-light text-warning',
        unlinked: 'bg-neutral-50 text-text-placeholder border border-divider',
        error: 'bg-error-light text-error',
    };

    return (
        <div
            className={cn(
                'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider',
                variants[variant],
                className
            )}
            {...props}
        />
    );
}
