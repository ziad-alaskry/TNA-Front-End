import { Page, expect } from '@playwright/test';

export class CarrierHomePage {
  constructor(private page: Page) {}

  async expectFleetStats() {
    await expect(this.page.getByText('Fleet Size')).toBeVisible();
    await expect(this.page.getByText('Active Shipments')).toBeVisible();
    await expect(this.page.getByText('On-Time Delivery')).toBeVisible();
  }

  async expectActiveShipments() {
    await expect(this.page.getByText('Active Shipments')).toBeVisible();
  }

  async navigate() {
    await this.page.goto('/carrier/home');
  }
}