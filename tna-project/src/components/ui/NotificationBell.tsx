'use client';

import { Bell } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface NotificationBellProps {
  count?: number;
  className?: string;
}

export function NotificationBell({ count = 0, className }: NotificationBellProps) {
  const hasNotifications = count > 0;

  return (
    <div className={cn('relative', className)}>
      <button className="p-2 rounded-full hover:bg-surface-200 transition-colors">
        <Bell 
          size={20} 
          className="text-text-secondary hover:text-text-primary transition-colors" 
        />
      </button>
      {hasNotifications && (
        <span className="absolute -top-0.5 -end-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-error px-1 text-[10px] font-bold text-white border-[2px] border-surface">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </div>
  );
}