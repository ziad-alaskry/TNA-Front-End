/**
 * Provides helper to set locale cookie for tests
 */
import { Page } from '@playwright/test';

const LOCALE_COOKIE_NAME = 'tna-locale';

/**
 * Set locale cookie to influence middleware
 */
export async function setLocale(page: Page, locale: 'en' | 'ar'): Promise<void> {
  await page.context().addCookies([
    {
      name: LOCALE_COOKIE_NAME,
      value: locale,
      domain: 'localhost',
      path: '/',
      httpOnly: false,
      secure: false,
      sameSite: 'Lax',
    },
  ]);
}

/**
 * Get current locale from cookie
 */
export async function getLocale(page: Page): Promise<string> {
  const cookies = await page.context().cookies();
  const cookie = cookies.find((c) => c.name === LOCALE_COOKIE_NAME);
  return cookie?.value || 'en';
}
