import { create } from 'zustand';
import type { Binding, BindingStatus } from '@/lib/types/bindings';
import { bindingsApi } from '@/lib/api/bindings';

interface BindingState {
  bindings: Binding[];
  selectedBinding: Binding | null;
  loading: boolean;
  error: string | null;
  fetchBindings: (role: 'visitor' | 'owner') => Promise<void>;
  fetchBindingById: (id: string) => Promise<void>;
  approveBinding: (id: string) => Promise<void>;
  rejectBinding: (id: string, reason?: string) => Promise<void>;
  terminateBinding: (id: string) => Promise<void>;
  setSelectedBinding: (binding: Binding | null) => void;
}

export const useBindingStore = create<BindingState>()((set, get) => ({
  bindings: [],
  selectedBinding: null,
  loading: false,
  error: null,

  fetchBindings: async (role: 'visitor' | 'owner') => {
    set({ loading: true, error: null });
    try {
      const response = await bindingsApi.getBindings(role);
      set({ bindings: response.data, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch bindings', loading: false });
    }
  },

  fetchBindingById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      // TODO: Implement GET /bindings/{id} in API
      // For now, find from local bindings list or fetch from server
      const response = await bindingsApi.getBindings('owner'); // workaround
      const binding = response.data.find(b => b.binding_id === id);
      if (binding) {
        set({ selectedBinding: binding, loading: false });
      } else {
        set({ error: 'Binding not found', loading: false });
      }
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch binding', loading: false });
    }
  },

  approveBinding: async (id: string) => {
    try {
      const updated = await bindingsApi.approveBinding(id);
      set(state => ({
        bindings: state.bindings.map(b => b.binding_id === id ? updated : b),
        selectedBinding: state.selectedBinding?.binding_id === id ? updated : state.selectedBinding,
      }));
    } catch (err: any) {
      set({ error: err.message || 'Failed to approve binding' });
      throw err;
    }
  },

  rejectBinding: async (id: string, reason?: string) => {
    try {
      await bindingsApi.rejectBinding(id, reason);
      set(state => ({
        bindings: state.bindings.map(b => b.binding_id === id ? { ...b, status: 'CANCELLED' as BindingStatus } : b),
        selectedBinding: state.selectedBinding?.binding_id === id ? { ...state.selectedBinding, status: 'CANCELLED' as BindingStatus } : state.selectedBinding,
      }));
    } catch (err: any) {
      set({ error: err.message || 'Failed to reject binding' });
      throw err;
    }
  },

  terminateBinding: async (id: string) => {
    try {
      // API endpoint not yet defined in bindings.ts — stub for now
      // Will be implemented when backend endpoint is ready
      set(state => ({
        bindings: state.bindings.map(b => b.binding_id === id ? { ...b, status: 'TERMINATED' as BindingStatus } : b),
        selectedBinding: state.selectedBinding?.binding_id === id ? { ...state.selectedBinding, status: 'TERMINATED' as BindingStatus } : state.selectedBinding,
      }));
    } catch (err: any) {
      set({ error: err.message || 'Failed to terminate binding' });
      throw err;
    }
  },

  setSelectedBinding: (binding: Binding | null) => {
    set({ selectedBinding: binding });
  },
}));
