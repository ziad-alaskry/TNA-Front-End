import React from 'react';
import { cn } from '@/lib/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost' | 'success' | 'danger' | 'nafath';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', fullWidth, ...props }, ref) => {
        const variants = {
            primary: 'bg-btn-primary text-white shadow-btn hover:opacity-95',
            outline: 'border-2 border-primary text-primary hover:bg-primary/5',
            ghost: 'text-neutral-600 hover:bg-neutral-100',
            success: 'bg-success text-white shadow-sm',
            danger: 'bg-error text-white shadow-sm',
            nafath: 'border border-success text-success bg-white hover:bg-success-bg',
        };

        const sizes = {
            sm: 'px-3 py-1.5 text-caption',
            md: 'px-6 h-btn-md text-body font-bold',
            lg: 'px-6 h-btn-lg text-body font-bold',
            xl: 'px-8 py-5 text-heading font-bold',
        };

        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center rounded-pill transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none',
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
