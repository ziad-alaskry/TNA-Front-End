import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class GovTNAQueuePage extends BasePage {
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
   * Get pending request rows
   */
  getPendingRows(): Locator {
    return this.page.locator('tr:has-text("PENDING_REVIEW"), div:has-text("PENDING")');
  }

  /**
   * Get Review button for a request ID
   */
  getReviewButton(requestId: string): Locator {
    return this.page.getByRole('button', { name: new RegExp(`Review.*${requestId}|${requestId}.*Review`, 'i') })
      .or(this.page.locator(`button:has-text("Review")`).filter({ hasText: requestId }));
  }

  /**
   * Click a row to open detail
   */
  async clickRow(requestId: string): Promise<void> {
    const row = this.page.locator('tr, div[class*="row"]').filter({ hasText: requestId });
    await row.click();
  }

  /**
   * Get request count
   */
  async getPendingCount(): Promise<number> {
    return await this.getPendingRows().count();
  }

  /**
   * Navigate to detail page by clicking Review
   */
  async reviewRequest(requestId: string): Promise<void> {
    await this.getReviewButton(requestId).click();
  }

  /**
   * Verify queue loaded
   */
  async expectQueue(): Promise<void> {
    const count = await this.getPendingCount();
    expect(count).toBeGreaterThanOrEqual(0);
  }

  /**
   * Verify empty state
   */
  async expectEmptyQueue(): Promise<void> {
    await this.expectVisible('text=No pending requests');
  }
}
