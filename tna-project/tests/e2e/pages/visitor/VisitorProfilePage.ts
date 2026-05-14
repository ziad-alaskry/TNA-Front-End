import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class VisitorProfilePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Profile section selectors
   */
  getProfileHeader(): Locator {
    return this.page.locator('h1, h2').filter({ hasText: /Profile|My Profile/i }).first();
  }

  getNameInput(): Locator {
    return this.page.getByLabel(/Full Name|Name/i);
  }

  getEmailInput(): Locator {
    return this.page.getByLabel(/Email/i);
  }

  getPhoneInput(): Locator {
    return this.page.getByLabel(/Phone|Mobile/i);
  }

  getSaveButton(): Locator {
    return this.page.getByRole('button', { name: /Save Changes|Update/i });
  }

  /**
   * Get current displayed name
   */
  async getDisplayedName(): Promise<string> {
    const nameElement = this.page.locator('.profile-name, h1').first();
    return await nameElement.textContent() || '';
  }

  /**
   * Update profile information
   */
  async updateProfile(name?: string, email?: string, phone?: string): Promise<void> {
    if (name) {
      await this.getNameInput().fill(name);
    }
    if (email) {
      await this.getEmailInput().fill(email);
    }
    if (phone) {
      await this.getPhoneInput().fill(phone);
    }
    await this.getSaveButton().click();
  }

  /**
   * Verify profile loaded
   */
  async expectProfileLoaded(): Promise<void> {
    await this.expectVisible(this.getProfileHeader());
    await this.expectVisible(this.getNameInput());
  }

  /**
   * Verify update success (toast or UI change)
   */
  async expectUpdateSuccess(): Promise<void> {
    await this.expectVisible('[data-testid="toast-success"], .toast-success');
  }
}
