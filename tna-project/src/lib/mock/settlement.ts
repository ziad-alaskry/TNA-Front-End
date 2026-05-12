/**
 * Mock data for settlement adjustments
 * Aligned with `settlement_adjustments` table
 */

export interface SettlementAdjustment {
  adjustment_id: string;
  binding_id: string;
  tna_id: string;
  adjustment_type: 'PLATFORM_FEE_ADJUSTMENT' | 'AUTHORITY_SHARE_ADJUSTMENT' | 'OWNER_PAYOUT_ADJUSTMENT' | 'REFUND';
  adjustment_amount: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'APPLIED';
  initiated_by_user_id: string;
  approved_by_user_id?: string;
  approval_notes?: string;
  created_at: string;
  updated_at: string;
}

export const mockSettlementAdjustments: SettlementAdjustment[] = [
  {
    adjustment_id: 'ADJ-001',
    binding_id: 'bind-1',
    tna_id: 'tna-1',
    adjustment_type: 'PLATFORM_FEE_ADJUSTMENT',
    adjustment_amount: -25.00,
    reason: 'Promotional discount for first-time renter',
    status: 'PENDING',
    initiated_by_user_id: 'user-admin-1',
    created_at: '2026-05-08T10:00:00Z',
    updated_at: '2026-05-08T10:00:00Z',
  },
  {
    adjustment_id: 'ADJ-002',
    binding_id: 'bind-2',
    tna_id: 'tna-2',
    adjustment_type: 'OWNER_PAYOUT_ADJUSTMENT',
    adjustment_amount: 50.00,
    reason: 'Manual bonus for long-term rental (12+ months)',
    status: 'APPROVED',
    initiated_by_user_id: 'user-admin-1',
    approved_by_user_id: 'user-gov-1',
    approval_notes: 'Bonus approved per policy §5.2',
    created_at: '2026-05-05T14:30:00Z',
    updated_at: '2026-05-06T09:15:00Z',
  },
  {
    adjustment_id: 'ADJ-003',
    binding_id: 'bind-3',
    tna_id: 'tna-3',
    adjustment_type: 'REFUND',
    adjustment_amount: -120.00,
    reason: 'Customer dispute: service not rendered',
    status: 'REJECTED',
    initiated_by_user_id: 'user-support-1',
    approved_by_user_id: 'user-gov-2',
    approval_notes: 'Refund rejected — service was delivered with photo proof',
    created_at: '2026-05-03T08:45:00Z',
    updated_at: '2026-05-04T11:20:00Z',
  },
];
