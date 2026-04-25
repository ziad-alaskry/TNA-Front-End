'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface ProgressStepperProps {
    currentStep: 1 | 2 | 3;
    label: string;
}

export default function ProgressStepper({ currentStep, label }: ProgressStepperProps) {
    return (
        <div className="bg-surface-200 px-6 pb-6 pt-2">
            <p className="text-center text-label font-bold mb-6 text-neutral-600">{label}</p>
            <div className="relative flex items-center justify-between max-w-xs mx-auto px-4" dir="rtl">
                {/* Horizontal line */}
                <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-neutral-200 -translate-y-1/2 z-0" />

                {/* Dots (RTL: Step 1 is rightmost) */}
                {[1, 2, 3].map((step) => (
                    <div 
                        key={step}
                        className={cn(
                            "relative z-10 w-4 h-4 rounded-full border-2 transition-all duration-300",
                            currentStep >= step 
                                ? 'bg-primary border-primary scale-110 shadow-sm' 
                                : 'bg-white border-neutral-300'
                        )} 
                    />
                ))}
            </div>
        </div>
    );
}
