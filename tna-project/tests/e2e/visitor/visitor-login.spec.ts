import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { VisitorHomePage } from '../pages/visitor/VisitorHomePage';
import { expectStateTransition } from '../assertions/functional';
import { expectSPATIALTheme, expectRTLLayout, expectBasicAccessibility } from '../assertions/visual';

test.describe('Visitor Role Login Flow', () => {
  let loginPage: LoginPage;
  let homePage: VisitorHomePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new VisitorHomePage(page);
  });

  test('visitor can login and redirects to home', async ({ page }) => {
    await loginPage.open('en');
    await expect(page).toHaveURL(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/en/login`);
    
    await loginPage.login('VISITOR', 'visitor', 'password123');
    
    await expect(page).toHaveURL(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/en/visitor/home`);
    await homePage.expectHeroBanner();
  });

  test('visitor login preserves locale setting', async ({ page }) => {
    await page.goto('/ar/login');
    await loginPage.selectRole('VISITOR');
    await loginPage.fillUsername('visitor');
    await loginPage.fillPassword('password');
    await loginPage.clickLogin();
    
    await expect(page).toHaveURL(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/ar/visitor/home`);
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  });

  test('login form displays all role options', async ({ page }) => {
    await loginPage.open('en');
    await expect(loginPage.getByText('Owner')).toBeVisible();
    await expect(loginPage.getByText('Carrier')).toBeVisible();
    await expect(loginPage.getByText('Gov')).toBeVisible();
    await expect(loginPage.getByText('Visitor')).toBeVisible();
  });

  test('visitor design system compliance after login', async ({ page }) => {
    await loginPage.open('en');
    await loginPage.login('VISITOR');
    await homePage.expectHeroBanner();
    
    // Verify S.P.A.T.I.A.L. theme
    await expectSPATIALTheme(page);
    await expectBasicAccessibility(page);
  });
});
