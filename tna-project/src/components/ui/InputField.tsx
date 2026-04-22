'use client';

import React, { forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: LucideIcon;
    error?: string;
    label?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
    ({ icon: Icon, error, label, className = '', ...props }, ref) => {
        return (
            <div className="w-full space-y-1">
                {label && <label className="block text-sm font-medium text-gray-700 mb-1 inline-block">{label}</label>}
                <div className="relative group">
                    <input
                        ref={ref}
                        dir="rtl"
                        className={`w-full h-14 bg-white border ${error ? 'border-danger' : 'border-tna-gray-200 group-focus-within:border-primary'
                            } rounded-md px-4 py-2 text-start text-tna-gray-900 placeholder:text-tna-gray-400 focus:outline-none transition-all ${Icon ? 'ps-12' : ''
                            } ${className}`}
                        {...props}
                    />
                    {Icon && (
                        <div className="absolute start-4 top-1/2 -translate-y-1/2 text-tna-gray-400 pointer-events-none transition-colors group-focus-within:text-primary">
                            <Icon size={22} strokeWidth={1.5} />
                        </div>
                    )}
                </div>
                {error && <p className="text-xs text-danger ps-1">{error}</p>}
            </div>
        );
    }
);

InputField.displayName = 'InputField';

export default InputField;