# Design System Fix Plan — SPATIAL Brand Alignment

**Project:** TNA Frontend  
**Based on:** Codebase crawl + MOUNT_SPEC analysis  
**Status:** DRAFT — Awaiting Approval

---

## Executive Summary

The application has **critical design misalignment** between SPATIAL brand tokens and actual asset implementation:

| Layer | Current State | SPATIAL Target |
|-------|---------------|----------------|
| **Color tokens** | SPATIAL Navy `#02488D` / Cyan `#00B4C9` defined in globals.css | ✅ Correct |
| **Logo assets** | `/public/assets/brand/` is **EMPTY** (components reference missing files) | ❌ Broken |
| **Legacy assets** | `/public/brand/` contains TNA Carrier logos (colors `#014A8F` / `#17BFD9`) | ❌ Wrong brand |
| **Language toggle** | Uses `slate-*` Tailwind defaults + invalid `bg-primitive-navy` | ❌ Broken |
| **Header** | References missing assets; visual transition to sidebar unpolished | ⚠️ Needs refinement |

**Critical failures:**
1. **Missing assets**: All components reference `/assets/brand/*.svg` but directory is empty → 404 errors
2. **Wrong brand colors**: Existing TNA Carrier SVG files use legacy colors ≠ SPATIAL theme
3. **Language toggle class errors**: `bg-primitive-navy` is not a valid Tailwind utility; uses `slate` outside SPATIAL neutral system
4. **Visual continuity**: Header frosted glass present but height mismatch may clip teal accent line; no gradient bridge to dark sidebar

---

## Current Asset State (Verified)

### `public/assets/brand/` — **EMPTY**
- Status: Directory exists but contains **no files**
- All components reference this path → **broken images**

### `public/brand/` — Contains legacy TNA Carrier assets
```
logo.svg              — Uses #014A8F (navy) + #17BFD9 (teal)
logo-watermark.svg    — Uses #17BFD9 teal, opacity 0.07
brand-tokens.css      — Defines conflicting --brand-navy: #014A8F, --brand-teal: #17BFD9
visual identitiy.svg  — Unused decorative file
```
**Issue:** These colors differ from SPATIAL spec (`#02488D`, `#00B4C9`).

### Component asset references (all broken)
| Component | Asset Path | Status |
|-----------|------------|--------|
| `layout/AppShell.tsx` (header logo) | `/assets/brand/logo.svg` | ❌ Missing |
| `layout/AppShell.tsx` (watermark) | `/assets/brand/logo-watermark.svg` | ❌ Missing |
| `layout/AppShell.tsx` (sidebar logo) | `/assets/brand/logo.svg` | ❌ Missing |
| `app/[locale]/layout.tsx` (favicon) | `/assets/brand/favicon.svg` | ❌ Missing |
| `shell/Header.tsx` (logo) | `/assets/brand/logo.svg` | ❌ Missing |

**Orphaned files:** `shell/Header.tsx` defined but never imported; `public/brand/visual identitiy.svg` unused.

---

## Phase 1: Generate SPATIAL Logo Assets (Prerequisite)

**Target:** Create correct SPATIAL-branded SVG files in `/public/assets/brand/`.

### 1.1 SPATIAL logo specifications

**Primary colors (from globals.css):**
- Navy: `#02488D` (primary brand)
- Cyan: `#00B4C9` (secondary/accent)
- White: `#FFFFFF` (highlights)

**File 1: `logo.svg`**
- Purpose: Full logo for header + sidebar (isometric icon + wordmark)
- ViewBox: `0 0 200 48` (landscape, 200×48px)
- Contents:
  - Isometric "SPATIAL" icon mark (left, ~36×36px equivalent)
  - Wordmark text "SPATIAL" in Rubik Bold, fill `#02488D`
  - Optional sub-brand "TNA" or "PLATFORM" in `#00B4C9` small caps (configurable)
- Format: SVG with shapes, transparent background

**File 2: `logo-watermark.svg`**
- Purpose: Subtle background watermark in content area
- ViewBox: `0 0 400 400` (square)
- Contents: Isometric SPATIAL icon only (no text)
- Fill: `#02488D` with opacity ~0.05–0.08
- Format: SVG single-color

**File 3: `favicon.svg`**
- Purpose: Browser tab icon
- ViewBox: `0 0 32 32`
- Contents: SPATIAL icon mark only (simplified)
- Fill: `#02488D`
- Format: Square SVG favicon

### 1.2 Asset placement

**Create files:**
```
public/assets/brand/logo.svg
public/assets/brand/logo-watermark.svg
public/assets/brand/favicon.svg
```

