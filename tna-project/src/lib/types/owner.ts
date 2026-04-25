export interface Property {
    id: string;
    name: string;
    building_number: string;
    sector_id?: string;
    is_verified: boolean | 'VERIFIED' | 'PENDING';
    created_at?: string;
}
