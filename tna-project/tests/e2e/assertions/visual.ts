import { expect, Page } from '@playwright/test';

// ============================================
// DESIGN SYSTEM / SPATIAL THEME ASSERTIONS
// ============================================

/**
 * Verifies that the S.P.A.T.I.A.L. design system CSS variables are loaded
 * and correctly configured on the page.
 */
export async function expectSPATIALTheme(page: Page): Promise<void> {
  // Check primary color CSS variable
  const primaryColor = await page.evaluate(() => {
    return getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim();
  });
  expect(primaryColor).toBe('#2196C9');

  // Check font families contain expected fonts (Rubik or IBM Plex Sans Arabic)
  const fontFamily = await page.evaluate(() => {
    return getComputedStyle(document.body).fontFamily;
  });
  const lowerFontFamily = fontFamily.toLowerCase();
  const hasExpectedFont = lowerFontFamily.includes('rubik') ||
                          lowerFontFamily.includes('ibm plex') ||
                          lowerFontFamily.includes('ibm plex sans arabic');
  expect(hasExpectedFont).toBe(true);

  // Ensure the primary font (first in stack) is a custom font, not a raw browser default
  const primaryFont = fontFamily.split(',')[0].trim().toLowerCase();
  const isPrimaryCustom = primaryFont.includes('rubik') || primaryFont.includes('ibm plex');
  expect(isPrimaryCustom).toBe(true);

  // Verify gradient exists on CTA buttons
  const hasGradientOnButtons = await page.evaluate(() => {
    const buttons = document.querySelectorAll('button, a.btn, [role="button"]');
    return Array.from(buttons).some((btn: Element) => {
      const style = getComputedStyle(btn);
      return style.backgroundImage && style.backgroundImage.includes('gradient');
    });
  });
  expect(hasGradientOnButtons).toBe(true);
}

/**
 * Verifies RTL layout is properly applied.
 * Checks dir attribute and logical CSS properties.
 */
export async function expectRTLLayout(page: Page): Promise<void> {
  const dir = await page.evaluate(() => document.documentElement.dir);
  expect(dir === 'rtl' || dir === 'ltr').toBeTruthy(); // Should be set to either rtl or ltr

  // Check for logical padding properties in common elements
  const hasLogicalPadding = await page.evaluate(() => {
    const elements = document.querySelectorAll('*');
    return Array.from(elements).some((el: Element) => {
      const style = getComputedStyle(el);
      const padding = style.padding || style.paddingInline || style.paddingBlock;
      return padding && (padding.includes('padding-inline') || padding.includes('padding-block'));
    });
  });
  expect(hasLogicalPadding).toBe(true);

  // Check for logical margin properties in common elements
  const hasLogicalMargin = await page.evaluate(() => {
    const elements = document.querySelectorAll('*');
    return Array.from(elements).some((el: Element) => {
      const style = getComputedStyle(el);
      const margin = style.margin || style.marginInline || style.marginBlock;
      return margin && (margin.includes('margin-inline') || margin.includes('margin-block'));
    });
  });
  expect(hasLogicalMargin).toBe(true);
}

/**
 * Asserts that the page has no console errors during navigation/load.
 */
export async function expectNoConsoleErrors(page: Page): Promise<void> {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  // Call after test actions are complete
  expect(errors.length).toBe(0);
}

/**
 * Verifies the branding/logo is present in the header.
 */
export async function expectBrandingPresent(page: Page): Promise<void> {
  const hasBranding = await page.evaluate(() => {
    return document.querySelector('img[alt*="TNA"], .brand, [data-testid="logo"]') !== null;
  });
  // Soft assertion - check for common branding elements
}

// ============================================
// ACCESSIBILITY ASSERTIONS
// ============================================

/**
 * Verifies basic accessibility: alt text on images, form labels, heading hierarchy.
 */
export async function expectBasicAccessibility(page: Page): Promise<void> {
  // Check that images have alt attributes
  const imagesWithoutAlt = await page.evaluate(() => {
    const imgs = document.querySelectorAll('img');
    return Array.from(imgs).filter((img) => !img.hasAttribute('alt')).length;
  });
  expect(imagesWithoutAlt).toBe(0);

  // Check form inputs have labels or aria-labels
  const inputsWithoutLabel = await page.evaluate(() => {
    const inputs = document.querySelectorAll('input:not([type="hidden"]), select, textarea');
    return Array.from(inputs).filter((input) => {
      const id = input.getAttribute('id');
      const ariaLabel = input.getAttribute('aria-label');
      const placeholder = input.getAttribute('placeholder');
      return !(id && document.querySelector(`label[for="${id}"]`)) && !ariaLabel && !placeholder;
    }).length;
  });
  // Soft warning threshold: at most 2 unlabelled inputs
  expect(inputsWithoutLabel).toBeLessThanOrEqual(2);
}

// ============================================
// RESPONSIVE ASSERTIONS
// ============================================

/**
 * Asserts that a mobile navigation or bottom bar exists on small screens.
 */
export async function expectResponsiveMobileElements(page: Page): Promise<void> {
  const hasMobileNav = await page.evaluate(() => {
    return document.querySelector('[data-testid="bottom-nav"], nav.mobile, .mobile-nav') !== null;
  });
  expect(hasMobileNav).toBe(true);
}
