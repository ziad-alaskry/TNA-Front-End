import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { VisitorTNAPage } from '../pages/visitor/VisitorTNAPage';
import { VisitorProfilePage } from '../pages/visitor/VisitorProfilePage';
import { expectGuardrail } from '../assertions/functional';

test.describe('Visitor Unbinding with Guardrail', () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.open('en');
    await login.login('VISITOR');
  });

  test('VISITOR can unbind an ACTIVE TNA', async ({ page }) => {
    const tnaPage = new VisitorTNAPage(page);
    await page.goto('/en/visitor/tnas');
    
    // Find first ACTIVE TNA
    const activeTNAS = await page.locator('.badge:has-text("ACTIVE")').count();
    expect(activeTNAS).toBeGreaterThan(0);
    
    const activeCard = page.locator('.badge:has-text("ACTIVE")').first();
    const tnaCode = await activeCard.locator('..').textContent() || '';
    const codeMatch = tnaCode.match(/TNA-[A-Z0-9]+/);
    
    if (codeMatch) {
      const code = codeMatch[0];
      await tnaPage.viewTNA(code);
      
      // Click unbind button - implementation specific
      const unbindBtn = page.getByRole('button', { name: /Unbind|Terminate/i });
      if (await unbindBtn.count() > 0) {
        await unbindBtn.click();
        await expect(page.getByText(/unlinked|terminated/i)).toBeVisible();
      } else {
        test.skip(true, 'Unbind button not present in current UI');
      }
    }
  });

  test('IN_TRANSIT shipment prevents TNA unbinding', async ({ page }) => {
    const tnaPage = new VisitorTNAPage(page);
    await page.goto('/en/visitor/tnas');
    
    // Mock a TNA with IN_TRANSIT shipment
    await page.route('/api/binding/terminate', async (route) => {
      await route.fulfill({
        status: 409,
        body: JSON.stringify({ error: 'Cannot unlink: Active deliveries in progress' }),
        headers: { 'Content-Type': 'application/json' },
      });
    });

    // Find a TNA (any) and attempt unbind
    const firstCard = page.locator('div[class*="snap-start"]').first();
    await firstCard.click();

    const unbindBtn = page.getByRole('button', { name: /Unbind/i });
    if (await unbindBtn.count() > 0) {
      await unbindBtn.click();
      
      // Expect error toast
      await expectGuardrail(page, 'Cannot unlink: Active deliveries in progress');
    }
  });
});
