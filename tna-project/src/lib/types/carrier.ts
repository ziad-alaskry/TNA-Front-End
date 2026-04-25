export interface Carrier {
    carrier_id: string;
    company_name: string;
    commercial_registration: string;
    license_number: string;
    tax_id?: string;
    headquarters_address?: string;
    contact_email: string;
    contact_phone: string;
    is_verified: boolean;
    is_active: boolean;
    created_at: string;
}

export interface CarrierStaff {
    staff_id: string;
    user_id: string;
    carrier_id: string;
    full_name: string;
    employee_id?: string;
    position?: string;
    mobile?: string;
    is_active: boolean;
    created_at: string;
}

export interface CarrierVehicle {
    vehicle_id: string;
    carrier_id: string;
    plate_number: string;
    vehicle_type: string;
    status: 'IDLE' | 'ON_TRIP' | 'MAINTENANCE';
    assigned_staff_id?: string;
    last_known_latitude?: number;
    last_known_longitude?: number;
    updated_at: string;
}

export interface FleetData {
    vehicles: CarrierVehicle[];
    staff: CarrierStaff[];
}
