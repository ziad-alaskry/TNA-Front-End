import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { OwnerHomePage } from '../pages/owner/OwnerHomePage';
import { expectSPATIALTheme } from '../assertions/visual';

test.describe('Owner Role Login & Dashboard', () => {
  test('owner can login and see wallet balance', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open('en');
    await login.selectRole('OWNER');
    await login.fillUsername('owner');
    await login.fillPassword('password');
    await login.clickLogin();

    await expect(page).toHaveURL(/.*\/en\/owner\/home/);
  });

  test('owner dashboard displays wallet balance card', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open('en');
    await login.login('OWNER');

    const homePage = new OwnerHomePage(page);
    await homePage.expectStatsCards();
    await homePage.expectWalletWidget();
  });

  test('owner dashboard complies with design system', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open('en');
    await login.login('OWNER');

    await expectSPATIALTheme(page);
  });
});
