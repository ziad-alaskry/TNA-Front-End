import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { OwnerPayoutsPage } from '../pages/owner/OwnerPayoutsPage';
import { OwnerHomePage } from '../pages/owner/OwnerHomePage';

test.describe('Owner Wallet & Payouts', () => {
   test.beforeEach(async ({ page }) => {
     const login = new LoginPage(page);
     await login.open('en');
     await login.login('OWNER');
     await page.goto('/en/owner/payouts');
   });

  test('owner can view wallet balance', async ({ page }) => {
    const payoutsPage = new OwnerPayoutsPage(page);
    await payoutsPage.expectBalance();
  });

  test('owner can view transaction history', async ({ page }) => {
    const payoutsPage = new OwnerPayoutsPage(page);
    await payoutsPage.expectTransactionHistory();
  });

  test('owner can request cash-out', async ({ page }) => {
    const payoutsPage = new OwnerPayoutsPage(page);
    const balanceText = await payoutsPage.getBalanceDisplay().textContent();
    const match = balanceText?.match(/\d+/);
    const balance = match ? parseInt(match[0]) : 1000;
    
    await payoutsPage.requestPayout(balance / 2);
    await payoutsPage.expectPayoutSuccess();
  });

  test('insufficient balance cash-out shows error', async ({ page }) => {
    const payoutsPage = new OwnerPayoutsPage(page);
    await payoutsPage.requestPayout(999999);
    
    await expect(page.locator('.toast-error, .text-error')).toBeVisible();
  });

  test('payout failure handled gracefully', async ({ page }) => {
    // Mock payout API failure
    await page.route('/api/owner/payouts', async (route) => {
      await route.fulfill({ status: 500, body: JSON.stringify({ error: 'Insufficient funds' }) });
    });

    const payoutsPage = new OwnerPayoutsPage(page);
    await payoutsPage.requestPayout(100);
    await expect(page.locator('.toast-error')).toBeVisible();
  });
});
