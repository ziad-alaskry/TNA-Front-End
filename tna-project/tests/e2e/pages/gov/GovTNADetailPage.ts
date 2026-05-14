import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class GovTNADetailPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Page title shows request ID
   */
  getPageTitle(): Locator {
    return this.page.locator('h1, h2').filter({ hasText: /TNA Request/ }).first();
  }

  /**
   * Sections
   */
  getVisitorInfoSection(): Locator {
    return this.page.locator('h3, h4').filter({ hasText: /Visitor Information/i }).first();
  }

  getEligibilitySection(): Locator {
    return this.page.locator('h3, h4').filter({ hasText: /Eligibility/i }).first();
  }

  getDocumentsSection(): Locator {
    return this.page.locator('h3, h4').filter({ hasText: /Supporting Documents/i }).first();
  }

  /**
   * Sidebar Action buttons
   */
  getApproveButton(): Locator {
    return this.page.getByRole('button', { name: /Approve Request/i });
  }

  getRejectButton(): Locator {
    return this.page.getByRole('button', { name: /Reject Request/i });
  }

  /**
   * Status display after decision
   */
  getDecisionState(): Locator {
    return this.page.locator('.decision-state, [data-testid="decision"]');
  }

  getSuccessNotification(): Locator {
    return this.page.locator('.toast-success, [data-testid="toast-success"]');
  }

  /**
   * Check if page loaded with ID
   */
  async isPageLoaded(requestId: string): Promise<boolean> {
    const title = await this.getPageTitle().textContent();
    return title?.includes(requestId) || false;
  }

  /**
   * Approve the request
   */
  async approve(): Promise<void> {
    await this.getApproveButton().click();
  }

  /**
   * Reject the request
   */
  async reject(): Promise<void> {
    await this.getRejectButton().click();
  }

  /**
   * Verify sections present
   */
  async expectSections(): Promise<void> {
    await this.expectVisible(this.getVisitorInfoSection());
    await this.expectVisible(this.getEligibilitySection());
    await this.expectVisible(this.getDocumentsSection());
  }

  /**
   * Verify action buttons present
   */
  async expectActions(): Promise<void> {
    await this.expectVisible(this.getApproveButton());
    await this.expectVisible(this.getRejectButton());
  }

  /**
   * Verify approval success
   */
  async expectApprovalSuccess(): Promise<void> {
    await this.expectVisible(this.getSuccessNotification());
    const state = await this.getDecisionState().textContent();
    expect(state?.toLowerCase()).toContain('approved');
  }

  /**
   * Verify rejection success
   */
  async expectRejectionSuccess(): Promise<void> {
    await this.expectVisible(this.getSuccessNotification());
    const state = await this.getDecisionState().textContent();
    expect(state?.toLowerCase()).toContain('rejected');
  }

  /**
   * Navigate back to queue
   */
  async backToQueue(): Promise<void> {
    const backButton = this.page.getByRole('link', { name: /Back to Queue/i });
    await backButton.click();
  }
}
