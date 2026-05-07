# SPATIAL Brand Identity — Refined Implementation Plan
**Project:** TNA-Front-End (Next.js 14 / Tailwind CSS / TypeScript)  
**Brand Source:** SPATIAL Visual Identity 2025  
**Date:** May 2026  
**Status:** DRAFT (Awaiting Execution)

---

## 1. Executive Summary
This document refines the initial implementation plan to ensure 100% compatibility with the existing `tna-project` architecture. It addresses the mismatch between the current `tailwind.config.js` (which uses `brand.orange`) and the new SPATIAL identity (Navy/Cyan).

## 2. Token & Config Alignment

### 2.1 CSS Variables (Refined `tokens.css`)
We will merge the `edited-tokens.css` into `tna-project/src/app/tokens.css`.
- **Action:** Retain existing structure but update values.
- **Change:** Map `--color-primary` to Navy (`#02488D`) and `--color-secondary` to Cyan (`#00B4C9`).
- **Addition:** Add specific `surface-dark` tokens for the **Owner** and **Gov** dark modes.

### 2.2 Tailwind Config (Refined `tailwind.config.js`)
Instead of just adding new keys, we will systematically replace the orange brand keys to prevent dead code.
- **Old:** `brand.orange`, `brand.teal`
- **New:** `brand.primary` (Navy), `brand.secondary` (Cyan), `brand.accent` (Cyan Light)
- **Mapping:** Update `ring: "var(--color-primary)"` to ensure focus states follow the new brand.

## 3. UX/UI Best Practice Enhancements

### 3.1 Motion & Feedback
- **Transitions:** Standardize `transition-all duration-300 ease-in-out` for all hover states.
- **Button Feedback:** Use `active:scale-95` for tactile feedback on mobile.
- **Skeleton States:** Implement branded skeletons using `animate-pulse` with a `bg-brand-navy/5` tint.

### 3.2 Typography
- **Contrast:** Ensure all text on `brand-navy` backgrounds uses `text-white` or `text-neutral-50` for WCAG AAA compliance.
- **Arabic Legibility:** Set `line-height: 1.6` for Arabic body text to accommodate Rubik's descenders.

### 3.3 Layout Polish
- **Glassmorphism:** Use `backdrop-blur-md` on the `Header` and `BottomNav` with a translucent white/navy background (85% opacity).
- **Safe Areas:** Ensure `BottomNav` respects mobile safe area insets using `pb-safe`.

## 4. Implementation Steps

### Phase 1: Core Tokens (Critical)
1.  **Modify** `tna-project/src/app/tokens.css` with corrected SPATIAL values.
2.  **Modify** `tna-project/tailwind.config.js` to remove `orange` and add semantic brand mapping.

### Phase 2: Shell & Navigation (High)
1.  **Update** `Header.tsx` to include the SPATIAL logo (replacing text "TNA").
2.  **Refactor** `AppLayout.tsx` to use the CSS-class based theme switcher (Visitor/Owner/Gov/Carrier).
3.  **Update** `BottomNav.tsx` active indicator to use Cyan (`#00B4C9`).

### Phase 3: Global Styles (High)
1.  **Enhance** `globals.css` with the new `.btn-primary` gradient and `.ui-card` shadows.
2.  **Add** `.theme-*` scope classes to `globals.css`.

### Phase 4: Asset Integration (Medium)
1.  **Add** SVG logos to `public/brand/`.

## 5. Verification Checklist
- [ ] Primary button is Navy-to-Cyan gradient.
- [ ] No orange remnants in `tailwind.config.js` or `tokens.css`.
- [ ] Header logo switches correctly between EN (SPATIAL) and AR (استدلال).
- [ ] Owner role shows Dark Navy theme; Visitor role shows Light theme.
