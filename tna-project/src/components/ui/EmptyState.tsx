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
                'flex flex-col items-center justify-center text-center animate-in fade-in duration-standard',
                compact
                    ? 'py-12 px-6'
                    : 'p-12 bg-card rounded-xl border border-divider shadow-card',
                className
            )}
            {...props}
        >
            {IconComponent && (
                <div className={cn(
                    'mb-6 rounded-full flex items-center justify-center transition-transform hover:scale-110 duration-fast',
                    compact ? 'p-4 bg-neutral-50' : 'p-8 bg-background border border-divider shadow-inner'
                )}>
                    <IconComponent
                        size={compact ? 32 : 56}
                        className="text-text-placeholder"
                        weight="thin"
                    />
                </div>
            )}
            <h3 className="text-xl font-bold text-text-primary mb-2">{title}</h3>
            <p className="text-sm text-text-secondary max-w-[320px] leading-relaxed mb-8">
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
