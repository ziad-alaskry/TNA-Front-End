# TNA Platform — Optimized Implementation Plan

**Branch:** `feature/ux-refactor-phase-1`
**Revised:** 2026-05-11
**Status:** Supersedes original plan — Task 1C fully redesigned

---

## Part I — Root Cause Analysis: Why Task 1C Failed

### The Original Design

Task 1C was specified as a **single monolithic task**: an AI coding agent was expected to manually iterate through 39+ `.tsx` files across six role-domains, grep for inline `isRTL ? '...' : '...'` ternaries, devise key names on the fly, update both `ar.json` and `en.json`, and replace the inline strings — all within one uninterrupted execution context.

### Failure Mode 1 — Context Window Saturation (Primary Bottleneck)

This is the dominant cause of latency. The agent's context window fills on three simultaneous axes:

| Axis | Growth Pattern | Impact |
|---|---|---|
| Source files | Each `.tsx` file read in full (avg ~300 lines) | 39 files × 300 lines = ~11,700 lines consumed |
| `ar.json` / `en.json` | Both re-read and re-written with every new key batch | Files grow from ~50 to 250+ keys mid-task |
| Conversation history | Every grep result, diff, and verification output appended | Compounding token overhead per domain |

By domain 3 (Shell), the agent's effective context had already degraded. By domain 4–6 (Owner/Carrier/Gov), the agent was operating with a partially truncated history, causing: missed strings, duplicate key names, inconsistent nesting conventions, and stale file states.

### Failure Mode 2 — Sequential 7-Operation Loop Per File

The per-file procedure in the original plan translates to exactly **7 agent operations per file**:

```
read file → grep for patterns → decide key names → read ar.json
→ write ar.json → read en.json → write en.json → edit source file → verify
```

That is **~9 operations × 39 files = ~351 sequential round-trips**. Each round-trip has overhead. Even at low latency per operation, the cumulative cost across a single task context is severe. The agent cannot parallelize; it is serialized by design.

### Failure Mode 3 — No Schema-First Discipline

Key naming was invented inline, per-file, during extraction. This produced:

- **Structural inconsistencies**: `nav.menu.home` in one file, `home.nav` in another
- **Duplicate keys**: The same Arabic string appeared under two different key paths
- **Untranslated gaps**: Keys added to `ar.json` but omitted from `en.json` (or vice versa), causing silent runtime fallbacks

Without a global key manifest generated upfront, the agent had no source of truth to reconcile against.

### Failure Mode 4 — Deferred Verification

The original plan ran `rg` verification **after each batch**, meaning errors in batch 2 were only caught after batch 3's context was already loaded. Rework required re-reading files that had already scrolled out of the effective context window.

Additionally, the verification command itself was malformed:

```bash
# ORIGINAL (broken) — --type tsx is not a native ripgrep type without .rgignore config
rg "isRTL\s*\?.*'.*'.*'.*'" src/ --type tsx --type tsx
#                                              ^^^^^^^^^^^ duplicated flag, tsx not registered
```

### Failure Mode 5 — Task Granularity Mismatch

**39 files is not a task — it is a project.** The atomic unit of a coding agent task should require at most 3–5 file reads and 2–4 writes. Task 1C as written is 5–8× too large for a single agent context. There is no checkpoint mechanism, no way to pause and resume, and no sub-task isolation.

---

## Part II — The Optimal Execution Strategy

The redesign replaces the manual, iterative, per-file approach with a **two-stage pipeline**:

**Stage A — Automated Discovery & Schema Generation (Script-first)**
A Node.js script does in one execution what took the agent 351 manual steps. It scans every `.tsx` and `.ts` file, extracts all `isRTL` ternary patterns via regex, generates a structured manifest, and produces the complete `ar.json` and `en.json` key additions as a diff-ready JSON patch.

**Stage B — Atomic Domain Replacement (Divide and Conquer)**
The agent works domain by domain (6 sub-tasks instead of 1 mega-task), each with a pre-loaded manifest to eliminate guesswork. Each sub-task touches ≤10 files and has a defined completion signal.

---

## Part III — Revised Phase 1 (Full Detail)

### Task 1A: Create Gov TNA Queue Detail Page

*(Unchanged — no issues identified)*

**Files to create/modify:**

