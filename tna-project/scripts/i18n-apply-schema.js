#!/usr/bin/env node
/**
 * i18n Schema Application Script
 *
 * Merges extracted i18n keys from i18n-patch.json into locale files.
 * Preserves existing keys - only adds new ones.
 *
 * Run: node scripts/i18n-apply-schema.js
 */

const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.resolve(__dirname, '../public/locales');
const PATCH_FILE = path.join(__dirname, 'i18n-patch.json');

if (!fs.existsSync(PATCH_FILE)) {
  console.error('Error: i18n-patch.json not found. Run i18n-extract.js first.');
  process.exit(1);
}

const patch = JSON.parse(fs.readFileSync(PATCH_FILE, 'utf8'));

function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!target[key]) target[key] = {};
      deepMerge(target[key], source[key]);
    } else {
      // Only add if key doesn't exist (preserve manual translations)
      if (target[key] === undefined) {
        target[key] = source[key];
      }
    }
  }
  return target;
}

// Read and merge into ar.json
const arPath = path.join(LOCALES_DIR, 'ar.json');
const arContent = JSON.parse(fs.readFileSync(arPath, 'utf8'));
const newAr = deepMerge(arContent, patch.ar);

// Read and merge into en.json
const enPath = path.join(LOCALES_DIR, 'en.json');
const enContent = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const newEn = deepMerge(enContent, patch.en);

// Write back with 2-space indentation
fs.writeFileSync(arPath, JSON.stringify(newAr, null, 2));
fs.writeFileSync(enPath, JSON.stringify(newEn, null, 2));

console.log('\n✅ Locale files updated');
console.log(`   ${arPath}`);
console.log(`   ${enPath}`);