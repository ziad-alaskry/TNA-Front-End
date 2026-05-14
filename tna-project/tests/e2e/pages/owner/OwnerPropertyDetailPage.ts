import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class OwnerPropertyDetailPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Property info section
   */
  getPropertyAddress(): Locator {
    return this.page.locator('h1, h2').first();
  }

  /**
   * Sub-address list
   */
  getSubAddressList(): Locator {
    return this.page.locator('[data-testid="sub-address-list"], div[class*="sub-address"]');
  }

  getSubAddressItem(suffixCode: string): Locator {
    return this.page.locator(`div:has-text("${suffixCode}")`).first();
  }

  /**
   * Add sub-address button
   */
  getAddSubAddressButton(): Locator {
    return this.page.getByRole('button', { name: /Add Sub-Address|Create Unit/i });
  }

  /**
   * Verify property details
   */
  async expectPropertyDetails(): Promise<void> {
    await this.expectVisible(this.getPropertyAddress());
  }

  /**
   * Verify sub-addresses list
   */
  async expectSubAddresses(): Promise<void> {
    const count = await this.getSubAddressList().count();
    expect(count).toBeGreaterThan(0);
  }

  /**
   * Navigate to add sub-address
   */
  async addSubAddress(): Promise<void> {
    await this.getAddSubAddressButton().click();
  }
}
