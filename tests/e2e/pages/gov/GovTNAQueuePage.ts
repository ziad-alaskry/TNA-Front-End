import { Page, expect } from '@playwright/test';

export class GovTNAQueuePage {
  constructor(private page: Page) {}

  async expectPendingTable() {
    await expect(this.page.locator('.tna-queue-table')).toBeVisible();
  }

  async clickReview(index: number = 0) {
    const reviewButtons = this.page.getByRole('button', { name: 'Review' });
    await reviewButtons.nth(index).click();
  }

  async navigate() {
    await this.page.goto('/gov/tna-queue');
  }
}