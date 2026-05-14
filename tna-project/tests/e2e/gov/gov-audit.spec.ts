import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Gov Audit Log', () => {
  test('gov can view audit log table', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open('en');
    await login.login('GOV_USER');
    await page.goto('/en/gov/audit');
    
    await expect(page.locator('table, [role="grid"]')).toBeVisible();
  });

  test('audit log renders action history', async ({ page }) => {
    await page.goto('/en/gov/audit');
    const rows = page.locator('tr, div[class*="row"]');
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
  });
});
