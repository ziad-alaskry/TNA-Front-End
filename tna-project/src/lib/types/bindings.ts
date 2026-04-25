export type BindingStatus = 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'TERMINATED';

export interface Binding {
    binding_id: string;
    tna_id: string;
    sub_address_id: string;
    rent_contract_id?: string;
    status: BindingStatus;
    start_at: string;
    end_at: string;
    approved_by_owner_id?: string;
    approved_at?: string;
    termination_reason?: string;
    created_at: string;
    updated_at: string;
    // UI Helpers (optional, based on usage)
    tna_code?: string;
    na_id?: string; // from task.md
    visitor_id?: string; // from task.md
}

export interface BindingResponse {
    data: Binding[];
}
