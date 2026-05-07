import { FinancialTransaction, LedgerEntry } from '../types/ledger';

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
