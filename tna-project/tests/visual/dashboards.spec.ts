import { test, expect } from '@playwright/test';
import { loginAs, waitForDashboardHydration } from '../helpers/auth';
import { UserRole } from '../../src/lib/types/auth';

const ROLES: UserRole[] = ['VISITOR', 'OWNER', 'CARRIER_STAFF', 'GOV_USER'];

test.describe('Dashboard Visual Regression', () => {
  for (const role of ROLES) {
    test(`Dashboard Layout - ${role}`, async ({ page }) => {
      // 1. Setup programmatic auth
      await loginAs(page, role);

      // 2. Navigate to the role's dashboard
      const dashboardPath = `/${role.toLowerCase().replace('_staff', '')}/dashboard`;
      await page.goto(dashboardPath);

      // 3. Ensure hydration and stability
      await waitForDashboardHydration(page);

      // 4. Capture screenshot with specific masking for dynamic sectors
      await expect(page).toHaveScreenshot(`${role}-dashboard.png`, {
        fullPage: true,
        mask: [
          // Global dynamic sectors
          page.locator('[data-vrt="timestamp"]'),
          page.locator('[data-vrt="dynamic-counter"]'),
          
          // Chart masking
          page.locator('.recharts-wrapper'),
          
          // Role-specific volatile zones
          role === 'OWNER' ? page.locator('section:has-text("Revenue")') : null,
          role === 'VISITOR' ? page.locator('section.group:has(h1)') : null, // Hero banner
        ].filter(Boolean) as any[],
      });
    });
  }
});

test.describe('Common UI Components VRT', () => {
  test('Auth - Login Page Layout', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('login-page.png');
  });

  test('Navigation - Sidebar Consistency', async ({ page }) => {
    await loginAs(page, 'OWNER');
    await page.goto('/owner/dashboard');
    await waitForDashboardHydration(page);
    
    // Specifically snapshot the sidebar
    const sidebar = page.locator('aside');
    await expect(sidebar).toHaveScreenshot('sidebar-owner.png');
  });
});
