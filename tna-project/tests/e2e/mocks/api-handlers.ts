import type { Request } from '@playwright/test';
import {
  mockTNAs,
  mockIssuanceRequests,
  mockBindings,
  mockProperties,
  mockSubAddresses,
  mockShipments,
  mockCarriers,
  mockDrivers,
  mockVehicles,
  mockBalances,
  mockTransactions,
  mockWeeklyRevenue,
  mockFleetUtilization,
  mockTaskDistribution,
  mockGovQueue,
  mockSubAddressQueue,
  mockTNARequestDetails,
  mockSubAddressDetails,
  mockGovAdjustments,
  issuancePolicyConfig,
  mockRegionStats,
} from '@/lib/mock';

// ============================================
// AUTH HANDLERS
// ============================================
export const authHandlers = {
  loginSuccess: (role: string = 'VISITOR') => ({
    status: 200,
    body: {
      token: `mock-jwt-token-${role.toLowerCase()}`,
      user: mockUsers[role as keyof typeof mockUsers] || mockUsers.VISITOR,
    },
  }),

  loginFailure: () => ({
    status: 401,
    body: { error: 'Invalid credentials' },
  }),

  loginServerError: () => ({
    status: 500,
    body: { error: 'Internal server error' },
  }),

  logoutSuccess: () => ({
    status: 200,
    body: { success: true, message: 'Logged out successfully' },
  }),

  refreshSuccess: () => ({
    status: 200,
    body: {
      token: 'mock-jwt-token-refreshed',
      expires_in: 3600,
    },
  }),

  getMeSuccess: () => ({
    status: 200,
    body: mockUsers.VISITOR, // Default; test can override
  }),
};

// ============================================
// TNA HANDLERS
// ============================================
export const tnaHandlers = {
  listSuccess: () => ({
    status: 200,
    body: { data: mockTNAs },
  }),

  requestDetailSuccess: (requestId: string = 'req-pending-1') => ({
    status: 200,
    body: mockTNARequestDetails[requestId] || mockTNARequestDetails['req-pending-1'],
  }),

  listIssuanceRequestsSuccess: () => ({
    status: 200,
    body: { data: mockIssuanceRequests },
  }),

  createRequestSuccess: () => ({
    status: 201,
    body: {
      request_id: 'req-new-' + Date.now(),
      request_status: 'PENDING',
      mode_at_submission: 'MODERATED',
      created_at: new Date().toISOString(),
    },
  }),

  checkEligibilitySuccess: () => ({
    status: 200,
    body: {
      eligible: true,
      max_tnas_reached: false,
      active_tnas_count: 2,
      max_allowed: 3,
    },
  }),

  approveSuccess: (requestId: string) => ({
    status: 200,
    body: {
      request_id: requestId,
      status: 'APPROVED',
      tna_id: 'tna-' + requestId.split('-')[2],
      tna_code: 'TNA-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
      issued_at: new Date().toISOString(),
    },
  }),

  rejectSuccess: (requestId: string) => ({
    status: 200,
    body: {
      request_id: requestId,
      status: 'REJECTED',
      rejection_reason: 'Rejected by test',
      reviewed_at: new Date().toISOString(),
    },
  }),

  cancelSuccess: (tnaId: string) => ({
    status: 200,
    body: {
      tna_id: tnaId,
      status: 'UNLINKED',
      revoked_at: new Date().toISOString(),
      revocation_reason: 'Cancelled by user',
    },
  }),

  notFound404: () => ({
    status: 404,
    body: { error: 'Request not found' },
  }),

  serverError500: () => ({
    status: 500,
    body: { error: 'Internal server error' },
  }),
};

// ============================================
// ADDRESS / PROPERTY HANDLERS
// ============================================
export const addressHandlers = {
  searchSuccess: (query: string = '') => ({
    status: 200,
    body: {
      data: mockProperties.map((p) => ({
        ...p,
        match_score: query ? Math.random() : 1.0,
      })),
    },
  }),

  getDetailSuccess: (id: string = 'na-1') => {
    const property = mockProperties.find((p) => p.na_id === id) || mockProperties[0];
    const subAddresses = mockSubAddresses.filter((s) => s.na_id === id);
    return {
      status: 200,
      body: {
        ...property,
        sub_addresses: subAddresses,
      },
    };
  },

  registerPropertySuccess: () => ({
    status: 201,
    body: {
      na_id: 'na-new-' + Date.now(),
      ownership_proof_status: 'PENDING_VERIFICATION',
      created_at: new Date().toISOString(),
    },
  }),

  notFound404: () => ({
    status: 404,
    body: { error: 'Address not found' },
  }),
};

