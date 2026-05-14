import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class CarrierHomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Fleet stats
   */
  getFleetUtilization(): Locator {
    return this.page.locator('div:has-text("Fleet Utilization")').first();
  }

  getActiveShipments(): Locator {
    return this.page.locator('div:has-text("Active Shipments")').first();
  }

  /**
   * Action buttons
   */
  getNewShipmentButton(): Locator {
    return this.page.getByRole('button', { name: /New Shipment/i });
  }

  getManageFleetButton(): Locator {
    return this.page.getByRole('button', { name: /Manage Fleet/i });
  }

  /**
   * Verify dashboard loaded
   */
  async expectDashboard(): Promise<void> {
    await this.expectVisible(this.getFleetUtilization());
    await this.expectVisible(this.getActiveShipments());
  }

  /**
   * Navigate to new shipment
   */
  async createNewShipment(): Promise<void> {
    await this.getNewShipmentButton().click();
  }

  /**
   * Navigate to fleet management
   */
  async goToFleet(): Promise<void> {
    await this.getManageFleetButton().click();
  }
}
