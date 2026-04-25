'use client';

import React from 'react';
import { useLocale } from '@/i18n/LocaleProvider';
import { cn } from '@/lib/utils/cn';

interface MirrorIconProps {
    children: React.ReactElement;
    className?: string;
    /** Force mirroring even if not in RTL (rare) */
    force?: boolean;
    /** If true, only mirror in LTR (for icons that are default RTL) */
    reverse?: boolean;
}

/**
 * Automatically mirrors directional icons (arrows, chevrons) based on RTL state.
 * Use for icons that point 'forward' or 'backward'.
 */
export default function MirrorIcon({ children, className, force, reverse }: MirrorIconProps) {
    const { isRTL } = useLocale();

    // Mirror logic: 
    // Default behavior is to flip on RTL.
    // If reverse is true, we flip on LTR.
    const shouldMirror = force || (reverse ? !isRTL : isRTL);

    return React.cloneElement(children, {
        className: cn(
            children.props.className,
            shouldMirror && 'scale-x-[-1]', // scale-x-[-1] is cleaner than rotate-180 for mirroring
            className
        ),
    });
}
