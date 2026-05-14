import { test, expect } from '@playwright/test';

test.describe('Visitor Login Flow', () => {
  test('Login with VISITOR role redirects to /visitor/home', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: 'VISITOR' }).click();
    await page.getByLabel('Email').fill('visitor@test.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL('/visitor/home');
  });

  test('Invalid role fallback shows error', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: 'VISITOR' }).click();
    await page.getByLabel('Email').fill('visitor@test.com');
    await page.getByLabel('Password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByText('Invalid credentials')).toBeVisible();
  });
});
