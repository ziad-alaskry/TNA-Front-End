export interface Property {
    id: string;
    name: string;
    building_number: string;
    sector_id?: string;
    is_verified: boolean | 'VERIFIED' | 'PENDING';
    auto_accept: boolean;
    created_at?: string;
}
