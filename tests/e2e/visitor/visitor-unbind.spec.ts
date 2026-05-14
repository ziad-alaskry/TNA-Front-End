import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { VisitorTNAPage } from '../pages/visitor/VisitorTNAPage';

test.describe('Visitor Unbind Guardrails', () => {
  test('Unbind active TNA → verify UNLINKED status', async ({ page }) => {
    const login = new LoginPage(page);
    await login.navigate();
    await login.selectRole('VISITOR');
    await login.fillCredentials('VISITOR');
    await login.submit();
    await expect(page).toHaveURL('/visitor/home');

    const tnaPage = new VisitorTNAPage(page);
    await tnaPage.navigate();
    await tnaPage.clickTNADetail(0);
    await tnaPage.requestUnbind();
    await page.getByRole('button', { name: 'Confirm Unbind' }).click();
    await expect(page.getByText('TNA unlinked successfully')).toBeVisible();
    await expect(page.locator('.tna-status')).toHaveText('UNLINKED');
  });

  test('⚠️ IN_TRANSIT guardrail: attempt unbind while shipment is IN_TRANSIT → expect error toast "Cannot unlink: Active deliveries in progress"', async ({ page }) => {
    const login = new LoginPage(page);
    await login.navigate();
    await login.selectRole('VISITOR');
    await login.fillCredentials('VISITOR');
    await login.submit();

    // Mock API to return 409 conflict when trying to unbind with active in-transit shipments
    await page.route('/api/binding/terminate', route => {
      route.fulfill({
        status: 409,
        body: { error: 'Cannot unlink: Active deliveries in progress' }
      });
    });

    const tnaPage = new VisitorTNAPage(page);
    await tnaPage.navigate();
    await tnaPage.clickTNADetail(0);
    await tnaPage.requestUnbind();
    await page.getByRole('button', { name: 'Confirm Unbind' }).click();
    await expect(page.getByText('Cannot unlink: Active deliveries in progress')).toBeVisible();
  });
});
