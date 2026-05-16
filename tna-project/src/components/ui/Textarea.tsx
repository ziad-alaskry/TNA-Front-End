'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, helperText, className = '', ...props }, ref) => {
        return (
            <div className="w-full space-y-2">
                {label && (
                    <label className="block text-sm font-bold text-text-primary ps-1">
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    className={cn(
                        'w-full min-h-[80px] bg-surface border border-divider rounded-sm px-4 py-3 text-start text-text-primary placeholder:text-text-placeholder focus:outline-none transition-all duration-fast resize-y shadow-sm',
                        error
                            ? 'border-error ring-1 ring-error/20'
                            : 'focus:border-primary focus:ring-2 focus:ring-primary/10',
                        className
                    )}
                    {...props}
                />
                {error && (
                    <p className="text-xs text-error ps-1 font-medium">{error}</p>
                )}
                {!error && helperText && (
                    <p className="text-xs text-text-placeholder ps-1">{helperText}</p>
                )}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';
export default Textarea;