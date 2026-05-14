import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class OwnerPropertiesPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Properties table selectors
   */
  getPropertiesTable(): Locator {
    return this.page.locator('table, [role="grid"], div[class*="table"]');
  }

  getAddPropertyButton(): Locator {
    return this.page.getByRole('button', { name: /Add New Property/i });
  }

  /**
   * Get property row by address snippet
   */
  getPropertyRow(address: string): Locator {
    return this.page.locator(`tr:has-text("${address}"), div[class*="row"]:has-text("${address}")`).first();
  }

  /**
   * Get Details button for property
   */
  getDetailsButton(row: Locator): Locator {
    return row.getByRole('button', { name: /Details/i });
  }

  /**
   * Get property count
   */
  async getPropertiesCount(): Promise<number> {
    const rows = this.page.locator('tr, div[class*="row"]');
    return await rows.count();
  }

  /**
   * Navigate to add property
   */
  async addProperty(): Promise<void> {
    await this.getAddPropertyButton().click();
  }

  /**
   * View property details
   */
  async viewProperty(address: string): Promise<void> {
    const row = this.getPropertyRow(address);
    await this.getDetailsButton(row).click();
  }

  /**
   * Verify properties loaded
   */
  async expectPropertiesListed(): Promise<void> {
    const count = await this.getPropertiesCount();
    expect(count).toBeGreaterThan(0);
  }

  /**
   * Verify empty state
   */
  async expectEmptyState(): Promise<void> {
    await this.expectVisible('text=No Properties Found');
    await this.expectVisible('button:has-text("Register Property")');
  }
}
