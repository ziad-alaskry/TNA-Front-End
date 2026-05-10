import apiClient from './client';
import type { RentQuote, RentQuoteParams } from '@/lib/types/rentals';

export const financialsApi = {
  /**
   * Get rental price quote before binding request
   * POST /v1/pricing/rent-quote
   */
  getRentQuote: async (params: RentQuoteParams): Promise<RentQuote> => {
    const response = await apiClient.post<RentQuote>('/v1/pricing/rent-quote', params);
    return response.data;
  },

  /**
   * Create an order (financial transaction) for a binding
   * POST /v1/orders
   */
  createOrder: async (binding_id: string): Promise<{ order_id: string; total_amount: number }> => {
    const response = await apiClient.post<{ order_id: string; total_amount: number }>('/v1/orders', {
      binding_id,
    });
    return response.data;
  },

  /**
   * Initiate payment for an order
   * POST /v1/orders/{order_id}/pay
   */
  payOrder: async (order_id: string, payment_method: string = 'credit_card'): Promise<{ payment_id: string; status: string }> => {
    const response = await apiClient.post<{ payment_id: string; status: string }>(`/v1/orders/${order_id}/pay`, {
      payment_method,
    });
    return response.data;
  },

  /**
   * Get order/payment status
   * GET /v1/orders/{order_id}
   */
  getOrderStatus: async (order_id: string): Promise<{ status: string; transaction_id?: string }> => {
    const response = await apiClient.get<{ status: string; transaction_id?: string }>(`/v1/orders/${order_id}`);
    return response.data;
  },
};