**Action:** Replace missing files with SPATIAL versions. Do NOT touch `/public/brand/` (legacy, unused).

### 1.3 Remove conflicting CSS

**File:** `public/assets/brand/brand-tokens.css` — **does not exist** (no action needed)

**File:** `public/brand/brand-tokens.css` — **DELETE** (defines legacy colors, not imported anywhere)

**Rationale:** Prevents future confusion; SPATIAL tokens already in `globals.css` and `tokens.css`.

---

## Phase 2: Language Toggle Theming (High Priority)

**File:** `src/components/ui/LanguageSwitcher.tsx` (lines 43–56)

### 2.1 Current issues
```tsx
className="flex items-center gap-1 rounded-md border border-slate-200 bg-slate-100/50 p-1"
// ...
className={`... ${currentLocale === locale
  ? 'bg-primitive-navy text-white shadow-sm'  // ❌ invalid class
  : 'text-slate-500 hover:bg-white hover:text-slate-900'}`}
```
- Uses `slate-*` Tailwind defaults → outside SPATIAL neutral system
- `bg-primitive-navy` → invalid; no such Tailwind utility
- Hover states not theme-aware

### 2.2 Fix to SPATIAL palette

**Wrapper:** Neutral theme colors
```tsx
className="flex items-center gap-1 rounded-md border border-neutral-200 bg-white/50 p-1"
```

**Active button:** SPATIAL navy
```tsx
className={`rounded-sm px-3 py-1 text-xs font-bold transition-all duration-200 ${
  currentLocale === locale
    ? 'bg-primary text-white shadow-sm'   // primary = #02488D
    : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'
}`}
```

**Result:** Active language = SPATIAL navy background, white text; inactive = neutral gray with hover state.

---

## Phase 3: Header Visual Consistency (Medium Priority)

**File:** `src/components/layout/AppShell.tsx` (header, lines 43–83)  
**Styles:** `src/app/globals.css` (`.ui-topbar`, lines 377–389)

### 3.1 Height & accent line alignment

**Current:**
```tsx
<header className="topbar ui-topbar ps-5 pe-5 py-4 shrink-0">
```

**Issue:** `ui-topbar` sets `height: var(--navbar-height)` (72px). Appending `py-4` (16px top/bottom) creates 56px actual content height, potentially clipping the `border-top: 3px solid var(--primitive-cyan)` accent line.

**Fix:** Remove inline `py-*` to let `.ui-topbar` control height:
```tsx
<header suppressHydrationWarning className="topbar ui-topbar ps-5 pe-5 shrink-0">
```
**Rationale:** `.ui-topbar` already defines `height: var(--navbar-height)` (72px) and vertical padding via flex alignment.

### 3.2 Smooth header → sidebar transition

**Current visual:** White frosted header (`rgba(255,255,255,0.85)`) above dark navy sidebar (`--surface-dark-200` = `#013A70`) → abrupt contrast.

**Option A — Universal frosted white (MOUNT_SPEC default):**
Keep header white for all roles. Add subtle bottom gradient for smoother blend:

```css
/* In globals.css .ui-topbar */
.ui-topbar {
  border-bottom: 1px solid transparent;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(255, 255, 255, 0.85) 100%
  );
}
```

**Option B — Role-aware header (advanced):**
For Owner/Gov dark themes, make header translucent dark to match sidebar:
```css
.theme-owner .ui-topbar,
.theme-gov .ui-topbar {
  background: rgba(1, 58, 112, 0.85);  /* surface-dark-200 */
  border-bottom-color: rgba(255,255,255,0.1);
}
.theme-owner .topbar-title,
.theme-owner .sidebar-brand-name {
  color: #FFFFFF;
}
```
**Decision required:** Universal (A) or role-aware (B)?

### 3.3 Brand name alignment

AppShell shows "TNA" in blue:
```tsx
<span className="sidebar-brand-name text-brand-navy">TNA</span>
```
Brand token `text-brand-navy` maps to SPATIAL navy (`#02488D`) ✅ correct.

**Optional refinement:** Update to "SPATIAL" wordmark if brand strategy dictates, or keep "TNA" as platform name. Current state acceptable unless brand guidelines require change.

---

## Phase 4: Logo Content Updates (Low Priority)

### 4.1 Update brand wordmark in AppShell

**File:** `AppShell.tsx` (lines 69–72, 100–103, 181–184)

**Current:** Shows "TNA" as brand name / "PORTAL" as subtitle.

