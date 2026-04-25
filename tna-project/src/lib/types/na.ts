export type OwnershipProofStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface NationalAddress {
    na_id: string;
    owner_id: string;
    full_address: string;
    building_number?: string;
    street_name?: string;
    district?: string;
    city: string;
    postal_code?: string;
    additional_number?: string;
    unit_number?: string;
    latitude?: number;
    longitude?: number;
    registry_reference?: any; // PDF or Reference info
    title_deed_reference: string;
    na_certificate_url?: string;
    ownership_proof_status: OwnershipProofStatus;
    verified_at?: string;
    created_at: string;
}

export interface SubAddress {
    sub_address_id: string;
    na_id: string;
    suffix_code: string;
    label?: string;
    description?: string;
    is_available: boolean;
    is_verified: boolean;
    verified_at?: string;
    verified_by_gov_user_id?: string;
    verification_notes?: string;
    created_at: string;
}

export interface NationalAddressResponse {
    data: NationalAddress[];
}

export interface SubAddressResponse {
    data: SubAddress[];
}

export interface NAStats {
    total: number;
    linked: number;
    unlinked: number;
}

export interface NAStatsResponse {
    data: NAStats;
}
