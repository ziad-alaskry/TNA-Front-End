'use client';

import { useState } from 'react';
import { Bell, Check } from 'lucide-react';
import { X } from '@phosphor-icons/react';
import { useLocale } from '@/i18n/LocaleProvider';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useUIStore } from '@/lib/store/useUIStore';
import { getNotificationsForRole } from '@/lib/mock/notifications.mock';
import { cn } from '@/lib/utils/cn';

export function NotificationPanel() {
  const { t } = useLocale();
  const { user } = useAuthStore();
  const { isNotificationPanelOpen, setNotificationPanelOpen, setUnreadNotificationCount } = useUIStore();

  const role = user?.user_role?.toLowerCase() === 'visitor' ? 'Visitor' :
               user?.user_role?.toLowerCase() === 'owner' ? 'Owner' :
               user?.user_role?.toLowerCase() === 'carrier_staff' ? 'Carrier' :
               user?.user_role?.toLowerCase() === 'gov_user' ? 'Gov' : 'Visitor';

  const [notifications, setNotifications] = useState(() => getNotificationsForRole(role as any));
  const [localCount, setLocalCount] = useState(notifications.filter(n => !n.read).length);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setLocalCount(0);
    setUnreadNotificationCount(0);
  };

  const handleNotificationClick = (link?: string) => {
    if (link) {
      window.location.href = link;
    }
    setNotificationPanelOpen(false);
  };

  if (!isNotificationPanelOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={() => setNotificationPanelOpen(false)}
      />

      {/* Panel */}
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-800 shadow-2xl border border-neutral-200 dark:border-slate-700 h-full md:h-auto md:max-h-[80vh] md:my-8 md:me-4 md:rounded-xl flex flex-col end-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Bell size={20} className="text-primary" />
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
              {t('notifications.title')}
            </h2>
            {localCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold bg-error text-white rounded-full">
                {localCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {localCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs font-medium text-primary hover:text-primary/80 px-2 py-1 rounded hover:bg-primary/10 transition-colors"
              >
                {t('notifications.markAllRead')}
              </button>
            )}
            <button
              onClick={() => setNotificationPanelOpen(false)}
              className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-slate-700 transition-colors"
            >
              <X size={20} className="text-neutral-500" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-2">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <Bell size={48} className="text-neutral-300 dark:text-slate-600 mb-4" />
              <p className="text-neutral-500 dark:text-slate-400 font-medium">
                {t('notifications.empty.title')}
              </p>
              <p className="text-sm text-neutral-400 dark:text-slate-500 mt-1">
                {t('notifications.empty.subtitle')}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.link)}
                  className={cn(
                    "p-3 rounded-lg cursor-pointer transition-colors border-s-4",
                    notification.read
                      ? "bg-transparent border-transparent hover:bg-neutral-50 dark:hover:bg-slate-700/50"
                      : "bg-primary/5 border-primary",
                    notification.type === 'alert' && !notification.read && "border-error",
                    notification.type === 'success' && !notification.read && "border-success"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "mt-0.5 w-2 h-2 rounded-full flex-shrink-0",
                      notification.type === 'success' ? "bg-success" :
                      notification.type === 'alert' ? "bg-error" : "bg-info"
                    )} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className={cn(
                          "text-sm font-semibold truncate",
                          notification.read
                            ? "text-neutral-600 dark:text-slate-400"
                            : "text-neutral-900 dark:text-white"
                        )}>
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <Check size={14} className="text-primary flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-neutral-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                        {notification.message}
                      </p>
                      <span className="text-xs text-neutral-400 dark:text-slate-500 mt-1 block">
                        {notification.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
