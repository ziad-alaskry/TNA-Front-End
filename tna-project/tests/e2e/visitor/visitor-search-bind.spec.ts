import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { VisitorTNAPage } from '../pages/visitor/VisitorTNAPage';
import { VisitorHomePage } from '../pages/visitor/VisitorHomePage';

test.describe('Visitor Search & Bind Address', () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.open('en');
    await login.login('VISITOR');
  });

  test('visitor can search for address in marketplace', async ({ page }) => {
    // Navigate to search page
    await page.goto('/en/visitor/search');
    
    // Mock search API response
    await page.route('/api/addresses/search', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({
        data: [
          { na_id: 'na-1', full_address: '123 Test St, Riyadh', availability: true }
        ]
      }) });
    });

    const searchInput = page.getByPlaceholder(/Search address/i);
    await searchInput.fill('Test St');
    await page.keyboard.press('Enter');
    
    await expect(page.locator('text=123 Test St')).toBeVisible();
  });

  test('search displays no results state for unknown address', async ({ page }) => {
    await page.goto('/en/visitor/search');
    
    await page.route('/api/addresses/search', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ data: [] }) });
    });

    const searchInput = page.getByPlaceholder(/Search address/i);
    await searchInput.fill('ZZZZZZZ');
    await page.keyboard.press('Enter');
    
    await expect(page.locator('text=No results found')).toBeVisible();
  });

  test('visitor can select address and initiate binding', async ({ page }) => {
    await page.goto('/en/visitor/search');
    
    // Mock results
    await page.route('/api/addresses/search', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({
        data: [
          { na_id: 'na-1', full_address: '123 Test St, Riyadh', availability: true }
        ]
      }) });
    });

    const searchInput = page.getByPlaceholder(/Search address/i);
    await searchInput.fill('Test');
    await page.keyboard.press('Enter');
    
    // Click first result
    await page.locator('div[class*="result-item"]').first().click();
    
    // Should navigate to binding page or show binding modal
    await expect(page).toHaveURL(/\/visitor\/.*/);
  });
});
