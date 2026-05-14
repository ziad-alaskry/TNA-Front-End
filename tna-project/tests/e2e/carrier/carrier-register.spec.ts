import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Carrier Registration', () => {
  test('carrier can complete registration flow', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open('en');
    await page.goto('/en/register/type');
    
    // Select Carrier role in registration
    await page.getByRole('button', { name: /Carrier/i }).click();
    await page.getByRole('button', { name: /Continue/i }).click();
    
    // Fill company info
    await page.getByLabel(/Company Name/i).fill('Test Logistics Co.');
    await page.getByLabel(/Commercial Registration/i).fill('CR-1234567890');
    await page.getByRole('button', { name: /Next/i }).click();
    
    // Verify redirect to carrier dashboard after completion (mock)
    test.info().annotations.push({ type: 'todo', description: 'Complete registration flow assertions after API integration' });
  });

  test('duplicate registration rejected', async ({ page }) => {
    await page.route('/api/carriers/register', async (route) => {
      await route.fulfill({ 
        status: 409, 
        body: JSON.stringify({ error: 'Carrier already exists' }) 
      });
    });

    await page.goto('/en/register/type');
    await page.getByRole('button', { name: /Carrier/i }).click();
    // Fill form...
    
    // Expect error
    await expect(page.locator('.toast-error, [role="alert"]')).toContainText('already exists');
  });
});
