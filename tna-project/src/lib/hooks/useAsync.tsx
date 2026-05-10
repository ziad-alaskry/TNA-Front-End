import React, { useState, useEffect, useCallback } from 'react';
import ErrorAlert from '@/components/ui/ErrorAlert';
import EmptyState from '@/components/ui/EmptyState';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import type { AppError } from '@/lib/api/types';

interface AsyncState<T> {
    data: T | null;
    isLoading: boolean;
    error: AppError | null;
    refetch: () => Promise<void>;
}

/**
 * Hook for handling async data fetching with built-in UI state management.
 * Handles error types: network, unauthorized (401), forbidden (403), not found (404), conflict (409).
 */
export function useAsync<T>(
    fetchFn: () => Promise<T>,
    initialData: T | null = null
): AsyncState<T> {
    const [data, setData] = useState<T | null>(initialData);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<AppError | null>(null);

    const refetch = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await fetchFn();
            setData(result);
        } catch (err) {
            setError(err as AppError);
        } finally {
            setIsLoading(false);
        }
    }, [fetchFn]);

    // Auto-fetch on mount
    useEffect(() => {
        refetch();
    }, [refetch]);

    return { data, isLoading, error, refetch };
}

/**
 * Get user-friendly error message based on status code
 */
export function getErrorMessage(error: AppError): string {
    if (!error.status) return error.message || 'Network connection failed';

    switch (error.status) {
        case 401:
            return 'Authentication required. Please log in.';
        case 403:
            return "You don't have permission to access this resource.";
        case 404:
            return 'The requested resource was not found.';
        case 409:
            return error.message || 'The action cannot be completed due to a conflict.';
        default:
            return error.message || 'An unexpected error occurred';
    }
}

/**
 * Props for AsyncStateRenderer component
 */
interface AsyncStateRendererProps<T> {
    data: T | null;
    isLoading: boolean;
    error: AppError | null;
    renderData: (data: T) => React.ReactNode;
    emptyState?: {
        title: string;
        description: string;
        cta?: string;
        onCtaClick?: () => void;
    };
    skeletonCount?: number;
}

/**
 * Component that renders appropriate UI based on async state.
 * Use in pages: <AsyncStateRenderer data={data} isLoading={isLoading} error={error} renderData={...} />
 */
export function AsyncStateRenderer<T>({
    data,
    isLoading,
    error,
    renderData,
    emptyState,
    skeletonCount = 3,
}: AsyncStateRendererProps<T>) {
    // Loading state
    if (isLoading) {
        return (
            <div className="space-y-4">
                {Array.from({ length: skeletonCount }).map((_, i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>
        );
    }

    // Network/Unauthorized/Forbidden error state
    if (error) {
        const isForbidden = error.status === 403;
        const isNotFound = error.status === 404;
        const isUnauthorized = error.status === 401;
        const isConflict = error.status === 409;

        // Special handling for 401 - will redirect via interceptor, show minimal message
        if (isUnauthorized) {
            return null;
        }

        // Conflict errors - show inline with explanation
        if (isConflict) {
            const messages = error.errors ? Object.values(error.errors).flat() : [getErrorMessage(error)];
            return (
                <div className="max-w-lg mx-auto py-8">
                    <ErrorAlert
                        title="Action Cannot Be Completed"
                        message={messages.join(' ')}
                        onRetry={undefined}
                    />
                </div>
            );
        }

        // Forbidden error
        if (isForbidden) {
            return (
                <div className="flex min-h-[40vh] items-center justify-center">
                    <ErrorAlert
                        title="Access Denied"
                        message={getErrorMessage(error)}
                        retryLabel="Go Back"
                        onRetry={() => window.history.back()}
                    />
                </div>
            );
        }

        // Not found error
        if (isNotFound) {
            return (
                <div className="flex min-h-[40vh] items-center justify-center">
                    <EmptyState
                        title="Not Found"
                        description={getErrorMessage(error)}
                        actionLabel="Go Back"
                        onAction={() => window.history.back()}
                    />
                </div>
            );
        }

        // Generic error
        return (
            <div className="flex min-h-[40vh] items-center justify-center">
                <ErrorAlert
                    title="Error Loading Data"
                    message={getErrorMessage(error)}
                    onRetry={undefined}
                />
            </div>
        );
    }

    // Empty state
    if (!data || (Array.isArray(data) && data.length === 0)) {
        if (emptyState) {
            return (
                <EmptyState
                    title={emptyState.title}
                    description={emptyState.description}
                    actionLabel={emptyState.cta}
                    onAction={emptyState.onCtaClick}
                />
            );
        }
        return null;
    }

    // Success - render data
    return <>{renderData(data)}</>;
}