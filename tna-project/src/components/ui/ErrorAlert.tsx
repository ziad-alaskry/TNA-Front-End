import React from 'react';
import { WarningCircle, Icon } from '@phosphor-icons/react';
import { cn } from '@/lib/utils/cn';

export interface ErrorAlertProps extends React.HTMLAttributes<HTMLDivElement> {
    message: string;
    title?: string;
    onRetry?: () => void;
    retryLabel?: string;
}

/**
 * SPATIAL error alert — color-error-bg / color-error-border tokens.
 * Supports optional retry action and custom title.
 */
export default function ErrorAlert({
    className,
    message,
    title,
    onRetry,
    retryLabel = 'إعادة المحاولة',
    ...props
}: ErrorAlertProps) {
    return (
        <div
            role="alert"
            className={cn(
                'flex items-start gap-3 p-4 rounded-md border',
                'bg-error-bg border-error-border text-error',
                'shadow-sm',
                className
            )}
            {...props}
        >
            <WarningCircle className="shrink-0 mt-0.5" size={20} weight="fill" />
            <div className="flex-1 min-w-0">
                {title && (
                    <p className="text-label font-bold mb-0.5">{title}</p>
                )}
                <p className="text-label font-medium leading-relaxed">{message}</p>
            </div>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="shrink-0 text-label font-bold border border-error rounded-xs px-3 py-1 hover:bg-error hover:text-white transition-colors duration-200"
                >
                    {retryLabel}
                </button>
            )}
        </div>
    );
}

/** Full-page error state — for API failures at page level */
export function PageError({
    message = 'حدث خطأ أثناء تحميل البيانات.',
    onRetry,
}: {
    message?: string;
    onRetry?: () => void;
}) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
            <div className="mb-4 p-5 rounded-full bg-error-bg">
                <WarningCircle size={48} className="text-error" weight="fill" />
            </div>
            <h3 className="text-heading font-bold text-neutral-900 mb-2">خطأ في التحميل</h3>
            <p className="text-body text-neutral-500 max-w-xs mb-6">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="px-6 h-btn-md bg-btn-primary text-white font-bold rounded-pill shadow-btn hover:opacity-95 transition-all"
                >
                    إعادة المحاولة
                </button>
            )}
        </div>
    );
}
