export type TNARequestStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'ISSUED';
export type TNAStatus = 'UNLINKED' | 'ACTIVE' | 'EXPIRED' | 'REVOKED' | 'PENDING_OWNER_APPROVAL' | 'SUSPENDED';

export interface TNAIssuanceRequest {
    request_id: string;
    visitor_id: string;
    request_status: TNARequestStatus;
    mode_at_submission: 'MODERATED' | 'AUTONOMOUS';
    reviewed_by_gov_user_id?: string;
    rejection_reason?: string;
    eligibility_snapshot?: any; // Added based on task.md requirement
    supporting_documents: {
        doc_type: string;
        url: string;
        uploaded_at: string;
    }[];
    created_at: string;
    reviewed_at?: string;
    issued_at?: string;
}

export interface TNA {
    tna_id: string;
    visitor_id: string;
    issuance_request_id: string;
    tna_code: string;
    status: TNAStatus;
    issued_at: string;
    expires_at: string;
    revoked_at?: string;
    revocation_reason?: string;
    created_at?: string; // from task.md
}

export interface TNAResponse {
    data: TNA[];
}

export interface TNAIssuanceRequestResponse {
    data: TNAIssuanceRequest[];
}
