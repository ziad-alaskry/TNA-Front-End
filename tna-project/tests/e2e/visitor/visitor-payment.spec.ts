import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { CheckoutPage } from '../pages/visitor/CheckoutPage';
import { expectGuardrail } from '../assertions/functional';

test.describe('Visitor Payment and Checkout', () => {
  let checkoutPage: CheckoutPage;
  const bindingId = 'bind-pending-1'; // from mockBindings

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.open('en');
    await login.login('VISITOR');
    checkoutPage = new CheckoutPage(page);
  });

  test('visitor can complete payment with credit card', async ({ page }) => {
    // Ensure sufficient wallet balance
    await page.goto('about:blank');
    await page.evaluate(() => {
      localStorage.setItem('tna_wallet_balance_user-visitor-1', '2000');
    });

    // Mock binding and contract fetches
    await page.route(`**/api/bindings/${bindingId}`, async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          data: {
            binding_id: bindingId,
            tna_id: 'tna-2',
            sub_address_id: 'sub-2-apt1',
            status: 'PENDING',
            tna_code: 'TNA-XYZW5678',
          },
        }),
      });
    });
    await page.route(`**/api/bindings/${bindingId}/contract`, async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          data: {
            gross_amount: 1200,
            platform_fee_percentage: 10,
            platform_fee_amount: 120,
            authority_share_percentage: 5,
            authority_share_amount: 60,
            net_owner_amount: 1020,
          },
        }),
      });
    });

    // Mock order creation
    await page.route('**/api/v1/orders', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({ order_id: 'order-123', total_amount: 1200 }),
        });
      } else {
        await route.continue();
      }
    });

    // Mock payment success
    await page.route('**/api/v1/orders/order-123/pay', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({ payment_id: 'pay-123', status: 'COMPLETED' }),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto(`/en/visitor/checkout/${bindingId}`);
    await page.waitForTimeout(500);

    await checkoutPage.selectCreditCard();
    await checkoutPage.fillCardDetails();
    await checkoutPage.completePayment();

    await checkoutPage.expectSuccess('Payment successful');
  });

  test('Apple Pay shown as coming soon', async ({ page }) => {
    // Minimal mocks for page to load
    await page.route(`**/api/bindings/${bindingId}`, async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ data: { binding_id: bindingId } }) });
    });
    await page.route(`**/api/bindings/${bindingId}/contract`, async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ data: {} }) });
    });

    await page.goto(`/en/visitor/checkout/${bindingId}`);
    await page.waitForTimeout(500);

    await checkoutPage.expectComingSoonDisabled();
  });

  test('top-up flow when balance insufficient', async ({ page }) => {
    // Set low balance
    await page.goto('about:blank');
    await page.evaluate(() => {
      localStorage.setItem('tna_wallet_balance_user-visitor-1', '50');
    });

    // Mock binding and contract
    await page.route(`**/api/bindings/${bindingId}`, async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ data: { binding_id: bindingId } }) });
    });
    await page.route(`**/api/bindings/${bindingId}/contract`, async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ data: { gross_amount: 500 } }) });
    });

    await page.goto(`/en/visitor/checkout/${bindingId}`);
    await page.waitForTimeout(500);

    await checkoutPage.selectCreditCard();
    await checkoutPage.fillCardDetails();
    const buttonText = await checkoutPage.getPayButtonText();
    expect(buttonText.toLowerCase()).toContain('top up');

    // Complete top-up (mocked client-side)
    await checkoutPage.completeTopUp();
    await checkoutPage.expectSuccess('Top-up successful');
  });

  test('card validation shows error for invalid number', async ({ page }) => {
    // Minimal mocks
    await page.route(`**/api/bindings/${bindingId}`, async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ data: { binding_id: bindingId } }) });
    });
    await page.route(`**/api/bindings/${bindingId}/contract`, async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ data: {} }) });
    });

    await page.goto(`/en/visitor/checkout/${bindingId}`);
    await page.waitForTimeout(500);

    await checkoutPage.selectCreditCard();
    await checkoutPage.getCardNumberInput().fill('123');
    await checkoutPage.getExpiryInput().fill('00/00');
    await checkoutPage.getCVVInput().fill('123');

    await page.locator('.text-error, .error-message').waitFor({ state: 'visible' });
  });

  test('payment required before TNA activation (G-2)', async ({ page }) => {
    // Set a reasonable balance but we'll fail at pay step
    await page.goto('about:blank');
    await page.evaluate(() => {
      localStorage.setItem('tna_wallet_balance_user-visitor-1', '2000');
    });

    // Mock binding and contract
    await page.route(`**/api/bindings/${bindingId}`, async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ data: { binding_id: bindingId, tna_code: 'TNA-XYZW5678', status: 'PENDING' } }) });
    });
    await page.route(`**/api/bindings/${bindingId}/contract`, async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ data: { gross_amount: 1200, platform_fee_percentage: 10, platform_fee_amount: 120, authority_share_percentage: 5, authority_share_amount: 60, net_owner_amount: 1020, rental_period_type: 'YEARLY', rental_duration: 1, status: 'PENDING' } }) });
    });

    // Mock create order
    await page.route('**/api/v1/orders', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({ status: 200, body: JSON.stringify({ order_id: 'order-g2-123', total_amount: 1200 }) });
      } else { await route.continue(); }
    });

    // Mock payment endpoint to return 402 (payment required)
    await page.route('**/api/v1/orders/order-g2-123/pay', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({ status: 402, body: JSON.stringify({ error: 'Payment required before activation' }) });
      } else { await route.continue(); }
    });

    await page.goto(`/en/visitor/checkout/${bindingId}`);
    await page.waitForTimeout(500);

    await checkoutPage.selectCreditCard();
    await checkoutPage.fillCardDetails();
    await checkoutPage.getPayButton().click();

    // Expect error toast with guardrail message
    await expectGuardrail(page, 'Payment required before activation');
  });
});
