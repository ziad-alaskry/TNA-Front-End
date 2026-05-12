import apiClient from './client';
import type { PriceCatalogEntry } from '@/lib/types/priceCatalog';

export const priceCatalogApi = {
  /**
   * Get price catalog entries (e.g., TNA issuance fees, rental rates)
   * GET /v1/pricing/tna-issuance
   */
  getCatalog: async (): Promise<{ data: PriceCatalogEntry[] }> => {
    const response = await apiClient.get<{ data: PriceCatalogEntry[] }>('/v1/pricing/tna-issuance');
    return response.data;
  },

  /**
   * Update a price catalog entry (admin only)
   * PUT /v1/pricing/catalog/{catalog_id}
   */
  updateEntry: async (catalog_id: string, data: Partial<PriceCatalogEntry>): Promise<{ data: PriceCatalogEntry }> => {
    const response = await apiClient.put<{ data: PriceCatalogEntry }>(`/v1/pricing/catalog/${catalog_id}`, data);
    return response.data;
  },
};
