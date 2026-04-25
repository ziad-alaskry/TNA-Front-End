import apiClient from './client';
import { Binding, BindingResponse } from '../types/bindings';

export const bindingsApi = {
    getBindings: async (role: 'visitor' | 'owner'): Promise<BindingResponse> => {
        const response = await apiClient.get<BindingResponse>(`/bindings`, {
            params: { role }
        });
        return response.data;
    },

    approveBinding: async (id: string): Promise<Binding> => {
        const response = await apiClient.post<{ data: Binding }>(`/bindings/${id}/approve`);
        return response.data.data;
    },

    rejectBinding: async (id: string, reason?: string): Promise<void> => {
        await apiClient.post(`/bindings/${id}/reject`, { reason });
    }
};