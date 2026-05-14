import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { VisitorTNAIssuancePage } from '../pages/visitor/VisitorTNAIssuancePage';
import { VisitorTNAPage } from '../pages/visitor/VisitorTNAPage';
import { expectStateTransition } from '../assertions/functional';
import { expectFlowCompletion } from '../assertions/flow';
import { expectSPATIALTheme } from '../assertions/visual';
import { expectGuardrail } from '../assertions/functional';

test.describe('Visitor TNA Request Flow', () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.open('en');
    await login.login('VISITOR');
  });

  test('visitor can request new TNA through wizard', async ({ page }) => {
    const issuancePage = new VisitorTNAIssuancePage(page);
    
    // Navigate to TNA issuance from home or TNA page
    await page.getByRole('button', { name: /Request TNA/i }).click();
    
    // Step 1: Identity
    await issuancePage.expectStep1();
    await issuancePage.confirmIdentity();
    await issuancePage.expectNextStepDisabled(false);
    await issuancePage.goToNextStep();

    // Step 2: Policy
    await issuancePage.expectStep2();
    await issuancePage.agreeToPolicy();
    await issuancePage.expectSubmitDisabled(false);
    await issuancePage.submitRequest();

    // Step 3: Success
    await issuancePage.expectSuccess();
    await expectFlowCompletion(page, 'text=Approved!');
  });

  test('TNA request cannot proceed without identity confirmation', async ({ page }) => {
    const issuancePage = new VisitorTNAIssuancePage(page);
    await page.getByRole('button', { name: /Request TNA/i }).click();
    
    await issuancePage.expectNextStepDisabled(true);
    await expect(issuancePage.getIdentitySection()).toBeVisible();
  });

  test('TNA request cannot proceed without policy agreement', async ({ page }) => {
    const issuancePage = new VisitorTNAIssuancePage(page);
    await page.getByRole('button', { name: /Request TNA/i }).click();
    
    await issuancePage.confirmIdentity();
    await issuancePage.goToNextStep();
    await issuancePage.expectSubmitDisabled(true);
  });

  test('requested TNA appears in My TNAs list', async ({ page }) => {
    const issuancePage = new VisitorTNAIssuancePage(page);
    const tnaPage = new VisitorTNAPage(page);
    
    await page.getByRole('button', { name: /Request TNA/i }).click();
    await issuancePage.confirmIdentity();
    await issuancePage.goToNextStep();
    await issuancePage.agreeToPolicy();
    await issuancePage.submitRequest();

    // Navigate to TNA list
    await issuancePage.goToMyTNAs();
    await tnaPage.expectTNAList();

    const tnaCode = await issuancePage.getTNACodeDisplay().textContent();
    if (tnaCode) {
      await tnaPage.expectTNA(tnaCode);
      await tnaPage.expectTNAStatus(tnaCode, 'ACTIVE');
    }
  });

  test('TNA request verified on design system', async ({ page }) => {
    const issuancePage = new VisitorTNAIssuancePage(page);
    await page.getByRole('button', { name: /Request TNA/i }).click();
    await issuancePage.confirmIdentity();
    await issuancePage.goToNextStep();
    await issuancePage.agreeToPolicy();
    await issuancePage.submitRequest();
    await issuancePage.expectSuccess();
    await expectSPATIALTheme(page);
  });

  test('visitor with 3 active TNAs cannot request a 4th', async ({ page }) => {
    // Mock: visitor already has 3 active TNAs
    await page.route('/api/tna/check-eligibility', async (route) => {
      await route.fulfill({
        status: 200,
        body: {
          eligible: false,
          max_tnas_reached: true,
          active_tnas_count: 3,
          max_allowed: 3,
          reason: 'Maximum active TNA limit reached',
        },
      });
    });

    const issuancePage = new VisitorTNAIssuancePage(page);
    await page.getByRole('button', { name: /Request TNA/i }).click();

    // Step 1 passes
    await issuancePage.confirmIdentity();
    await issuancePage.goToNextStep();

    // Step 2: policy agreement
    await issuancePage.expectStep2();
    await issuancePage.agreeToPolicy();

    // Submit should be blocked or API should return error
    await issuancePage.submitRequest();

    // Expect guardrail: error toast indicating limit reached
    await expectGuardrail(page, 'Maximum active TNA limit reached');
  });
});
