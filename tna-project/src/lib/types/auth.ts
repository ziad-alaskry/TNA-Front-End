export type UserRole = 'VISITOR' | 'OWNER' | 'GOV_USER' | 'CARRIER_STAFF';

export interface User {
    user_id: string;
    username: string;
    email: string;
    user_role: UserRole;
    is_active: boolean;
    last_login_at?: string;
    created_at: string;
    updated_at: string;
}

export interface LoginRequest {
    username: string;
    password_hash: string; // Or just password for client-side
}

export interface LoginResponse {
    token: string;
    user: User;
}

export interface SignupRequest {
    username: string;
    email: string;
    password?: string;
    password_hash?: string;
    user_role: UserRole;
    // Extended profile data based on role
    full_name: string;
    nationality: string;
    mobile: string;
    date_of_birth: string;
    document_type: 'PASSPORT' | 'VISA' | 'IQAMA';
    document_number: string;
    // B2B Support
    is_entity?: boolean;
    entity_name?: string;
    license_number?: string;
    agency_type?: 'HOTEL' | 'TOURISM' | 'OTHER';
}
