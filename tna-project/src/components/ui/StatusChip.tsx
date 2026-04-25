import React from 'react';
import { cn } from '@/lib/utils/cn';

export type StatusType = 'success' | 'pending' | 'unlinked' | 'warning' | 'error';

export interface StatusChipProps extends React.HTMLAttributes<HTMLDivElement> {
    status: StatusType;
    label: string;
}

export default function StatusChip({ className, status, label, ...props }: StatusChipProps) {
    const statusStyles = {
        success: 'bg-success-bg text-success',
        pending: 'bg-pending-bg text-pending',
        unlinked: 'bg-neutral-100 text-neutral-500',
        warning: 'bg-warning-bg text-warning',
        error: 'bg-error-bg text-error',
    };

    return (
        <div
            className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1 rounded-xs text-label font-bold transition-all shadow-sm',
                statusStyles[status],
                className
            )}
            {...props}
        >
            <span className={cn(
                'h-1.5 w-1.5 rounded-full',
                status === 'success' && 'bg-success',
                status === 'pending' && 'bg-pending',
                status === 'unlinked' && 'bg-neutral-400',
                status === 'warning' && 'bg-warning',
                status === 'error' && 'bg-error'
            )} />
            {label}
        </div>
    );
}