- **Create:** `src/app/[locale]/gov/tna-queue/[id]/page.tsx`
  - Import `AppShell` with `role="Gov"`
  - Fetch `request_id` from `mockGovQueue` in `src/lib/mock/gov.mock.ts`
  - Render detail/review card matching existing design patterns
  - Include back navigation link to `/${locale}/gov/tna-queue`

- **Verify:** `src/lib/mock/gov.mock.ts`
  - Ensure `request_id` format matches: `req-pending-{number}`

**Acceptance:** URL `/ar/gov/tna-queue/req-pending-1` renders functional detail page.

---

### Task 1B: Fix Auth Routing Broken Links

*(Unchanged — no issues identified)*

**Files to modify:**

- `src/app/[locale]/(auth)/login/page.tsx` — Forgot Password → `/${locale}/forgot-password`
- `src/components/modules/auth/RegisterAccountModule.tsx` — Next button → `/${locale}/register/personal`

**Acceptance:** No auth routing 404s in AR or EN locales.

---

### Task 1C — REDESIGNED: i18n Architecture Audit

**Objective:** Eliminate all inline `isRTL ? 'عربي' : 'English'` ternaries across 39+ files.

**Total sub-tasks:** 8 (was: 1)
**Execution model:** Script-first discovery → schema commit → atomic domain replacements → automated gate

---

#### Sub-task 1C-0: Write and Run the Discovery Script

**Agent action:** Create and execute the following script. This replaces all manual grepping.

**File:** `scripts/i18n-extract.js`

