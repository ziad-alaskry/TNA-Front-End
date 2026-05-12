export type KYCStatus = 'NOT_STARTED' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';

export type KYCDocType = 
  | 'NATIONAL_ID'
  | 'PASSPORT'
  | 'RESIDENCE_PERMIT'
  | 'DRIVER_LICENSE'
  | 'BUSINESS_LICENSE'
  | 'PROOF_OF_ADDRESS';

export interface KYCDocument {
  document_id: string;
  user_id: string;
  document_type: KYCDocType;
  document_number?: string;
  issuing_country?: string;
  expiry_date?: string;
  front_image_url: string;
  back_image_url?: string;
  selfie_image_url?: string;
  status: KYCStatus;
  rejection_reason?: string;
  reviewed_by_user_id?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface KYCVerification {
  verification_id: string;
  user_id: string;
  overall_status: KYCStatus;
  documents: KYCDocument[];
  verification_score?: number;
  notes?: string;
  next_review_date?: string;
  created_at: string;
  updated_at: string;
}

export interface KYCUpdateRequest {
  status?: KYCStatus;
  notes?: string;
  next_review_date?: string;
}

export interface KYCVerificationResponse {
  data: KYCVerification;
}
