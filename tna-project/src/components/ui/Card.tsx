import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    padding?: boolean;
}

export default function Card({ className, padding = true, ...props }: CardProps) {
    return (
        <div
            className={cn(
                'bg-card rounded-lg shadow-card border border-divider overflow-hidden',
                padding && 'p-6',
                className
            )}
            {...props}
        />
    );
}
