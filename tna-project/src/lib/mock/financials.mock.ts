import { FinancialTransaction, LedgerEntry } from '../types/ledger';
import type { RentContract } from '../types/rentals';

export const mockBalances: Record<string, number> = {
  'user-visitor-1': 450.00,
  'user-owner-1': 12300.00,
  'user-carrier-1': 50000.00,
};

export const mockTransactions: FinancialTransaction[] = [
  {
    transaction_id: 'tx-1',
    user_id: 'user-visitor-1',
    user_role: 'VISITOR',
    transaction_type: 'RENTAL_PAYMENT',
    amount: 500.00,
    currency: 'SAR',
    status: 'COMPLETED',
    description: 'TNA Binding Rental - TNA-ABCD1234',
    metadata: {
        tna_code: 'TNA-ABCD1234',
        na_id: 'na-1'
    },
    created_at: '2024-02-05T09:50:00Z',
    updated_at: '2024-02-05T10:00:00Z',
    settled_at: '2024-02-05T10:00:00Z',
  },
  {
    transaction_id: 'tx-2',
    user_id: 'user-visitor-1',
    user_role: 'VISITOR',
    transaction_type: 'DEPOSIT',
    amount: 1000.00,
    currency: 'SAR',
    status: 'COMPLETED',
    description: 'Wallet Top-up',
    created_at: '2024-02-01T12:00:00Z',
    updated_at: '2024-02-01T12:05:00Z',
    settled_at: '2024-02-01T12:05:00Z',
  }
];

/**
 * Mock weekly revenue data for dashboard charts
 */
export const mockWeeklyRevenue: number[] = [12000, 15000, 8000, 18000, 22000, 19000, 14000];

/**
 * Mock rent_contracts aligned with data model v2.1
 */
export const mockRentContracts: RentContract[] = [
  {
    rent_contract_id: 'RC-001',
    binding_id: 'bind-1',
    tna_id: 'tna-1',
    sub_address_id: 'sub-1-room',
    gross_amount: 500.00,
    platform_fee_percentage: 10,
    platform_fee_amount: 50.00,
    authority_share_percentage: 5,
    authority_share_amount: 25.00,
    net_owner_amount: 425.00,
    rental_period_type: 'MONTHLY',
    rental_duration: 3,
    start_at: '2024-02-05T00:00:00Z',
    end_at: '2025-02-05T00:00:00Z',
    status: 'ACTIVE',
    created_at: '2024-02-04T12:00:00Z',
    updated_at: '2024-02-05T10:00:00Z',
  },
  {
    rent_contract_id: 'RC-002',
    binding_id: 'bind-pending-1',
    tna_id: 'tna-2',
    sub_address_id: 'sub-2-apt1',
    gross_amount: 1200.00,
    platform_fee_percentage: 10,
    platform_fee_amount: 120.00,
    authority_share_percentage: 5,
    authority_share_amount: 60.00,
    net_owner_amount: 1020.00,
    rental_period_type: 'YEARLY',
    rental_duration: 1,
    start_at: '2024-05-10T00:00:00Z',
    end_at: '2025-05-10T00:00:00Z',
    status: 'PENDING',
    created_at: '2024-05-06T09:00:00Z',
    updated_at: '2024-05-06T09:00:00Z',
  },
];

