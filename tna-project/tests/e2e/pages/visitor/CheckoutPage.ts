import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class CheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Payment method selectors
   */
  getCreditCardOption(): Locator {
    return this.page.locator('label:has-text("Credit Card")').first();
  }

  getApplePayOption(): Locator {
    return this.page.locator('label:has-text("Apple Pay")').first();
  }

  getSTCPayOption(): Locator {
    return this.page.locator('label:has-text("STC Pay")').first();
  }

  /**
   * Credit card form fields
   */
  getCardNumberInput(): Locator {
    return this.page.getByPlaceholder('4111 1111 1111 1111');
  }

  getExpiryInput(): Locator {
    return this.page.getByPlaceholder('MM/YY');
  }

  getCVVInput(): Locator {
    return this.page.getByPlaceholder('123');
  }

  getCardholderNameInput(): Locator {
    return this.page.getByPlaceholder(/cardholder|name/i);
  }

  /**
   * Action buttons
   */
  getGoBackButton(): Locator {
    return this.page.getByRole('button', { name: /Go Back/i });
  }

  getPayButton(): Locator {
    return this.page.getByRole('button', { name: /Pay/i });
  }

  getTopUpButton(): Locator {
    return this.page.getByRole('button', { name: /Top Up/i });
  }

  /**
   * Top-up modal
   */
  getTopUpModal(): Locator {
    return this.page.locator('[role="dialog"], .modal, div:has-text("Top Up")');
  }

  getTopUpConfirmButton(): Locator {
    return this.page.getByRole('button', { name: /Confirm/i });
  }

  getTopUpCancelButton(): Locator {
    return this.page.getByRole('button', { name: /Cancel/i });
  }

  /**
   * Select payment method
   */
  async selectCreditCard(): Promise<void> {
    await this.getCreditCardOption().click();
  }

  /**
   * Fill credit card details
   */
  async fillCardDetails(cardNumber: string = '4111 1111 1111 1111', expiry: string = '12/25', cvv: string = '123', name: string = 'Test User'): Promise<void> {
    await this.getCardNumberInput().fill(cardNumber);
    await this.getExpiryInput().fill(expiry);
    await this.getCVVInput().fill(cvv);
    await this.getCardholderNameInput().fill(name);
  }

  /**
   * Complete payment (no top-up needed)
   */
  async completePayment(): Promise<void> {
    await this.selectCreditCard();
    await this.fillCardDetails();
    await this.getPayButton().click();
  }

  /**
   * Complete top-up flow
   */
  async completeTopUp(): Promise<void> {
    await this.selectCreditCard();
    await this.fillCardDetails();
    // Assuming the current balance is insufficient, button shows Top Up
    await this.getTopUpButton().click();
    await this.getTopUpConfirmButton().click();
  }

  /**
   * Go back to previous step
   */
  async goBack(): Promise<void> {
    await this.getGoBackButton().click();
  }

  /**
   * Verify payment options present
   */
  async expectPaymentOptions(): Promise<void> {
    await this.expectVisible('label:has-text("Credit Card")');
    await this.expectVisible('label:has-text("Apple Pay")');
    await this.expectVisible('label:has-text("STC Pay")');
  }

  /**
   * Verify disabled methods show coming soon
   */
  async expectComingSoonDisabled(): Promise<void> {
    await this.expectVisible('text=Apple Pay (Coming Soon)');
    await this.expectVisible('text=STC Pay (Coming Soon)');
  }

  /**
   * Verify credit card form appears
   */
  async expectCardFormVisible(): Promise<void> {
    await this.expectVisible(this.getCardNumberInput());
    await this.expectVisible(this.getExpiryInput());
    await this.expectVisible(this.getCVVInput());
  }

  /**
   * Verify success message appears
   */
  async expectSuccess(message?: string): Promise<void> {
    const successToast = this.page.locator('.toast-success, [data-testid="toast-success"]').first();
    await expect(successToast).toBeVisible();
    if (message) {
      await expect(successToast).toContainText(message);
    }
  }

  /**
   * Verify top-up modal appears
   */
  async expectTopUpModal(): Promise<void> {
    await this.expectVisible(this.getTopUpModal());
    await this.expectVisible(this.getTopUpConfirmButton());
  }

  /**
   * Get Pay button text
   */
  async getPayButtonText(): Promise<string> {
    return await this.getPayButton().textContent() || '';
  }
}
