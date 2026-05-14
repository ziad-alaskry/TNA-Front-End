import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';
import type { TNA } from '@/lib/types/tna';

export class VisitorHomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Get hero section banner
   */
  getHeroBanner(): Locator {
    return this.page.locator('div').filter({ hasText: 'Saudi National Address Proxy' }).first();
  }

  /**
   * Get Request TNA CTA button
   */
  getRequestTNAButton(): Locator {
    return this.page.getByRole('button', { name: /Request TNA/i });
  }

  /**
   * Get Find Address CTA button
   */
  getFindAddressButton(): Locator {
    return this.page.getByRole('button', { name: /Find Address/i });
  }

  /**
   * Get stats card by label
   */
  getStatsCard(label: string): Locator {
    return this.page.locator('div').filter({ hasText: label }).first();
  }

  /**
   * Get active TNA count from stats
   */
  async getActiveTNACount(): Promise<number> {
    const activeTNASection = this.page.locator('text=Active TNAs');
    const parent = activeTNASection.locator('..');
    const countText = await parent.textContent() || '';
    const match = countText.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  }

  /**
   * Get shipments count from stats
   */
  async getShipmentsCount(): Promise<number> {
    const shipmentsSection = this.page.locator('text=Shipments');
    const parent = shipmentsSection.locator('..');
    const countText = await parent.textContent() || '';
    const match = countText.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  }

  /**
   * Get TNA card by code
   */
  getTNACardByCode(code: string): Locator {
    return this.page.locator(`div[class*="snap-start"]:has-text("${code}")`);
  }

  /**
   * Get My Active Addresses section
   */
  getMyActiveAddressesSection(): Locator {
    return this.page.locator('h2:has-text("My Active Addresses")');
  }

  /**
   * Click Manage Addresses link
   */
  async clickManageAddresses(): Promise<void> {
    const link = this.page.getByRole('link', { name: /Manage Addresses/i });
    await link.click();
  }

  /**
   * Get Recent Shipments section
   */
  getRecentShipmentsSection(): Locator {
    return this.page.locator('h2:has-text("Recent Shipments")');
  }

  /**
   * Verify hero banner present
   */
  async expectHeroBanner(): Promise<void> {
    await this.expectVisible('div:has-text("Saudi National Address Proxy")');
  }

  /**
   * Verify CTA buttons present
   */
  async expectCTAButtons(): Promise<void> {
    await this.expectVisible('button:has-text("Request TNA")');
    await this.expectVisible('button:has-text("Find Address")');
  }

  /**
   * Verify stats cards present
   */
  async expectStatsCards(): Promise<void> {
    await this.expectVisible('div:has-text("Active TNAs")');
    await this.expectVisible('div:has-text("Shipments")');
  }

  /**
   * Navigate to TNA request page
   */
  async goToTNARequest(): Promise<void> {
    await this.getRequestTNAButton().click();
  }

  /**
   * Navigate to address search
   */
  async goToSearch(): Promise<void> {
    await this.getFindAddressButton().click();
  }

  /**
   * Navigate to TNA list
   */
  async goToTNAList(): Promise<void> {
    await this.clickManageAddresses();
  }

  /**
   * Navigate to shipments list
   */
  async goToShipments(): Promise<void> {
    const viewAll = this.page.getByRole('link', { name: /View All/i });
    await viewAll.click();
  }
}
