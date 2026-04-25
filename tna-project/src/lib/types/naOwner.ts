export type OwnerType = 'INDIVIDUAL' | 'BUSINESS';

export interface Owner {
    owner_id: string;
    user_id: string;
    owner_type: OwnerType;
    full_name: string;
    business_name?: string;
    commercial_registration?: string;
    national_id: string;
    tax_id?: string;
    mobile: string;
    nationality?: string;
    bank_account_info?: {
        bank_name: string;
        account_number: string;
        iban: string;
        swift?: string;
    };
    is_verified: boolean;
    verified_at?: string;
    created_at: string;
}

export interface OwnerAccount {
    account_id: string;
    owner_id: string;
    current_balance: number; // wallet_balance
    pending_balance: number;
    total_earned: number;
    total_paid_out: number;
    currency: string;
    payout_method: 'BANK_TRANSFER' | 'WALLET' | 'CHECK';
    payout_details?: any;
    last_payout_at?: string;
    account_status: 'ACTIVE' | 'SUSPENDED' | 'CLOSED';
    updated_at: string;
}

export interface OwnerResponse {
    data: Owner;
}

export interface OwnerAccountResponse {
    data: OwnerAccount;
}
