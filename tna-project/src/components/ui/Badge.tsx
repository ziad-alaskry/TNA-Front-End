import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'success' | 'pending' | 'warning' | 'unlinked' | 'error';
}

export default function Badge({ className, variant = 'unlinked', ...props }: BadgeProps) {
    const variants = {
        success: 'bg-success-bg text-success',
        pending: 'bg-pending-bg text-pending',
        warning: 'bg-warning-bg text-warning',
        unlinked: 'bg-neutral-100 text-neutral-500',
        error: 'bg-error-bg text-error',
    };

    return (
        <div
            className={cn(
                'inline-flex items-center rounded-xs px-2 py-1 text-label font-bold',
                variants[variant],
                className
            )}
            {...props}
        />
    );
}