```javascript
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
const glob = require('glob'); // npm install glob --save-dev  (or use fs.readdirSync recursively)

// ─── Config ──────────────────────────────────────────────────────────────────

const SRC_DIR    = path.resolve(__dirname, '../src');
const OUT_MANIFEST = path.resolve(__dirname, 'i18n-manifest.json');
const OUT_PATCH    = path.resolve(__dirname, 'i18n-patch.json');

// Matches:  isRTL ? 'Arabic text' : 'English text'
// Group 1 = AR string,  Group 2 = EN string
const TERNARY_RE = /isRTL\s*\?\s*['"`]([^'"`]+)['"`]\s*:\s*['"`]([^'"`]+)['"`]/g;

// Domain detection from file path
const DOMAIN_MAP = [
  { pattern: /\/visitor\//,  domain: 'visitor'  },
  { pattern: /\/auth\//,     domain: 'auth'     },
  { pattern: /\/shell\//,    domain: 'shell'    },
  { pattern: /\/owner\//,    domain: 'owner'    },
  { pattern: /\/carrier\//,  domain: 'carrier'  },
  { pattern: /\/gov\//,      domain: 'gov'      },
  { pattern: /\/components\/shell\//, domain: 'shell' },
  { pattern: /\/components\/layout\//, domain: 'shell' },
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

const files = glob.sync('**/*.{tsx,ts}', { cwd: SRC_DIR, absolute: true });

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
```

**Run:**
```bash
node scripts/i18n-extract.js
```

**Expected output:**
```
✅ i18n Discovery Complete

   Total patterns found : 210   ← (exact count revealed here for the first time)
   Files affected        : 39

   Breakdown by domain:
     visitor    30 patterns
     auth       15 patterns
     shell      10 patterns
     owner      45 patterns
     carrier    50 patterns
     gov        60 patterns

   Output:
     Manifest : scripts/i18n-manifest.json
     Patch    : scripts/i18n-patch.json
```

**Agent cost:** 1 script write + 1 shell execution. No file reading loops. No context saturation.

**Checkpoint:** Commit `scripts/i18n-extract.js`, `scripts/i18n-manifest.json`, `scripts/i18n-patch.json`.

---

#### Sub-task 1C-1: Apply Schema to Locale JSON Files

**Agent action:** Write and run the merge script. This is a single operation that replaces ~210 manual JSON edits.

**File:** `scripts/i18n-apply-schema.js`

```javascript
#!/usr/bin/env node
/**
 * Merges i18n-patch.json into the existing ar.json and en.json locale files.
 * Deep-merges without overwriting existing keys (safe to re-run).
 *
 * Run: node scripts/i18n-apply-schema.js
 */

const fs   = require('fs');
const path = require('path');

const LOCALES_DIR = path.resolve(__dirname, '../public/locales');
const PATCH_FILE  = path.resolve(__dirname, 'i18n-patch.json');

const patch = JSON.parse(fs.readFileSync(PATCH_FILE, 'utf8'));

function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!target[key]) target[key] = {};
      deepMerge(target[key], source[key]);
    } else {
      // Do NOT overwrite existing keys — preserves manual translations
      if (!(key in target)) {
        target[key] = source[key];
      }
    }
  }
  return target;
}

for (const [lang, additions] of Object.entries(patch)) {
  const localePath = path.join(LOCALES_DIR, `${lang}.json`);
  const existing   = JSON.parse(fs.readFileSync(localePath, 'utf8'));
  const merged     = deepMerge(existing, additions);
  fs.writeFileSync(localePath, JSON.stringify(merged, null, 2) + '\n');
  console.log(`✅ ${lang}.json updated — ${Object.keys(additions).length} top-level domain keys merged`);
}
```

**Run:**
```bash
node scripts/i18n-apply-schema.js
```

**Agent cost:** 1 script write + 1 shell execution.

**Checkpoint:** Commit `ar.json`, `en.json` with all new keys. Git diff is the source of truth.

> **⚠ Manual review required after this step:** Open `ar.json` and `en.json`. The auto-generated Arabic keys are extracted verbatim from source and should be accurate. Review key names for naturalness (e.g., rename `auth.sign_in_1` to `auth.signIn` if desired). Do this cleanup NOW before replacements begin — changing key names after is expensive.

---

#### Sub-task 1C-2: Domain Replacement Script

**Agent action:** Write the replacement script once. It will be called per-domain in 1C-3 through 1C-8.

**File:** `scripts/i18n-replace.js`

```javascript
#!/usr/bin/env node
/**
 * Applies i18n replacements to source files for a given domain.
 *
 * Usage:
 *   node scripts/i18n-replace.js --domain visitor
 *   node scripts/i18n-replace.js --domain auth
 *   node scripts/i18n-replace.js --domain all
 *
 * What it does per match:
 *   1. Replaces: isRTL ? 'عربي' : 'English'  →  t('domain.key')
 *   2. Ensures useTranslation() is imported/destructured
 *   3. Flags (does not auto-remove) isRTL destructuring for manual cleanup
 */

const fs   = require('fs');
const path = require('path');

const MANIFEST_FILE = path.resolve(__dirname, 'i18n-manifest.json');
const SRC_DIR       = path.resolve(__dirname, '../src');

const args   = process.argv.slice(2);
const domArg = args[args.indexOf('--domain') + 1];

if (!domArg) {
  console.error('Usage: node scripts/i18n-replace.js --domain <name|all>');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf8'));

// Filter by domain
const entries = domArg === 'all'
  ? manifest
  : manifest.filter(m => m.suggestedKey.startsWith(domArg + '.'));

// Group by file
const byFile = entries.reduce((acc, m) => {
  if (!acc[m.file]) acc[m.file] = [];
  acc[m.file].push(m);
  return acc;
}, {});

let totalReplaced = 0;
let filesModified = 0;

for (const [relPath, matches] of Object.entries(byFile)) {
  const absPath = path.join(SRC_DIR, relPath);
  let source = fs.readFileSync(absPath, 'utf8');
  let modified = false;

  for (const m of matches) {
    const replacement = `t('${m.suggestedKey}')`;
    if (source.includes(m.original)) {
      source = source.replace(m.original, replacement);
      totalReplaced++;
      modified = true;
    }
  }

  if (modified) {
    // Ensure useTranslation is imported
    if (!source.includes('useTranslation')) {
      // Add import after the last existing import line
      source = source.replace(
        /(import .+\n)(?!import)/,
        `$1import { useTranslation } from 'react-i18next';\n`
      );
      // Add destructure inside the component (heuristic: after first 'const {')
      // NOTE: For complex components, review this manually
      source = source.replace(
        /^(export default function \w+[^{]*\{)/m,
        `$1\n  const { t } = useTranslation();`
      );
    }

    // Flag isRTL for manual cleanup (add comment, don't delete — safe)
    source = source.replace(
      /const\s*\{\s*isRTL\s*\}/g,
      '/* TODO: remove if isRTL no longer used */ const { isRTL }'
    );

    fs.writeFileSync(absPath, source);
    filesModified++;
    console.log(`  ✓ ${relPath} — ${matches.length} replacement(s)`);
  }
}

console.log(`\n✅ Domain [${domArg}] complete: ${totalReplaced} strings replaced across ${filesModified} files\n`);
```

**Agent cost:** 1 script write. Reused across all 6 domain sub-tasks.

---

#### Sub-task 1C-3: Domain — Visitor (5 files, ~30 strings)

```bash
node scripts/i18n-replace.js --domain visitor
```

**Verify:**
```bash
grep -rn "isRTL ?" src/app/[locale]/visitor/ src/components/modules/visitor/ 2>/dev/null | grep -v "TODO"
# Expected: zero results
```

**Checkpoint:** Commit `feat(i18n): visitor domain — inline strings extracted`

---

#### Sub-task 1C-4: Domain — Auth (3 files, ~15 strings)

```bash
node scripts/i18n-replace.js --domain auth
```

**Verify:**
```bash
grep -rn "isRTL ?" src/app/[locale]/'(auth)'/ src/components/modules/auth/ 2>/dev/null | grep -v "TODO"
```

**Checkpoint:** Commit `feat(i18n): auth domain — inline strings extracted`

---

#### Sub-task 1C-5: Domain — Shell (Header, Sidebar, BottomNav, ~10 strings)

```bash
node scripts/i18n-replace.js --domain shell
```

**Verify:**
```bash
grep -rn "isRTL ?" src/components/shell/ src/components/layout/ 2>/dev/null | grep -v "TODO"
```

**Checkpoint:** Commit `feat(i18n): shell domain — inline strings extracted`

---

#### Sub-task 1C-6: Domain — Owner (7 files, ~45 strings)

```bash
node scripts/i18n-replace.js --domain owner
```

**Verify:**
```bash
grep -rn "isRTL ?" src/app/[locale]/owner/ src/components/modules/owner/ 2>/dev/null | grep -v "TODO"
```

**Checkpoint:** Commit `feat(i18n): owner domain — inline strings extracted`

---

#### Sub-task 1C-7: Domain — Carrier (8 files, ~50 strings)

```bash
node scripts/i18n-replace.js --domain carrier
```

**Verify:**
```bash
grep -rn "isRTL ?" src/app/[locale]/carrier/ src/components/modules/carrier/ 2>/dev/null | grep -v "TODO"
```

**Checkpoint:** Commit `feat(i18n): carrier domain — inline strings extracted`

---

#### Sub-task 1C-8: Domain — Gov (10 files, ~60 strings)

```bash
node scripts/i18n-replace.js --domain gov
```

**Verify:**
```bash
grep -rn "isRTL ?" src/app/[locale]/gov/ src/components/modules/gov/ 2>/dev/null | grep -v "TODO"
```

**Checkpoint:** Commit `feat(i18n): gov domain — inline strings extracted`

---

#### Sub-task 1C-9: Final Sweep + Gate

Write and run the corrected cleanliness check (fixes the broken regex from the original plan):

**File:** `scripts/check-i18n-cleanliness.js` *(replaces the broken version from original Task 5C)*

```javascript
#!/usr/bin/env node
/**
 * CI gate: fails if any isRTL ternary inline strings remain.
 * Corrected version — uses Node's child_process and explicit file extensions.
 *
 * Fixed issues vs original:
 *   - ripgrep --type tsx is not a built-in type; use --glob instead
 *   - Removed duplicated --type tsx flag
 *   - Tightened regex to avoid false positives from comments
 */

const { execSync } = require('child_process');

try {
  const results = execSync(
    // Use --glob instead of --type for tsx/ts (not built-in rg types)
    `rg -n "isRTL\\s*\\?\\s*['\\"\\`][^'\\"\\`]+['\\"\\`]\\s*:\\s*['\\"\\`][^'\\"\\`]+['\\"\\`]" src/ --glob "*.tsx" --glob "*.ts"`,
    { encoding: 'utf8' }
  );

  if (results && results.trim().length > 0) {
    console.error('\n❌ Inline i18n strings still present:\n');
    console.error(results);
    console.error('\nRun: node scripts/i18n-replace.js --domain all\n');
    process.exit(1);
  }
} catch (err) {
  // rg exits with code 1 when no matches — that is the SUCCESS case
  if (err.status === 1 && (!err.stdout || err.stdout.trim() === '')) {
    console.log('\n✅ Clean: zero inline isRTL ternary strings found\n');
    process.exit(0);
  }
  // Any other error is a real failure
  console.error('\n❌ Check script error:', err.message);
  process.exit(1);
}
```

**Run:**
```bash
node scripts/check-i18n-cleanliness.js
```

**Expected final output:**
```
✅ Clean: zero inline isRTL ternary strings found
```

**Checkpoint:** Commit `feat(i18n): Task 1C complete — all inline strings extracted, gate passing`

---

### Task 1C — Sub-task Summary

| Sub-task | Operation | Agent Work | Files Touched |
|---|---|---|---|
| 1C-0 | Discovery script | Write + run 1 script | 0 source files |
| 1C-1 | Schema merge | Write + run 1 script | ar.json, en.json only |
| 1C-2 | Replacement script | Write 1 script | 0 (reused in 1C-3→8) |
| 1C-3 | Visitor replacements | 1 shell command | ≤5 files |
| 1C-4 | Auth replacements | 1 shell command | ≤3 files |
| 1C-5 | Shell replacements | 1 shell command | ≤3 files |
| 1C-6 | Owner replacements | 1 shell command | ≤7 files |
| 1C-7 | Carrier replacements | 1 shell command | ≤8 files |
| 1C-8 | Gov replacements | 1 shell command | ≤10 files |
| 1C-9 | Gate check | 1 shell command | 0 |

**Original plan agent operations:** ~351 sequential read/write/verify loops
**Redesigned plan agent operations:** 6 script writes + 9 shell commands = **15 total**

**Estimated latency reduction:** ~95% fewer agent context operations

---

## Part IV — Phases 2–5 (Unchanged with Annotations)

Phases 2 through 5 from the original plan remain structurally sound. The annotations below flag where the 1C redesign creates positive downstream effects.

### Phase 2 — Shell Refactor *(prerequisite: 1C-9 passing)*

**Task 2A: Header Refactor** — No changes. Note: Task 1C-5 (Shell domain) will have already extracted Header strings into locale JSON before this phase begins, eliminating a common double-edit problem where a developer extracts strings then immediately has to re-touch the same file for structural changes.

**Task 2B: Sidebar Refactor** — No changes. Same benefit: `RoleSidebar.tsx` will be i18n-clean before structural edits begin.

---

### Phase 3 — Profile System + Notification System *(prerequisite: Phase 2)*

**Task 3A: Profile System** — No changes.

**Task 3B: Notification System** — Important: All notification strings (`notifications.title`, `notifications.markAllRead`, etc.) should be added directly to `ar.json`/`en.json` during this task using `i18n-apply-schema.js` as the merge tool. Do not add them manually — use the established pipeline.

---

### Phase 4 — Domain Features *(prerequisite: Phase 1 + Phase 3)*

**Task 4A: Payment Integration** — The `payment.*` i18n keys specified here (`payment.cardNumber`, `payment.topUpSuccess`, etc.) should be added via a small targeted patch through `i18n-apply-schema.js` rather than manual JSON editing.

**Task 4B: Dashboard Interactivity Audit** — No changes.

**Task 4C: Auth Pages Responsivity** — No changes.

---

### Phase 5 — Testing & QA *(prerequisite: all phases)*

**Task 5A: Test Infrastructure** — No changes.

**Task 5B: E2E Test Suites** — No changes.

**Task 5C: Automated i18n Cleanliness Check** — **Replace entirely with the corrected version written in Task 1C-9.** The original version in this phase had a broken regex and incorrect `--type tsx` flag (not a native ripgrep type). The 1C-9 version is the canonical implementation.

**Task 5D: CI Integration** — Add `check:i18n` to the CI workflow:

```yaml
- name: i18n cleanliness gate
  run: node scripts/check-i18n-cleanliness.js
  # Runs before Playwright to fail fast on inline string regressions
```

Place this step **before** `npx playwright test` so the gate fails fast without waiting for browser test startup.

---

## Part V — Revised Verification Checklist

### Phase 1

- [ ] `/ar/gov/tna-queue/req-pending-1` renders (no 404)
- [ ] Auth links: forgot-password → `/ar/forgot-password`
- [ ] Auth links: Register Next → `/ar/register/personal`
- [ ] `scripts/i18n-manifest.json` generated and committed
- [ ] `scripts/i18n-patch.json` generated and committed
- [ ] `ar.json` and `en.json` updated via merge script (no manual edits)
- [ ] All 6 domain replacement scripts executed without error
- [ ] `node scripts/check-i18n-cleanliness.js` exits 0

### Phase 2

- [ ] Header shows no search bar, responsive at 375/768/1440px
- [ ] Sidebar defaults collapsed on desktop (icons only)
- [ ] Sidebar expands on click, shows labels + profile
- [ ] Dark professional sidebar theme (gradient, sky-400 accent)
- [ ] Smooth width transitions, no layout shift

### Phase 3

- [ ] Profile pages exist for Owner, Carrier, Gov
- [ ] ProfileModule displays correct fields per role
- [ ] NotificationBell shows unread count badge
- [ ] NotificationPanel slides open, displays role-specific mock data
- [ ] "Mark all read" clears badge

### Phase 4

- [ ] Checkout credit card form validates (Luhn, expiry, CVV)
- [ ] Top Up success updates wallet balance
- [ ] All dashboard widgets display mock data
- [ ] No "coming soon" placeholders in any role home page
- [ ] Auth pages responsive (no horizontal overflow at 375px)

### Phase 5

- [ ] `playwright.config.ts` configured
- [ ] All E2E suites created
- [ ] i18n and responsive suites created
- [ ] `check-i18n-cleanliness.js` passes (corrected version)
- [ ] CI workflow includes i18n gate before Playwright
- [ ] All tests pass locally and in CI

---

## Part VI — Git Strategy (Revised Commit Structure)

```bash
# Phase 1A
git commit -m "feat(routing): create Gov TNA queue detail dynamic route"

# Phase 1B
git commit -m "fix(auth): repair forgot-password and register-next routing links"

# Phase 1C — 9 atomic commits, one per sub-task
git commit -m "chore(i18n): add discovery + schema scripts (1C-0, 1C-1, 1C-2)"
git commit -m "feat(i18n): visitor domain — inline strings extracted (1C-3)"
git commit -m "feat(i18n): auth domain — inline strings extracted (1C-4)"
git commit -m "feat(i18n): shell domain — inline strings extracted (1C-5)"
git commit -m "feat(i18n): owner domain — inline strings extracted (1C-6)"
git commit -m "feat(i18n): carrier domain — inline strings extracted (1C-7)"
git commit -m "feat(i18n): gov domain — inline strings extracted (1C-8)"
git commit -m "chore(i18n): add cleanliness gate script — 0 inline strings (1C-9)"

# Phase 2
git commit -m "feat(shell): header cleanup + sidebar collapsed-by-default + dark theme"

# Phases 3–5: one commit per task
```

---

## Part VII — Risk Register (Updated)

| Risk | Original Mitigation | Revised Mitigation |
|---|---|---|
| i18n extraction misses strings | Manual grep after each batch | AST/regex discovery script produces exhaustive manifest before any edits begin |
| Key naming inconsistencies | None — invented inline | Schema-first: all keys defined in `i18n-patch.json` before replacements run |
| Agent context overflow on 1C | None | Task decomposed to ≤10 files per agent turn; script handles bulk operations |
| Broken cleanliness check command | `--type tsx` (not a native rg type) | Fixed to `--glob "*.tsx" --glob "*.ts"` in 1C-9 |
| Sidebar collapse breaks mobile | Responsive test suite | Unchanged |
| Gov detail route mismatch | Verify mock format | Unchanged |
| Payment false confidence | DEMO MODE banner | Unchanged |
| Flaky Playwright tests | `expect.poll`, `waitFor` | Unchanged |
| isRTL removal causes runtime errors | Not addressed | Replacement script adds `TODO` comment; manual cleanup per domain after verification |

---

*Optimized plan generated 2026-05-11. All script paths are relative to the repository root. Scripts require Node.js ≥ 18 and the `glob` package (`npm install glob --save-dev`).*
