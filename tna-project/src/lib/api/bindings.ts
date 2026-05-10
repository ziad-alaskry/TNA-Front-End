import apiClient from './client';
import { Binding, BindingResponse } from '../types/bindings';

export const bindingsApi = {
    getBindings: async (role: 'visitor' | 'owner'): Promise<BindingResponse> => {
        const response = await apiClient.get<BindingResponse>(`/bindings`, {
            params: { role }
        });
        return response.data;
    },

    getBindingById: async (id: string): Promise<{ data: Binding }> => {
        const response = await apiClient.get<{ data: Binding }>(`/bindings/${id}`);
        return response.data;
    },

    createBinding: async (data: {
        tna_id: string
        sub_address_id: string
        rental_period_type: 'DAILY' | 'MONTHLY' | 'YEARLY'
        rental_duration: number
    }): Promise<{ data: Binding; rent_contract: any }> => {
        const response = await apiClient.post<{ data: Binding; rent_contract: any }>('/bindings', data);
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