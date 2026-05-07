import { create } from 'zustand';
import { PriceCatalogEntry, PriceCatalogResponse, UpdatePriceEntryRequest } from '@/lib/types/priceCatalog';

interface PriceCatalogState {
  entries: PriceCatalogEntry[];
  loading: boolean;
  error: string | null;
  fetchEntries: () => Promise<void>;
  updateEntry: (id: string, data: UpdatePriceEntryRequest) => Promise<void>;
}

export const usePriceCatalogStore = create<PriceCatalogState>()((set, get) => ({
  entries: [],
  loading: false,
  error: null,
  
  fetchEntries: async () => {
    set({ loading: true, error: null });
    try {
      // TODO: Implement API call
      const response: PriceCatalogResponse = { data: [] };
      set({ entries: response.data, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch price catalog', loading: false });
    }
  },
  
  updateEntry: async (id, data) => {
    set({ loading: true, error: null });
    try {
      // TODO: Implement API call
      set(state => ({
        entries: state.entries.map(entry =>
          entry.catalog_id === id
            ? { ...entry, ...data, updated_at: new Date().toISOString() }
            : entry
        ),
        loading: false
      }));
    } catch (err) {
      set({ error: 'Failed to update price entry', loading: false });
    }
  },
}));
