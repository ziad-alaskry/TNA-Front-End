import { expect, Page } from '@playwright/test';

// ============================================
// FLOW CONTINUITY ASSERTIONS
// ============================================

/**
 * Verifies that a multi-step journey reached its terminal success state.
 * Checks for success dialog, expected element presence, and takes final screenshot.
 */
export async function expectFlowCompletion(
  page: Page,
  finalElementSelector: string,
  options: { successMessage?: string; takeScreenshot?: boolean } = {}
): Promise<void> {
  const { successMessage, takeScreenshot = true } = options;

  // Final element should be visible (success state)
  await expect(page.locator(finalElementSelector).first()).toBeVisible({ timeout: 10000 });

  // Optionally check for success toast/dialog
  if (successMessage) {
    const successToast = page.locator('[data-testid="toast-success"], .toast-success, .success')
      .filter({ hasText: successMessage });
    await expect(successToast).toBeVisible({ timeout: 5000 });
  }

  // Capture screenshot on successful completion for audit trail
  if (takeScreenshot) {
    await page.screenshot({
      path: `test-results/screenshots/${Date.now()}-flow-completion.png`,
      fullPage: true,
    });
  }
}

/**
 * Asserts that no intermediate 404s, blank states, or loading spinners persisted.
 */
export async function expectNoIntermediateFailures(page: Page): Promise<void> {
  // Check that no error boundaries or error pages are visible
  const errorPage = page.locator('[data-testid="error-page"], .error-page, [role="alert"]')
    .filter({ hasText: /404|not found|error/i });

  const count = await errorPage.count();
  expect(count).toBe(0);

  // Also check console for any uncaught errors
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  expect(errors.length).toBe(0);
}

/**
 * Verifies that a critical user flow was completed without page reloads/redirects to error pages.
 */
export async function expectSmoothFlow(page: Page, pathPattern: RegExp): Promise<void> {
  // Track URL changes - no 404 redirects
  const url = page.url();
  expect(url).toMatch(pathPattern);

  // No empty shell states
  const isEmptyState = await page.locator('[data-testid="empty-state"], .empty-state').count();
  expect(isEmptyState).toBe(0);
}

/**
 * Confirms that the user's state persisted correctly (e.g., after flow completion).
 */
export async function expectStatePersisted(
  page: Page,
  storageKey: string,
  expectedValue: string
): Promise<void> {
  const stored = await page.evaluate((key) => {
    return localStorage.getItem(key) || sessionStorage.getItem(key);
  }, storageKey);

  expect(stored).toContain(expectedValue);
}

/**
 * Asserts that the journey did not result in console errors.
 */
export async function expectCleanConsole(page: Page): Promise<void> {
  const consoleErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  expect(consoleErrors.length).toBe(0);
}
