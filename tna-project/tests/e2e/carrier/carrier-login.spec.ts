import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { CarrierHomePage } from '../pages/carrier/CarrierHomePage';

test.describe('Carrier Role Login & Dashboard', () => {
  test('carrier can login and see dashboard', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open('en');
    await login.login('CARRIER_STAFF', 'carrier', 'password');
    
    await expect(page).toHaveURL(/.*\/en\/carrier\/home/);
  });

  test('carrier dashboard displays fleet stats', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open('en');
    await login.login('CARRIER_STAFF');
    
    const homePage = new CarrierHomePage(page);
    await homePage.expectDashboard();
  });

  test('carrier can navigate to create shipment', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open('en');
    await login.login('CARRIER_STAFF');
    
    const homePage = new CarrierHomePage(page);
    await homePage.createNewShipment();
    await expect(page).toHaveURL(/\/carrier\/shipments\/new/);
  });

  test('carrier can navigate to fleet management', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open('en');
    await login.login('CARRIER_STAFF');
    
    const homePage = new CarrierHomePage(page);
    await homePage.goToFleet();
    await expect(page).toHaveURL(/\/carrier\/fleet/);
  });
});
