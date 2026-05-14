import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { OwnerPayoutsPage } from '../pages/owner/OwnerPayoutsPage';

test.describe('Owner Cash-out Flow', () => {
  test('Request wallet cash-out → select Apple Pay/Visa → verify payout record', async ({ page }) => {
    const login = new LoginPage(page);
    await login.navigate();
    await login.selectRole('OWNER');
    await login.fillCredentials('OWNER');
    await login.submit();
    await expect(page).toHaveURL('/owner/home');

    const payouts = new OwnerPayoutsPage(page);
    await payouts.navigate();
    await payouts.requestCashOut();

    await page.getByLabel('Payment Method').selectOption('APPLE_PAY');
    await page.getByRole('button', { name: 'Confirm Payout' }).click();
    await expect(page.getByText('Payout request submitted')).toBeVisible();
    await payouts.expectTransactionHistory();
  });

  test('Insufficient balance error', async ({ page }) => {
    const login = new LoginPage(page);
    await login.navigate();
    await login.selectRole('OWNER');
    await login.fillCredentials('OWNER');
    await login.submit();

    // Mock insufficient balance
    await page.route('/api/payout/request', route =>
      route.fulfill({ status: 400, body: { error: 'Insufficient balance' } })
    );

    const payouts = new OwnerPayoutsPage(page);
    await payouts.navigate();
    await payouts.requestCashOut();
    await page.getByRole('button', { name: 'Confirm Payout' }).click();
    await expect(page.getByText('Insufficient balance')).toBeVisible();
  });

  test('Payout failure scenario (500)', async ({ page }) => {
    const login = new LoginPage(page);
    await login.navigate();
    await login.selectRole('OWNER');
    await login.fillCredentials('OWNER');
    await login.submit();

    await page.route('/api/payout/request', route =>
      route.fulfill({ status: 500, body: { error: 'Payment provider unavailable' } })
    );

    const payouts = new OwnerPayoutsPage(page);
    await payouts.navigate();
    await payouts.requestCashOut();
    await page.getByRole('button', { name: 'Confirm Payout' }).click();
    await expect(page.getByText('Payout failed')).toBeVisible();
  });
});
