import { Page, expect } from '@playwright/test';

export class VisitorCheckoutPage {
  constructor(private page: Page) {}

  async selectPaymentMethod(method: 'Apple Pay' | 'Visa') {
    await this.page.getByLabel(method).check();
  }

  async confirmPayment() {
    await this.page.getByRole('button', { name: 'Confirm Payment' }).click();
  }

  async expectSuccess() {
    await expect(this.page.getByText('Payment successful')).toBeVisible;
  }

  async navigate() {
    // Assuming we navigate to checkout from somewhere, but for direct access:
    await this.page.goto('/visitor/checkout');
  }
}