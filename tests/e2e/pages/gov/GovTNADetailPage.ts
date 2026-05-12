import { Page, expect } from '@playwright/test';

export class GovTNADetailPage {
  constructor(private page: Page) {}

  async approveRequest() {
    await this.page.getByRole('button', { name: 'Approve', exact: true }).click();
  }

  async rejectRequest() {
    await this.page.getByRole('button', { name: 'Reject', exact: true }).click();
  }

  async expectDecisionState() {
    // Expect either success or failure animation/message
    await expect(this.page.locator('.decision-state')).toBeVisible();
  }

  async navigate(requestId: string) {
    await this.page.goto(`/gov/tna-queue/${requestId}`);
  }
}