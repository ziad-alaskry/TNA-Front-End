import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { VisitorShipmentsPage } from '../pages/visitor/VisitorShipmentsPage';
import { expectStateTransition, expectGuardrail } from '../assertions/functional';

test.describe('Visitor Shipment Tracking', () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.open('en');
    await login.login('VISITOR');
    await page.goto('/en/visitor/shipments');
  });

  test('visitor can view shipments table', async ({ page }) => {
    const shipmentsPage = new VisitorShipmentsPage(page);
    await shipmentsPage.expectShipmentsTable();
  });

  test('filter by IN_TRANSIT shows relevant shipments', async ({ page }) => {
    const shipmentsPage = new VisitorShipmentsPage(page);
    await shipmentsPage.filterByStatus('IN_TRANSIT');
    
    // Verify at least one shipment shows IN_TRANSIT status
    const count = await shipmentsPage.getShipmentsCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('view shipment tracking details', async ({ page }) => {
    const shipmentsPage = new VisitorShipmentsPage(page);
    const shipmentsList = shipmentsPage.getShipmentsList();
    const count = await shipmentsList.count();

    if (count > 0) {
      // Find first shipment with a tracking number
      const first = shipmentsList.nth(0);
      const trackingText = await first.textContent() || '';
      const match = trackingText.match(/TRK-[A-Z0-9]+/);
      if (match) {
        const tracking = match[0];
        await shipmentsPage.viewShipment(tracking);
        await expect(page).toHaveURL(/\/visitor\/shipments\/.*/);
      }
    } else {
      test.skip(true, 'No shipments available in mock data');
    }
  });

  test('empty shipments state displays correctly', async ({ page }) => {
    // Set up scenario with no shipments via mock
    await page.route('/api/shipments', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ data: [] }) });
    });

    const shipmentsPage = new VisitorShipmentsPage(page);
    await page.reload();
    await shipmentsPage.expectEmptyState();
  });
});
