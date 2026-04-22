export interface NAStats {
    total: number;
    linked: number;
    unlinked: number;
}

export interface NationalAddress {
    na_id: string;
    na_code: string;
    status: 'LINKED' | 'UNLINKED' | 'PROCESSING';
}

export interface Binding {
    binding_id: string;
    na_code: string;
    tna_code: string;
    status: 'PENDING' | 'ACTIVE' | 'PROCESSING';
}

export interface NAStatsResponse {
    data: NAStats;
}

export interface NationalAddressResponse {
    data: NationalAddress[];
}

export interface BindingResponse {
    data: Binding[];
}
