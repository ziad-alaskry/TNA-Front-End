import { create } from 'zustand';
import { SettlementAdjustment, SettlementAdjustmentResponse } from '@/lib/types/settlement';

interface SettlementState {
  adjustments: SettlementAdjustment[];
  loading: boolean;
  error: string | null;
  fetchAdjustments: () => Promise<void>;
  createAdjustment: (adjustment: Omit<SettlementAdjustment, 'adjustment_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateAdjustment: (id: string, status: SettlementAdjustment['status']) => Promise<void>;
}

export const useSettlementStore = create<SettlementState>()((set, get) => ({
  adjustments: [],
  loading: false,
  error: null,
  
  fetchAdjustments: async () => {
    set({ loading: true, error: null });
    try {
      // TODO: Implement API call
      const response: SettlementAdjustmentResponse = { data: [] };
      set({ adjustments: response.data, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch settlements', loading: false });
    }
  },
  
  createAdjustment: async (adjustment) => {
    set({ loading: true, error: null });
    try {
      // TODO: Implement API call
      const newAdjustment: SettlementAdjustment = {
        ...adjustment,
        adjustment_id: `adj-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      set(state => ({ 
        adjustments: [newAdjustment, ...state.adjustments],
        loading: false 
      }));
    } catch (err) {
      set({ error: 'Failed to create settlement', loading: false });
    }
  },
  
  updateAdjustment: async (id, status) => {
    try {
      // TODO: Implement API call
      set(state => ({
        adjustments: state.adjustments.map(adj =>
          adj.adjustment_id === id
            ? { ...adj, status, updated_at: new Date().toISOString() }
            : adj
        )
      }));
    } catch (err) {
      set({ error: 'Failed to update settlement' });
    }
  },
}));