/**
 * Visitor types
 * Aligned with data model v2.1 `visitors` table
 */

import type { KYCStatus } from './kyc';

export interface Visitor {
  visitor_id: string;
  user_id: string;
  full_name: string;
  nationality: string;
  date_of_birth: string;
  document_type: 'VISA' | 'IQAMA' | 'PASSPORT';
  document_number: string;
  document_expiry?: string;
  mobile: string;
  kyc_status: KYCStatus;
  kyc_verified_at?: string;
  max_active_tnas: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface VisitorTNA {
  visitor_tna_id: string;
  visitor_id: string;
  tna_code: string;
  status: 'UNLINKED' | 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  issued_at: string;
  expires_at: string;
  created_at: string;
}

export interface VisitorResponse {
  data: Visitor;
}

export interface VisitorTNAResponse {
  data: VisitorTNA[];
}
