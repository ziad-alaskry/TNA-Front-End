import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { VisitorTNAPage } from '../pages/visitor/VisitorTNAPage';
import { VisitorCheckoutPage } from '../pages/visitor/CheckoutPage';

test.describe('Visitor Payment Flow', () => {
  test('Checkout flow with Apple Pay mock → success toast → verify transaction', async ({ page }) => {
    const login = new LoginPage(page);
    await login.navigate();
    await login.selectRole('VISITOR');
    await login.fillCredentials('VISITOR');
    await login.submit();
    await expect(page).toHaveURL('/visitor/home');

    const checkout = new VisitorCheckoutPage(page);
    await checkout.navigate();

    await checkout.selectPaymentMethod('Apple Pay');
    await checkout.confirmPayment();
    await expect(page.getByText('Payment successful')).toBeVisible();
    await expect(page.locator('.transaction-status')).toHaveText('COMPLETED');
  });

  test('Checkout flow with Visa mock → success', async ({ page }) => {
    const login = new LoginPage(page);
    await login.navigate();
    await login.selectRole('VISITOR');
    await login.fillCredentials('VISITOR');
    await login.submit();

    const checkout = new VisitorCheckoutPage(page);
    await checkout.navigate();
    await checkout.selectPaymentMethod('Visa');
    await checkout.confirmPayment();
    await expect(page.getByText('Payment successful')).toBeVisible();
  });

  test('Payment failure (500) shows error', async ({ page }) => {
    const login = new LoginPage(page);
    await login.navigate();
    await login.selectRole('VISITOR');
    await login.fillCredentials('VISITOR');
    await login.submit();

    const checkout = new VisitorCheckoutPage(page);
    await checkout.navigate();

    // Intercept API to return 500 error
    await page.route('/api/payment/charge', route => 
      route.fulfill({ status: 500, body: { error: 'Internal server error' } })
    );

    await checkout.selectPaymentMethod('Visa');
    await checkout.confirmPayment();
    await expect(page.getByText('Payment failed')).toBeVisible();
  });

  test('Insufficient funds scenario', async ({ page }) => {
    const login = new LoginPage(page);
    await login.navigate();
    await login.selectRole('VISITOR');
    await login.fillCredentials('VISITOR');
    await login.submit();

    const checkout = new VisitorCheckoutPage(page);
    await checkout.navigate();

    await page.route('/api/payment/charge', route =>
      route.fulfill({ status: 402, body: { error: 'Insufficient funds' } })
    );

    await checkout.selectPaymentMethod('Apple Pay');
    await checkout.confirmPayment();
    await expect(page.getByText('Insufficient funds')).toBeVisible();
  });
});
