import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    padding?: boolean;
}

export default function Card({ className, padding = true, ...props }: CardProps) {
    return (
        <div
            className={cn(
                'bg-surface-200 rounded-md shadow-card border border-neutral-200 overflow-hidden',
                padding && 'p-4',
                className
            )}
            {...props}
        />
    );
}
