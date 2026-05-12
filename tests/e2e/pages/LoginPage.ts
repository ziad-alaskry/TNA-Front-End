import { Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async selectRole(role: 'VISITOR' | 'OWNER' | 'GOV-USER' | 'CARRIER') {
    await this.page.getByRole('button', { name: role, exact: true }).click();
  }

  async fillCredentials(role: 'VISITOR' | 'OWNER' | 'GOV-USER' | 'CARRIER') {
    // Fill email based on role
    const emailMap = {
      VISITOR: 'visitor@test.com',
      OWNER: 'owner@test.com',
      'GOV-USER': 'gov@test.com',
      CARRIER: 'carrier@test.com'
    };
    
    await this.page.getByLabel('Email').fill(emailMap[role]);
    await this.page.getByLabel('Password').fill('password123');
  }

  async submit() {
    await this.page.getByRole('button', { name: 'Sign In' }).click();
  }

  async expectRoleButtons() {
    await expect(this.page.getByRole('button', { name: 'VISITOR', exact: true })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'OWNER', exact: true })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'GOV-USER', exact: true })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'CARRIER', exact: true })).toBeVisible();
  }

  async navigate() {
    await this.page.goto('/login');
  }
}