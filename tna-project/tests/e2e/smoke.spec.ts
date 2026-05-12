import { test, expect } from '@playwright/test';

test.describe('TNA Platform Smoke Test', () => {
  test('should load the login page', async ({ page }) => {
    // Note: This assumes the app is running on localhost:3000
    // In a real CI environment, this would be parameterized
    await page.goto('/en/login');
    await expect(page).toHaveTitle(/Login/i);
    await expect(page.getByText(/العنوان الوطني المؤقت/i)).toBeVisible();
  });

  test('should allow role selection on login', async ({ page }) => {
    await page.goto('/en/login');
    const ownerButton = page.getByRole('button', { name: /مالك/i });
    await expect(ownerButton).toBeVisible();
    
    const visitorButton = page.getByRole('button', { name: /زائر/i });
    await expect(visitorButton).toBeVisible();
  });
});
