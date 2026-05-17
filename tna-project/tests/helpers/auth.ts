import { BrowserContext, Page } from '@playwright/test';
import { UserRole } from '../../src/lib/types/auth';

/**
 * Programmatically seeds the Zustand auth store in localStorage.
 * This bypasses the UI login form for faster, more reliable testing.
 */
export async function loginAs(page: Page, role: UserRole) {
  const mockUser = {
    user_id: `vrt-${role.toLowerCase()}-1`,
    username: `vrt_${role.toLowerCase()}`,
    email: `${role.toLowerCase()}@vrt.test`,
    user_role: role,
    full_name: `VRT ${role} User`,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const authState = {
    state: {
      user: mockUser,
      token: 'vrt-mock-token',
      role: role,
    },
    version: 0,
  };

  // Navigate to the base URL first to set the context for localStorage
  await page.goto('/');

  // Inject the auth state into localStorage
  await page.evaluate((data) => {
    localStorage.setItem('auth-storage', JSON.stringify(data));
  }, authState);

  // Reload to ensure the app picks up the injected state
  await page.reload({ waitUntil: 'networkidle' });
}

/**
 * Custom wait utility to ensure the dashboard is fully hydrated and skeleton loaders are gone.
 */
export async function waitForDashboardHydration(page: Page) {
  // Wait for the main dashboard container
  await page.waitForSelector('main', { state: 'visible' });
  
  // Wait for any skeleton loaders to disappear (common pattern in the app)
  const skeletons = page.locator('.animate-pulse');
  await skeletons.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {
    console.warn('VRT Warning: Skeleton loaders might still be visible.');
  });

  // Additional wait for network stability
  await page.waitForLoadState('networkidle');
}
