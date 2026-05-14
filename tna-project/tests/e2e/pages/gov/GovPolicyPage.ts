import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class GovPolicyPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Policy form
   */
  getIssuanceModeSelect(): Locator {
    return this.page.getByLabel(/Issuance Mode/i);
  }

  getMaxTNASInput(): Locator {
    return this.page.getByLabel(/max.*TNA|TNA.*limit/i);
  }

  getAutoApproveCheckboxes(): Locator {
    return this.page.locator('input[type="checkbox"]').filter({ hasText: /auto.*approv/i });
  }

  getSaveButton(): Locator {
    return this.page.getByRole('button', { name: /Save|Update/i });
  }

  /**
   * Verify policy page loaded
   */
  async expectPolicyForm(): Promise<void> {
    await this.expectVisible(this.getIssuanceModeSelect());
    await this.expectVisible(this.getSaveButton());
  }

  /**
   * Change issuance mode
   */
  async setIssuanceMode(mode: 'MODERATED' | 'AUTONOMOUS'): Promise<void> {
    await this.getIssuanceModeSelect().selectOption({ label: mode });
  }

  /**
   * Update max TNA limit
   */
  async setMaxTNALimit(limit: number): Promise<void> {
    await this.getMaxTNASInput().fill(limit.toString());
  }

  /**
   * Toggle auto-approve options
   */
  async toggleAutoApprove(option: number, enabled: boolean): Promise<void> {
    const checkboxes = this.getAutoApproveCheckboxes();
    const count = await checkboxes.count();
    if (option < count) {
      const cb = checkboxes.nth(option);
      if (await cb.isChecked() !== enabled) {
        await cb.click();
      }
    }
  }

  /**
   * Save policy
   */
  async savePolicy(): Promise<void> {
    await this.getSaveButton().click();
  }

  /**
   * Verify policy saved
   */
  async expectPolicySaved(): Promise<void> {
    await this.expectVisible('.toast-success');
  }
}
