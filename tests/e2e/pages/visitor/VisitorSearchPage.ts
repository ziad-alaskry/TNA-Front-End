import { Page, expect } from '@playwright/test';

export class VisitorSearchPage {
  constructor(private page: Page) {}

  async searchAddress(query: string) {
    await this.page.getByLabel('Search address or TNA').fill(query);
    await this.page.getByRole('button', { name: 'Search' }).click();
  }

  async selectResult(index: number = 0) {
    const results = this.page.locator('.search-result-item');
    await results.nth(index).click();
  }

  async expectResultsList() {
    await expect(this.page.locator('.search-results')).toBeVisible();
  }

  async navigate() {
    await this.page.goto('/visitor/search');
  }
}