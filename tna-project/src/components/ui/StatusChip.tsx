import React from 'react';
import { cn } from '@/lib/utils/cn';

export type StatusType = 'success' | 'pending' | 'unlinked' | 'warning' | 'error';

export interface StatusChipProps extends React.HTMLAttributes<HTMLDivElement> {
    status: StatusType;
    label: string;
}

export default function StatusChip({ className, status, label, ...props }: StatusChipProps) {
    const statusStyles = {
        success: 'bg-success-light text-success border-success/10',
        pending: 'bg-pending-light text-pending border-pending/10',
        unlinked: 'bg-neutral-50 text-text-placeholder border-divider',
        warning: 'bg-warning-light text-warning border-warning/10',
        error: 'bg-error-light text-error border-error/10',
    };

    return (
        <div
            className={cn(
                'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold transition-all border',
                statusStyles[status],
                className
            )}
            {...props}
        >
            <span className={cn(
                'h-2 w-2 rounded-full shadow-inner',
                status === 'success' && 'bg-success',
                status === 'pending' && 'bg-pending',
                status === 'unlinked' && 'bg-text-placeholder',
                status === 'warning' && 'bg-warning',
                status === 'error' && 'bg-error'
            )} />
            <span className="uppercase tracking-wider">{label}</span>
        </div>
    );
}
