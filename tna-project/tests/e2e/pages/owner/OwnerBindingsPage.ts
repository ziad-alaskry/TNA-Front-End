import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class OwnerBindingsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Bindings table
   */
  getBindingsTable(): Locator {
    return this.page.locator('table, [role="grid"], div[class*="table"]');
  }

  /**
   * Get pending binding count
   */
  async getPendingCount(): Promise<number> {
    const badges = this.page.locator('.badge, [class*="badge"]:has-text("PENDING")');
    return await badges.count();
  }

  /**
   * Get approval/decline buttons for a binding
   */
  getApproveButton(row: Locator): Locator {
    return row.getByRole('button', { name: /Approve/i });
  }

  getDeclineButton(row: Locator): Locator {
    return row.getByRole('button', { name: /Reject|Decline/i });
  }

  /**
   * Auto-accept toggle
   */
  getAutoAcceptToggle(): Locator {
    return this.page.locator('input[type="checkbox"]').first();
  }

  /**
   * Verify pending bindings exist
   */
  async expectPendingBindings(): Promise<void> {
    const count = await this.getPendingCount();
    expect(count).toBeGreaterThan(0);
  }

  /**
   * Approve a binding row
   */
  async approveBinding(row: Locator): Promise<void> {
    await this.getApproveButton(row).click();
  }

  /**
   * Declinea binding row
   */
  async declineBinding(row: Locator): Promise<void> {
    await this.getDeclineButton(row).click();
  }

  /**
   * Toggle auto-accept
   */
  async toggleAutoAccept(enable: boolean): Promise<void> {
    const toggle = this.getAutoAcceptToggle();
    if (await toggle.isChecked() !== enable) {
      await toggle.click();
    }
  }
}
