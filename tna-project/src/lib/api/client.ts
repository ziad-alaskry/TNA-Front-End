import axios, { AxiosError } from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { AppError, ApiError } from './types';

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for JWT
apiClient.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Response interceptor for errors
apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiError>) => {
        const status = error.response?.status;
        const data = error.response?.data;

        if (status === 401) {
            useAuthStore.getState().logout();
            // Optional: redirect to login if not already there
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth/login')) {
                window.location.href = '/auth/login';
            }
        }

        const message = data?.message || error.message || 'An unexpected error occurred';
        const appError = new AppError(
            message,
            status,
            data?.code,
            data?.errors
        );

        return Promise.reject(appError);
    }
);

export default apiClient;