'use client';

import React from 'react';

interface ProgressStepperProps {
    currentStep: 1 | 2 | 3;
    label: string;
}

export default function ProgressStepper({ currentStep, label }: ProgressStepperProps) {
    return (
        <div className="bg-white px-6 pb-6 pt-2">
            <p className="text-center text-sm font-semibold mb-6 text-tna-gray-600">{label}</p>
            <div className="relative flex items-center justify-between max-w-xs mx-auto px-4" dir="rtl">
                {/* Horizontal line */}
                <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-tna-gray-200 -translate-y-1/2 z-0" />

                {/* Dots (RTL: Step 1 is left visually because it's the start, but RTL usually maps 1 to rightmost) */}
                {/* Actually, in the Figma screenshot for Step 3, all 3 dots are blue. */}
                {/* Step 1: Rightmost in RTL */}
                <div className={`relative z-10 w-4 h-4 rounded-full border-2 transition-colors ${currentStep >= 1 ? 'bg-primary border-primary' : 'bg-white border-tna-gray-400'}`} />

                {/* Step 2: Middle */}
                <div className={`relative z-10 w-4 h-4 rounded-full border-2 transition-colors ${currentStep >= 2 ? 'bg-primary border-primary' : 'bg-white border-tna-gray-400'}`} />

                {/* Step 3: Leftmost in RTL */}
                <div className={`relative z-10 w-4 h-4 rounded-full border-2 transition-colors ${currentStep >= 3 ? 'bg-primary border-primary' : 'bg-white border-tna-gray-400'}`} />
            </div>
        </div>
    );
}