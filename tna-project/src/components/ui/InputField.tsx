'use client';

import React, { forwardRef } from 'react';
import { Icon } from '@phosphor-icons/react';
import { cn } from '@/lib/utils/cn';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: Icon;
    error?: string;
    label?: string;
    helperText?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
    ({ icon: IconComponent, error, label, helperText, className = '', ...props }, ref) => {
        return (
            <div className="w-full space-y-1.5">
                {label && (
                    <label className="block text-label font-bold text-neutral-700 ps-1">
                        {label}
                    </label>
                )}
                <div className="relative group">
                    <input
                        ref={ref}
                        className={cn(
                            'w-full h-input bg-surface-200 border rounded-sm px-4 text-start text-neutral-900 placeholder:text-neutral-400 focus:outline-none transition-all duration-200',
                            error
                                ? 'border-error ring-1 ring-error/20'
                                : 'border-neutral-300 group-focus-within:border-primary group-focus-within:ring-2 group-focus-within:ring-primary/15',
                            IconComponent && 'ps-12',
                            className
                        )}
                        {...props}
                    />
                    {IconComponent && (
                        <div className={cn(
                            'absolute start-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none transition-colors duration-200',
                            !error && 'group-focus-within:text-primary'
                        )}>
                            <IconComponent size={22} weight="regular" />
                        </div>
                    )}
                </div>
                {error && (
                    <p className="text-caption text-error ps-1 font-medium">{error}</p>
                )}
                {!error && helperText && (
                    <p className="text-caption text-neutral-400 ps-1">{helperText}</p>
                )}
            </div>
        );
    }
);

InputField.displayName = 'InputField';
export default InputField;
