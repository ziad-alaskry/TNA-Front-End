import React from 'react';
import { cn } from '@/lib/utils/cn';

export default function SkeletonCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                'bg-surface-200 rounded-md shadow-card border border-neutral-100 p-4 animate-pulse',
                className
            )}
            {...props}
        >
            <div className="h-4 bg-neutral-200 rounded-xs w-3/4 mb-4" />
            <div className="space-y-2">
                <div className="h-3 bg-neutral-100 rounded-xs w-full" />
                <div className="h-3 bg-neutral-100 rounded-xs w-5/6" />
                <div className="h-3 bg-neutral-100 rounded-xs w-4/6" />
            </div>
            <div className="mt-6 flex justify-between items-center">
                <div className="h-8 bg-neutral-200 rounded-pill w-24" />
                <div className="h-4 bg-neutral-100 rounded-xs w-16" />
            </div>
        </div>
    );
}
