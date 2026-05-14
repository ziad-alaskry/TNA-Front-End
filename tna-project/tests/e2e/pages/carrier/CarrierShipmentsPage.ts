import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class CarrierShipmentsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Shipments list
   */
  getShipmentsList(): Locator {
    return this.page.locator('[data-testid="shipments-list"], table, div[class*="list"]');
  }

  /**
   * Filter by status
   */
  getStatusFilter(): Locator {
    return this.page.locator('select, [role="combobox"]').first();
  }

  /**
   * Update status button on a shipment
   */
  getUpdateStatusButton(trackingNumber: string): Locator {
    const row = this.page.locator(`tr:has-text("${trackingNumber}"), div:has-text("${trackingNumber}")`);
    return row.getByRole('button', { name: /Update|Change Status/i }).first();
  }

  /**
   * Assign driver button
   */
  getAssignDriverButton(trackingNumber: string): Locator {
    const row = this.page.locator(`tr:has-text("${trackingNumber}"), div:has-text("${trackingNumber}")`);
    return row.getByRole('button', { name: /Assign Driver/i }).first();
  }

  /**
   * Filter shipments
   */
  async filterByStatus(status: string): Promise<void> {
    await this.getStatusFilter().selectOption({ label: status });
    await this.waitForNetworkIdle();
  }

  /**
   * Update shipment status
   */
  async updateStatus(trackingNumber: string, newStatus: string): Promise<void> {
    await this.getUpdateStatusButton(trackingNumber).click();
    await this.page.locator('text=' + newStatus).click();
    await this.waitForNetworkIdle();
  }

  /**
   * Verify shipments listed
   */
  async expectShipmentsListed(): Promise<void> {
    const count = await this.getShipmentsList().count();
    expect(count).toBeGreaterThan(0);
  }
}
