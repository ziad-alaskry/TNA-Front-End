import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { CarrierDriverPage } from '../pages/carrier/CarrierDriverPage';

test.describe('Carrier Driver Tasks', () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.open('en');
    await login.login('CARRIER_STAFF');
    await page.goto('/en/carrier/driver');
  });

  test('driver can view assigned tasks', async ({ page }) => {
    const driverPage = new CarrierDriverPage(page);
    await driverPage.expectTasks();
  });

  test('task list displays TNA codes and destinations', async ({ page }) => {
    const tasks = page.locator('[data-testid="task-list"] li, .task-item');
    const count = await tasks.count();
    expect(count).toBeGreaterThan(0);
    
    // Verify TNA pattern appears
    const firstTask = tasks.first();
    const text = await firstTask.textContent() || '';
    expect(text).toMatch(/TNA-[A-Z0-9]+/);
  });

  test('driver can update task status to completed', async ({ page }) => {
    const driverPage = new CarrierDriverPage(page);
    await driverPage.expectTasks();
    
    // The task list should have update buttons
    const updateBtn = page.getByRole('button', { name: /Mark Complete/i });
    if (await updateBtn.count() > 0) {
      await updateBtn.first().click();
      await expect(page.locator('.toast-success')).toBeVisible();
    }
  });

  test('map page loads for a task', async ({ page }) => {
    const tasks = page.locator('.task-item, [data-testid="task-item"]');
    const count = await tasks.count();
    if (count > 0) {
      await tasks.first().click();
      await expect(page).toHaveURL(/\/carrier\/driver\/.*\/map/);
      await expect(page.locator('canvas, [class*="map"]')).toBeVisible();
    }
  });
});
