import apiClient from './client';

/**
 * TNA Resolution Result — address-only, NO visitor PII
 * Security: Must not expose visitor identity fields
 */
export interface TNAResolutionResult {
  deliverable: boolean;
  tna_code: string;
  sub_address: {
    sub_address_id: string;
    suffix_code: string;
    label: string;
  };
  national_address: {
    na_id: string;
    full_address: string;
    city: string;
    district: string;
    latitude: number;
    longitude: number;
  };
  binding_status: 'UNLINKED' | 'ACTIVE' | 'EXPIRED';
  error?: string; // Only present if deliverable = false
}

/**
 * TNA Resolver API
 * POST /v1/resolve
 *
 * Used by carrier staff to convert TNA code → physical address
 * Output is stripped of visitor personal information
 */
export const resolverApi = {
  resolveTNA: async (tna_code: string): Promise<TNAResolutionResult> => {
    const response = await apiClient.post<TNAResolutionResult>('/v1/resolve', {
      tna_code,
    });
    return response.data;
  },
};
