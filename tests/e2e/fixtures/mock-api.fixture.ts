import { test as base } from '@playwright/test';

interface MockApiFixture {
  /**
   * Sets up API route interceptors for mocking responses
   * @param handler Function that returns the mock response
   */
  mockApiRoute: (urlPattern: string | RegExp, handler: (request: any) => any) => void;
}

export const test = base.extend<MockApiFixture>({
  mockApiRoute: async ({ page }, use) => {
    async function mockApiRoute(urlPattern: string | RegExp, handler: (request: any) => any) {
      await page.route(urlPattern, async (route, request) => {
        const mockResponse = handler(request);
        await route.fulfill(mockResponse);
      });
    }
    await use(mockApiRoute);
  }
});

export { expect } from '@playwright/test';