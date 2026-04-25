import React from 'react';
import { Icon } from '@phosphor-icons/react';
import Button from './Button';
import { cn } from '@/lib/utils/cn';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
    icon?: Icon;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    compact?: boolean;
}

/**
 * SPATIAL EmptyState — illustration placeholder + title + subtitle + optional CTA.
 * compact=true for inline table/section zero-data scenarios.
 */
export default function EmptyState({
    className,
    icon: IconComponent,
    title,
    description,
    actionLabel,
    onAction,
    compact = false,
    ...props
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center text-center',
                compact
                    ? 'py-12 px-6'
                    : 'p-10 bg-surface-200 rounded-md border border-neutral-200 shadow-card',
                className
            )}
            {...props}
        >
            {IconComponent && (
                <div className={cn(
                    'mb-5 rounded-full flex items-center justify-center',
                    compact ? 'p-4 bg-neutral-100' : 'p-6 bg-neutral-50 border border-neutral-200'
                )}>
                    <IconComponent
                        size={compact ? 36 : 48}
                        className="text-neutral-300"
                        weight="thin"
                    />
                </div>
            )}
            <h3 className="text-subheading font-bold text-neutral-700 mb-2">{title}</h3>
            <p className="text-body text-neutral-400 max-w-[280px] leading-relaxed mb-6">
                {description}
            </p>
            {actionLabel && onAction && (
                <Button variant="primary" size="md" onClick={onAction}>
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}