**Decision:**
- Keep as-is (TNA PLATFORM)
- OR change to "SPATIAL" wordmark with "TNA PLATFORM" subtitle
- OR make it locale-aware (English: "SPATIAL", Arabic: "استدلال")

If changing to SPATIAL:
```tsx
<span className="sidebar-brand-name text-brand-navy">SPATIAL</span>
<span className="sidebar-brand-sub">PLATFORM</span>
```
Recommend delay until brand identity officially ratified.

---

## Phase 5: Cleanup & Removal

### 5.1 Delete orphaned/unreferenced files

**Files to delete:**
- `public/brand/` (entire directory) — contains only legacy TNA Carrier assets
- `public/brand/brand-tokens.css` — legacy CSS, conflicts with SPATIAL tokens
- `public/brand/visual identitiy.svg` — unused decorative file
- `src/components/shell/Header.tsx` — orphaned component (not imported anywhere, duplicates AppShell functionality)

**Rationale:** Reduces confusion, ensures single source of truth, prevents accidental usage.

### 5.2 Ensure canonical asset location

**Single source:** All brand assets live in `public/assets/brand/` only.

---

## Implementation Order

1. **Phase 1.1–1.3** — Generate SPATIAL SVGs in `/public/assets/brand/`, delete `/public/brand/` and its contents
2. **Phase 2** — Fix `LanguageSwitcher.tsx` colors (simple, isolated, high impact)
3. **Phase 3.1** — Remove `py-4` from AppShell header height (ensures teal line visible)
4. **Phase 3.2** — Smooth header gradient transition (optional: A univers al or B role-aware)
5. **Phase 5** — Delete orphaned legacy files
6. **Phase 4.1** — Brand wordmark update (defer to separate branding decision)

---

## Verification Checklist

### Asset checks
- [ ] `public/assets/brand/logo.svg` displays navy `#02488D` / cyan `#00B4C9` correctly
- [ ] `public/assets/brand/logo-watermark.svg` appears as subtle ghosted icon in content area
- [ ] `public/assets/brand/favicon.svg` shows in browser tab
- [ ] No 404 errors in console for missing assets

### Visual checks
- [ ] Header displays frosted glass (blur visible over scrolling content)
- [ ] Teal accent line (3px) visible at top of header
- [ ] Header height = 72px (no clipping of border or text)
- [ ] Language toggle: active = navy background, white text; inactive = neutral gray
- [ ] Header → Sidebar visual transition feels seamless (no jarring contrast)
- [ ] Watermark in content area visible but subtle (opacity 0.05–0.08)

### Technical checks
- [ ] No CSS variable warnings (`var(--undefined)`)
- [ ] Build passes without asset errors
- [ ] Legacy `/public/brand/` directory removed
- [ ] `brand-tokens.css` removed from repo
- [ ] `bg-primitive-navy` replaced with valid SPATIAL classes

---

## Open Questions (User Decision Required)

1. **Header theming strategy:**
   - **A. Universal frosted white** — header always white glass (`rgba(255,255,255,0.85)`) regardless of role
   - **B. Role-aware** — light for Visitor, dark translucent navy for Owner/Gov to match dark surfaces

2. **Brand wordmark:**
   - Keep "TNA PLATFORM" as-is in header/sidebar
   - Change to "SPATIAL" with "TNA PLATFORM" subtitle
   - Locale-aware: "SPATIAL" (EN) / "استدلال" (AR)

3. **Gradient bridge implementation:**
   - Implement now as part of Phase 3.2
   - Defer to separate design iteration after asset/toggle fixes land

4. **Favicon location:**
   - Keep favicon reference in `layout.tsx` as `/assets/brand/favicon.svg` (recommended)
   - Move to `/favicon.svg` at root (common convention)

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| SVG generation produces incorrect shapes | High | Generate previews, verify against SPATIAL spec before commit |
| Header height change breaks mobile layout | Medium | Test on mobile viewport; use `shrink-0` to prevent collapse |
| Language toggle SSR hydration mismatch | Medium | Component already has `mounted` guard; replacement classes are deterministic |
| Legacy file deletion accidentally removes needed assets | Low | Verify no imports reference `/public/brand/` before deleting |
| Dark header reduces text contrast for Owner/Gov | High | If role-aware, test Owner/Gov themes for WCAG AA compliance |

---

## Recommendation

**Approve Phases 1–3 as batch 1** (critical brand alignment + functional fixes).  
**Defer Phase 4** (wordmark update) pending brand approval.  
**Decide Phase 3.2** (header gradient) based on UX preference (Option A recommended for first iteration).

**Estimated effort:** 2–3 hours for asset creation + code changes + verification.
