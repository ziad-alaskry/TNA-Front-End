import { Page, expect, Locator } from '@playwright/test';

/**
 * Base page class providing common functionality for all page objects.
 * All page objects should extend this class.
 */
export class BasePage {
  readonly page: Page;
  readonly baseURL: string;

  constructor(page: Page, baseURL: string = 'http://localhost:3000') {
    this.page = page;
    this.baseURL = baseURL;
  }

  /**
   * Navigate to a path relative to baseURL, automatically prepending locale if needed
   */
  async navigate(path: string, locale: 'en' | 'ar' = 'en'): Promise<void> {
    const fullPath = path.startsWith('/') ? path : `/${path}`;
    // Ensure we include locale in URL
    const url = new URL(this.baseURL);
    url.pathname = fullPath;
    await this.page.goto(url.toString());
    await this.waitForLoad();
  }

  /**
   * Navigate to a role-specific page with proper locale
   */
  async navigateToRole(role: string, path: string = 'home', locale: 'en' | 'ar' = 'en'): Promise<void> {
    await this.navigate(`/${locale}/${role}/${path}`, locale);
  }

  /**
   * Wait for page to be stable (network idle + DOM ready)
   */
  async waitForLoad(timeout: number = 30000): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded', { timeout });
    await this.page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * Get locator for element by test ID
   */
  getByTestId(testId: string): Locator {
    return this.page.locator(`[data-testid="${testId}"]`);
  }

  /**
   * Get locator by aria label
   */
  getByLabel(label: string): Locator {
    return this.page.getByLabel(label);
  }

  /**
   * Get locator by placeholder
   */
  getByPlaceholder(placeholder: string): Locator {
    return this.page.getByPlaceholder(placeholder);
  }

  /**
   * Get locator by text content
   */
  getByText(text: string): Locator {
    return this.page.getByText(text);
  }

  /**
   * Get locator by role (button, link, etc.)
   */
  getByRole(role: string, options?: { name?: string | RegExp }): Locator {
    return this.page.getByRole(role as any, options);
  }

  /**
   * Fill input field by label or placeholder
   */
  async fillField(selector: string, value: string): Promise<void> {
    const field = this.page.locator(selector).first();
    await field.fill('');
    await field.type(value);
  }

  /**
   * Click button by text or role
   */
  async clickButton(textOrRole: string | { role: string; name?: string | RegExp }): Promise<void> {
    if (typeof textOrRole === 'string') {
      await this.page.getByRole('button', { name: textOrRole }).click();
    } else {
      await this.page.getByRole(textOrRole.role as any, { name: textOrRole.name }).click();
    }
  }

  /**
   * Wait for element to appear
   */
  async waitForSelector(selector: string, timeout: number = 5000): Promise<Locator> {
    const locator = this.page.locator(selector);
    await locator.waitFor({ state: 'visible', timeout });
    return locator;
  }

  /**
   * Take a screenshot
   */
  async screenshot(path: string): Promise<void> {
    await this.page.screenshot({ path, fullPage: true });
  }

  /**
   * Assert URL contains expected path
   */
  async expectURL(path: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(path);
  }

  /**
   * Assert page title contains text
   */
  async expectTitle(text: string | RegExp): Promise<void> {
    await expect(this.page).toHaveTitle(text);
  }

  /**
   * Assert element is visible
   */
  async expectVisible(selector: string | Locator): Promise<void> {
    const element = typeof selector === 'string' ? this.page.locator(selector).first() : selector;
    await expect(element).toBeVisible();
  }

  /**
   * Assert element contains text
   */
  async expectText(selector: string | Locator, text: string | RegExp): Promise<void> {
    const element = typeof selector === 'string' ? this.page.locator(selector).first() : selector;
    await expect(element).toContainText(text);
  }

  /**
   * Assert element has attribute value
   */
  async expectAttribute(selector: string | Locator, attribute: string, value: string | RegExp): Promise<void> {
    const element = typeof selector === 'string' ? this.page.locator(selector).first() : selector;
    await expect(element).toHaveAttribute(attribute, value);
  }

  /**
   * Get text content of element
   */
  async getText(selector: string): Promise<string> {
    return await this.page.locator(selector).first().textContent() || '';
  }

  /**
   * Check if element exists
   */
  async exists(selector: string): Promise<boolean> {
    return await this.page.locator(selector).count() > 0;
  }

  /**
   * Wait for network to be idle
   */
  async waitForNetworkIdle(timeout: number = 5000): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * Execute JavaScript in browser context
   */
  async evaluate<T>(script: string | ((arg: any) => T), arg?: any): Promise<T> {
    return await this.page.evaluate(script, arg);
  }

  /**
   * Set localStorage item
   */
  async setLocalStorage(key: string, value: any): Promise<void> {
    await this.page.evaluate((params: { k: string; v: any }) => {
      localStorage.setItem(params.k, JSON.stringify(params.v));
    }, { k: key, v: value });
  }

  /**
   * Get localStorage item
   */
  async getLocalStorage(key: string): Promise<any> {
    return await this.page.evaluate((k: string) => {
      const item = localStorage.getItem(k);
      return item ? JSON.parse(item) : null;
    }, key);
  }
}
