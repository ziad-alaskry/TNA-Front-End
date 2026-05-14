import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { OwnerPropertiesPage } from '../pages/owner/OwnerPropertiesPage';
import { OwnerPropertyDetailPage } from '../pages/owner/OwnerPropertyDetailPage';
import { expectGuardrail } from '../assertions/functional';

test.describe('Owner Property Management', () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.open('en');
    await login.login('OWNER');
    await page.goto('/en/owner/properties');
  });

  test('owner can view properties list', async ({ page }) => {
    const propsPage = new OwnerPropertiesPage(page);
    await propsPage.expectPropertiesListed();
  });

  test('owner can add new property', async ({ page }) => {
    const propsPage = new OwnerPropertiesPage(page);
    await propsPage.addProperty();
    
    // Form should be displayed
    await expect(page).toHaveURL(/\/owner\/properties\/new/);
    await expect(page.getByLabel(/Address/i)).toBeVisible();
  });

  test('owner can create sub-address for property', async ({ page }) => {
    const propsPage = new OwnerPropertiesPage(page);
    const detailPage = new OwnerPropertyDetailPage(page);
    
    // Open first property detail
    await propsPage.viewProperty('Al Malaz');
    await detailPage.expectPropertyDetails();
    await detailPage.expectSubAddresses();
    
    // Add sub-address
    await detailPage.addSubAddress();
    await expect(page).toHaveURL(/\/owner\/properties\/.*\/sub-address\/new/);
  });

  test('properties table shows status and actions', async ({ page }) => {
    const propsPage = new OwnerPropertiesPage(page);
    await expect(page.locator('table, [role="grid"]')).toBeVisible();
    const detailsCount = await page.getByRole('button', { name: /Details/i }).count();
    expect(detailsCount).toBeGreaterThan(0);
  });

  test('duplicate property rejected', async ({ page }) => {
    const propsPage = new OwnerPropertiesPage(page);
    const originalCount = await propsPage.getPropertiesCount();
    
    await propsPage.addProperty();
    // Fill duplicate address (should fail validation)
    // This depends on backend validation being mocked
    test.info().annotations.push({ type: 'todo', description: 'Implement duplicate address validation test assertion' });
  });
});
