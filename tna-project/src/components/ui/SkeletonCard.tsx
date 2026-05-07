import React from 'react';
import { cn } from '@/lib/utils/cn';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

/** Single animated shimmer bar */
function Shimmer({ className, ...props }: SkeletonProps) {
    return (
        <div
            className={cn('animate-pulse rounded bg-neutral-100/80', className)}
            {...props}
        />
    );
}

/** Dashboard stat card skeleton */
export function SkeletonStatCard({ className }: SkeletonProps) {
    return (
        <div className={cn('bg-card rounded-lg shadow-card border border-divider p-6', className)}>
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <Shimmer className="h-3 w-2/3 mb-4" />
                    <Shimmer className="h-8 w-1/2" />
                </div>
                <Shimmer className="h-12 w-12 rounded-md" />
            </div>
        </div>
    );
}

/** Generic content card skeleton */
export function SkeletonCard({ className, ...props }: SkeletonProps) {
    return (
        <div
            className={cn('bg-card rounded-lg shadow-card border border-divider p-6', className)}
            {...props}
        >
            <div className="flex items-center gap-4 mb-6">
                <Shimmer className="h-12 w-12 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2.5">
                    <Shimmer className="h-4 w-3/4" />
                    <Shimmer className="h-3 w-1/2" />
                </div>
            </div>
            <div className="space-y-3">
                <Shimmer className="h-3 w-full" />
                <Shimmer className="h-3 w-5/6" />
                <Shimmer className="h-3 w-4/6" />
            </div>
            <div className="mt-8 flex justify-between items-center">
                <Shimmer className="h-10 rounded-full w-28" />
                <Shimmer className="h-4 w-20" />
            </div>
        </div>
    );
}

/** Table row skeleton */
export function SkeletonTableRow({ cols = 4 }: { cols?: number }) {
    return (
        <tr className="border-b border-divider">
            {Array.from({ length: cols }).map((_, i) => (
                <td key={i} className="px-4 py-3">
                    <Shimmer className="h-4 w-full" />
                </td>
            ))}
        </tr>
    );
}

/** Stats grid skeleton (4 cards) */
export function SkeletonStatsGrid({ count = 4 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonStatCard key={i} />
            ))}
        </div>
    );
}

export default SkeletonCard;
