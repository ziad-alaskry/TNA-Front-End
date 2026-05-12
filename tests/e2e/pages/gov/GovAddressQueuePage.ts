import { Page, expect } from '@playwright/test';

export class GovAddressQueuePage {
  constructor(private page: Page) {}

  async expectQueueTable() {
    await expect(this.page.locator('.address-queue-table')).toBeVisible();
  }

  async clickReview(index: number = 0) {
    const reviewButtons = this.page.getByRole('button', { name: 'Review' });
    await reviewButtons.nth(index).click();
  }

  async navigate() {
    await this.page.goto('/gov/address-queue');
  }
}