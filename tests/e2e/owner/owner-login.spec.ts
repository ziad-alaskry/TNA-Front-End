import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { OwnerHomePage } from '../pages/owner/OwnerHomePage';

test.describe('Owner Login Flow', () => {
  test('Login → redirect to /owner/home → verify wallet balance card', async ({ page }) => {
    const login = new LoginPage(page);
    await login.navigate();
    await login.selectRole('OWNER');
    await login.fillCredentials('OWNER');
    await login.submit();
    await expect(page).toHaveURL('/owner/home');

    const home = new OwnerHomePage(page);
    await home.expectWalletBalance();
    await home.expectPropertyCount();
  });
});
