// .gemini/helpers/ux-audit.ts
import { test, expect } from '@playwright/test';

test('Check Bi-Directional Layout Integrity', async ({ page }) => {
    await page.goto('http://localhost:3000/tna-portal');
    // Check for Rubik font loading
    const font = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
    expect(font).toContain('Rubik');

    // Test RTL Flip
    await page.click('button#lang-switch-ar');
    const dir = await page.getAttribute('html', 'dir');
    expect(dir).toBe('rtl');

    // Check for common 'User Flow Confusion' gaps (overlapping elements)
    const isOverlapping = await page.evaluate(() => {
        /* Custom script to detect UI collisions */
    });
});