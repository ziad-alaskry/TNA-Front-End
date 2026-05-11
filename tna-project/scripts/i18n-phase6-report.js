#!/usr/bin/env node
/**
 * Phase 6 Manual Cleanup Report Generator
 *
 * Identifies components where isRTL is still used for:
 *   - dir={isRTL ? 'rtl' : 'ltr'} (layout direction)
 *   - className={isRTL ? ...} (icon rotation)
 *   - Other non-translatable purposes
 *
 * Run: node scripts/i18n-phase6-report.js
 */

const fs = require('fs');
const path = require('path');
const { globSync } = require('glob');

const SRC_DIR = path.resolve(__dirname, '../src');

const files = globSync('**/*.{tsx,ts}', { cwd: SRC_DIR, absolute: true });
const usages = [];

files.forEach(filePath => {
  const rel = path.relative(SRC_DIR, filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    // Skip if this is a t() call (already translated)
    if (line.includes("t('") || line.includes('t("')) return;

    // Find isRTL usages
    if (line.includes('isRTL')) {
      // Categorize the usage
      let category = 'unknown';
      if (line.includes('dir={isRTL')) category = 'layout_direction';
      else if (line.includes('className={isRTL') || line.match(/isRTL.*rotate/)) category = 'icon_rotation';
      else if (line.includes('useLocale()') && line.includes('isRTL')) category = 'useLocale_hook';

      usages.push({
        file: rel,
        line: idx + 1,
        text: line.trim().substring(0, 80),
        category
      });
    }
  });
});

// Group by file
const byFile = {};
usages.forEach(u => {
  if (!byFile[u.file]) byFile[u.file] = [];
  byFile[u.file].push(u);
});

console.log('\n📋 Phase 6 Manual Cleanup Report\n');
console.log('Components with remaining isRTL usage (for layout/icon purposes):\n');

Object.entries(byFile).forEach(([file, items]) => {
  console.log(`  ${file}:`);
  items.forEach(item => {
    console.log(`    Line ${item.line}: [${item.category}] ${item.text}`);
  });
});

console.log(`\nTotal: ${usages.length} isRTL usages in ${Object.keys(byFile).length} files`);
console.log('\nAction: Review each file and remove unused isRTL destructures.\n');