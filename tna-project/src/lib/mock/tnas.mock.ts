import { TNA, TNAIssuanceRequest } from '../types/tna';

export const mockTNAs: TNA[] = [
  {
    tna_id: 'tna-1',
    visitor_id: 'user-visitor-1',
    issuance_request_id: 'req-1',
    tna_code: 'TNA-ABCD1234',
    status: 'ACTIVE',
    issued_at: '2024-02-01T00:00:00Z',
    expires_at: '2025-02-01T00:00:00Z',
    created_at: '2024-02-01T00:00:00Z',
  },
  {
    tna_id: 'tna-2',
    visitor_id: 'user-visitor-1',
    issuance_request_id: 'req-2',
    tna_code: 'TNA-XYZW5678',
    status: 'UNLINKED',
    issued_at: '2024-03-01T00:00:00Z',
    expires_at: '2025-03-01T00:00:00Z',
    created_at: '2024-03-01T00:00:00Z',
  },
  {
    tna_id: 'tna-3',
    visitor_id: 'user-visitor-1',
    issuance_request_id: 'req-3',
    tna_code: 'TNA-STOP9999',
    status: 'SUSPENDED',
    issued_at: '2024-01-15T00:00:00Z',
    expires_at: '2025-01-15T00:00:00Z',
    created_at: '2024-01-15T00:00:00Z',
  },
];

export const mockIssuanceRequests: TNAIssuanceRequest[] = [
  {
    request_id: 'req-1',
    visitor_id: 'user-visitor-1',
    request_status: 'ISSUED',
    mode_at_submission: 'AUTONOMOUS',
    supporting_documents: [],
    created_at: '2024-02-01T00:00:00Z',
    issued_at: '2024-02-01T00:00:00Z',
  },
  {
    request_id: 'req-2',
    visitor_id: 'user-visitor-1',
    request_status: 'ISSUED',
    mode_at_submission: 'AUTONOMOUS',
    supporting_documents: [],
    created_at: '2024-03-01T00:00:00Z',
    issued_at: '2024-03-01T00:00:00Z',
  },
  {
    request_id: 'req-3',
    visitor_id: 'user-visitor-1',
    request_status: 'ISSUED',
    mode_at_submission: 'MODERATED',
    supporting_documents: [],
    created_at: '2024-01-15T00:00:00Z',
    issued_at: '2024-01-15T00:00:00Z',
  },
  {
    request_id: 'req-pending-1',
    visitor_id: 'user-visitor-1',
    request_status: 'PENDING',
    mode_at_submission: 'MODERATED',
    supporting_documents: [
        { doc_type: 'PASSPORT', url: '/mock/docs/passport.pdf', uploaded_at: '2024-05-01T10:00:00Z' }
    ],
    created_at: '2024-05-01T10:00:00Z',
  }
];
