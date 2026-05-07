export interface WebhookConfiguration {
  webhook_id: string;
  carrier_id: string;
  webhook_url: string;
  secret_key: string;
  events: WebhookEventType[];
  is_active: boolean;
  last_triggered_at?: string;
  last_status?: 'SUCCESS' | 'FAILED' | 'TIMEOUT';
  retry_count: number;
  created_at: string;
  updated_at: string;
}

export type WebhookEventType = 
  | 'DELIVERY_CREATED'
  | 'DELIVERY_PICKED_UP'
  | 'DELIVERY_IN_TRANSIT'
  | 'DELIVERY_OUT_FOR_DELIVERY'
  | 'DELIVERY_COMPLETED'
  | 'DELIVERY_FAILED'
  | 'BINDING_ACTIVATED'
  | 'BINDING_TERMINATED'
  | 'PAYMENT_COMPLETED'
  | 'TNA_ISSUED';

export interface UpdateWebhookRequest {
  webhook_url?: string;
  events?: WebhookEventType[];
  is_active?: boolean;
}

export interface WebhookTestRequest {
  event_type: WebhookEventType;
  test_payload: any;
}

export interface WebhookTestResponse {
  success: boolean;
  status_code: number;
  response_time_ms: number;
  error_message?: string;
}

export interface WebhookLogEntry {
  log_id: string;
  webhook_id: string;
  event_type: WebhookEventType;
  delivery_id?: string;
  binding_id?: string;
  payload: any;
  response_status: number;
  response_time_ms: number;
  success: boolean;
  error_message?: string;
  created_at: string;
}
