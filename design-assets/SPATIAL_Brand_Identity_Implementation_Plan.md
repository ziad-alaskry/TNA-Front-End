# SPATIAL Brand Identity — Frontend Implementation Plan
**Project:** TNA-Front-End (Next.js 14 / Tailwind CSS / TypeScript)  
**Brand Source:** SPATIAL Visual Identity 2025  
**Date:** May 2026  
**Status:** Implementation Ready

---

## Executive Summary

This plan defines how to mount the **SPATIAL** brand identity (logo, colors, typography, motion, and component language) across the TNA frontend project. The codebase already has a `tokens.css` + `tailwind.config.js` token architecture in place — however several tokens currently reference an **orange brand (`#F68B1E`)** that conflicts with the SPATIAL identity (navy + cyan). This plan corrects that mismatch and provides a full implementation roadmap across five phases.

---

## 1. Brand Identity Inventory (from PDF)

### 1.1 Color Palette

| Token Name | Hex | Usage |
|---|---|---|
| `--primitive-cyan-light` | `#18CCE5` | Highlights, icons, hover accents |
| `--primitive-cyan-mid` | `#00B4C9` | CTA outlines, info states, links |
| `--primitive-navy` | `#02488D` | Primary brand, headers, sidebar bg |
| `--neutral-400` | `#B7B7B7` | Muted text, disabled states, dividers |

### 1.2 Typography

| Weight | Usage |
|---|---|
| Rubik ExtraBold (800) | Display headings, brand wordmark |
| Rubik Medium (500) | Subheadings, nav labels, card titles |
| Rubik Light (300) | Body copy, captions, fine print |
| Arabic — Rubik (same family) | RTL support across all weights |

> ✅ **Good news:** `Rubik` is already imported in `globals.css` and defined in `tailwind.config.js`.  
> ⚠️ **Issue:** The current `--color-brand-primary` is set to `#F68B1E` (orange). This must be re-mapped to `#02488D` (navy) as the primary brand color, with `#00B4C9` as the accent.

### 1.3 Logo System

Two logo variants exist:
- **English version:** Icon + "SPATIAL" wordmark + tagline "Precision to Confidence"
- **Arabic version:** Icon + "استدلال" + tagline "الاستدلال بدقة... للوصول بثقة"

The icon is a **geometric location-pin motif** composed of cyan/navy faceted segments with a concentric circle center — used as both a full logo and a standalone icon mark.

---

## 2. Current State Audit

### 2.1 Token Conflicts (Must Fix)

```
tokens.css
--color-brand-primary: #F68B1E   ← WRONG (orange, not SPATIAL)
--color-brand-secondary: #FFB347 ← WRONG
--color-brand-accent: #FFCC33    ← WRONG
--shadow-card: rgba(246,139,30,…) ← orange tint must become navy/cyan
--shadow-btn: rgba(246,139,30,…)  ← same
--input-border-focus: #F68B1E    ← must become #00B4C9
--navbar-icon-active: #F68B1E    ← must become #02488D
--navbar-active-bar: #F5A623     ← must become #00B4C9
--bottom-nav-active-dot: #F68B1E ← must become #02488D
--btn-primary-bg: gradient(#F68B1E, #FFB347) ← must become navy
```

### 2.2 Components Needing Updates

| File | Issue |
|---|---|
| `src/components/shell/Header.tsx` | No logo, just "TNA" text |
| `src/components/shell/AppLayout.tsx` | OWNER theme is `bg-black` (wrong) |
| `src/components/shell/BottomNav.tsx` | Uses `text-primary` (currently orange), active bar is amber |
| `src/app/globals.css` | `.ui-topbar` needs brand navbar styling |

---

## 3. Implementation Phases

---

### Phase 1 — Design Token Correction (Day 1) 🔴 Critical

**File:** `src/app/tokens.css`

Replace the orange brand tokens with the correct SPATIAL palette:

