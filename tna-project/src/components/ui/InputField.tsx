'use client';

import React, { forwardRef } from 'react';
import { Icon } from '@phosphor-icons/react';
import { cn } from '@/lib/utils/cn';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: Icon;
    error?: string;
    label?: string;
    helperText?: string;
    inputClassName?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
    ({ icon: IconComponent, error, label, helperText, className = '', inputClassName = '', ...props }, ref) => {
        return (
            <div className="w-full space-y-2">
                {label && (
                    <label className="block text-sm font-bold text-text-primary ps-1">
                        {label}
                    </label>
                )}
                <div className="relative group">
                    <input
                        ref={ref}
                        className={cn(
                            'w-full h-input bg-surface-200 border border-divider rounded-sm px-4 text-start text-text-primary placeholder:text-text-placeholder focus:outline-none transition-all duration-fast',
                            error
                                ? 'border-error ring-1 ring-error/20'
                                : 'group-focus-within:border-primary group-focus-within:ring-2 group-focus-within:ring-primary/10',
                            IconComponent && 'ps-12',
                            inputClassName,
                            className
                        )}
                        {...props}
                    />
                    {IconComponent && (
                        <div className={cn(
                            'absolute start-4 top-1/2 -translate-y-1/2 text-text-placeholder pointer-events-none transition-colors duration-fast',
                            !error && 'group-focus-within:text-primary'
                        )}>
                            <IconComponent size={20} weight="regular" />
                        </div>
                    )}
                </div>
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

InputField.displayName = 'InputField';
export default InputField;
