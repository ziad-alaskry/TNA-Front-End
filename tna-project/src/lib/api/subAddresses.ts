import apiClient from './client';
import type { SubAddress, NationalAddress, SubAddressResponse, NationalAddressResponse } from '@/lib/types/na';

export const subAddressesApi = {
  /**
   * Get all sub-addresses for a national address
   * GET /v1/na/{na_id}/sub-addresses
   */
  getSubAddresses: async (na_id: string): Promise<SubAddressResponse> => {
    const response = await apiClient.get<SubAddressResponse>(`/v1/na/${na_id}/sub-addresses`);
    return response.data;
  },

  /**
   * Create a new sub-address under a national address
   * POST /v1/na/{na_id}/sub-addresses
   */
  createSubAddress: async (na_id: string, data: Partial<SubAddress>): Promise<{ data: SubAddress }> => {
    const response = await apiClient.post<{ data: SubAddress }>(`/v1/na/${na_id}/sub-addresses`, data);
    return response.data;
  },

  /**
   * Verify a sub-address (government action)
   * PATCH /v1/gov/na/sub-addresses/{sub_address_id}/verify
   */
  verifySubAddress: async (sub_address_id: string, notes?: string): Promise<{ data: SubAddress }> => {
    const response = await apiClient.patch<{ data: SubAddress }>(`/v1/gov/na/sub-addresses/${sub_address_id}/verify`, { verification_notes: notes });
    return response.data;
  },
};

export const nationalAddressesApi = {
  /**
   * Get verified national addresses available for binding
   * GET /v1/na?is_verified=true
   */
  getVerifiedAddresses: async (filters?: { city?: string; district?: string }): Promise<NationalAddressResponse> => {
    const params = new URLSearchParams();
    if (filters?.city) params.append('city', filters.city);
    if (filters?.district) params.append('district', filters.district);
    params.append('is_verified', 'true');
    
    const response = await apiClient.get<NationalAddressResponse>(`/v1/na?${params.toString()}`);
    return response.data;
  },
};
