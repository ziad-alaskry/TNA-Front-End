export type MockUserRole = 'Owner' | 'Carrier' | 'Visitor' | 'Gov';

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'alert' | 'success';
  link?: string;
}

export const getNotificationsForRole = (role: MockUserRole): Notification[] => {
  const map: Record<MockUserRole, Notification[]> = {
    Visitor: [
      {
        id: 'n-1',
        title: 'notifications.visitor.tna_activated.title',
        message: 'notifications.visitor.tna_activated.message',
        timestamp: '2h ago',
        read: false,
        type: 'success',
        link: '/visitor/tnas'
      },
      {
        id: 'n-2',
        title: 'notifications.visitor.shipment_update.title',
        message: 'notifications.visitor.shipment_update.message',
        timestamp: '5h ago',
        read: false,
        type: 'info',
        link: '/visitor/shipments'
      },
      {
        id: 'n-3',
        title: 'notifications.visitor.address_linked.title',
        message: 'notifications.visitor.address_linked.message',
        timestamp: '1d ago',
        read: true,
        type: 'success',
        link: '/visitor/tnas'
      }
    ],
    Owner: [
      {
        id: 'n-10',
        title: 'notifications.owner.new_binding.title',
        message: 'notifications.owner.new_binding.message',
        timestamp: '1h ago',
        read: false,
        type: 'alert',
        link: '/owner/bindings'
      },
      {
        id: 'n-11',
        title: 'notifications.owner.payout_processed.title',
        message: 'notifications.owner.payout_processed.message',
        timestamp: '3h ago',
        read: false,
        type: 'success',
        link: '/owner/earnings'
      },
      {
        id: 'n-12',
        title: 'notifications.owner.property_verified.title',
        message: 'notifications.owner.property_verified.message',
        timestamp: '1d ago',
        read: true,
        type: 'success',
        link: '/owner/properties'
      }
    ],
    Carrier: [
      {
        id: 'n-20',
        title: 'notifications.carrier.new_assignment.title',
        message: 'notifications.carrier.new_assignment.message',
        timestamp: '30m ago',
        read: false,
        type: 'info',
        link: '/carrier/shipments'
      },
      {
        id: 'n-21',
        title: 'notifications.carrier.fleet_alert.title',
        message: 'notifications.carrier.fleet_alert.message',
        timestamp: '2h ago',
        read: false,
        type: 'alert',
        link: '/carrier/fleet'
      },
      {
        id: 'n-22',
        title: 'notifications.carrier.delivery_complete.title',
        message: 'notifications.carrier.delivery_complete.message',
        timestamp: '5h ago',
        read: true,
        type: 'success',
        link: '/carrier/shipments'
      }
    ],
    Gov: [
      {
        id: 'n-30',
        title: 'notifications.gov.queue_alert.title',
        message: 'notifications.gov.queue_alert.message',
        timestamp: '15m ago',
        read: false,
        type: 'alert',
        link: '/gov/tna-queue'
      },
      {
        id: 'n-31',
        title: 'notifications.gov.policy_update.title',
        message: 'notifications.gov.policy_update.message',
        timestamp: '1h ago',
        read: false,
        type: 'info',
        link: '/gov/policy'
      },
      {
        id: 'n-32',
        title: 'notifications.gov.system_report.title',
        message: 'notifications.gov.system_report.message',
        timestamp: '1d ago',
        read: true,
        type: 'info',
        link: '/gov/audit'
      }
    ]
  };

  return map[role] || [];
};

export const getUnreadCount = (role: MockUserRole): number => {
  return getNotificationsForRole(role).filter(n => !n.read).length;
};
