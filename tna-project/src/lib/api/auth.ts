import apiClient from './client';
import { LoginRequest, LoginResponse, SignupRequest } from '../types/auth';

export const authApi = {
    login: async (data: LoginRequest): Promise<LoginResponse> => {
        const response = await apiClient.post<LoginResponse>('/auth/login', data);
        return response.data;
    },

    signup: async (data: SignupRequest): Promise<LoginResponse> => {
        const response = await apiClient.post<LoginResponse>('/auth/signup', data);
        return response.data;
    },

    logout: async (): Promise<void> => {
        await apiClient.post('/auth/logout');
    },

    refreshToken: async (): Promise<{ token: string }> => {
        const response = await apiClient.post<{ token: string }>('/auth/refresh');
        return response.data;
    },

    forgotPassword: async (email: string): Promise<void> => {
        await apiClient.post('/auth/forgot-password', { email });
    }
};