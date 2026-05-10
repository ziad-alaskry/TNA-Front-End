import apiClient from './client';
import type { TNAIssuanceRequest } from '@/lib/types/tna';
import type { SubAddress } from '@/lib/types/na';

export interface TNAQueueFilters {
  status?: string;
  mode_at_submission?: 'AUTONOMOUS' | 'MODERATED';
  visitor_nationality?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  limit?: number;
}

export interface AddressQueueFilters {
  is_verified?: boolean;
  city?: string;
  owner_type?: 'INDIVIDUAL' | 'BUSINESS';
  date_from?: string;
  date_to?: string;
  page?: number;
  limit?: number;
}

export const govQueueApi = {
  /**
   * Get TNA issuance request queue
   * GET /v1/gov/issue-requests
   */
  getTNAQueue: async (filters: TNAQueueFilters = {}): Promise<{ data: TNAIssuanceRequest[]; total: number }> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') params.append(key, String(value));
    });
    const response = await apiClient.get<{ data: TNAIssuanceRequest[]; total: number }>(`/v1/gov/issue-requests?${params.toString()}`);
    return response.data;
  },

  /**
   * Approve a TNA issuance request
   * POST /v1/gov/issue-requests/{request_id}/approve
   */
  approveTNARequest: async (request_id: string): Promise<{ success: boolean; tna_code?: string }> => {
    const response = await apiClient.post<{ success: boolean; tna_code?: string }>(`/v1/gov/issue-requests/${request_id}/approve`);
    return response.data;
  },

  /**
   * Reject a TNA issuance request
   * POST /v1/gov/issue-requests/{request_id}/reject
   */
  rejectTNARequest: async (request_id: string, reason: string): Promise<{ success: boolean }> => {
    const response = await apiClient.post<{ success: boolean }>(`/v1/gov/issue-requests/${request_id}/reject`, { reason });
    return response.data;
  },

  /**
   * Get sub-address verification queue (addresses pending gov verification)
   * GET /v1/gov/na/sub-addresses?is_verified=false
   */
  getAddressVerificationQueue: async (filters: AddressQueueFilters = {}): Promise<{ data: SubAddress[]; total: number }> => {
    const params = new URLSearchParams();
    params.append('is_verified', 'false');
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') params.append(key, String(value));
    });
    const response = await apiClient.get<{ data: SubAddress[]; total: number }>(`/v1/gov/na/sub-addresses?${params.toString()}`);
    return response.data;
  },

  /**
   * Get settlement adjustments pending approval
   * GET /v1/gov/adjustments?status=PENDING
   */
  getAdjustmentsQueue: async (): Promise<{ data: any[] }> => {
    const response = await apiClient.get<{ data: any[] }>('/v1/gov/adjustments?status=PENDING');
    return response.data;
  },

  /**
   * Approve a settlement adjustment
   * POST /v1/gov/adjustments/{adjustment_id}/approve
   */
  approveAdjustment: async (adjustment_id: string): Promise<{ success: boolean }> => {
    const response = await apiClient.post<{ success: boolean }>(`/v1/gov/adjustments/${adjustment_id}/approve`);
    return response.data;
  },
};
