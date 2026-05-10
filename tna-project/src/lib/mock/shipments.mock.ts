import { Shipment } from '../types/deliveries';

export const mockShipments: Shipment[] = [
  {
    shipment_id: 'ship-1',
    tna_id: 'tna-1',
    carrier_id: 'carrier-1',
    assigned_staff_id: 'driver-1',
    tracking_number: 'TRK-123456',
    tracking_no: 'TRK-123456',
    carrier: 'Fast Track Logistics',
    expected_at: '2024-03-12T18:00:00Z',
    tna_code: 'TNA-77-88',
    status: 'DELIVERED',
    sender_name: 'Amazon SA',
    recipient_name: 'Abdullah Al-Ghamdi',
    destination_address_full: 'حي الملقا، شارع الأمير محمد بن سعد، فيلا ١٢',
    package_details: {
      weight: 2.5,
      dimensions: '30x20x15 cm',
      contents: 'Electronics'
    },
    dimensions: '30x20x15 cm',
    weight: '2.5 kg',
    created_at: '2024-03-10T10:00:00Z',
    estimated_delivery: '2024-03-12T18:00:00Z',
    actual_delivery: '2024-03-12T16:30:00Z',
    shipment_status_logs: [
      {
        log_id: 'log-1',
        shipment_id: 'ship-1',
        status: 'CREATED',
        logged_at: '2024-03-10T10:00:00Z'
      },
      {
        log_id: 'log-2',
        shipment_id: 'ship-1',
        status: 'PICKED_UP',
        logged_at: '2024-03-11T08:00:00Z'
      },
      {
        log_id: 'log-3',
        shipment_id: 'ship-1',
        status: 'IN_TRANSIT',
        logged_at: '2024-03-12T14:00:00Z'
      },
      {
        log_id: 'log-4',
        shipment_id: 'ship-1',
        status: 'DELIVERED',
        logged_at: '2024-03-12T16:30:00Z',
        notes: 'Delivered to recipient'
      }
    ],
    shipment_messages: [
      {
        message_id: 'msg-1',
        shipment_id: 'ship-1',
        sender_user_id: 'user-carrier-1',
        sender_role: 'CARRIER',
        message_text: 'Package is out for delivery today',
        created_at: '2024-03-12T08:00:00Z'
      },
      {
        message_id: 'msg-2',
        shipment_id: 'ship-1',
        sender_user_id: 'user-visitor-1',
        sender_role: 'VISITOR',
        message_text: 'Thank you',
        created_at: '2024-03-12T16:35:00Z'
      }
    ]
  },
  {
    shipment_id: 'ship-2',
    tna_id: 'tna-1',
    carrier_id: 'carrier-1',
    assigned_staff_id: 'driver-1',
    tracking_number: 'TRK-789012',
    tracking_no: 'TRK-789012',
    carrier: 'Fast Track Logistics',
    expected_at: '2024-05-07T20:00:00Z',
    tna_code: 'TNA-11-22',
    status: 'IN_TRANSIT',
    sender_name: 'Noon',
    recipient_name: 'Abdullah Al-Ghamdi',
    destination_address_full: 'حي النرجس، تقاطع طريق الملك سلمان، عمارة ٥٦',
    package_details: {
      weight: 0.5,
      dimensions: '10x10x10 cm',
      contents: 'Documents'
    },
    dimensions: '10x10x10 cm',
    weight: '0.5 kg',
    created_at: '2024-05-05T09:00:00Z',
    estimated_delivery: '2024-05-07T20:00:00Z',
    shipment_status_logs: [
      {
        log_id: 'log-5',
        shipment_id: 'ship-2',
        status: 'CREATED',
        logged_at: '2024-05-05T09:00:00Z'
      },
      {
        log_id: 'log-6',
        shipment_id: 'ship-2',
        status: 'PICKED_UP',
        logged_at: '2024-05-06T10:00:00Z'
      },
      {
        log_id: 'log-7',
        shipment_id: 'ship-2',
        status: 'IN_TRANSIT',
        logged_at: '2024-05-06T14:00:00Z'
      }
    ]
  },
  {
    shipment_id: 'ship-3',
    tna_id: 'tna-2',
    carrier_id: 'carrier-1',
    assigned_staff_id: 'driver-2',
    tracking_number: 'TRK-345678',
    tracking_no: 'TRK-345678',
    carrier: 'Fast Track Logistics',
    expected_at: '2024-05-08T18:00:00Z',
    tna_code: 'TNA-33-44',
    status: 'CREATED',
    sender_name: 'Jarir Bookstore',
    recipient_name: 'Abdullah Al-Ghamdi',
    destination_address_full: 'حي الياسمين، عمارة رقم ٤٤',
    package_details: {
      weight: 1.2,
      dimensions: '40x30x5 cm',
      contents: 'Books'
    },
    dimensions: '40x30x5 cm',
    weight: '1.2 kg',
    created_at: '2024-05-06T14:00:00Z',
    estimated_delivery: '2024-05-08T18:00:00Z',
    shipment_status_logs: [
      {
        log_id: 'log-8',
        shipment_id: 'ship-3',
        status: 'CREATED',
        logged_at: '2024-05-06T14:00:00Z'
      }
    ]
  },
];
