'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface ProgressStepperProps {
    currentStep: 1 | 2 | 3;
    label: string;
}

export default function ProgressStepper({ currentStep, label }: ProgressStepperProps) {
    return (
        <div className="bg-card px-6 pb-6 pt-4 border-b border-divider">
            <p className="text-center text-xs font-bold mb-6 text-text-secondary uppercase tracking-wider">{label}</p>
            <div className="relative flex items-center justify-between max-w-xs mx-auto px-4">
                {/* Horizontal line */}
                <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-divider -translate-y-1/2 z-0" />
                
                {/* Active line progress */}
                <div 
                    className="absolute top-1/2 right-4 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-slow" 
                    style={{ width: `${(currentStep - 1) * 50}%` }}
                />

                {/* Dots */}
                {[1, 2, 3].map((step) => (
                    <div 
                        key={step}
                        className={cn(
                            "relative z-10 w-5 h-5 rounded-full border-2 transition-all duration-fast flex items-center justify-center",
                            currentStep >= step 
                                ? 'bg-primary border-primary shadow-button scale-110' 
                                : 'bg-card border-divider'
                        )} 
                    >
                        {currentStep > step && (
                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        )}
                        {currentStep === step && (
                            <div className="w-2 h-2 bg-white rounded-full shadow-inner animate-pulse" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