```css
/* ─── SEMANTIC: BRAND (SPATIAL — CORRECTED) ─── */
--color-brand-primary:    #02488D;   /* Navy — main brand */
--color-brand-secondary:  #00B4C9;   /* Cyan mid — accents & CTAs */
--color-brand-accent:     #18CCE5;   /* Cyan light — highlights */

/* ─── SHADOWS (Navy/Cyan tint, not orange) ─── */
--shadow-card:         0 2px 8px  rgba(2, 72, 141, 0.08);
--shadow-modal:        0 8px 32px rgba(2, 72, 141, 0.18);
--shadow-btn:          0 4px 16px rgba(0, 180, 201, 0.30);
--shadow-glow-primary: 0 0 16px   rgba(2, 72, 141, 0.40);
--shadow-glow-cyan:    0 0 16px   rgba(0, 180, 201, 0.40);

/* ─── COMPONENT: PRIMARY BUTTON (Navy → Cyan gradient) ─── */
--btn-primary-bg:       linear-gradient(135deg, #02488D, #00B4C9);
--btn-primary-color:    #FFFFFF;

/* ─── COMPONENT: INPUT ─── */
--input-border-focus:   1.5px solid #00B4C9;

/* ─── NAVIGATION ─── */
--navbar-icon-active:   #02488D;
--navbar-active-bar:    3px solid #00B4C9;
--bottom-nav-active-dot:#02488D;

/* ─── SURFACE: DARK (Navy tone) ─── */
--surface-dark-100: #02488D;
--surface-dark-200: #013A70;
--surface-dark-300: #011D40;
```

**Update `tailwind.config.js`** — replace `brand.orange` with SPATIAL semantic colors:
```js
brand: {
  navy:        'var(--primitive-navy)',
  'navy-dark': 'var(--primitive-navy-dark)',
  cyan:        'var(--primitive-cyan-mid)',
  'cyan-light':'var(--primitive-cyan-light)',
  primary:     'var(--color-brand-primary)',   // was 'orange'
  secondary:   'var(--color-brand-secondary)',
},
```

---

### Phase 2 — Logo & SVG Asset Creation (Day 1–2) 🔴 Critical

#### 2.1 Create SVG Logo Assets

Create the following in `public/brand/`:

**`/public/brand/logo-full-en.svg`** — Horizontal English logo  
**`/public/brand/logo-full-ar.svg`** — Horizontal Arabic logo  
**`/public/brand/logo-icon.svg`** — Icon mark only (for favicons, loading states)  
**`/public/brand/logo-full-white.svg`** — Reversed/white version (for dark navy backgrounds)

#### 2.2 Icon Mark SVG Spec

The icon is a **hexagonal location pin** made of 6 faceted segments:

```
Segments layout (approximate):
  Top-left:    #18CCE5 (cyan light)
  Top-right:   #00B4C9 (cyan mid)
  Mid-left:    #02488D (navy)
  Mid-right:   #18CCE5 (cyan light)
  Bottom-left: #00B4C9 (cyan mid)
  Center:      white circle with concentric ring #02488D
  Pin tip:     #02488D pointing down
```

#### 2.3 Favicon

Generate from icon SVG:
- `public/favicon.ico`
- `public/apple-touch-icon.png` (180×180)
- `public/icon-192.png` (192×192 for PWA)

Update `src/app/[locale]/layout.tsx` metadata:

```tsx
export const metadata: Metadata = {
  title: 'SPATIAL — Precision to Confidence',
  description: 'الاستدلال بدقة... للوصول بثقة',
  icons: {
    icon: '/brand/logo-icon.svg',
    apple: '/apple-touch-icon.png',
  },
  themeColor: '#02488D',
}
```

---

### Phase 3 — Header / Navbar Redesign (Day 2–3) 🟠 High Priority

**File:** `src/components/shell/Header.tsx`

Replace the plain "TNA" text with the branded header:

```tsx
'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Globe } from 'lucide-react'
import { useLocale } from '@/i18n/LocaleProvider'
import { locales, type Locale } from '@/i18n/config'

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { locale: currentLocale } = useLocale()
  const isRTL = currentLocale === 'ar'

  const handleLocaleToggle = () => {
    const newLocale: Locale = currentLocale === 'en' ? 'ar' : 'en'
    const segments = pathname.split('/')
    segments[1] = newLocale
    router.push(segments.join('/'))
  }

  return (
    <header className="ui-topbar flex items-center justify-between px-5">
      {/* Logo — switches between EN/AR version */}
      <Link href={`/${currentLocale}/visitor/home`} className="flex items-center gap-3">
        <Image
          src="/brand/logo-icon.svg"
          alt="SPATIAL icon"
          width={36}
          height={36}
          priority
        />
        <Image
          src={isRTL ? '/brand/logo-full-ar.svg' : '/brand/logo-full-en.svg'}
          alt="SPATIAL"
          width={isRTL ? 120 : 110}
          height={32}
          priority
          className="hidden sm:block"
        />
      </Link>

      {/* Language Toggle */}
      <button
        onClick={handleLocaleToggle}
        className="
          flex items-center gap-2 rounded-pill border border-brand-cyan
          bg-white px-4 py-2 text-label font-medium text-brand-navy
          transition-all hover:bg-brand-navy hover:text-white hover:border-brand-navy
          focus:outline-none focus:ring-2 focus:ring-brand-cyan/40
        "
        aria-label={`Switch to ${currentLocale === 'en' ? 'Arabic' : 'English'}`}
      >
        <Globe size={16} />
        <span>{currentLocale === 'en' ? 'عربي' : 'EN'}</span>
      </button>
    </header>
  )
}
```

