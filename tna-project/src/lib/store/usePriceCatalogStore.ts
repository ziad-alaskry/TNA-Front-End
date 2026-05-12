import { create } from 'zustand';
import type { PriceCatalogEntry, UpdatePriceEntryRequest } from '@/lib/types/priceCatalog';
import type { RentQuote, RentQuoteParams } from '@/lib/types/rentals';
import { priceCatalogApi } from '@/lib/api/priceCatalog';
import { financialsApi } from '@/lib/api/financials';

interface PriceCatalogState {
  entries: PriceCatalogEntry[];
  loading: boolean;
  error: string | null;
  fetchEntries: () => Promise<void>;
  updateEntry: (id: string, data: UpdatePriceEntryRequest) => Promise<void>;
  getRentQuote: (params: RentQuoteParams) => Promise<RentQuote>;
}

export const usePriceCatalogStore = create<PriceCatalogState>()((set, get) => ({
  entries: [],
  loading: false,
  error: null,

  fetchEntries: async () => {
    set({ loading: true, error: null });
    try {
      const response = await priceCatalogApi.getCatalog();
      set({ entries: response.data, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch price catalog', loading: false });
    }
  },

  updateEntry: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const response = await priceCatalogApi.updateEntry(id, data);
      set(state => ({
        entries: state.entries.map(entry =>
          entry.catalog_id === id
            ? response.data
            : entry
        ),
        loading: false
      }));
    } catch (err: any) {
      set({ error: err.message || 'Failed to update price entry', loading: false });
      throw err;
    }
  },

  getRentQuote: async (params: RentQuoteParams): Promise<RentQuote> => {
    try {
      const quote = await financialsApi.getRentQuote(params);
      return quote;
    } catch (err: any) {
      set({ error: err.message || 'Failed to get rent quote' });
      throw err;
    }
  },
}));