// ============================================
// BINDING HANDLERS
// ============================================
export const bindingHandlers = {
  listSuccess: (role: string = 'VISITOR') => ({
    status: 200,
    body: {
      data: mockBindings.filter((b) =>
        role === 'OWNER' ? true : b.visitor_id === 'user-visitor-1'
      ),
    },
  }),

  approveSuccess: (bindingId: string) => ({
    status: 200,
    body: {
      binding_id: bindingId,
      status: 'ACTIVE',
      approved_at: new Date().toISOString(),
    },
  }),

  rejectSuccess: (bindingId: string) => ({
    status: 200,
    body: {
      binding_id: bindingId,
      status: 'CANCELLED',
      termination_reason: 'Rejected by owner',
      updated_at: new Date().toISOString(),
    },
  }),

  terminateSuccess: (bindingId: string) => ({
    status: 200,
    body: {
      binding_id: bindingId,
      status: 'TERMINATED',
      termination_reason: 'Terminated by visitor',
      updated_at: new Date().toISOString(),
    },
  }),

  terminateBlocked: () => ({
    status: 409,
    body: { error: 'Cannot unlink: Active deliveries in progress' },
  }),

  terminateError500: () => ({
    status: 500,
    body: { error: 'Internal server error' },
  }),

  notFound404: () => ({
    status: 404,
    body: { error: 'Binding not found' },
  }),
};

// ============================================
// PAYMENT / WALLET HANDLERS
// ============================================
export const paymentHandlers = {
  chargeSuccess: () => ({
    status: 200,
    body: {
      transaction_id: 'tx-' + Date.now(),
      status: 'COMPLETED',
      amount: 500,
      currency: 'SAR',
      description: 'Payment successful',
      settled_at: new Date().toISOString(),
    },
  }),

  chargeFailed: () => ({
    status: 402,
    body: { error: 'Payment declined', code: 'INSUFFICIENT_FUNDS' },
  }),

  chargeError500: () => ({
    status: 500,
    body: { error: 'Internal server error' },
  }),

  getWalletBalanceSuccess: (userId: string = 'user-visitor-1') => ({
    status: 200,
    body: {
      balance: mockBalances[userId] || 0,
      currency: 'SAR',
      pending: 0,
    },
  }),

  getTransactionsSuccess: () => ({
    status: 200,
    body: { data: mockTransactions },
  }),

  topUpSuccess: () => ({
    status: 200,
    body: {
      transaction_id: 'tx-topup-' + Date.now(),
      status: 'COMPLETED',
      amount: 1000,
      new_balance: 1450,
    },
  }),
};

// ============================================
// SHIPMENT / DELIVERY HANDLERS
// ============================================
export const shipmentHandlers = {
  listSuccess: (role: string = 'VISITOR') => ({
    status: 200,
    body: {
      data: mockShipments.filter((s) =>
        role === 'CARRIER_STAFF' ? true : true // Simplified filtering
      ),
    },
  }),

  getDetailSuccess: (id: string = 'ship-1') => {
    const shipment = mockShipments.find((s) => s.shipment_id === id) || mockShipments[0];
    return {
      status: 200,
      body: shipment,
    };
  },

  createShipmentSuccess: () => ({
    status: 201,
    body: {
      shipment_id: 'ship-new-' + Date.now(),
      tracking_number: 'TRK-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      status: 'CREATED',
      created_at: new Date().toISOString(),
    },
  }),

  updateStatusSuccess: (shipmentId: string, newStatus: string) => ({
    status: 200,
    body: {
      shipment_id: shipmentId,
      status: newStatus,
      updated_at: new Date().toISOString(),
    },
  }),

  invalidTransition: () => ({
    status: 409,
    body: { error: 'Invalid status transition', current_status: 'DELIVERED' },
  }),

  notFound404: () => ({
    status: 404,
    body: { error: 'Shipment not found' },
  }),

  serverError500: () => ({
    status: 500,
    body: { error: 'Internal server error' },
  }),

  assignDriverSuccess: () => ({
    status: 200,
    body: {
      assigned_staff_id: 'driver-1',
      assignment_successful: true,
    },
  }),
};

