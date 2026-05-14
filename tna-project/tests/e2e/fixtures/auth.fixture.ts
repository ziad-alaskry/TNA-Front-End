import { Page } from '@playwright/test';
import { UserRole } from '@/lib/types/auth';

// Define the auth state structure that matches useAuthStore persisted format
interface StoredAuthState {
  user: {
    user_id: string;
    username: string;
    email: string;
    user_role: UserRole;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    full_name?: string;
    nationality?: string;
    document_number?: string;
  } | null;
  token: string | null;
  role: UserRole | null;
}

// Mock users for each role aligned with auth.mock.ts
const mockAuthStates: Record<UserRole, StoredAuthState> = {
  VISITOR: {
    user: {
      user_id: 'user-visitor-1',
      username: 'visitor',
      email: 'visitor@tna.test',
      user_role: 'VISITOR',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      full_name: 'Demo Visitor',
      nationality: 'SA',
      document_number: '1234567890',
    },
    token: 'mock-jwt-token-visitor',
    role: 'VISITOR',
  },
  OWNER: {
    user: {
      user_id: 'user-owner-1',
      username: 'owner',
      email: 'owner@tna.test',
      user_role: 'OWNER',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      full_name: 'Demo Owner',
      nationality: 'SA',
      document_number: '9876543210',
    },
    token: 'mock-jwt-token-owner',
    role: 'OWNER',
  },
  CARRIER_STAFF: {
    user: {
      user_id: 'user-carrier-1',
      username: 'carrier',
      email: 'carrier@tna.test',
      user_role: 'CARRIER_STAFF',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      full_name: 'Demo Carrier',
      nationality: 'SA',
      document_number: '5555555555',
    },
    token: 'mock-jwt-token-carrier',
    role: 'CARRIER_STAFF',
  },
  GOV_USER: {
    user: {
      user_id: 'user-gov-1',
      username: 'gov',
      email: 'gov@tna.test',
      user_role: 'GOV_USER',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      full_name: 'Demo Gov',
      nationality: 'SA',
      document_number: '1111111111',
    },
    token: 'mock-jwt-token-gov',
    role: 'GOV_USER',
  },
};

// Storage key used by zustand persist
const AUTH_STORAGE_KEY = 'auth-storage';

/**
 * Helper to directly set auth state on a page
 */
export async function setAuthState(page: Page, role: UserRole): Promise<void> {
  const authState = mockAuthStates[role];
  const storageData = JSON.stringify({
    state: authState,
    version: 1,
  });

  await page.goto('/'); // Navigate to set up context
  await page.evaluate((params: { key: string; data: string }) => {
    window.localStorage.setItem(params.key, params.data);
    try {
      window.sessionStorage.setItem(params.key, params.data);
    } catch (e) {}
  }, { key: AUTH_STORAGE_KEY, data: storageData });
}

/**
 * Get auth state for a specific role (for reference)
 */
export function getAuthStateForRole(role: UserRole): StoredAuthState {
  return mockAuthStates[role];
}
