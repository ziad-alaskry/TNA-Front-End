import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Visitor Profile Flow', () => {
  test('View/edit profile → update contact info → verify persistence', async ({ page }) => {
    const login = new LoginPage(page);
    await login.navigate();
    await login.selectRole('VISITOR');
    await login.fillCredentials('VISITOR');
    await login.submit();
    await expect(page).toHaveURL('/visitor/home');

    await page.getByRole('link', { name: 'Profile' }).click();
    await expect(page.getByText('Personal Information')).toBeVisible();

    await page.getByLabel('Phone number').fill('+966500000000');
    await page.getByRole('button', { name: 'Save Changes' }).click();
    await expect(page.getByText('Profile updated successfully')).toBeVisible();

    // Verify persisted
    await page.reload();
    await expect(page.getByLabel('Phone number')).toHaveValue('+966500000000');
  });
});
