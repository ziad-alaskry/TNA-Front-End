import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { GovTNAQueuePage } from '../pages/gov/GovTNAQueuePage';
import { GovTNADetailPage } from '../pages/gov/GovTNADetailPage';

test.describe('Gov TNA Queue Management', () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.open('en');
    await login.login('GOV_USER');
    await page.goto('/en/gov/tna-queue');
  });

  test('gov can view pending TNA request queue', async ({ page }) => {
    const queuePage = new GovTNAQueuePage(page);
    await queuePage.expectQueue();
    const count = await queuePage.getPendingCount();
    expect(count).toBeGreaterThan(0);
  });

  test('gov can click review and navigate to detail', async ({ page }) => {
    const queuePage = new GovTNAQueuePage(page);
    // Use first available pending request
    await queuePage.reviewRequest('req-pending-1');
    await expect(page).toHaveURL(/\/gov\/tna-queue\/req-pending-1/);
  });

  test('empty queue state displays properly', async ({ page }) => {
    // Mock empty queue
    await page.route('/api/gov/tna-queue', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ data: [] }) });
    });
    await page.reload();

    const queuePage = new GovTNAQueuePage(page);
    await queuePage.expectEmptyQueue();
  });
});
