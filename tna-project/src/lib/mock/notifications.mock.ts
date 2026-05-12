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
        title: 'TNA Activated',
        message: 'Your TNA TNA-001 has been activated successfully.',
        timestamp: '2h ago',
        read: false,
        type: 'success',
        link: '/visitor/tnas'
      },
      {
        id: 'n-2',
        title: 'Shipment Update',
        message: 'Shipment SHP-001 is out for delivery.',
        timestamp: '5h ago',
        read: false,
        type: 'info',
        link: '/visitor/shipments'
      },
      {
        id: 'n-3',
        title: 'Address Linked',
        message: 'Your temporary address has been linked to a property.',
        timestamp: '1d ago',
        read: true,
        type: 'success',
        link: '/visitor/tnas'
      }
    ],
    Owner: [
      {
        id: 'n-10',
        title: 'New Binding Request',
        message: 'New binding request from أحمد الزائر requires your approval.',
        timestamp: '1h ago',
        read: false,
        type: 'alert',
        link: '/owner/bindings'
      },
      {
        id: 'n-11',
        title: 'Payout Processed',
        message: 'Payout of SAR 1,200 has been processed to your bank account.',
        timestamp: '3h ago',
        read: false,
        type: 'success',
        link: '/owner/earnings'
      },
      {
        id: 'n-12',
        title: 'Property Verified',
        message: 'Your property at Riyadh has been verified by authorities.',
        timestamp: '1d ago',
        read: true,
        type: 'success',
        link: '/owner/properties'
      }
    ],
    Carrier: [
      {
        id: 'n-20',
        title: 'New Assignment',
        message: 'New shipment assigned to driver محمد.',
        timestamp: '30m ago',
        read: false,
        type: 'info',
        link: '/carrier/shipments'
      },
      {
        id: 'n-21',
        title: 'Fleet Alert',
        message: 'Fleet utilization below 50%. Consider adding more vehicles.',
        timestamp: '2h ago',
        read: false,
        type: 'alert',
        link: '/carrier/fleet'
      },
      {
        id: 'n-22',
        title: 'Delivery Complete',
        message: '10 shipments delivered successfully today.',
        timestamp: '5h ago',
        read: true,
        type: 'success',
        link: '/carrier/shipments'
      }
    ],
    Gov: [
      {
        id: 'n-30',
        title: 'Queue Alert',
        message: '3 TNA issuance requests pending review in the queue.',
        timestamp: '15m ago',
        read: false,
        type: 'alert',
        link: '/gov/tna-queue'
      },
      {
        id: 'n-31',
        title: 'Policy Update',
        message: 'Policy update requires your attention. New parameters available.',
        timestamp: '1h ago',
        read: false,
        type: 'info',
        link: '/gov/policy'
      },
      {
        id: 'n-32',
        title: 'System Report',
        message: 'Daily system audit report is now available.',
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
