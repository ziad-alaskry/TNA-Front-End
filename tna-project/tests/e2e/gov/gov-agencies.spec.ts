import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Gov Agencies Management', () => {
  test('gov can view agencies table', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open('en');
    await login.login('GOV_USER');
    await page.goto('/en/gov/agencies');
    
    await expect(page.locator('table, [role="grid"]')).toBeVisible();
  });

  test('agencies display correct permissions', async ({ page }) => {
    await page.goto('/en/gov/agencies');
    // Check for expected column headers
    await expect(page.locator('text=Agency Name')).toBeVisible();
    await expect(page.locator('text=Region')).toBeVisible();
  });
});
