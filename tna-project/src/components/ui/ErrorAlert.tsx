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
                'flex items-start gap-4 p-5 rounded-lg border animate-in fade-in slide-in-from-top-1 duration-fast',
                'bg-error-light border-error/20 text-error',
                'shadow-sm',
                className
            )}
            {...props}
        >
            <WarningCircle className="shrink-0 mt-0.5" size={22} weight="fill" />
            <div className="flex-1 min-w-0">
                {title && (
                    <p className="text-sm font-bold mb-1">{title}</p>
                )}
                <p className="text-sm font-medium leading-relaxed">{message}</p>
            </div>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="shrink-0 text-xs font-bold border border-error rounded-md px-4 py-1.5 hover:bg-error hover:text-white transition-all duration-fast active:scale-95"
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
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center animate-in fade-in duration-standard">
            <div className="mb-6 p-6 rounded-full bg-error-light shadow-inner">
                <WarningCircle size={56} className="text-error" weight="fill" />
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-3">خطأ في التحميل</h3>
            <p className="text-base text-text-secondary max-w-sm mb-8 leading-relaxed">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="px-8 h-12 bg-primary-gradient text-white font-bold rounded-full shadow-button hover:brightness-110 transition-all active:scale-95"
                >
                    إعادة المحاولة
                </button>
            )}
        </div>
    );
}
