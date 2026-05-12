import { Page, expect } from '@playwright/test';

export class OwnerPayoutsPage {
  constructor(private page: Page) {}

  async requestCashOut() {
    await this.page.getByRole('button', { name: 'Request Cash Out' }).click();
  }

  async expectTransactionHistory() {
    await expect(this.page.locator('.transaction-history')).toBeVisible();
  }

  async navigate() {
    await this.page.goto('/owner/payouts');
  }
}