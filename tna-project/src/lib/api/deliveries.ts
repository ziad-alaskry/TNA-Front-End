import apiClient from './client';
import { Shipment, ShipmentResponse, ShipmentStatus } from '../types/deliveries';

export const deliveriesApi = {
    getShipments: async (role: 'visitor' | 'carrier'): Promise<ShipmentResponse> => {
        const response = await apiClient.get<ShipmentResponse>(`/shipments`, {
            params: { role }
        });
        return response.data;
    },

    getShipmentById: async (id: string): Promise<Shipment> => {
        const response = await apiClient.get<{ data: Shipment }>(`/shipments/${id}`);
        return response.data.data;
    },

    updateShipmentStatus: async (id: string, status: ShipmentStatus, notes?: string): Promise<Shipment> => {
        const response = await apiClient.patch<{ data: Shipment }>(`/shipments/${id}/status`, {
            status,
            notes
        });
        return response.data.data;
    }
};