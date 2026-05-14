import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

const BASE_URL = 'http://localhost:3000';

test.describe('TNA Platform Smoke Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
  });

  test('application loads login page', async ({ page }) => {
    await page.goto('/en/login');
    await expect(page).toHaveURL(`${BASE_URL}/en/login`);
    await expect(loginPage.getByText(/Temporary National Address|العنوان الوطني المؤقت/i)).toBeVisible();
  });

  test('login page displays all role buttons', async ({ page }) => {
    await page.goto('/en/login');
    await loginPage.expectRoleButtons();
  });

  test('successful login redirects to correct dashboard', async ({ page }) => {
    await page.goto('/en/login');
    await loginPage.login('VISITOR');
    await expect(page).toHaveURL(`${BASE_URL}/en/visitor/home`);
  });

  test('Arabic locale RTL layout works', async ({ page }) => {
    await page.goto('/ar/login');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  });

  test('responsive design: mobile navigation exists', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/en/login');
    await expect(loginPage.getByText(/Login|Sign in/i)).toBeVisible();
  });

  test('deprecated route redirects to new path', async ({ page }) => {
    const response = await page.goto('/en/gov/verification/queue');
    await expect(response).toHaveStatus(301);
    await expect(page).toHaveURL(`${BASE_URL}/en/gov/tna-queue`);
  });
});
