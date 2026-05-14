import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class VisitorTNAIssuancePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Step 1: Identity Confirmation selectors
   */
  getIdentitySection(): Locator {
    return this.page.locator('h2, h3').filter({ hasText: 'Identity Confirmation' }).first();
  }

  getConfirmIdentityCheckbox(): Locator {
    return this.page.locator('label:has-text("I confirm that all personal data") input[type="checkbox"]');
  }

  getNextStepButton(): Locator {
    return this.page.getByRole('button', { name: /Next Step/i });
  }

  /**
   * Step 2: Policy Acknowledgment selectors
   */
  getPolicySection(): Locator {
    return this.page.locator('h2, h3').filter({ hasText: 'Policy Acknowledgment' }).first();
  }

  getAgreePolicyCheckbox(): Locator {
    return this.page.locator('label:has-text("I agree to the TNA Terms") input[type="checkbox"]');
  }

  getSubmitRequestButton(): Locator {
    return this.page.getByRole('button', { name: /Submit Request/i });
  }

  getBackButton(): Locator {
    return this.page.getByRole('button', { name: /Back/i });
  }

  /**
   * Step 3: Result section selectors
   */
  getSuccessHeading(): Locator {
    return this.page.locator('h2, h1').filter({ hasText: 'Approved!' }).first();
  }

  getPendingHeading(): Locator {
    return this.page.locator('h2, h1').filter({ hasText: 'Pending Review' }).first();
  }

  getTNACodeDisplay(): Locator {
    return this.page.locator('code, .tna-code, [class*="mono"]').filter({ hasText: /TNA-[A-Z0-9]+/ }).first();
  }

  getActiveBadge(): Locator {
    return this.page.locator('.badge, [class*="badge"]:has-text("ACTIVE")').first();
  }

  getGoToMyTNAsButton(): Locator {
    return this.page.getByRole('button', { name: /Go to My TNAs/i });
  }

  getReturnToDashboardButton(): Locator {
    return this.page.getByRole('button', { name: /Return to Dashboard/i });
  }

  /**
   * Check if identity checkbox is checked
   */
  async isIdentityConfirmed(): Promise<boolean> {
    return await this.getConfirmIdentityCheckbox().isChecked();
  }

  /**
   * Check if policy checkbox is checked
   */
  async isPolicyAgreed(): Promise<boolean> {
    return await this.getAgreePolicyCheckbox().isChecked();
  }

  /**
   * Confirm identity (checkbox)
   */
  async confirmIdentity(): Promise<void> {
    await this.getConfirmIdentityCheckbox().check();
  }

  /**
   * Agree to policy (checkbox)
   */
  async agreeToPolicy(): Promise<void> {
    await this.getAgreePolicyCheckbox().check();
  }

  /**
   * Navigate to next step
   */
  async goToNextStep(): Promise<void> {
    await this.getNextStepButton().click();
  }

  /**
   * Submit the request
   */
  async submitRequest(): Promise<void> {
    await this.getSubmitRequestButton().click();
  }

  /**
   * Go back to previous step
   */
  async goBack(): Promise<void> {
    await this.getBackButton().click();
  }

  /**
   * Navigate to my TNAs from success screen
   */
  async goToMyTNAs(): Promise<void> {
    await this.getGoToMyTNAsButton().click();
  }

  /**
   * Verify Step 1 is displayed
   */
  async expectStep1(): Promise<void> {
    await this.expectVisible(this.getIdentitySection());
    await this.expectVisible(this.getConfirmIdentityCheckbox());
    await this.expectVisible(this.getNextStepButton());
  }

  /**
   * Verify Step 2 is displayed
   */
  async expectStep2(): Promise<void> {
    await this.expectVisible(this.getPolicySection());
    await this.expectVisible(this.getAgreePolicyCheckbox());
    await this.expectVisible(this.getSubmitRequestButton());
  }

  /**
   * Verify success state
   */
  async expectSuccess(): Promise<void> {
    await this.expectVisible(this.getSuccessHeading());
    await this.expectVisible(this.getTNACodeDisplay());
    await this.expectVisible(this.getActiveBadge());
    await this.expectVisible(this.getGoToMyTNAsButton());
  }

  /**
   * Verify pending state
   */
  async expectPending(): Promise<void> {
    await this.expectVisible(this.getPendingHeading());
    await this.expectVisible(this.getReturnToDashboardButton());
  }

  /**
   * Verify step buttons are enabled/disabled
   */
  async expectNextStepDisabled(disabled: boolean = true): Promise<void> {
    if (disabled) {
      await expect(this.getNextStepButton()).toBeDisabled();
    } else {
      await expect(this.getNextStepButton()).toBeEnabled();
    }
  }

  async expectSubmitDisabled(disabled: boolean = true): Promise<void> {
    if (disabled) {
      await expect(this.getSubmitRequestButton()).toBeDisabled();
    } else {
      await expect(this.getSubmitRequestButton()).toBeEnabled();
    }
  }
}
