import { User } from '../types/auth';

export const mockUsers: User[] = [
  {
    user_id: 'user-visitor-1',
    username: 'visitor',
    email: 'visitor@tna.test',
    user_role: 'VISITOR',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    user_id: 'user-owner-1',
    username: 'owner',
    email: 'owner@tna.test',
    user_role: 'OWNER',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    user_id: 'user-carrier-1',
    username: 'carrier',
    email: 'carrier@tna.test',
    user_role: 'CARRIER_STAFF',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    user_id: 'user-gov-1',
    username: 'gov',
    email: 'gov@tna.test',
    user_role: 'GOV_USER',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];
