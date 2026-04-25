export type ShipmentStatus = 'CREATED' | 'PICKED_UP' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'FAILED' | 'RETURNED';

export interface Shipment {
    shipment_id: string;
    carrier_id: string;
    tracking_number: string;
    tna_id: string;
    assigned_staff_id?: string;
    status: ShipmentStatus;
    origin_address?: string;
    destination_address_full?: string;
    estimated_delivery?: string;
    actual_delivery?: string;
    delivery_signature?: string;
    delivery_photo_url?: string;
    package_details?: {
        weight?: number;
        dimensions?: string;
        contents?: string;
    };
    failure_reason?: string;
    created_at: string;
    updated_at: string;
}

export interface ShipmentStatusLog {
    log_id: string;
    shipment_id: string;
    status: ShipmentStatus;
    location?: string;
    latitude?: number;
    longitude?: number;
    notes?: string;
    logged_at: string;
}

export interface ShipmentResponse {
    data: Shipment[];
}

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
