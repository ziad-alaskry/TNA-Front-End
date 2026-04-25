import apiClient from './client';
import { TNA, TNAResponse, TNAIssuanceRequest } from '../types/tna';

export const tnaApi = {
    getTnas: async (): Promise<TNAResponse> => {
        const response = await apiClient.get<TNAResponse>('/tnas');
        return response.data;
    },

    getTnaById: async (id: string): Promise<TNA> => {
        const response = await apiClient.get<{ data: TNA }>(`/tnas/${id}`);
        return response.data.data;
    },

    requestTna: async (data: Partial<TNAIssuanceRequest>): Promise<TNAIssuanceRequest> => {
        const response = await apiClient.post<{ data: TNAIssuanceRequest }>('/tnas/request', data);
        return response.data.data;
    },

    cancelTna: async (id: string, reason?: string): Promise<void> => {
        await apiClient.post(`/tnas/${id}/cancel`, { reason });
    }
};