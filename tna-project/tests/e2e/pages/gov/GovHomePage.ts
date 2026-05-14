import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class GovHomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * KPI cards selectors
   */
  getPendingTNACard(): Locator {
    return this.page.locator('div:has-text(/TNA.*Pending|Pending TNA/i)').first();
  }

  getPendingAddressesCard(): Locator {
    return this.page.locator('div:has-text(/Address.*Pending|Pending Address/i)').first();
  }

  getAdjustmentsCard(): Locator {
    return this.page.locator('div:has-text(/Adjustment/i)').first();
  }

  getAutoapprovalCard(): Locator {
    return this.page.locator('div:has-text(/Autoapprov|Auto-Approval/i)').first();
  }

  /**
   * Quick actions panel
   */
  getPolicySettingsButton(): Locator {
    return this.page.getByRole('button', { name: /Policy Settings/i });
  }

  getSystemAuditButton(): Locator {
    return this.page.getByRole('button', { name: /System Audit/i });
  }

  getAgencyManagementButton(): Locator {
    return this.page.getByRole('button', { name: /Agency Management/i });
  }

  getFinancialAdjustmentsButton(): Locator {
    return this.page.getByRole('button', { name: /Financial Adjustments/i });
  }

  /**
   * Region distribution section
   */
  getRegionStatsSection(): Locator {
    return this.page.locator('h2, h3').filter({ hasText: /Region|Geographic/i }).first();
  }

  /**
   * Quick actions navigation
   */
  async goToPolicySettings(): Promise<void> {
    await this.getPolicySettingsButton().click();
  }

  async goToSystemAudit(): Promise<void> {
    await this.getSystemAuditButton().click();
  }

  /**
   * Verify KPIs displayed
   */
  async expectKPICards(): Promise<void> {
    await this.expectVisible(this.getPendingTNACard());
    await this.expectVisible(this.getPendingAddressesCard());
    await this.expectVisible(this.getAdjustmentsCard());
    await this.expectVisible(this.getAutoapprovalCard());
  }

  /**
   * Verify quick actions
   */
  async expectQuickActions(): Promise<void> {
    await this.expectVisible(this.getPolicySettingsButton());
    await this.expectVisible(this.getSystemAuditButton());
    await this.expectVisible(this.getAgencyManagementButton());
    await this.expectVisible(this.getFinancialAdjustmentsButton());
  }

  /**
   * Get KPI counts
   */
  async getKPICounts(): Promise<{ tna: number; addresses: number; adjustments: number }> {
    const parse = async (card: Locator): Promise<number> => {
      const txt = await card.textContent() || '';
      const nums = txt.match(/\d+/g);
      return nums ? parseInt(nums[0]) : 0;
    };
    const tna = await parse(this.getPendingTNACard());
    const addresses = await parse(this.getPendingAddressesCard());
    const adjustments = await parse(this.getAdjustmentsCard());
    return { tna, addresses, adjustments };
  }
}
