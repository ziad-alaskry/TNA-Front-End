import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';
import type { TNA } from '@/lib/types/tna';

export class VisitorTNAPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Get TNA list section
   */
  getTNAListSection(): Locator {
    return this.page.locator('div').filter({ hasText: /TNA-[A-Z0-9]+/i }).first();
  }

  /**
   * Get TNA card by code
   */
  getTNACard(code: string): Locator {
    return this.page.locator(`div:has-text("${code}")`).first();
  }

  /**
   * Get TNA status badge
   */
  getTNAStatus(code: string): Locator {
    const card = this.getTNACard(code);
    return card.locator('.badge, [class*="badge"]').first();
  }

  /**
   * Get View Details button for a TNA
   */
  getViewDetailsButton(code: string): Locator {
    const card = this.getTNACard(code);
    return card.getByRole('button', { name: /View Details/i });
  }

  /**
   * Get Create New TNA button
   */
  getCreateTNAButton(): Locator {
    return this.page.getByRole('button', { name: /Request TNA/i });
  }

  /**
   * Get pending TNA count
   */
  async getPendingTNACount(): Promise<number> {
    const badges = this.page.locator('.badge, [class*="badge"]:has-text("PENDING")');
    return await badges.count();
  }

  /**
   * Get active TNA count
   */
  async getActiveTNACount(): Promise<number> {
    const badges = this.page.locator('.badge, [class*="badge"]:has-text("ACTIVE")');
    return await badges.count();
  }

  /**
   * View TNA details
   */
  async viewTNA(code: string): Promise<void> {
    await this.getViewDetailsButton(code).click();
  }

  /**
   * Request new TNA
   */
  async requestNewTNA(): Promise<void> {
    await this.getCreateTNAButton().click();
  }

  /**
   * Verify TNA list loaded
   */
  async expectTNAList(): Promise<void> {
    // At least one TNA should be visible
    const count = await this.page.locator('div:has-text("TNA-")').count();
    expect(count).toBeGreaterThan(0);
  }

  /**
   * Verify specific TNA is shown
   */
  async expectTNA(code: string): Promise<void> {
    await this.expectVisible(`div:has-text("${code}")`);
  }

  /**
   * Verify TNA status badge
   */
  async expectTNAStatus(code: string, expectedStatus: string): Promise<void> {
    const status = this.getTNAStatus(code);
    await expect(status).toContainText(expectedStatus, { useInnerText: true });
  }
}
