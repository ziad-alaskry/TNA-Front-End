#!/usr/bin/env node
/**
 * i18n Discovery & Schema Generator
 *
 * Scans all .tsx/.ts files for isRTL ternary patterns and produces:
 *   1. A full manifest (scripts/i18n-manifest.json)
 *   2. Key additions for ar.json and en.json (scripts/i18n-patch.json)
 *
 * Run: node scripts/i18n-extract.js
 */

const fs   = require('fs');
const path = require('path');
const { globSync } = require('glob');

// ─── Config ──────────────────────────────────────────────────────────────────

const SRC_DIR    = path.resolve(__dirname, '../src');
const OUT_MANIFEST = path.resolve(__dirname, 'i18n-manifest.json');
const OUT_PATCH    = path.resolve(__dirname, 'i18n-patch.json');

// Matches:  isRTL ? 'Arabic text' : 'English text'
// Group 1 = AR string,  Group 2 = EN string
const TERNARY_RE = /isRTL\s*\?\s*['"`]([^'"`]+)['"`]\s*:\s*['"`]([^'"`]+)['"`]/g;

// Domain detection from file path
const DOMAIN_MAP = [
  { pattern: /[\\/]visitor[\\/]/,  domain: 'visitor'  },
  { pattern: /[\\/]auth[\\/]/,     domain: 'auth'     },
  { pattern: /[\\/]\(auth\)[\\/]/,  domain: 'auth'     },
  { pattern: /[\\/]shell[\\/]/,    domain: 'shell'    },
  { pattern: /[\\/]owner[\\/]/,    domain: 'owner'    },
  { pattern: /[\\/]carrier[\\/]/,  domain: 'carrier'  },
  { pattern: /[\\/]gov[\\/]/,      domain: 'gov'      },
  { pattern: /[\\/]components[\\/]shell[\\/]/, domain: 'shell' },
  { pattern: /[\\/]components[\\/]layout[\\/]/, domain: 'shell' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function detectDomain(filePath) {
  for (const { pattern, domain } of DOMAIN_MAP) {
    if (pattern.test(filePath)) return domain;
  }
  return 'common';
}

/**
 * Convert a raw English string to a dot-notation i18n key.
 * "Sign In"  →  "auth.signIn"   (domain prefix applied separately)
 */
function toKey(enStr, domain, index) {
  const slug = enStr
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')   // strip punctuation
    .trim()
    .replace(/\s+/g, '_')          // spaces → underscores
    .slice(0, 40);                 // cap length
  return `${domain}.${slug}_${index}`;  // index prevents collisions
}

// ─── Scan ─────────────────────────────────────────────────────────────────────

// Using globSync for glob v10+
const files = globSync('**/*.{tsx,ts}', { cwd: SRC_DIR, absolute: true });

const manifest  = [];   // { file, line, arStr, enStr, suggestedKey }
const arPatch   = {};   // will be merged into ar.json
const enPatch   = {};   // will be merged into en.json
const keyIndex  = {};   // collision counter per domain

files.forEach(filePath => {
  const rel     = path.relative(SRC_DIR, filePath);
  const source  = fs.readFileSync(filePath, 'utf8');
  const lines   = source.split('\n');
  const domain  = detectDomain(filePath);

  // Per-file grep
  let lineNo = 0;
  lines.forEach((line, idx) => {
    let match;
    TERNARY_RE.lastIndex = 0;
    while ((match = TERNARY_RE.exec(line)) !== null) {
      const [, arStr, enStr] = match;
      keyIndex[domain] = (keyIndex[domain] || 0) + 1;
      const key = toKey(enStr, domain, keyIndex[domain]);

      manifest.push({
        file: rel,
        line: idx + 1,
        column: match.index,
        arStr,
        enStr,
        suggestedKey: key,
        original: match[0],
      });

      // Build nested key in patch objects
      setNestedKey(arPatch, key, arStr);
      setNestedKey(enPatch, key, enStr);
    }
  });
});

// ─── Helpers for nested key setting ──────────────────────────────────────────

function setNestedKey(obj, dotPath, value) {
  const parts = dotPath.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!cur[parts[i]]) cur[parts[i]] = {};
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = value;
}

// ─── Output ───────────────────────────────────────────────────────────────────

fs.writeFileSync(OUT_MANIFEST, JSON.stringify(manifest, null, 2));
fs.writeFileSync(OUT_PATCH, JSON.stringify({ ar: arPatch, en: enPatch }, null, 2));

// ─── Console summary ──────────────────────────────────────────────────────────

const byDomain = manifest.reduce((acc, m) => {
  const d = detectDomain('/' + m.file);
  acc[d] = (acc[d] || 0) + 1;
  return acc;
}, {});

console.log('\n✅ i18n Discovery Complete\n');
console.log(`   Total patterns found : ${manifest.length}`);
console.log(`   Files affected        : ${[...new Set(manifest.map(m => m.file))].length}`);
console.log('\n   Breakdown by domain:');
Object.entries(byDomain).forEach(([d, n]) => console.log(`     ${d.padEnd(10)} ${n} patterns`));
console.log('\n   Output:');
console.log(`     Manifest : scripts/i18n-manifest.json`);
console.log(`     Patch    : scripts/i18n-patch.json\n`);
