import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { VisitorSearchPage } from '../pages/visitor/VisitorSearchPage';

test.describe('Visitor Search & Bind Flow', () => {
  test('Search marketplace → select address → initiate binding → verify pending state', async ({ page }) => {
    const login = new LoginPage(page);
    await login.navigate();
    await login.selectRole('VISITOR');
    await login.fillCredentials('VISITOR');
    await login.submit();
    await expect(page).toHaveURL('/visitor/home');

    const searchPage = new VisitorSearchPage(page);
    await searchPage.navigate();
    await searchPage.searchAddress('456 Olaya St');
    await searchPage.expectResultsList();
    await searchPage.selectResult(0);
    await page.getByRole('button', { name: 'Initiate Binding' }).click();
    await expect(page.getByText('Binding request sent')).toBeVisible();
    await expect(page.locator('.binding-status')).toHaveText('PENDING');
  });

  test('No results state on empty search', async ({ page }) => {
    const login = new LoginPage(page);
    await login.navigate();
    await login.selectRole('VISITOR');
    await login.fillCredentials('VISITOR');
    await login.submit();

    const searchPage = new VisitorSearchPage(page);
    await searchPage.navigate();
    await searchPage.searchAddress('zzzznonexistent');
    await expect(page.getByText('No results found')).toBeVisible();
  });

  test('Empty search shows placeholder', async ({ page }) => {
    const login = new LoginPage(page);
    await login.navigate();
    await login.selectRole('VISITOR');
    await login.fillCredentials('VISITOR');
    await login.submit();

    const searchPage = new VisitorSearchPage(page);
    await searchPage.navigate();
    await expect(page.getByText('Start typing to search')).toBeVisible();
  });
});
