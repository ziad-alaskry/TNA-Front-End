#!/usr/bin/env node
/**
 * i18n Cleanliness Gate Script
 *
 * Scans for remaining inline isRTL ternary strings after extraction.
 * Exits 0 if clean, exit 1 if any remain (excluding TODO-flagged lines).
 *
 * Excludes patterns that are NOT translatable text:
 *   - dir={isRTL ? 'rtl' : 'ltr'}           (layout direction)
 *   - className={isRTL ? "rotate-180" ...}  (icon rotation)
 *   - object accessor [isRTL ? 'ar' : 'en'] (dynamic lookup)
 *
 * Run: node scripts/check-i18n-cleanliness.js
 */

const fs = require('fs');
const path = require('path');
const { globSync } = require('glob');

const SRC_DIR = path.resolve(__dirname, '../src');

const files = globSync('**/*.{tsx,ts}', { cwd: SRC_DIR, absolute: true });
const matches = [];

function isTranslatableString(str) {
  // Filter out layout/technical values
  const clean = str.trim();
  if (!clean) return false;

  const lower = clean.toLowerCase();
  // Exclude common non-translatable values
  if (['rtl', 'ltr', 'left', 'right'].includes(lower)) return false;
  if (lower.startsWith('rotate-')) return false;
  if (clean.match(/^[a-z]{2}$/)) return false; // 2-letter codes like 'ar', 'en'

  return true;
}

files.forEach(filePath => {
  const rel = path.relative(SRC_DIR, filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    // Skip lines with TODO marker (flagged for manual review)
    if (line.includes('TODO')) return;

    // Skip dir attribute patterns (layout direction)
    if (line.includes('dir={isRTL')) return;

    // Skip className patterns that contain isRTL (icon rotation, positioning)
    if (line.includes('className={isRTL') && !line.includes('>')) return;
    // Skip positioning patterns like "right-0" / "left-0"
    if (line.match(/isRTL\s*\?\s*["']right-\d+["']\s*:\s*["']left-\d+["']/)) return;

    // Match isRTL ternary patterns in text content (not attributes)
    // Look for patterns where the strings contain letters (actual text)
    const textTernaryRe = /isRTL\s*\?\s*['"`]([a-zA-Z\u0600-\u06FF][^'"`]*)['"`]\s*:\s*['"`]([a-zA-Z][^'"`]*)['"`]/g;

    let match;
    while ((match = textTernaryRe.exec(line)) !== null) {
      const [, arStr, enStr] = match;

      // Verify both strings look like translatable text
      if (isTranslatableString(arStr) && isTranslatableString(enStr)) {
        matches.push({
          file: rel,
          line: idx + 1,
          text: line.trim().substring(0, 100)
        });
      }
    }
  });
});

if (matches.length > 0) {
  console.error('\n❌ FAIL: Inline isRTL ternary strings still present:\n');
  matches.slice(0, 100).forEach(m => {
    console.error(`  ${m.file}:${m.line}: ${m.text}`);
  });
  if (matches.length > 100) {
    console.error(`  ... and ${matches.length - 100} more`);
  }
  console.error(`\n   Found ${matches.length} inline pattern(s) that should have been replaced.\n`);
  process.exit(1);
}

console.log('✅ Clean: zero inline isRTL ternary strings found');
process.exit(0);