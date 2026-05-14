/**
 * Provides helper functions to mock API responses during tests
 */
import { Page, Route } from '@playwright/test';
import { mockHandlers } from '../mocks/api-handlers';

/**
 * Mock API for a given endpoint pattern using handler factory
 */
export async function mockApi(page: Page, pattern: string, handler: (req: any) => Promise<{ status: number; body: any }>) {
  await page.route(pattern, async (route: Route, request: any) => {
    const response = await handler(request);
    await route.fulfill({
      status: response.status,
      body: JSON.stringify(response.body),
      headers: { 'Content-Type': 'application/json' },
    });
  });
}

/**
 * Helper to allow API to pass through unhandled routes
 */
export async function passthroughApi(page: Page, pattern: string) {
  await page.route(pattern, async (route) => {
    await route.continue();
  });
}

/**
 * Commonly used mock handlers shortcut
 */
export { mockHandlers };