#### 3.1 Update `globals.css` — `.ui-topbar`

```css
.ui-topbar {
  @apply sticky top-0 z-50 border-b border-neutral-200;
  height: var(--navbar-height);          /* 72px */
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: var(--shadow-navbar);
}

/* Dark variant — used on navy/dark screens */
.ui-topbar-dark {
  background: var(--surface-dark-100);   /* #02488D */
  border-bottom-color: rgba(255,255,255,0.12);
}
.ui-topbar-dark .logo-wordmark { filter: brightness(0) invert(1); }
```

---

### Phase 4 — Role Theme System (Day 3–4) 🟠 High Priority

**Problem:** `AppLayout.tsx` uses ad-hoc strings like `bg-black`. Roles need consistent, SPATIAL-branded themes.

#### 4.1 Define Role Theme CSS Classes in `globals.css`

```css
/* ── VISITOR Theme (default light + navy/cyan) ── */
.theme-visitor {
  --primary:              var(--primitive-navy);
  --primary-foreground:   #FFFFFF;
  --accent:               var(--primitive-cyan-mid);
  --accent-foreground:    #FFFFFF;
  --navbar-bg:            #FFFFFF;
  --sidebar-bg:           var(--neutral-50);
  --sidebar-active-bg:    var(--color-info-bg);     /* light cyan tint */
  --sidebar-active-text:  var(--primitive-navy);
}

/* ── OWNER Theme (dark navy surface) ── */
.theme-owner {
  --primary:              var(--primitive-cyan-mid);
  --primary-foreground:   #FFFFFF;
  --accent:               var(--primitive-cyan-light);
  --navbar-bg:            var(--surface-dark-100);  /* #02488D */
  --sidebar-bg:           var(--surface-dark-200);  /* #013A70 */
  --sidebar-active-bg:    rgba(24, 204, 229, 0.12);
  --sidebar-active-text:  var(--primitive-cyan-light);
  --background:           var(--surface-dark-300);
  --foreground:           #FFFFFF;
  --card:                 var(--surface-dark-200);
  --card-foreground:      #FFFFFF;
}

/* ── GOV_USER Theme (professional light) ── */
.theme-gov {
  --primary:              var(--primitive-navy);
  --accent:               var(--primitive-cyan-mid);
  --navbar-bg:            var(--surface-dark-100);
  --background:           var(--neutral-100);
  --sidebar-bg:           #FFFFFF;
}

/* ── CARRIER_STAFF Theme (operational teal) ── */
.theme-carrier {
  --primary:              var(--primitive-cyan-mid);
  --primary-foreground:   #FFFFFF;
  --accent:               var(--primitive-navy);
  --navbar-bg:            #FFFFFF;
  --sidebar-bg:           var(--color-info-bg);
}
```

#### 4.2 Update `AppLayout.tsx`

```tsx
const roleThemeClass: Record<string, string> = {
  VISITOR:       'theme-visitor',
  OWNER:         'theme-owner',
  GOV_USER:      'theme-gov',
  CARRIER_STAFF: 'theme-carrier',
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { role } = useAuthStore()
  const themeClass = role ? roleThemeClass[role] ?? 'theme-visitor' : 'theme-visitor'

  return (
    <div className={`min-h-screen flex flex-col bg-background text-foreground ${themeClass}`}>
      <Header />
      <main className="flex-1 pb-[var(--bottom-nav-height)]">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
```

---

### Phase 5 — Component Library Audit & Polish (Day 4–5) 🟡 Medium Priority

#### 5.1 Button Component

Ensure primary buttons use the SPATIAL navy→cyan gradient, not orange:

