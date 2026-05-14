import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class GovAuditPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Audit log table
   */
  getAuditTable(): Locator {
    return this.page.locator('table, [role="grid"]');
  }

  getAuditRows(): Locator {
    return this.page.locator('tr, div[class*="row"]:has-text("Adjustment")');
  }

  /**
   * Verify audit logs rendered
   */
  async expectAuditLogs(): Promise<void> {
    const count = await this.getAuditRows().count();
    expect(count).toBeGreaterThan(0);
  }
}
