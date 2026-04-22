export interface TNA {
    tna_id: string;
    tna_code: string;
    status: 'UNLINKED' | 'ACTIVE' | 'SUSPENDED';
    linked_until?: string;
}

export interface TNAResponse {
    data: TNA[];
}