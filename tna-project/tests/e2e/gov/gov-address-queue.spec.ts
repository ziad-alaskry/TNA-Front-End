import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { GovAddressQueuePage } from '../pages/gov/GovAddressQueuePage';
import { GovAddressDetailPage } from '../pages/gov/GovAddressDetailPage';

test.describe('Gov Address Queue & Verification', () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.open('en');
    await login.login('GOV_USER');
    await page.goto('/en/gov/address-queue');
  });

  test('gov can view address verification queue', async ({ page }) => {
    const queuePage = new GovAddressQueuePage(page);
    await queuePage.expectQueue();
    const count = await queuePage.getPendingCount();
    expect(count).toBeGreaterThan(0);
  });

  test('gov can review and approve sub-address', async ({ page }) => {
    const queuePage = new GovAddressQueuePage(page);
    await queuePage.reviewAddress('sub-001');
    
    await expect(page).toHaveURL(/\/gov\/address-queue\/sub-001/);
    const detailPage = new GovAddressDetailPage(page);
    await detailPage.expectOwnerInfo();
    await detailPage.expectActions();
    
    await detailPage.verify();
    await detailPage.expectVerificationSuccess();
  });

  test('address detail page displays full information', async ({ page }) => {
    await page.goto('/en/gov/address-queue/sub-001');
    const detailPage = new GovAddressDetailPage(page);
    await detailPage.expectOwnerInfo();
    await detailPage.expectAddressDetails();
  });
});