```css
/* globals.css — Button overrides */
.btn-primary {
  background: var(--btn-primary-bg);    /* linear-gradient(135deg, #02488D, #00B4C9) */
  color: var(--btn-primary-color);
  height: var(--btn-primary-height);
  border-radius: var(--btn-primary-radius);
  font-weight: var(--btn-primary-weight);
  box-shadow: var(--shadow-btn);
  transition: opacity 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
}
.btn-primary:hover {
  opacity: 0.92;
  transform: translateY(-1px);
  box-shadow: var(--shadow-glow-cyan);
}
.btn-primary:active {
  transform: translateY(0);
  opacity: 1;
}

/* Outline/secondary CTA — cyan border */
.btn-outline {
  border: var(--btn-outline-border);    /* 1.5px solid #00B4C9 */
  color: var(--primitive-cyan-mid);
  background: transparent;
  height: var(--btn-outline-height);
  border-radius: var(--btn-outline-radius);
}
.btn-outline:hover {
  background: var(--color-info-bg);
}
```

#### 5.2 BottomNav Polish

```tsx
{/* Active indicator — SPATIAL cyan bar at top, not amber */}
{isActive && (
  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-brand-cyan rounded-b-full" />
)}
```

Change active text class from `text-primary` (which maps to orange currently) to:
```tsx
className={isActive ? 'text-brand-navy' : 'text-neutral-400'}
```

#### 5.3 Sidebar Active State

In `RoleSidebar.tsx` and `VisitorSidebar.tsx`, replace hardcoded amber/orange active colors:

```tsx
// Before (wrong):
className="bg-amber-50 text-amber-600 border-l-4 border-amber-500"

// After (SPATIAL):
className="bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active-text)] border-l-4 border-brand-cyan"
```

#### 5.4 Card Component

Update card shadow from orange tint:
```css
.ui-card {
  background: var(--card);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);   /* now navy-tinted after Phase 1 */
  border: 1px solid var(--neutral-200);
}
```

#### 5.5 Form Focus States

All `<input>` focus rings must use cyan, not orange:
```css
.ui-input:focus {
  border: var(--input-border-focus);  /* 1.5px solid #00B4C9 */
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 180, 201, 0.15);
}
```

---

### Phase 6 — Splash / Auth Screens (Day 5) 🟡 Medium Priority

Auth and splash screens should reflect the brand's full visual depth.

#### 6.1 Splash Screen Background

```css
.splash-bg {
  background: linear-gradient(150deg, #02488D 0%, #013A70 50%, #011D40 100%);
}
```

Logo (white reversed version) centered with a subtle pulse animation:

```css
@keyframes spatial-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.85; transform: scale(0.97); }
}
.logo-splash {
  animation: spatial-pulse 2.4s ease-in-out infinite;
}
```

#### 6.2 Login Page

- **Background:** Light neutral (`#F4F5F6`) with a subtle geometric pattern using the icon motif (SVG repeat at ~5% opacity)
- **Card:** White, `border-radius: 20px`, `box-shadow: var(--shadow-modal)`
- **Title:** "Precision to Confidence" in Rubik Light below logo
- **CTA Button:** Navy→Cyan gradient
- **Language toggle:** Pill-shaped, navy border

---

## 4. Theme Design Reference

### Light Theme (Visitor / Default)

```
Background:    #F4F5F6  (neutral-100)
Surface/Card:  #FFFFFF
Header bg:     rgba(255,255,255,0.95) with backdrop-blur
Sidebar bg:    #FAFAFA  (neutral-50)
Primary text:  #3A3F47  (neutral-700)
Muted text:    #8C9098  (neutral-500)
Brand primary: #02488D  (navy)
Brand accent:  #00B4C9  (cyan)
Dividers:      #EAECEE  (neutral-200)
Active:        cyan left border + light cyan bg
CTA button:    navy→cyan gradient
```

### Dark Theme (Owner Role)

```
Background:    #011D40  (navy darkest)
Surface/Card:  #013A70  (navy dark)
Header bg:     #02488D  (navy)
Sidebar bg:    #013A70
Primary text:  #FFFFFF
Muted text:    rgba(255,255,255,0.55)
Brand primary: #00B4C9  (cyan — reversed for dark bg)
Brand accent:  #18CCE5  (cyan light)
Active:        cyan left border + translucent cyan bg
```

---

## 5. File Change Summary

