'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface CurrencySymbolProps {
  className?: string;
  char?: string;
}

/**
 * Renders the official Saudi Riyal symbol using the custom 'SaudiRiyal' font.
 * Default character is Unicode U+20C1 (Saudi Riyal Sign).
 */
export function CurrencySymbol({ className, char = '\u20C1' }: CurrencySymbolProps) {
  return (
    <span className={cn("saudi-riyal-symbol", className)} aria-label="SAR">
      {char}
    </span>
  );
}
