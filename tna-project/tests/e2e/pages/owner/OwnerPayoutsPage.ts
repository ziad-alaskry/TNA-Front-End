import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class OwnerPayoutsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Wallet balance display
   */
  getBalanceDisplay(): Locator {
    return this.page.locator('text=/SAR \\d+[,\\.]\\d+/').first();
  }

  /**
   * Request payout button
   */
  getRequestPayoutButton(): Locator {
    return this.page.getByRole('button', { name: /Withdraw|Request Payout/i });
  }

  /**
   * Transaction history list
   */
  getTransactionList(): Locator {
    return this.page.locator('[data-testid="transactions-list"], table, div[class*="list"]');
  }

  /**
   * Request payout amount input
   */
  getAmountInput(): Locator {
    return this.page.getByLabel(/Amount/i);
  }

  getPayoutMethodSelect(): Locator {
    return this.page.getByLabel(/Payment Method/i);
  }

  getConfirmPayoutButton(): Locator {
    return this.page.getByRole('button', { name: /Confirm|Request/i });
  }

  /**
   * Request a payout
   */
  async requestPayout(amount: number, method: string = 'bank_transfer'): Promise<void> {
    await this.getAmountInput().fill(amount.toString());
    await this.getPayoutMethodSelect().selectOption({ label: method });
    await this.getConfirmPayoutButton().click();
  }

  /**
   * Verify balance displayed
   */
  async expectBalance(): Promise<void> {
    await this.expectVisible(this.getBalanceDisplay());
  }

  /**
   * Verify transaction history
   */
  async expectTransactionHistory(): Promise<void> {
    const count = await this.getTransactionList().count();
    expect(count).toBeGreaterThan(0);
  }

  /**
   * Verify payout success
   */
  async expectPayoutSuccess(): Promise<void> {
    await this.expectVisible('.toast-success, [data-testid="toast-success"]');
  }
}
