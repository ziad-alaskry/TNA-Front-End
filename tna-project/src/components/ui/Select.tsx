import React, { forwardRef, SelectHTMLAttributes } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  focusRingClassName?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, className, focusRingClassName, ...props }, ref) => {
    return (
      <div className={`flex flex-col ${className || ''}`}>
        {label && <label className="mb-1 text-sm font-medium text-gray-700 rtl:text-right">{label}</label>}
        <select
          ref={ref}
          className={`px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} ${focusRingClassName || ''}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-red-500 rtl:text-right">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
