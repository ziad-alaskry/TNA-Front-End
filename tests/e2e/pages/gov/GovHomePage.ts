import { Page, expect } from '@playwright/test';

export class GovHomePage {
  constructor(private page: Page) {}

  async expectKPICards() {
    await expect(this.page.getByText('Pending Requests')).toBeVisible();
    await expect(this.page.getByText('Approved Today')).toBeVisible();
    await expect(this.page.getByText('Rejected Today')).toBeVisible();
    await expect(this.page.getByText('Total TNAs Issued')).toBeVisible();
  }

  async expectRegionStats() {
    await expect(this.page.locator('.region-stats')).toBeVisible();
  }

  async navigate() {
    await this.page.goto('/gov/home');
  }
}