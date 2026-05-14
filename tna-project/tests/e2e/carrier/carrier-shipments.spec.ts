import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { CarrierShipmentsPage } from '../pages/carrier/CarrierShipmentsPage';
import { expectStateTransition, expectGuardrail } from '../assertions/functional';

test.describe('Carrier Shipment Management', () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.open('en');
    await login.login('CARRIER_STAFF');
    await page.goto('/en/carrier/shipments');
  });

  test('carrier can view shipments list', async ({ page }) => {
    const shipmentsPage = new CarrierShipmentsPage(page);
    await shipmentsPage.expectShipmentsListed();
  });

  test('carrier can update shipment status through workflow', async ({ page }) => {
    const shipmentsPage = new CarrierShipmentsPage(page);
    
    // Filter to CREATED status
    await shipmentsPage.filterByStatus('CREATED');
    
    const count = await shipmentsPage.getShipmentsList().count();
    if (count > 0) {
      // Find first shipment tracking number
      const firstRow = page.locator('tr, div[class*="row"]').first();
      const text = await firstRow.textContent() || '';
      const match = text.match(/TRK-[A-Z0-9]+/);
      
      if (match) {
        const tracking = match[0];
        await shipmentsPage.updateStatus(tracking, 'PICKED_UP');
        await expectStateTransition(page, 'CREATED', 'PICKED_UP');
      }
    } else {
      test.skip(true, 'No CREATED shipments in mock data');
    }
  });

  test('invalid status transition is rejected', async ({ page }) => {
    // Force a 409 error
    await page.route('/api/shipments/**/status', async (route) => {
      await route.fulfill({ 
        status: 409, 
        body: JSON.stringify({ error: 'Invalid status transition' }) 
      });
    });

    const shipmentsPage = new CarrierShipmentsPage(page);
    await shipmentsPage.filterByStatus('CREATED');
    
    // Attempt update should show error
    await expectGuardrail(page, 'Invalid status transition');
  });

  test('carrier can assign driver to shipment', async ({ page }) => {
    const shipmentsPage = new CarrierShipmentsPage(page);
    const rows = page.locator('tr, div[class*="row"]');
    const count = await rows.count();
    if (count > 0) {
      const trackingText = await rows.first().textContent() || '';
      const match = trackingText.match(/TRK-[A-Z0-9]+/);
      if (match) {
        await shipmentsPage.getAssignDriverButton(match[0]).click();
        await expect(page.locator('text=Driver assigned')).toBeVisible();
      }
    }
  });
});
