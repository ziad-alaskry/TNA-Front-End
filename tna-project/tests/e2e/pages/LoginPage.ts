import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import type { UserRole } from '@/lib/types/auth';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to login page
   */
  async open(locale: 'en' | 'ar' = 'en'): Promise<void> {
    await this.navigate(`/${locale}/login`, locale);
  }

  /**
   * Select a role from the role buttons
   */
  async selectRole(role: UserRole): Promise<void> {
    const roleMap: Record<UserRole, string> = {
      VISITOR: 'Visitor',
      OWNER: 'Owner',
      CARRIER_STAFF: 'Carrier',
      GOV_USER: 'Gov',
    };

    const roleLabel = roleMap[role] || 'Visitor';
    const roleButton = this.page.locator('button', { hasText: roleLabel });
    await roleButton.waitFor({ state: 'visible' });
    await roleButton.click();
  }

  /**
   * Fill username field
   */
  async fillUsername(username: string): Promise<void> {
    await this.fillField('input[placeholder*="username"]', username);
  }

  /**
   * Fill password field
   */
  async fillPassword(password: string): Promise<void> {
    await this.fillField('input[type="password"]', password);
  }

  /**
   * Toggle password visibility
   */
  async togglePasswordVisibility(): Promise<void> {
    const toggleButton = this.page.locator('button:has(svg), button:has(button)').filter({
      has: this.page.locator('svg'),
    }).first();
    // More specific: find the button adjacent to password input that toggles visibility
    const passwordField = this.page.locator('input[type="password"]');
    const container = passwordField.locator('..');
    const toggleBtn = container.locator('button').first();
    await toggleBtn.click();
  }

  /**
   * Click login button
   */
  async clickLogin(): Promise<void> {
    await this.clickButton({ role: 'button', name: /Login|Sign in/i });
  }

  /**
   * Complete full login flow
   */
  async login(role: UserRole, username: string = 'dev_user', password: string = 'password'): Promise<void> {
    await this.selectRole(role);
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLogin();
  }

  /**
   * Verify role selection buttons are visible
   */
  async expectRoleButtons(): Promise<void> {
    const roles = ['Owner', 'Carrier', 'Gov', 'Visitor'];
    for (const role of roles) {
      await this.expectVisible(`button:has-text("${role}")`);
    }
  }

  /**
   * Verify login form is displayed correctly
   */
  async expectLoginForm(): Promise<void> {
    await this.expectVisible('input[placeholder*="username"]');
    await this.expectVisible('input[type="password"]');
    await this.expectVisible('button:has-text("Login")');
  }

  /**
   * Get Forgot Password link href
   */
  async getForgotPasswordHref(): Promise<string> {
    const link = this.page.locator('a', { hasText: /forgot password/i });
    return await link.getAttribute('href') || '';
  }

  /**
   * Get Create Account link href
   */
  async getCreateAccountHref(): Promise<string> {
    const link = this.page.locator('a', { hasText: /create account/i });
    return await link.getAttribute('href') || '';
  }
}
