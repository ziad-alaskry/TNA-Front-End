import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { GovHomePage } from '../pages/gov/GovHomePage';

test.describe('Gov User Role', () => {
  test('gov user can login and see dashboard', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open('en');
    await login.login('GOV_USER', 'gov', 'password');
    
    await expect(page).toHaveURL(/.*\/en\/gov\/home/);
  });

  test('gov dashboard displays KPI cards', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open('en');
    await login.login('GOV_USER');
    
    const homePage = new GovHomePage(page);
    await homePage.expectKPICards();
  });

  test('gov dashboard displays quick actions', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open('en');
    await login.login('GOV_USER');
    
    const homePage = new GovHomePage(page);
    await homePage.expectQuickActions();
  });
});
