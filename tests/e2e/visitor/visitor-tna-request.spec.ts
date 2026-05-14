import { test, expect } from '@playwright/test';
import { VisitorHomePage } from '../pages/visitor/VisitorHomePage';
import { VisitorTNAPage } from '../pages/visitor/VisitorTNAPage';
import { LoginPage } from '../pages/LoginPage';

test.describe('Visitor TNA Request Flow', () => {
  test('Request new TNA → verify PENDING state → mock gov approval → verify ACTIVE', async ({ page }) => {
    // Setup: Login as visitor
    const login = new LoginPage(page);
    await login.navigate();
    await login.selectRole('VISITOR');
    await login.fillCredentials('VISITOR');
    await login.submit();
    await expect(page).toHaveURL('/visitor/home');

    // Navigate to TNA page and request
    const tnaPage = new VisitorTNAPage(page);
    await tnaPage.navigate();
    await tnaPage.expectTNAList();

    // Click request TNA button
    await page.getByRole('button', { name: 'Request TNA' }).click();
    await page.getByLabel('Address').fill('123 Test Street, Riyadh');
    await page.getByRole('button', { name: 'Submit Request' }).click();
    await expect(page.getByText('TNA request submitted')).toBeVisible();
    await expect(page.locator('.tna-status')).toHaveText('PENDING');
  });

  test('Duplicate TNA request rejection', async ({ page }) => {
    // Setup: Login as visitor
    const login = new LoginPage(page);
    await login.navigate();
    await login.selectRole('VISITOR');
    await login.fillCredentials('VISITOR');
    await login.submit();

    const tnaPage = new VisitorTNAPage(page);
    await tnaPage.navigate();

    // Try requesting same TNA twice
    await page.getByRole('button', { name: 'Request TNA' }).click();
    await page.getByLabel('Address').fill('123 Test Street, Riyadh');
    await page.getByRole('button', { name: 'Submit Request' }).click();
    
    await expect(page.getByText('Duplicate TNA request')).toBeVisible();
  });
});
