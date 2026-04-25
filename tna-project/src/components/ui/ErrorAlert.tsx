import React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface ErrorAlertProps extends React.HTMLAttributes<HTMLDivElement> {
    message: string;
}

export default function ErrorAlert({ className, message, ...props }: ErrorAlertProps) {
    return (
        <div
            className={cn(
                'flex items-start gap-3 p-4 bg-error-bg border border-error-border rounded-md text-error shadow-sm',
                className
            )}
            {...props}
        >
            <AlertCircle className="shrink-0 mt-0.5" size={18} />
            <div className="text-sm font-medium">{message}</div>
        </div>
    );
}
