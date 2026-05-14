import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class CarrierDriverPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Driver task list
   */
  getTaskList(): Locator {
    return this.page.locator('[data-testid="task-list"], ul, div[class*="list"]');
  }

  /**
   * TNA resolve search input
   */
  getResolveInput(): Locator {
    return this.page.getByPlaceholder(/Enter TNA code/i);
  }

  getResolveButton(): Locator {
    return this.page.getByRole('button', { name: /Resolve|Search/i });
  }

  /**
   * Verify tasks assigned
   */
  async expectTasks(): Promise<void> {
    const count = await this.getTaskList().count();
    expect(count).toBeGreaterThan(0);
  }

  /**
   * Resolve TNA code
   */
  async resolveTNA(code: string): Promise<void> {
    await this.getResolveInput().fill(code);
    await this.getResolveButton().click();
  }

  /**
   * Verify address result after resolve
   */
  async expectAddressResult(): Promise<void> {
    await this.expectVisible('text=Address found');
  }
}
