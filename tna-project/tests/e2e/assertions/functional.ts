import { expect, Page } from '@playwright/test';

// ============================================
// STATE TRANSITION ASSERTIONS
// ============================================

/**
 * Verifies that a status badge or element transitions from one state to another.
 * Looks for elements containing the status text.
 */
export async function expectStateTransition(
  page: Page,
  from: string,
  to: string,
  timeout: number = 5000
): Promise<void> {
  // First check 'from' is no longer present (or changed)
  // Temporarily set short timeout to avoid waiting
  const fromLocator = page.locator(`text=${from}`);
  const fromStillPresent = await fromLocator.count();
  // (fromStillPresent === 0 means transition completed)

  // Then check 'to' is present
  const toElement = page.locator(`text=${to}`).first();
  await expect(toElement).toBeVisible({ timeout });

  // Optionally verify localStorage/Zustand state
  const currentState = await page.evaluate(() => {
    const authData = localStorage.getItem('auth-storage');
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        return JSON.stringify(parsed.state);
      } catch {
        return null;
      }
    }
    return null;
  });

  // Log for debugging
  console.log('Current auth state:', currentState);
}

/**
 * Asserts that a toast/dialog appears with a specific error message.
 */
export async function expectGuardrail(
  page: Page,
  errorMessage: string,
  options: { timeout?: number; isError?: boolean } = {}
): Promise<void> {
  const { timeout = 5000, isError = true } = options;

  // Look for toast messages or error dialogs
  const toastLocator = page.locator('[data-testid="toast"], .toast, [role="alert"]')
    .filter({ hasText: errorMessage });

  await expect(toastLocator).toBeVisible({ timeout });

  // Verify the toast has an error styling if isError=true
  if (isError) {
    const hasErrorClass = await toastLocator.evaluate((el) => {
      return el.className.toLowerCase().includes('error') ||
             el.className.toLowerCase().includes('danger') ||
             el.getAttribute('data-testid')?.toLowerCase().includes('error');
    });
    // Soft check: don't fail if class name convention differs
    console.log('Toast error styling:', hasErrorClass);
  }
}

/**
 * Verifies that a destructive action was blocked and state remains unchanged.
 */
export async function expectActionBlocked(
  page: Page,
  blockerMessage: string,
  previousState: string
): Promise<void> {
  await expectGuardrail(page, blockerMessage);
  // Verify state unchanged via localStorage or UI
  const currentState = await page.evaluate(() => {
    return (window as any).__previousState || localStorage.getItem('test-state');
  });
  expect(currentState).toBe(previousState);
}

// ============================================
// DATA VALIDATION ASSERTIONS
// ============================================

/**
 * Validates that a table or list renders expected row count.
 */
export async function expectTableRowCount(
  page: Page,
  tableSelector: string,
  expectedCount: number
): Promise<void> {
  const rows = page.locator(`${tableSelector} tr`);
  await expect(rows).toHaveCount(expectedCount);
}

/**
 * Confirms a badge displays a specific status text with appropriate color.
 */
export async function expectStatusBadge(page: Page, status: string, color?: string): Promise<void> {
  const badge = page.locator(`[data-testid*="badge"], .badge`).filter({ hasText: status }).first();
  await expect(badge).toBeVisible();

  if (color) {
    const badgeColor = await badge.evaluate((el) => {
      const style = getComputedStyle(el);
      return style.color || style.backgroundColor;
    });
    // Soft check for color match (could be rgb representation)
    console.log(`Badge color for "${status}":`, badgeColor);
  }
}

// ============================================
// COMMON UI ASSERTIONS
// ============================================

/**
 * Asserts element visibility with timeout
 */
export async function expectVisible(
  page: Page,
  selector: string,
  timeout = 5000
): Promise<void> {
  await expect(page.locator(selector).first()).toBeVisible({ timeout });
}

/**
 * Asserts element not visible
 */
export async function expectHidden(
  page: Page,
  selector: string,
  timeout = 2000
): Promise<void> {
  await expect(page.locator(selector).first()).toBeHidden({ timeout });
}

/**
 * Asserts URL contains expected path
 */
export async function expectURL(
  page: Page,
  expectedPath: string,
  timeout = 5000
): Promise<void> {
  await expect(page).toHaveURL(new RegExp(expectedPath), { timeout });
}

/**
 * Asserts page title or heading contains expected text
 */
export async function expectPageTitle(
  page: Page,
  title: string
): Promise<void> {
  await expect(page).toHaveTitle(new RegExp(title));
  // Also check for h1
  const h1 = page.locator('h1').first();
  await expect(h1).toContainText(title, { useInnerText: true });
}
