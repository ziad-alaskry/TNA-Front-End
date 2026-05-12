import { Page, expect } from '@playwright/test';

export class OwnerBindingsPage {
  constructor(private page: Page) {}

  async approveBinding() {
    await this.page.getByRole('button', { name: 'Approve', exact: true }).first().click();
  }

  async rejectBinding() {
    await this.page.getByRole('button', { name: 'Reject', exact: true }).first().click();
  }

  async expectPendingList() {
    await expect(this.page.locator('.pending-bindings')).toBeVisible();
  }

  async navigate() {
    await this.page.goto('/owner/bindings');
  }
}