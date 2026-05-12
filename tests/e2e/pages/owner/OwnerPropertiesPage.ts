import { Page, expect } from '@playwright/test';

export class OwnerPropertiesPage {
  constructor(private page: Page) {}

  async addProperty() {
    await this.page.getByRole('button', { name: 'Add Property' }).click();
  }

  async createSubAddress() {
    await this.page.getByRole('button', { name: 'Create Sub-address' }).click();
  }

  async toggleAutoAccept() {
    await this.page.getByLabel('Auto-accept bindings').click();
  }

  async navigate() {
    await this.page.goto('/owner/properties');
  }
}