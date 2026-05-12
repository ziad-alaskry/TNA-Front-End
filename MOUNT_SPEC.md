# TNA Carrier — Visual Identity Mount Spec
> Hand this file to Antigravity IDE code agent. Execute sequentially.

---

## Asset manifest (drop into /public/assets/brand/)

| File | Purpose | Status |
|---|---|---|
| `logo.svg` | Full icon, used in sidebar header | ✅ ready |
| `logo-watermark.svg` | Ghosted icon, content area bg | ✅ ready |
| `brand-tokens.css` | CSS custom properties | ✅ ready |
| `favicon.svg` | Browser tab icon (derive from logo.svg) | 🔲 generate |
| `logo-dark.svg` | White/teal only version for dark sidebar | 🔲 optional |
| `og-image.png` | 1200×630 social share card | 🔲 optional |

---

## Step 1 — Add brand tokens

In `src/styles/globals.css` or equivalent root stylesheet, import or paste `brand-tokens.css`.

---

## Step 2 — Sidebar component

Target file: whichever component renders the left nav (e.g. `Sidebar.jsx`, `SideNav.tsx`).

### 2a. Sidebar container styles
```css
.sidebar {
  width: var(--sidebar-width);
  background: var(--sidebar-bg);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
```

### 2b. Sidebar header block (logo + brand name)
Replace the existing text-only header block with:
```jsx
<div className="sidebar-header">
  <img
    src="/assets/brand/logo.svg"
    alt="TNA Carrier"
    width={36}
    height={36}
    className="sidebar-logo"
  />
  <div className="sidebar-brand-text">
    <span className="sidebar-brand-name">TNA Carrier</span>
    <span className="sidebar-brand-sub">PORTAL</span>
  </div>
  {/* User initial badge — keep existing "C" badge */}
  <div className="user-badge">C</div>
</div>
```

Styles:
```css
.sidebar-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 14px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}
.sidebar-logo {
  flex-shrink: 0;
  border-radius: 6px;
}
.sidebar-brand-name {
  font-family: var(--font-brand);
  font-size: 14px;
  font-weight: 700;
  color: #FFFFFF;
  line-height: 1.2;
}
.sidebar-brand-sub {
  font-size: 9px;
  letter-spacing: 0.12em;
  color: var(--brand-teal);
  text-transform: uppercase;
  display: block;
}
.user-badge {
  margin-left: auto;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--brand-teal);
  color: white;
  font-weight: 700;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### 2c. Navigation item active state
```css
.nav-item.active {
  background: var(--sidebar-active-bg);
  border-right: 3px solid var(--brand-teal);  /* RTL: border-left in LTR */
  color: var(--sidebar-active-text);
}
```

### 2d. Sidebar decorative image (the large blurred logo in the header area)
Add after the sidebar-header div:
```jsx
<div className="sidebar-hero-bg" aria-hidden="true">
  <img src="/assets/brand/logo.svg" alt="" width={160} height={160} />
</div>
```
```css
.sidebar-hero-bg {
  position: relative;
  height: 120px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.18;
  pointer-events: none;
}
.sidebar-hero-bg img {
  width: 160px;
  filter: blur(2px) brightness(1.6);
}
```

---

## Step 3 — Top bar / header component

Target file: `Header.jsx`, `TopBar.tsx`, or equivalent.

### 3a. Header container
```css
.topbar {
  height: var(--header-height);
  background: var(--header-bg);
  border-bottom: var(--header-border);
  border-top: var(--header-accent-line);  /* teal top line */
  display: flex;
  align-items: center;
  padding: 0 24px;
  gap: 12px;
}
```

### 3b. Page title
```css
.topbar-title {
  font-family: var(--font-brand);
  font-size: 18px;
  font-weight: 700;
  color: var(--brand-navy);
  margin-right: auto;   /* RTL: margin-left: auto */
}
```

### 3c. AR/EN language toggle
Keep existing toggle. Ensure active language uses `--brand-teal` background.

---

## Step 4 — Content area watermark

In the main content wrapper component, add:
```jsx
<div className="content-watermark" aria-hidden="true">
  <img src="/assets/brand/logo-watermark.svg" alt="" />
</div>
```
```css
.content-watermark {
  position: absolute;
  bottom: 40px;
  right: 40px;    /* RTL: left: 40px */
  width: var(--watermark-size);
  pointer-events: none;
  z-index: 0;
}
.content-wrapper {
  position: relative;  /* needed for watermark positioning */
}
```

---

## Step 5 — Favicon

Generate `favicon.svg` by taking `logo.svg` and removing the navy background path (first `<path>`), keeping only the teal/white icon shapes. Place at `/public/favicon.svg`.

In `index.html` or `_document.tsx`:
```html
<link rel="icon" type="image/svg+xml" href="/assets/brand/favicon.svg" />
```

---

## Step 6 — Font import

In your root HTML or CSS, add Cairo (supports Arabic):
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet" />
```

---

## RTL checklist (since app is Arabic-first)

- [ ] `border-right` active indicators → `border-inline-end` (works in both directions)
- [ ] Watermark position: use `inset-inline-end: 40px` instead of `right`
- [ ] `margin-right: auto` on title → `margin-inline-start: auto`
- [ ] Confirm `dir="rtl"` on `<html>` tag

---

## What you do NOT need to generate separately

- No separate dark-mode logo needed — the teal/white fills read correctly on navy
- No PNG fallbacks needed if your build target is modern browsers (SVG is universal)
- No icon sprite — the sidebar uses the single SVG directly
