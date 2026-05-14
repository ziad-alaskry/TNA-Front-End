import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { CarrierResolvePage } from '../pages/carrier/CarrierResolvePage';

test.describe('Carrier TNA Resolution', () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.open('en');
    await login.login('CARRIER_STAFF');
    await page.goto('/en/carrier/resolve');
  });

  test('carrier can resolve valid TNA code to address', async ({ page }) => {
    const resolvePage = new CarrierResolvePage(page);
    
    await resolvePage.resolve('TNA-ABCD1234');
    await resolvePage.expectAddressResult();
    
    // Verify address contains expected elements
    await expect(page.locator('[data-testid="address-result"]')).toContainText('Address');
  });

  test('invalid TNA code shows error state', async ({ page }) => {
    const resolvePage = new CarrierResolvePage(page);
    
    // Mock invalid TNA response
    await page.route('/api/carrier/resolve/**', async (route) => {
      await route.fulfill({ status: 404, body: JSON.stringify({ error: 'Invalid TNA' }) });
    });

    await resolvePage.resolve('TNA-INVALID123');
    await resolvePage.expectInvalidTNAError();
  });

  test('resolved TNA displays physical address', async ({ page }) => {
    const resolvePage = new CarrierResolvePage(page);
    await resolvePage.resolve('TNA-ABCD1234');
    
    await expect(page.locator('text=/Riyadh|Jeddah|Saudi Arabia/i')).toBeVisible();
  });

  test('can copy resolved address', async ({ page }) => {
    const resolvePage = new CarrierResolvePage(page);
    await resolvePage.resolve('TNA-ABCD1234');
    
    const copyBtn = page.getByRole('button', { name: /Copy/i });
    if (await copyBtn.count() > 0) {
      await copyBtn.click();
      await expect(page.locator('text=Address copied')).toBeVisible();
    }
  });
});
