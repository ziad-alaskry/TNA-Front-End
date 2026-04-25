import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface ChartPlaceholderProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    type?: 'bar' | 'line';
}

export default function ChartPlaceholder({
    className,
    title,
    type = 'bar',
    ...props
}: ChartPlaceholderProps) {
    return (
        <div
            className={cn(
                'bg-surface-200 rounded-md border border-neutral-100 shadow-card p-6 flex flex-col',
                className
            )}
            {...props}
        >
            {title && <h3 className="text-sm font-bold text-neutral-700 mb-6">{title}</h3>}
            <div className="flex-1 w-full min-h-[200px] flex items-end gap-3 px-2">
                {type === 'bar' ? (
                    <>
                        <div className="flex-1 bg-brand-navy/10 rounded-t-xs h-[40%]" />
                        <div className="flex-1 bg-brand-cyan rounded-t-xs h-[70%]" />
                        <div className="flex-1 bg-brand-navy rounded-t-xs h-[55%]" />
                        <div className="flex-1 bg-brand-cyan/60 rounded-t-xs h-[90%]" />
                        <div className="flex-1 bg-brand-navy/40 rounded-t-xs h-[30%]" />
                        <div className="flex-1 bg-brand-cyan rounded-t-xs h-[75%]" />
                        <div className="flex-1 bg-brand-navy rounded-t-xs h-[60%]" />
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-300">
                        <svg className="w-full h-full" viewBox="0 0 400 200">
                            <path
                                d="M0,150 Q50,100 100,120 T200,80 T300,110 T400,50"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                className="text-brand-cyan"
                            />
                            <path
                                d="M0,180 Q50,140 100,160 T200,120 T300,150 T400,90"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="text-brand-navy/30"
                            />
                        </svg>
                    </div>
                )}
            </div>
            <div className="mt-4 flex justify-between text-[10px] text-neutral-400 font-medium uppercase tracking-wider">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
            </div>
        </div>
    );
}
