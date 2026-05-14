import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class CarrierResolvePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * TNA code input
   */
  getTNAInput(): Locator {
    return this.page.getByPlaceholder(/TNA-[A-Z0-9]+/i) as Locator;
  }

  /**
   * Resolve button
   */
  getResolveButton(): Locator {
    return this.page.getByRole('button', { name: /Resolve/i });
  }

  /**
   * Address result
   */
  getAddressResult(): Locator {
    return this.page.locator('[data-testid="address-result"], .address-result, div:has-text("Address:")');
  }

  getErrorState(): Locator {
    return this.page.locator('[data-testid="error-state"], .error, text=Invalid');
  }

  /**
   * Enter TNA code and resolve
   */
  async resolve(code: string): Promise<void> {
    await this.getTNAInput().fill(code);
    await this.getResolveButton().click();
  }

  /**
   * Verify address returned
   */
  async expectAddressResult(): Promise<void> {
    await this.expectVisible(this.getAddressResult());
  }

  /**
   * Verify error for invalid TNA
   */
  async expectInvalidTNAError(): Promise<void> {
    await this.expectVisible(this.getErrorState());
  }
}
