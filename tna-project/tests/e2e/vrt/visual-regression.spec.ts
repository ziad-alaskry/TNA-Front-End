import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Visual Regression - UI Contrast', () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    // Use English for login to avoid label issues in Arabic
    await login.open('en');
    await login.login('VISITOR');
    
    // After login, navigate to the Arabic TNAs page
    await page.goto('/ar/visitor/tnas');
    // Increase wait time for the table and content to stabilize
    await page.waitForSelector('table', { state: 'visible', timeout: 10000 });
    await page.waitForLoadState('networkidle');
  });

  test('Visitor TNAs Table Contrast', async ({ page }) => {
    // Capture snapshot of the table container
    // Using a more specific selector if possible
    const tableContainer = page.locator('div.overflow-hidden.rounded-md.border.border-neutral-200.bg-surface').first();
    await expect(tableContainer).toBeVisible();
    await expect(tableContainer).toHaveScreenshot('visitor-tnas-table.png', {
        maxDiffPixelRatio: 0.05,
        threshold: 0.2
    });
  });

  test('Search Input Contrast', async ({ page }) => {
    // Capture snapshot of the search input area
    const searchInput = page.locator('input[placeholder*="بحث"]').first(); // Arabic for search
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toHaveScreenshot('visitor-tnas-search.png', {
        maxDiffPixelRatio: 0.05,
        threshold: 0.2
    });
  });

  test('Visitor Profile Contrast', async ({ page }) => {
    // Navigate to profile
    await page.goto('/ar/visitor/profile');
    await page.waitForSelector('h1', { state: 'visible' });
    await page.waitForLoadState('networkidle');

    // Capture snapshot of the whole detail view
    const detailView = page.locator('.min-h-screen').first();
    await expect(detailView).toBeVisible();
    await expect(detailView).toHaveScreenshot('visitor-profile-view.png', {
        maxDiffPixelRatio: 0.05,
        threshold: 0.2
    });
  });

  test('Visitor Search Properties Contrast', async ({ page }) => {
    // Navigate to search
    await page.goto('/en/visitor/search');
    await page.waitForSelector('h2:has-text("Available Properties")', { state: 'visible' });
    await page.waitForLoadState('networkidle');

    // Capture snapshot of the properties container
    const propertiesContainer = page.locator('div.rounded-md.border.border-neutral-200').first();
    await expect(propertiesContainer).toBeVisible();
    await expect(propertiesContainer).toHaveScreenshot('visitor-search-properties.png', {
        maxDiffPixelRatio: 0.05,
        threshold: 0.2
    });
  });
});
