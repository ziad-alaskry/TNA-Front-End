'use client';

import React, { forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: LucideIcon;
    error?: string;
    label?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
    ({ icon: Icon, error, label, className = '', ...props }, ref) => {
        return (
            <div className="w-full space-y-2">
                {label && (
                    <label className="block text-label font-bold text-neutral-700 pr-1">
                        {label}
                    </label>
                )}
                <div className="relative group">
                    <input
                        ref={ref}
                        dir="rtl"
                        className={cn(
                            'w-full h-input bg-surface-200 border rounded-sm px-4 text-start text-neutral-900 placeholder:text-neutral-400 focus:outline-none transition-all',
                            error 
                                ? 'border-error ring-1 ring-error/20' 
                                : 'border-neutral-300 group-focus-within:border-primary group-focus-within:ring-2 group-focus-within:ring-primary/20',
                            Icon && 'ps-12',
                            className
                        )}
                        {...props}
                    />
                    {Icon && (
                        <div className={cn(
                            'absolute start-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none transition-colors',
                            !error && 'group-focus-within:text-primary'
                        )}>
                            <Icon size={22} strokeWidth={1.5} />
                        </div>
                    )}
                </div>
                {error && <p className="text-xs text-error pr-1 font-medium">{error}</p>}
            </div>
        );
    }
);

InputField.displayName = 'InputField';

export default InputField;
