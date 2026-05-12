import { Page, expect } from '@playwright/test';

export class VisitorHomePage {
  constructor(private page: Page) {}

  async expectDashboardCards() {
    await expect(this.page.getByText('Active TNAs')).toBeVisible();
    await expect(this.page.getByText('Wallet Balance')).toBeVisible();
    await expect(this.page.getByText('Recent Shipments')).toBeVisible();
    await expect(this.page.getByText('Profile Completeness')).toBeVisible();
  }

  async expectActiveTNAs(count: number) {
    const tnaItems = this.page.locator('.tna-item.active');
    await expect(tnaItems).toHaveCount(count);
  }

  async navigate() {
    await this.page.goto('/visitor/home');
  }
}