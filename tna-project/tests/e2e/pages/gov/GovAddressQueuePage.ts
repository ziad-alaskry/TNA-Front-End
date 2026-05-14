import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class GovAddressQueuePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Queue table
   */
  getQueueTable(): Locator {
    return this.page.locator('table, [role="grid"], div[class*="table"]');
  }

  /**
   * Get pending address rows
   */
  getPendingRows(): Locator {
    return this.page.locator('tr:has-text("PENDING"), div:has-text("PENDING")');
  }

  /**
   * Review button for a sub-address
   */
  getReviewButton(subAddressId: string): Locator {
    return this.page.getByRole('button', { name: new RegExp(`Review.*${subAddressId}`, 'i') });
  }

  /**
   * Get pending count
   */
  async getPendingCount(): Promise<number> {
    return await this.page.locator('.badge:has-text("PENDING")').count();
  }

  /**
   * Navigate to detail
   */
  async reviewAddress(subAddressId: string): Promise<void> {
    await this.getReviewButton(subAddressId).click();
  }

  /**
   * Verify queue loaded
   */
  async expectQueue(): Promise<void> {
    await this.expectVisible(this.getQueueTable());
  }
}
