'use client';

import React from 'react';
import { Wallet } from '@phosphor-icons/react';
import { cn } from '@/lib/utils/cn';
import { useLocale } from '@/i18n/LocaleProvider';

interface WalletBalanceChipProps {
  balance: number;
  currency?: string;
  onClick?: () => void;
  className?: string;
}

export function WalletBalanceChip({ 
  balance, 
  currency = 'SAR', 
  onClick, 
  className 
}: WalletBalanceChipProps) {
  const { t } = useLocale();

  return (
    <div 
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 bg-primary/5 hover:bg-primary/10 border border-primary/10 px-3 py-1.5 rounded-full cursor-pointer transition-all active:scale-95 group",
        className
      )}
    >
      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
        <Wallet size={14} weight="fill" />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] leading-none font-bold text-neutral-400 uppercase tracking-widest">
          {t('common.wallet_balance')}
        </span>
        <span className="text-sm leading-none font-bold text-primary tabular-nums">
          {balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-[10px] opacity-70">{currency}</span>
        </span>
      </div>
    </div>
  );
}
