import { Page, expect } from '@playwright/test';

export class VisitorTNAPage {
  constructor(private page: Page) {}

  async expectTNAList() {
    await expect(this.page.locator('.tna-list')).toBeVisible();
  }

  async clickTNADetail(index: number = 0) {
    const tnaItems = this.page.locator('.tna-item');
    await tnaItems.nth(index).click();
  }

  async requestUnbind() {
    await this.page.getByRole('button', { name: 'Unbind TNA' }).click();
  }

  async navigate() {
    await this.page.goto('/visitor/tnas');
  }
}