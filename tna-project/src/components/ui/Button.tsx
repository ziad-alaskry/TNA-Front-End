import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const buttonVariants = cva(
    'inline-flex items-center justify-center transition-all duration-fast active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none font-bold select-none',
    {
        variants: {
            variant: {
                primary: 'bg-primary-gradient text-white shadow-button hover:brightness-110',
                secondary: 'bg-secondary text-white shadow-button hover:brightness-110',
                accent: 'bg-accent text-white shadow-button hover:brightness-110',
                outline: 'border border-divider bg-card text-primary hover:bg-neutral-50',
                ghost: 'text-neutral-500 hover:bg-neutral-50 hover:text-primary',
                danger: 'bg-error text-white shadow-button hover:brightness-110',
                nafath: 'border border-success text-success bg-white hover:bg-success-light',
            },
            size: {
                sm: 'h-9 px-4 text-xs rounded-md',
                md: 'h-button px-8 text-sm rounded-md',
                lg: 'h-button-lg px-10 text-base rounded-lg',
                icon: 'h-11 w-11 rounded-md',
            },
            fullWidth: {
                true: 'w-full',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'md',
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, fullWidth, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(buttonVariants({ variant, size, fullWidth, className }))}
                {...props}
            />
        );
    }
);

Button.displayName = 'Button';

export default Button;
export { buttonVariants };
