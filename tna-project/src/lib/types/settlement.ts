export type SettlementStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSED' | 'FAILED';

export interface SettlementAdjustment {
  adjustment_id: string;
  binding_id: string;
  dispute_type: 'DAMAGE' | 'LOSS' | 'DELAY' | 'QUALITY' | 'OTHER';
  claimant_id: string;
  claimant_role: 'VISITOR' | 'OWNER' | 'CARRIER';
  amount: number;
  currency: string;
  status: SettlementStatus;
  evidence_documents: {
    doc_type: string;
    url: string;
    uploaded_at: string;
  }[];
  resolution_notes?: string;
  resolved_by_user_id?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface SettlementAdjustmentResponse {
  data: SettlementAdjustment[];
}
