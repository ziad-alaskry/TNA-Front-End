import apiClient from './client';
import { NationalAddress, NationalAddressResponse } from '../types/na';

export const naApi = {
    searchAddresses: async (query: string): Promise<NationalAddressResponse> => {
        const response = await apiClient.get<NationalAddressResponse>(`/addresses/search`, {
            params: { q: query }
        });
        return response.data;
    },

    getAddressById: async (id: string): Promise<NationalAddress> => {
        const response = await apiClient.get<{ data: NationalAddress }>(`/addresses/${id}`);
        return response.data.data;
    },

    registerAddress: async (data: Partial<NationalAddress>): Promise<NationalAddress> => {
        const response = await apiClient.post<{ data: NationalAddress }>('/addresses/register', data);
        return response.data.data;
    }
};