// ============================================
// CARRIER HANDLERS
// ============================================
export const carrierHandlers = {
  getDashboardSuccess: () => ({
    status: 200,
    body: {
      fleet_utilization: mockFleetUtilization,
      active_shipments: 5,
      total_deliveries: 124,
      pending_tasks: 12,
    },
  }),

  getStaffSuccess: () => ({
    status: 200,
    body: { data: mockDrivers },
  }),

  addStaffSuccess: () => ({
    status: 201,
    body: {
      staff_id: 'driver-new-' + Date.now(),
      created_at: new Date().toISOString(),
    },
  }),

  getFleetSuccess: () => ({
    status: 200,
    body: { data: mockVehicles },
  }),

  addVehicleSuccess: () => ({
    status: 201,
    body: {
      vehicle_id: 'veh-new-' + Date.now(),
      plate_number: 'XXX ' + Math.floor(Math.random() * 1000),
      status: 'IDLE',
    },
  }),

  getDriverTasksSuccess: () => ({
    status: 200,
    body: {
      data: mockShipments
        .filter((s) => s.status !== 'DELIVERED')
        .map((s) => ({
          task_id: 'task-' + s.shipment_id,
          shipment_id: s.shipment_id,
          tna_code: s.tna_code,
          destination: s.destination_address_full,
          status: s.status,
        })),
    },
  }),

  updateTaskStatusSuccess: () => ({
    status: 200,
    body: {
      task_id: 'task-1',
      status: 'COMPLETED',
      completed_at: new Date().toISOString(),
    },
  }),

  getReportsSuccess: () => ({
    status: 200,
    body: {
      weekly_revenue: mockWeeklyRevenue,
      total_revenue: 145000,
      on_time_delivery_rate: 94.5,
    },
  }),

  getIntegrationConfigSuccess: () => ({
    status: 200,
    body: {
      api_key: 'sk-••••••••••••••••',
      webhook_url: 'https://api.example.com/tna/webhook',
      webhook_enabled: true,
    },
  }),

  rotateApiKeySuccess: () => ({
    status: 200,
    body: {
      api_key: 'sk-new-' + Date.now(),
      rotated_at: new Date().toISOString(),
    },
  }),
};

// ============================================
// GOVERNMENT / ADMIN HANDLERS
// ============================================
export const govHandlers = {
  getHomeDashboardSuccess: () => ({
    status: 200,
    body: {
      total_requests: 1240,
      pending_review: 47,
      approved_this_week: 89,
      rejection_rate: 2.3,
    },
  }),

  getTNAQueueSuccess: () => ({
    status: 200,
    body: { data: mockGovQueue.filter((q) => q.status === 'PENDING_REVIEW') },
  }),

  getAddressQueueSuccess: () => ({
    status: 200,
    body: { data: mockSubAddressQueue },
  }),

  getPolicyConfigSuccess: () => ({
    status: 200,
    body: issuancePolicyConfig,
  }),

  updatePolicyConfigSuccess: () => ({
    status: 200,
    body: {
      ...issuancePolicyConfig,
      issuance_mode: 'AUTONOMOUS',
    },
  }),

  getAgenciesSuccess: () => ({
    status: 200,
    body: {
      data: [
        { agency_id: 'ag-1', name: 'Ministry of Municipal', user_count: 15, region: 'Riyadh' },
        { agency_id: 'ag-2', name: 'Saudi Post', user_count: 8, region: 'All' },
      ],
    },
  }),

  getAuditLogsSuccess: () => ({
    status: 200,
    body: {
      data: mockGovAdjustments.map((a) => ({
        ...a,
        actor_name: 'Gov User',
        actor_id: 'user-gov-1',
      })),
    },
  }),

  getRegionStatsSuccess: () => ({
    status: 200,
    body: { data: mockRegionStats },
  }),
};

// ============================================
// AGGREGATED MOCK HANDLERS
// ============================================
export const mockHandlers = {
  auth: authHandlers,
  tna: tnaHandlers,
  address: addressHandlers,
  binding: bindingHandlers,
  payment: paymentHandlers,
  shipment: shipmentHandlers,
  carrier: carrierHandlers,
  gov: govHandlers,
};

// Helper mock users (align with auth.mock.ts)
const mockUsers = {
  VISITOR: {
    user_id: 'user-visitor-1',
    username: 'visitor',
    email: 'visitor@tna.test',
    user_role: 'VISITOR',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  OWNER: {
    user_id: 'user-owner-1',
    username: 'owner',
    email: 'owner@tna.test',
    user_role: 'OWNER',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  CARRIER_STAFF: {
    user_id: 'user-carrier-1',
    username: 'carrier',
    email: 'carrier@tna.test',
    user_role: 'CARRIER_STAFF',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  GOV_USER: {
    user_id: 'user-gov-1',
    username: 'gov',
    email: 'gov@tna.test',
    user_role: 'GOV_USER',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
};
