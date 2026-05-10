import { create } from 'zustand';
import type { NationalAddress, SubAddress } from '@/lib/types/na';
import { nationalAddressesApi, subAddressesApi } from '@/lib/api/subAddresses';

interface SubAddressState {
  addresses: NationalAddress[];
  subAddresses: SubAddress[];
  filters: { city?: string; district?: string };
  loading: boolean;
  error: string | null;
  searchAddresses: (filters?: { city?: string; district?: string }) => Promise<void>;
  loadSubAddresses: (na_id: string) => Promise<void>;
  checkAvailability: (sub_address_id: string) => Promise<boolean>;
  setFilters: (filters: { city?: string; district?: string }) => void;
}

export const useSubAddressStore = create<SubAddressState>()((set, get) => ({
  addresses: [],
  subAddresses: [],
  filters: {},
  loading: false,
  error: null,

  searchAddresses: async (filters = {}) => {
    set({ loading: true, error: null, filters });
    try {
      const response = await nationalAddressesApi.getVerifiedAddresses(filters);
      set({ addresses: response.data, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to search addresses', loading: false });
    }
  },

  loadSubAddresses: async (na_id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await subAddressesApi.getSubAddresses(na_id);
      set({ subAddresses: response.data, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to load sub-addresses', loading: false });
    }
  },

  checkAvailability: async (sub_address_id: string): Promise<boolean> => {
    const { subAddresses } = get();
    const sub = subAddresses.find(s => s.sub_address_id === sub_address_id);
    return sub ? sub.is_available && sub.is_verified : false;
  },

  setFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters } });
  },
}));
