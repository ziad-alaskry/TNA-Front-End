import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class OwnerHomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Stats cards selectors
   */
  getPropertiesCard(): Locator {
    return this.page.locator('div:has-text("Properties")').first();
  }

  getActiveBindingsCard(): Locator {
    return this.page.locator('div:has-text("Active Bindings")').first();
  }

  getPendingRequestsCard(): Locator {
    return this.page.locator('div:has-text("Pending Requests")').first();
  }

  getTotalEarningsCard(): Locator {
    return this.page.locator('div:has-text("Total Earnings")').first();
  }

  /**
   * Get wallet widget balance
   */
  getWalletBalance(): Locator {
    return this.page.locator('h3:has-text("Digital Wallet")').locator('..').locator('text=/SAR \\d+/').first();
  }

  /**
   * Action banner
   */
  getAddPropertyButton(): Locator {
    return this.page.getByRole('button', { name: /Add New Property/i });
  }

  /**
   * Pending requests section
   */
  getPendingRequestsSection(): Locator {
    return this.page.locator('h3:has-text("Pending Requests")').first();
  }

  getViewAllRequestsButton(): Locator {
    return this.page.getByRole('link', { name: /View All/i });
  }

  getBindingRequestCard(): Locator {
    return this.page.locator('div:has-text("New Binding Request")').first();
  }

  getAcceptButton(code?: string): Locator {
    const buttonText = code ? `Accept for ${code}` : /Accept/i;
    return this.page.getByRole('button', { name: buttonText }).first();
  }

  getDeclineButton(code?: string): Locator {
    const buttonText = code ? `Decline for ${code}` : /Decline/i;
    return this.page.getByRole('button', { name: buttonText }).first();
  }

  /**
   * Weekly revenue section
   */
  getWeeklyRevenueHeading(): Locator {
    return this.page.locator('h3:has-text("Weekly Revenue")').first();
  }

  /**
   * Navigate to add property page
   */
  async goToAddProperty(): Promise<void> {
    await this.getAddPropertyButton().click();
  }

  /**
   * Navigate to bindings page
   */
  async goToBindings(): Promise<void> {
    await this.getViewAllRequestsButton().click();
  }

  /**
   * Approve a pending binding request
   */
  async acceptBinding(btn?: Locator): Promise<void> {
    const button = btn || this.getAcceptButton();
    await button.click();
  }

  /**
   * Decline a pending binding request
   */
  async declineBinding(btn?: Locator): Promise<void> {
    const button = btn || this.getDeclineButton();
    await button.click();
  }

  /**
   * Verify stats cards displayed
   */
  async expectStatsCards(): Promise<void> {
    await this.expectVisible(this.getPropertiesCard());
    await this.expectVisible(this.getActiveBindingsCard());
    await this.expectVisible(this.getPendingRequestsCard());
    await this.expectVisible(this.getTotalEarningsCard());
  }

  /**
   * Verify wallet widget
   */
  async expectWalletWidget(): Promise<void> {
    await this.expectVisible('h3:has-text("Digital Wallet")');
    await this.expectVisible(this.getWalletBalance());
  }

  /**
   * Verify pending requests exist
   */
  async expectPendingRequests(): Promise<void> {
    await this.expectVisible(this.getPendingRequestsSection());
    const count = await this.getPendingRequestsCard().textContent();
    const match = count?.match(/\d+/);
    if (match && parseInt(match[0]) > 0) {
      await this.expectVisible(this.getBindingRequestCard());
    }
  }

  /**
   * Get stats card counts
   */
  async getStatsCounts(): Promise<{ properties: number; bindings: number; pending: number }> {
    const parseCount = async (card: Locator): Promise<number> => {
      const text = await card.textContent() || '';
      const match = text.match(/\d+/);
      return match ? parseInt(match[0]) : 0;
    };

    const properties = await parseCount(this.getPropertiesCard());
    const bindings = await parseCount(this.getActiveBindingsCard());
    const pending = await parseCount(this.getPendingRequestsCard());
    return { properties, bindings, pending };
  }

  /**
   * Verify success after binding action
   */
  async expectBindingActionSuccess(): Promise<void> {
    await this.expectVisible('.toast-success, [data-testid="toast-success"]');
  }
}
