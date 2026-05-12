import { Page, expect } from '@playwright/test';

export class VisitorShipmentsPage {
  constructor(private page: Page) {}

  async expectShipmentTable() {
    await expect(this.page.locator('.shipments-table')).toBeVisible();
  }

  async filterByStatus(status: string) {
    await this.page.getByLabel('Filter by status').selectOption(status);
  }

  async navigate() {
    await this.page.goto('/visitor/shipments');
  }
}