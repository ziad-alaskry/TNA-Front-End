import { Page, expect } from '@playwright/test';

export class GovPolicyPage {
  constructor(private page: Page) {}

  async toggleIssuanceMode() {
    await this.page.getByLabel('Issuance mode').click();
  }

  async updateRules() {
    await this.page.getByRole('button', { name: 'Update Rules' }).click();
  }

  async navigate() {
    await this.page.goto('/gov/policy');
  }
}