'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Bell, Check } from 'lucide-react';
import { useLocale } from '@/i18n/LocaleProvider';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useUIStore } from '@/lib/store/useUIStore';
import { getNotificationsForRole } from '@/lib/mock/notifications.mock';
import { cn } from '@/lib/utils/cn';

interface NotificationPanelProps {
  isOpen: boolean;
  anchorRef: React.RefObject<HTMLElement>;
  onClose: () => void;
}

export function NotificationPanel({ isOpen, anchorRef, onClose }: NotificationPanelProps) {
  const { t } = useLocale();
  const { user } = useAuthStore();
  const { setUnreadNotificationCount, setNotificationPanelOpen } = useUIStore();

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
    onClose();
  };

  const [coords, setCoords] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!isOpen || !anchorRef.current) return;

    const computePosition = () => {
      const anchor = anchorRef.current;
      if (!anchor) return;

      const rect = anchor.getBoundingClientRect();
      const gap = 8;

      // Panel width: match CSS (360px on desktop, responsive on mobile)
      const isMobile = window.innerWidth <= 600;
      const panelWidth = isMobile ? Math.min(360, window.innerWidth - 16) : 360;

      let top = rect.bottom + gap;
      let left: number;

      const isRTL = document.documentElement.dir === 'rtl';
      if (isRTL) {
        // RTL: bell is on left side; align left edges, panel extends right
        left = rect.left;
      } else {
        // LTR: bell is on right side; align right edges, panel extends left
        left = rect.right - panelWidth;
      }

      // Clamp to viewport with edge padding
      const EDGE_PAD = 8;
      const winWidth = window.innerWidth;
      if (left < EDGE_PAD) left = EDGE_PAD;
      if (left > winWidth - panelWidth - EDGE_PAD) left = winWidth - panelWidth - EDGE_PAD;

      setCoords({ top, left });
    };

    computePosition();

    const handleResize = () => computePosition();
    const handleScroll = () => computePosition();

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen, anchorRef]);

  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Outside-click overlay */}
      <div
        className="notif-click-outside"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="notif-panel"
        style={{
          position: 'fixed',
          top: coords.top,
          left: coords.left,
          right: 'auto',
        }}
      >
        {/* Header */}
        <div className="notif-panel-header">
          <div className="flex items-center gap-2">
            <Bell size={20} className="text-primary" />
            <h2 className="notif-panel-title">
              {t('notifications.title')}
            </h2>
            {localCount > 0 && (
              <span className="notif-badge">
                {localCount}
              </span>
            )}
          </div>
          {localCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="notif-mark-all-btn"
            >
              {t('notifications.markAllRead')}
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="notif-panel-body">
          {notifications.length === 0 ? (
            <div className="notif-empty-state">
              <Bell size={48} className="notif-empty-icon" />
              <p className="notif-empty-title">
                {t('notifications.empty.title')}
              </p>
              <p className="notif-empty-subtitle">
                {t('notifications.empty.subtitle')}
              </p>
            </div>
          ) : (
            <div className="space-y-0">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.link)}
                  className={cn(
                    "notif-item",
                    notification.read ? "notif-item-read" : "notif-item-unread"
                  )}
                >
                  <div className="notif-item-content">
                    <div className="flex items-center justify-between gap-2">
                    <h4 className="notif-item-title">
                      {t(notification.title)}
                    </h4>
                      {!notification.read && (
                        <Check size={14} className="notif-item-check" />
                      )}
                    </div>
                    <p className="notif-item-desc">
                      {t(notification.message)}
                    </p>
                    <span className="notif-item-time">
                      {notification.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="notif-panel-footer">
          <a href="/notifications" className="notif-view-all">
            {t('notifications.viewAll')}
          </a>
        </div>
      </div>
    </>,
    document.body
  );
}