| File | Action | Priority |
|---|---|---|
| `src/app/tokens.css` | Replace orange brand tokens with navy/cyan | 🔴 Critical |
| `tailwind.config.js` | Update `brand.orange` → `brand.primary` + fix shadow refs | 🔴 Critical |
| `public/brand/*.svg` | Add logo SVG files (full EN, full AR, icon, white) | 🔴 Critical |
| `src/components/shell/Header.tsx` | Add logo image, redesign language toggle | 🔴 Critical |
| `src/app/globals.css` | Fix `.ui-topbar`, add role theme classes, button overrides | 🟠 High |
| `src/components/shell/AppLayout.tsx` | Use `theme-*` class system per role | 🟠 High |
| `src/components/shell/BottomNav.tsx` | Fix active color tokens | 🟠 High |
| `src/components/layout/RoleSidebar.tsx` | Fix active state colors | 🟡 Medium |
| `src/components/layout/VisitorSidebar.tsx` | Same as above | 🟡 Medium |
| `src/app/[locale]/layout.tsx` | Add metadata: title, icons, themeColor | 🟡 Medium |
| Auth/Login pages | Redesign with dark navy splash, branded card | 🟡 Medium |

---

## 6. Design QA Checklist

Before each phase ships, verify:

- [ ] No orange (`#F68B1E`, `amber-*`) in brand-critical UI elements
- [ ] Logo renders correctly in EN and AR locale
- [ ] RTL layout doesn't break logo or header flex direction
- [ ] Active nav states use `#02488D` (navy) or `#00B4C9` (cyan), not amber
- [ ] Buttons use navy→cyan gradient with white text
- [ ] Focus rings on inputs are cyan (`#00B4C9`), not orange
- [ ] Dark (OWNER) theme is readable — white text on navy, no contrast failures (WCAG AA)
- [ ] Rubik font loads correctly in both weight 300 and 800
- [ ] Logo SVG renders sharply on retina displays
- [ ] `themeColor` meta is `#02488D` for mobile browser chrome

---

## 7. Typography Usage Guide

| Element | Font Style | Size | Weight | Color |
|---|---|---|---|---|
| App title / splash | Rubik | 32px | 800 ExtraBold | White or Navy |
| Page headings (H1) | Rubik | 22px | 700 Bold | `#02488D` Navy |
| Section headings (H2) | Rubik | 17px | 600 SemiBold | `#3A3F47` |
| Nav labels | Rubik | 11–13px | 700 Bold | Active: Navy, Inactive: `#B7B7B7` |
| Body copy | Rubik | 15px | 400 Regular | `#3A3F47` |
| Captions / labels | Rubik | 11–13px | 300–400 Light | `#8C9098` |
| Arabic headings | Rubik | same sizes | same weights | same colors |

---

## 8. Logo SVG Scaffold

Use this as a starting point to recreate the SPATIAL icon mark in `/public/brand/logo-icon.svg`:

```svg
<svg viewBox="0 0 48 56" xmlns="http://www.w3.org/2000/svg">
  <!-- Top-left facet -->
  <path d="M8 12 L24 8 L24 24 L8 20 Z" fill="#18CCE5"/>
  <!-- Top-right facet -->
  <path d="M24 8 L40 12 L40 20 L24 24 Z" fill="#00B4C9"/>
  <!-- Mid-left facet -->
  <path d="M8 20 L24 24 L24 36 L8 32 Z" fill="#02488D"/>
  <!-- Mid-right facet -->
  <path d="M24 24 L40 20 L40 32 L24 36 Z" fill="#18CCE5"/>
  <!-- Bottom convergence to pin tip -->
  <path d="M8 32 L24 36 L24 52 Z" fill="#00B4C9"/>
  <path d="M40 32 L24 36 L24 52 Z" fill="#02488D"/>
  <!-- Center lens / target ring -->
  <circle cx="24" cy="24" r="5" fill="white"/>
  <circle cx="24" cy="24" r="3.5" fill="none" stroke="#02488D" stroke-width="1.5"/>
  <circle cx="24" cy="24" r="1.5" fill="#02488D"/>
</svg>
```

> **Note:** This is an approximation. Trace the actual icon from the PDF using a vector tool (Figma / Illustrator / Inkscape) to get the exact bezier curves, then export as optimized SVG.

---

*This document should be treated as the single source of truth for brand integration. All pull requests touching colors, typography, logo, or navigation should reference this plan.*
