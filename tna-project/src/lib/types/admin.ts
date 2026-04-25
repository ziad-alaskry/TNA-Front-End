export type GovUserRole = 'REVIEWER' | 'APPROVER' | 'ADMIN' | 'AUDITOR';

export interface GovernmentAgency {
    agency_id: string;
    agency_code: string;
    agency_name_en: string;
    agency_name_ar?: string;
    parent_agency_id?: string;
    permissions?: string[];
    is_active: boolean;
    created_at: string;
}

export interface GovUser {
    gov_user_id: string;
    user_id: string;
    agency_id: string;
    full_name: string;
    employee_id: string;
    department?: string;
    position?: string;
    role: GovUserRole;
    additional_permissions?: string[];
    is_active: boolean;
    created_at: string;
}

export interface AuditLogEntry {
    log_id: string;
    action_type: string;
    actor_id: string; // user_id
    actor_type: string;
    resource_type: string;
    resource_id: string;
    old_value?: any;
    new_value?: any;
    ip_address?: string;
    user_agent?: string;
    created_at: string;
}

export interface PolicyConfiguration {
    config_id: string;
    policy_name: string;
    issuance_mode: 'MODERATED' | 'AUTONOMOUS';
    eligibility_rules: any;
    pricing_catalog_id: string;
    is_active: boolean;
    effective_from: string;
    effective_until?: string;
    created_at: string;
}

export interface PriceCatalogEntry {
    catalog_id: string;
    item_type: 'TNA_ISSUANCE' | 'RENTAL_DAILY' | 'RENTAL_MONTHLY' | 'RENTAL_YEARLY' | 'SERVICE_FEE';
    item_name: string;
    base_price: number;
    currency: string;
    pricing_rules?: any;
    platform_fee_percentage: number;
    authority_share_percentage: number;
    is_active: boolean;
    created_at: string;
}
