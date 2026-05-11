#!/usr/bin/env node
/**
 * i18n Atomic Replacement Script
 *
 * Replaces inline isRTL ternary strings with t('domain.key') calls.
 * Domain-specific execution: --domain <visitor|auth|shell|owner|carrier|gov|all>
 *
 * Run: node scripts/i18n-replace.js --domain <name>
 */

const fs   = require('fs');
const path = require('path');
const { globSync } = require('glob');

const SRC_DIR = path.resolve(__dirname, '../src');
const MANIFEST_PATH = path.join(__dirname, 'i18n-manifest.json');

if (!fs.existsSync(MANIFEST_PATH)) {
  console.error('Error: i18n-manifest.json not found. Run i18n-extract.js first.');
  process.exit(1);
}

// Parse arguments
const args = process.argv.slice(2);
const domainArg = args.find(a => a.startsWith('--domain='));
const domain = domainArg ? domainArg.split('=')[1] : null;

if (!domain) {
  console.error('Usage: node scripts/i18n-replace.js --domain <visitor|auth|shell|owner|carrier|gov|all>');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));

// Filter entries by domain
const domainEntries = manifest.filter(e => {
  if (domain === 'all') return true;
  return e.suggestedKey.startsWith(`${domain}.`);
});

if (domainEntries.length === 0) {
  console.log(`No entries found for domain: ${domain}`);
  process.exit(0);
}

// Group by file
const filesMap = new Map();
domainEntries.forEach(e => {
  if (!filesMap.has(e.file)) filesMap.set(e.file, []);
  filesMap.get(e.file).push(e);
});

console.log(`\nProcessing domain: ${domain} — ${domainEntries.length} replacements across ${filesMap.size} files\n`);

// ─── Replacement Logic ────────────────────────────────────────────────────────

// Escape regex characters for string replacement
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Check if file already imports useTranslation
function hasUseTranslationImport(content) {
  return /import\s*{[^}]*useTranslation[^}]*}\s*from\s*['"]react-i18next['"]/.test(content);
}

// Add import if missing
function addUseTranslationImport(content) {
  const lastImportMatch = content.match(/^import.*$/m);
  if (!lastImportMatch) return content; // no imports? skip
  const lastImportIdx = content.lastIndexOf('import');
  const fromEnd = content.indexOf('\n', lastImportIdx);
  if (fromEnd === -1) fromEnd = content.length;
  const insertAt = fromEnd + 1;
  return (
    content.slice(0, insertAt) +
    "import { useTranslation } from 'react-i18next';\n" +
    content.slice(insertAt)
  );
}

// Check if component already destructures from useLocale()
function hasUseLocaleHook(content) {
  return /useLocale\(\)/.test(content);
}

// Update existing destructure: const { locale, isRTL } = useLocale() → add t
function addTtoUseLocaleDestructure(content) {
  return content.replace(
    /const\s*\{([^}]*isRTL[^}]*)\}\s*=\s*useLocale\(\)/g,
    (match, vars) => {
      if (vars.includes('t')) return match;
      return `const { ${vars}, t } = useLocale()`;
    }
  );
}

// Ensure component has const { t } = useTranslation() destructure
function ensureTDestructure(content) {
  if (/const\s*\{[^}]*t[^}]*\}\s*=\s*useTranslation\(\)/.test(content)) {
    return content; // already destructured
  }
  if (/useLocale\(\)/.test(content)) {
    // Already handled by addTtoUseLocaleDestructure above
    return content;
  }
  // Add destructuring after useTranslation hook call
  return content.replace(
    /(const\s*\{[^}]*\}\s*=\s*useLocale\(\)|useLocale\(\))/g,
    (match) => {
      if (match.includes('useLocale')) {
        return match;
      }
      return match + '\n  const { t } = useTranslation()';
    }
  );
}

// Highlight isRTL for manual review
function flagIsRTLUsage(content) {
  return content.replace(
    /const\s*\{([^}]*)\}?\s*=\s*useLocale\(\)/g,
    (match, vars) => {
      if (vars && vars.includes('isRTL') && !match.includes('TODO')) {
        return `/* TODO: review isRTL usage */ ${match}`;
      }
      return match;
    }
  );
}

// Perform the actual ternary → t() replacement
function replaceTernary(content, entry) {
  const escaped = escapeRegExp(entry.original);
  const regex = new RegExp(escaped, 'g');
  const replacement = `t('${entry.suggestedKey}')`;
  return content.replace(regex, replacement);
}

// ─── Process Files ────────────────────────────────────────────────────────────

let totalReplacements = 0;

for (const [relPath, entries] of filesMap) {
  const filePath = path.join(SRC_DIR, relPath);

  if (!fs.existsSync(filePath)) {
    console.warn(`  ⚠ File not found: ${relPath} — skipping`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Ensure useTranslation import
  if (!hasUseTranslationImport(content)) {
    content = addUseTranslationImport(content);
    console.log(`  + Added useTranslation import: ${relPath}`);
  }

  // 2. Handle t destructuring
  if (hasUseLocaleHook(content)) {
    content = addTtoUseLocaleDestructure(content);
  } else if (!/\{ t \}\s*=\s*useTranslation/.test(content)) {
    // Add destructure if not using useLocale or doesn't have t
    // Find where useLocale or useTranslation is called and add destructure
    if (/useLocale\(\)/.test(content)) {
      // Already handled above
    } else if (/useTranslation\(\)/.test(content)) {
      content = content.replace(
        /(useTranslation\(\))/g,
        `$1\n  const { t } = useTranslation()`
      );
    }
  }

  // 3. Flag isRTL usage for review
  content = flagIsRTLUsage(content);

  // 4. Replace each ternary pattern
  let fileReplacements = 0;
  entries.forEach(entry => {
    const before = content;
    content = replaceTernary(content, entry);
    if (content !== before) fileReplacements++;
  });

  fs.writeFileSync(filePath, content);
  totalReplacements += fileReplacements;
  console.log(`  ✓ ${relPath} — ${fileReplacements} replacement(s)`);
}

console.log(`\n✅ Total replacements: ${totalReplacements} across ${filesMap.size} files`);
