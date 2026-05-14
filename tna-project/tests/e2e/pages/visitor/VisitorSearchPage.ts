import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class VisitorSearchPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Search input field
   */
  getSearchInput(): Locator {
    return this.page.getByPlaceholder(/Search address|search/i);
  }

  /**
   * Search button or enter key handler
   */
  getSearchButton(): Locator {
    return this.page.getByRole('button', { name: /Search/i });
  }

  /**
   * Address result items in the list
   */
  getResultItems(): Locator {
    return this.page.locator('div[class*="result-item"], .address-card, [data-testid="address-result"]');
  }

  /**
   * Get first result's title/full address
   */
  getFirstResultTitle(): Locator {
    return this.getResultItems().first().locator('h3, .address-title, .full-address').first();
  }

  /**
   * Select/click on first address result
   */
  async selectFirstResult(): Promise<void> {
    await this.getResultItems().first().click();
  }

  /**
   * Perform address search
   */
  async searchAddress(query: string): Promise<void> {
    await this.getSearchInput().fill(query);
    await this.page.keyboard.press('Enter');
  }

  /**
   * Expect "No results found" empty state
   */
  async expectNoResults(): Promise<void> {
    await this.expectVisible('text=No results found');
  }

  /**
   * Expect results list is visible
   */
  async expectResultsList(): Promise<void> {
    const count = await this.getResultItems().count();
    expect(count).toBeGreaterThan(0);
  }
}
