export interface Delivery {
    delivery_id: string;
    tracking_no: string;
    carrier: string;
    tna_code: string;
    expected_at: string;
}

export interface DeliveryResponse {
    data: Delivery[];
}