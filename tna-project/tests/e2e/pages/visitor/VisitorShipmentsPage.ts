import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';
import type { Shipment } from '@/lib/types/deliveries';

export class VisitorShipmentsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Get shipments table/list
   */
  getShipmentsList(): Locator {
    return this.page.locator('[data-testid="shipments-list"], div[class*="list"], table');
  }

  /**
   * Get shipment card by tracking number
   */
  getShipmentByTracking(trackingNumber: string): Locator {
    return this.page.locator(`div:has-text("${trackingNumber}")`).first();
  }

  /**
   * Get filter dropdown
   */
  getStatusFilter(): Locator {
    return this.page.locator('select, [role="combobox"]').first();
  }

  /**
   * Get filter options
   */
  getFilterOptions(): Locator {
    return this.page.locator('option, [role="option"]');
  }

  /**
   * Get status badge for a shipment
   */
  getShipmentStatus(trackingNumber: string): Locator {
    const card = this.getShipmentByTracking(trackingNumber);
    return card.locator('.badge, [class*="badge"]').first();
  }

  /**
   * Get View Details button for shipment
   */
  getViewDetailsButton(trackingNumber: string): Locator {
    const card = this.getShipmentByTracking(trackingNumber);
    return card.getByRole('button', { name: /Details|View/i });
  }

  /**
   * Filter shipments by status
   */
  async filterByStatus(status: string): Promise<void> {
    await this.getStatusFilter().selectOption({ label: status });
    await this.waitForNetworkIdle();
  }

  /**
   * View shipment details
   */
  async viewShipment(trackingNumber: string): Promise<void> {
    await this.getViewDetailsButton(trackingNumber).click();
  }

  /**
   * Get shipments count
   */
  async getShipmentsCount(): Promise<number> {
    const rows = this.page.locator('[data-testid="shipment-row"], div[class*="shipment-card"]');
    return await rows.count();
  }

  /**
   * Verify shipments table loaded
   */
  async expectShipmentsTable(): Promise<void> {
    const count = await this.getShipmentsCount();
    expect(count).toBeGreaterThan(0);
  }

  /**
   * Verify filter exists
   */
  async expectFilter(): Promise<void> {
    await this.expectVisible(this.getStatusFilter());
  }

  /**
   * Verify specific shipment status
   */
  async expectShipmentStatus(trackingNumber: string, expectedStatus: string): Promise<void> {
    const status = this.getShipmentStatus(trackingNumber);
    await expect(status).toContainText(expectedStatus, { useInnerText: true });
  }

  /**
   * Verify empty state
   */
  async expectEmptyState(): Promise<void> {
    await this.expectVisible('text=No active shipments found');
  }
}
