import { Page, expect } from '@playwright/test';

export class CarrierShipmentsPage {
  constructor(private page: Page) {}

  async expectShipmentTable() {
    await expect(this.page.locator('.shipments-table')).toBeVisible();
  }

  async updateStatus(status: string) {
    await this.page.getByLabel('Update status').selectOption(status);
    await this.page.getByRole('button', { name: 'Update' }).click();
  }

  async assignDriver() {
    await this.page.getByRole('button', { name: 'Assign Driver' }).click();
  }

  async navigate() {
    await this.page.goto('/carrier/shipments');
  }
}