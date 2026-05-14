import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { VisitorProfilePage } from '../pages/visitor/VisitorProfilePage';

test.describe('Visitor Profile', () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.open('en');
    await login.login('VISITOR');
    await page.goto('/en/visitor/profile');
  });

  test('visitor can view and edit profile', async ({ page }) => {
    const profilePage = new VisitorProfilePage(page);
    await profilePage.expectProfileLoaded();
    
    const originalName = await profilePage.getDisplayedName();
    const newName = 'Updated Visitor Name';
    
    await profilePage.updateProfile(newName);
    await profilePage.expectUpdateSuccess();
    
    const updatedName = await profilePage.getDisplayedName();
    expect(updatedName.toLowerCase()).toContain(newName.toLowerCase());
  });

  test('profile updates persist after page refresh', async ({ page }) => {
    const profilePage = new VisitorProfilePage(page);
    await profilePage.updateProfile('Persistent Name');
    await page.reload();
    await profilePage.expectProfileLoaded();
    
    const name = await profilePage.getDisplayedName();
    expect(name).toContain('Persistent Name');
  });
});
