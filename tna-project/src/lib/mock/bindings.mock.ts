import { Binding } from '../types/bindings';

export const mockBindings: Binding[] = [
  {
    binding_id: 'bind-1',
    tna_id: 'tna-1',
    sub_address_id: 'sub-1-room',
    status: 'ACTIVE',
    start_at: '2024-02-05T00:00:00Z',
    end_at: '2025-02-05T00:00:00Z',
    approved_by_owner_id: 'user-owner-1',
    approved_at: '2024-02-05T10:00:00Z',
    created_at: '2024-02-04T12:00:00Z',
    updated_at: '2024-02-05T10:00:00Z',
    tna_code: 'TNA-ABCD1234',
    na_id: 'na-1',
    visitor_id: 'user-visitor-1',
  },
  {
    binding_id: 'bind-pending-1',
    tna_id: 'tna-2',
    sub_address_id: 'sub-2-apt1',
    status: 'PENDING',
    start_at: '2024-05-10T00:00:00Z',
    end_at: '2024-08-10T00:00:00Z',
    created_at: '2024-05-06T09:00:00Z',
    updated_at: '2024-05-06T09:00:00Z',
    tna_code: 'TNA-XYZW5678',
    na_id: 'na-2',
    visitor_id: 'user-visitor-1',
  },
];
