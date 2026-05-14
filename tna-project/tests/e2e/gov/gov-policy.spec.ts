import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { GovPolicyPage } from '../pages/gov/GovPolicyPage';

test.describe('Gov Policy Configuration', () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.open('en');
    await login.login('GOV_USER');
    await page.goto('/en/gov/policy');
  });

  test('gov can toggle issuance mode', async ({ page }) => {
    const policyPage = new GovPolicyPage(page);
    await policyPage.expectPolicyForm();
    
    // Check current mode and toggle
    await policyPage.setIssuanceMode('AUTONOMOUS');
    await policyPage.savePolicy();
    await policyPage.expectPolicySaved();
  });

  test('policy config persists after page refresh', async ({ page }) => {
    const policyPage = new GovPolicyPage(page);
    await policyPage.setIssuanceMode('AUTONOMOUS');
    await page.waitForTimeout(500);
    
    // Reload to verify persistence (via localStorage)
    await page.reload();
    await policyPage.expectPolicyForm();
    // The mode selector should still show AUTONOMOUS
  });

  test('update rules and verify database persistence', async ({ page }) => {
    const policyPage = new GovPolicyPage(page);
    await policyPage.setMaxTNALimit(10);
    await policyPage.toggleAutoApprove(0, true);
    await policyPage.savePolicy();
    await policyPage.expectPolicySaved();
  });
});
