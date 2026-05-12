import { test as base } from '@playwright/test';

interface LocaleFixture {
  setLocale: (locale: 'ar' | 'en') => Promise<void>;
}

export const test = base.extend<LocaleFixture>({
  setLocale: async ({ page }, use) => {
    async function setLocale(locale: 'ar' | 'en') {
      await page.context().addCookies([
        {
          name: 'tna-locale',
          value: locale,
          domain: 'localhost',
          path: '/',
          expires: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
        }
      ]);
    }
    await use(setLocale);
  }
});

export { expect } from '@playwright/test';