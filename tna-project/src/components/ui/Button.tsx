import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost' | 'success' | 'danger' | 'nafath';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', fullWidth, ...props }, ref) => {
        const variants = {
            primary: 'bg-primary-gradient text-white shadow-md hover:opacity-90',
            outline: 'border-2 border-primary text-primary hover:bg-primary/5',
            ghost: 'text-primary hover:bg-primary/5',
            success: 'bg-success text-white shadow-md',
            danger: 'bg-danger text-white shadow-md',
            nafath: 'border border-success text-success bg-white hover:bg-success/5',
        };

        const sizes = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-4 py-3 text-base font-medium',
            lg: 'px-6 py-4 text-lg font-semibold',
            xl: 'px-8 py-5 text-xl font-bold',
        };

        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center rounded-full transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none',
                    variants[variant],
                    sizes[size],
                    fullWidth && 'w-full',
                    className
                )}
                {...props}
            />
        );
    }
);

Button.displayName = 'Button';

export default Button;