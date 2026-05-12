import apiClient from './client';
import type { RentContract, RentContractResponse } from '@/lib/types/rentals';

export const rentalsApi = {
  /**
   * Get rent contract by binding ID
   * GET /v1/bindings/{binding_id}/contract
   */
  getContractByBinding: async (binding_id: string): Promise<RentContract> => {
    const response = await apiClient.get<{ data: RentContract }>(`/bindings/${binding_id}/contract`);
    return response.data.data;
  },
};
