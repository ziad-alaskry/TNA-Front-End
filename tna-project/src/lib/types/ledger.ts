export type TransactionType = 
  | 'TNA_ISSUANCE_FEE'
  | 'RENTAL_PAYMENT'
  | 'SERVICE_FEE'
  | 'DELIVERY_FEE'
  | 'LATE_FEE'
  | 'REFUND'
  | 'WITHDRAWAL'
  | 'DEPOSIT'
  | 'ADJUSTMENT';

export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'DISPUTED';

export interface FinancialTransaction {
  transaction_id: string;
  order_id?: string;
  binding_id?: string;
  shipment_id?: string;
  adjustment_id?: string;
  user_id: string;
  user_role: 'VISITOR' | 'OWNER' | 'CARRIER' | 'GOV';
  transaction_type: TransactionType;
  amount: number;
  currency: string;
  status: TransactionStatus;
  description: string;
  metadata?: {
    tna_code?: string;
    na_id?: string;
    property_id?: string;
    carrier_id?: string;
  };
  payment_method?: {
    type: string;
    last4?: string;
    brand?: string;
  };
  settled_at?: string;
  created_at: string;
  updated_at: string;
}

export interface LedgerEntry {
  entry_id: string;
  account_id: string;
  transaction_id: string;
  debit: number;
  credit: number;
  balance_after: number;
  description: string;
  created_at: string;
}

export interface FinancialTransactionResponse {
  data: FinancialTransaction[];
}

export interface LedgerResponse {
  data: LedgerEntry[];
}

export interface CreateTransactionRequest {
  order_id?: string;
  binding_id?: string;
  shipment_id?: string;
  user_id: string;
  transaction_type: TransactionType;
  amount: number;
  currency: string;
  description: string;
  payment_method_id?: string;
  metadata?: FinancialTransaction['metadata'];
}
