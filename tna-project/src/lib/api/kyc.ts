import apiClient from './client';
import type { KYCVerification, KYCVerificationResponse, KYCDocument } from '@/lib/types/kyc';

export interface KYCSubmission {
  visitor_id: string;
  documents: Array<{
    doc_type: string;
    file_base64: string;
    filename: string;
  }>;
}

export const kycApi = {
  /**
   * Submit KYC documents for verification
   * POST /v1/visitors/kyc/documents
   */
  submitDocuments: async (data: KYCSubmission): Promise<KYCVerificationResponse> => {
    const response = await apiClient.post<KYCVerificationResponse>('/v1/visitors/kyc/documents', data);
    return response.data;
  },

  /**
   * Get current KYC status for visitor
   * GET /v1/visitors/{visitor_id}/kyc
   */
  getKYCStatus: async (visitor_id: string): Promise<KYCVerification> => {
    const response = await apiClient.get<{ data: KYCVerification }>(`/v1/visitors/${visitor_id}/kyc`);
    return response.data.data;
  },
};
