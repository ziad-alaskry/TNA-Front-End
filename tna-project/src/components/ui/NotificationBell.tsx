'use client';

import { Bell } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface NotificationBellProps {
  count?: number;
  className?: string;
  isOpen?: boolean;
  onClick?: () => void;
}

export function NotificationBell({ count = 0, className, isOpen, onClick }: NotificationBellProps) {
  const hasNotifications = count > 0;

  return (
    <div className={cn('notif-wrapper', className)}>
      <button 
        onClick={onClick}
        className={cn(
          'notif-bell-btn',
          isOpen && 'active'
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Bell 
          size={20} 
          className="text-text-secondary hover:text-text-primary transition-colors" 
        />
      </button>
      {hasNotifications && (
        <span className="notif-badge">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </div>
  );
}