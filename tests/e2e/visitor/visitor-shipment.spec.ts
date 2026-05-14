import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { VisitorShipmentsPage } from '../pages/visitor/ShipmentsPage';

test.describe('Visitor Shipment Flow', () => {
  test('View shipments table → filter by IN_TRANSIT → verify tracking details', async ({ page }) => {
    const login = new LoginPage(page);
    await login.navigate();
    await login.selectRole('VISITOR');
    await login.fillCredentials('VISITOR');
    await login.submit();
    await expect(page).toHaveURL('/visitor/home');

    const shipments = new VisitorShipmentsPage(page);
    await shipments.navigate();
    await shipments.expectShipmentTable();
    
    await shipments.filterByStatus('IN_TRANSIT');
    await expect(page.locator('.shipment-status')).toHaveText('IN_TRANSIT');
  });

  test('Empty shipments state displays properly', async ({ page }) => {
    const login = new LoginPage(page);
    await login.navigate();
    await login.selectRole('VISITOR');
    await login.fillCredentials('VISITOR');
    await login.submit();

    const shipments = new VisitorShipmentsPage(page);
    await shipments.navigate();

    // Mock empty API response
    await page.route('/api/shipments', route =>
      route.fulfill({ status: 200, body: { data: [] } })
    );

    await page.reload();
    await expect(page.getByText('No shipments found')).toBeVisible();
  });
});
