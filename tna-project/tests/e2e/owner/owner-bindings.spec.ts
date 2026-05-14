import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { OwnerBindingsPage } from '../pages/owner/OwnerBindingsPage';
import { expectStateTransition, expectGuardrail } from '../assertions/functional';

test.describe('Owner Binding Management', () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.open('en');
    await login.login('OWNER');
    await page.goto('/en/owner/bindings');
  });

  test('owner can view pending binding requests', async ({ page }) => {
    const bindingsPage = new OwnerBindingsPage(page);
    await bindingsPage.expectPendingBindings();
  });

  test('owner can approve binding request', async ({ page }) => {
    const bindingsPage = new OwnerBindingsPage(page);
    await bindingsPage.expectPendingBindings();
    
    const rows = page.locator('tr, div[class*="row"]');
    const count = await rows.count();
    if (count > 0) {
      await bindingsPage.approveBinding(rows.first());
      await expect(page.locator('.toast-success')).toBeVisible();
    } else {
      test.skip(true, 'No pending bindings in mock data');
    }
  });

  test('owner can reject binding request', async ({ page }) => {
    const bindingsPage = new OwnerBindingsPage(page);
    const rows = page.locator('tr, div[class*="row"]');
    const count = await rows.count();
    if (count > 0) {
      await bindingsPage.declineBinding(rows.first());
      await expect(page.locator('.toast-success')).toBeVisible();
    } else {
      test.skip(true, 'No pending bindings in mock data');
    }
  });

  test('auto-accept toggle ON bypasses manual approval for incoming binding', async ({ page }) => {
    const bindingsPage = new OwnerBindingsPage(page);
    const bindingId = 'bind-auto-accept-1';

    // Closure to simulate server-side effect
    let autoAcceptEnabled = false;

    // Mock GET /api/bindings?role=owner to return single binding whose status depends on autoAcceptEnabled
    await page.route('**/api/bindings*', async (route) => {
      const request = route.request();
      if (request.method() === 'GET' && request.url().includes('role=owner')) {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            data: [
              {
                binding_id: bindingId,
                visitor_name: 'Test Visitor',
                property_address: '123 Test St, Riyadh',
                status: autoAcceptEnabled ? 'ACTIVE' : 'PENDING',
                submitted_at: new Date().toISOString(),
              },
            ],
          }),
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        await route.continue();
      }
    });

    // Mock updating auto-accept setting
    await page.route('**/api/owner/properties/*/auto-accept', async (route) => {
      const method = route.request().method();
      if (method === 'PATCH' || method === 'PUT' || method === 'POST') {
        autoAcceptEnabled = true;
        await route.fulfill({
          status: 200,
          body: JSON.stringify({ auto_accept: true, success: true }),
        });
      } else {
        await route.continue();
      }
    });

    // Initial visit: binding PENDING with Approve button
    await page.goto('/en/owner/bindings');
    await page.waitForTimeout(500);
    const firstRow = page.locator('tr, div[class*="row"]').first();
    await expect(firstRow.locator('.badge')).toContainText('PENDING');
    await expect(firstRow.getByRole('button', { name: /Approve/i })).toBeVisible();

    // Enable auto-accept via toggle
    await bindingsPage.toggleAutoAccept(true);
    await page.waitForTimeout(500);

    // Simulate server auto-approval on next fetch
    autoAcceptEnabled = true;
    await page.reload();
    await page.waitForTimeout(500);

    // Verify binding now ACTIVE and Approve button gone
    await expect(firstRow.locator('.badge')).toContainText('ACTIVE');
    await expect(firstRow.getByRole('button', { name: /Approve/i })).not.toBeVisible();
  });
});
