import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class GovAddressDetailPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Page title
   */
  getPageTitle(): Locator {
    return this.page.locator('h1, h2').filter({ hasText: /Sub-address/i }).first();
  }

  /**
   * Sections
   */
  getOwnerInfoSection(): Locator {
    return this.page.locator('h3, h4').filter({ hasText: /Owner Information/i }).first();
  }

  getNationalAddressSection(): Locator {
    return this.page.locator('h3, h4').filter({ hasText: /National Address/i }).first();
  }

  getSubAddressSection(): Locator {
    return this.page.locator('h3, h4').filter({ hasText: /Sub-address/i }).filter({ hasText: /Details/ }).first();
  }

  /**
   * Action buttons
   */
  getVerifyButton(): Locator {
    return this.page.getByRole('button', { name: /Verify Address/i });
  }

  getRejectButton(): Locator {
    return this.page.getByRole('button', { name: /Reject Request/i });
  }

  /**
   * Verify owner info visible
   */
  async expectOwnerInfo(): Promise<void> {
    await this.expectVisible(this.getOwnerInfoSection());
    await this.expectVisible('text=Mohammed Al-Saud');
  }

  /**
   * Verify address details
   */
  async expectAddressDetails(): Promise<void> {
    await this.expectVisible(this.getNationalAddressSection());
  }

  /**
   * Verify action buttons
   */
  async expectActions(): Promise<void> {
    await this.expectVisible(this.getVerifyButton());
    await this.expectVisible(this.getRejectButton());
  }

  /**
   * Approve/verify address
   */
  async verify(): Promise<void> {
    await this.getVerifyButton().click();
  }

  /**
   * Reject address
   */
  async reject(): Promise<void> {
    await this.getRejectButton().click();
  }

  /**
   * Verify success state
   */
  async expectVerificationSuccess(): Promise<void> {
    await this.expectVisible('.toast-success, [data-testid="toast-success"]');
  }
}
