import React from 'react';
import { LucideIcon } from 'lucide-react';
import Button from './Button';
import { cn } from '@/lib/utils/cn';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
    icon?: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
}

export default function EmptyState({
    className,
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction,
    ...props
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center p-8 text-center bg-surface-200 rounded-md border border-neutral-100 shadow-card',
                className
            )}
            {...props}
        >
            {Icon && (
                <div className="mb-4 p-4 rounded-full bg-neutral-50 text-neutral-400">
                    <Icon size={48} strokeWidth={1.5} />
                </div>
            )}
            <h3 className="text-heading font-bold text-neutral-900 mb-2">{title}</h3>
            <p className="text-body text-neutral-500 max-w-[280px] mb-6">{description}</p>
            {actionLabel && onAction && (
                <Button variant="primary" onClick={onAction} className="rounded-pill">
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}
