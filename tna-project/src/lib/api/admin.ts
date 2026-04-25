import apiClient from './client';
import { GovUser, AuditLogEntry, PolicyConfiguration } from '../types/admin';

export const adminApi = {
    getAuditLog: async (params?: any): Promise<{ data: AuditLogEntry[] }> => {
        const response = await apiClient.get<{ data: AuditLogEntry[] }>('/admin/audit-logs', { params });
        return response.data;
    },

    getPolicyConfig: async (): Promise<{ data: PolicyConfiguration }> => {
        const response = await apiClient.get<{ data: PolicyConfiguration }>('/admin/policy-config');
        return response.data;
    },

    updatePolicyConfig: async (data: Partial<PolicyConfiguration>): Promise<PolicyConfiguration> => {
        const response = await apiClient.patch<{ data: PolicyConfiguration }>('/admin/policy-config', data);
        return response.data.data;
    },

    getGovUsers: async (): Promise<{ data: GovUser[] }> => {
        const response = await apiClient.get<{ data: GovUser[] }>('/admin/gov-users');
        return response.data;
    },

    updateGovUser: async (id: string, data: Partial<GovUser>): Promise<GovUser> => {
        const response = await apiClient.patch<{ data: GovUser }>(`/admin/gov-users/${id}`, data);
        return response.data.data;
    }
};