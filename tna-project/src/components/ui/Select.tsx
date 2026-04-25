import React, { forwardRef, SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, className, ...props }, ref) => {
    return (
      <div className={cn('flex flex-col space-y-2', className)}>
        {label && (
            <label className="text-label font-bold text-neutral-700 pr-1 rtl:text-right">
                {label}
            </label>
        )}
        <div className="relative group">
            <select
            ref={ref}
            className={cn(
                'w-full h-input bg-surface-200 border rounded-sm px-4 text-start text-neutral-900 appearance-none focus:outline-none transition-all',
                error 
                    ? 'border-error ring-1 ring-error/20' 
                    : 'border-neutral-300 group-focus-within:border-primary group-focus-within:ring-2 group-focus-within:ring-primary/20'
            )}
            {...props}
            >
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                {option.label}
                </option>
            ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-neutral-400">
                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
            </div>
        </div>
        {error && <p className="text-xs text-error pr-1 font-medium rtl:text-right">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
