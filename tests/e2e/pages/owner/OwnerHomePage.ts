import { Page, expect } from '@playwright/test';

export class OwnerHomePage {
  constructor(private page: Page) {}

  async expectWalletBalance() {
    await expect(this.page.getByText('Wallet Balance')).toBeVisible();
  }

  async expectPropertyCount() {
    await expect(this.page.getByText('Total Properties')).toBeVisible();
  }

  async navigate() {
    await this.page.goto('/owner/home');
  }
}