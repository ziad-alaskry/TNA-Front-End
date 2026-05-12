import { create } from 'zustand';
import { 
  WebhookConfiguration, 
  UpdateWebhookRequest,
  WebhookTestRequest,
  WebhookTestResponse,
  WebhookLogEntry 
} from '@/lib/types/webhook';

interface WebhookState {
  configurations: WebhookConfiguration[];
  logs: WebhookLogEntry[];
  loading: boolean;
  error: string | null;
  fetchConfigurations: () => Promise<void>;
  updateConfiguration: (id: string, data: UpdateWebhookRequest) => Promise<void>;
  testWebhook: (id: string, testData: WebhookTestRequest) => Promise<WebhookTestResponse>;
  fetchLogs: (webhookId?: string) => Promise<void>;
}

export const useWebhookStore = create<WebhookState>()((set, get) => ({
  configurations: [],
  logs: [],
  loading: false,
  error: null,
  
  fetchConfigurations: async () => {
    set({ loading: true, error: null });
    try {
      // TODO: Implement API call
      set({ configurations: [], loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch webhooks', loading: false });
    }
  },
  
  updateConfiguration: async (id, data) => {
    set({ loading: true, error: null });
    try {
      // TODO: Implement API call
      set(state => ({
        configurations: state.configurations.map(config =>
          config.webhook_id === id
            ? { ...config, ...data, updated_at: new Date().toISOString() }
            : config
        ),
        loading: false
      }));
    } catch (err) {
      set({ error: 'Failed to update webhook', loading: false });
    }
  },
  
  testWebhook: async (id, testData) => {
    try {
      // TODO: Implement API call
      const result: WebhookTestResponse = {
        success: true,
        status_code: 200,
        response_time_ms: 45,
      };
      return result;
    } catch (err) {
      set({ error: 'Webhook test failed' });
      return {
        success: false,
        status_code: 0,
        response_time_ms: 0,
        error_message: 'Test failed',
      };
    }
  },
  
  fetchLogs: async (webhookId) => {
    set({ loading: true, error: null });
    try {
      // TODO: Implement API call
      set({ logs: [], loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch webhook logs', loading: false });
    }
  },
}));
