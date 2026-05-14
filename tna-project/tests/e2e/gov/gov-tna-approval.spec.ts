import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { GovTNADetailPage } from '../pages/gov/GovTNADetailPage';

test.describe('Gov TNA Approval Process', () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.open('en');
    await login.login('GOV_USER');
  });

  test('gov can approve TNA request', async ({ page }) => {
    await page.goto('/en/gov/tna-queue/req-pending-1');
    const detailPage = new GovTNADetailPage(page);
    
    await detailPage.expectSections();
    await detailPage.expectActions();
    
    await detailPage.approve();
    
    // Wait for processing state
    await page.waitForTimeout(2000);
    await detailPage.expectApprovalSuccess();
  });

  test('gov can reject TNA request', async ({ page }) => {
    await page.goto('/en/gov/tna-queue/req-pending-2');
    const detailPage = new GovTNADetailPage(page);
    
    await detailPage.reject();
    await page.waitForTimeout(2000);
    await detailPage.expectRejectionSuccess();
  });

  test('back to queue navigation works', async ({ page }) => {
    await page.goto('/en/gov/tna-queue/req-pending-1');
    const detailPage = new GovTNADetailPage(page);
    
    await detailPage.backToQueue();
    await expect(page).toHaveURL(/\/gov\/tna-queue/);
  });

  test('404 on invalid TNA request ID', async ({ page }) => {
    await page.goto('/en/gov/tna-queue/nonexistent-id');
    await expect(page.locator('text=not found, Request not found')).toBeVisible();
  });

  test('success animation displays after decision', async ({ page }) => {
    await page.goto('/en/gov/tna-queue/req-pending-1');
    const detailPage = new GovTNADetailPage(page);
    
    await detailPage.approve();
    await page.waitForTimeout(2000);
    
    // Check for animation
    const decisionContainer = page.locator('.animate-in, [class*="zoom-in"]');
    await expect(decisionContainer).toBeVisible();
  });
});
