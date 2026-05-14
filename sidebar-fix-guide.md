# Sidebar Fix Guide — AI Coding Agent Instructions

## 1. Context & Architecture Overview

This application is a **multi-role shipping/logistics portal** built RTL (Arabic-first). The sidebar is the primary navigation surface shared by all user roles (Visitor, Registered, Admin, …), with conditional rendering per role. The sidebar exists in three render states:

| State | Trigger |
|---|---|
| Desktop — expanded | Default on `≥ 769px` viewports |
| Desktop — collapsed | User clicks the collapse toggle |
| Mobile — overlay drawer | Viewport `≤ 768px`; opened by hamburger button |

**All fixes must preserve this three-state contract and the role-conditional rendering architecture.**

---

## 2. Pain Points & Root Causes

### 2a. Mobile View — Overlapping Components
**Symptom:** The sidebar drawer overlays the content without a proper backdrop; elements inside the drawer bleed or misalign with the topbar.

**Root cause:** The mobile sidebar likely uses `position: absolute` without a coordinated `top` offset matching the topbar height, and/or the z-index stack is inconsistent.

---

### 2b. Mobile View — Unnecessary Backdrop-Blur
**Symptom:** The overlay behind the open mobile sidebar applies `backdrop-filter: blur(...)`, which is visually heavy and slow on low-end devices.

**Root cause:** The overlay element has `backdrop-filter` set in CSS.

---

### 2c. Mobile View — Wrong Background Color (Blue instead of White)
**Symptom:** The mobile sidebar shows a dark-blue gradient background; the desktop sidebar is white. This breaks visual consistency.

**Root cause:** The mobile sidebar (or its open-state class) overrides `background` to the brand gradient instead of `#ffffff`.

---

### 2d. Both Views — Redundant Profile Component
**Symptom:** A section below the brand header shows a user avatar icon + role badge (e.g., "Demo زائر / VISITOR"). This is redundant — the brand header already shows the role.

**Root cause:** A standalone `<UserProfileCard>` or similar component is rendered unconditionally inside the sidebar body.

---

### 2e. Both Views — Visible Scrollbar in Sidebar
**Symptom:** A scrollbar appears on the sidebar nav list when items overflow.

**Root cause:** The nav container has `overflow-y: auto` or `overflow-y: scroll`.

---

### 2f. Both Views — Support/Login Footer Component
**Symptom:** The bottom of the sidebar shows a "الدعم / Support" section with a login status string (`مسجل الدخول كـ common.roles.Visitor.overview`). This exposes untranslated i18n keys and is not useful UI.

**Root cause:** A `<SupportFooter>` or `<LoginStatus>` component is rendered at the bottom of the sidebar unconditionally.

---

## 3. Fix Strategy — Per Sector

### Fix A: Mobile Overlay & Positioning

**Target:** Mobile sidebar drawer and its backdrop overlay.

**Strategy:**
1. The sidebar must be `position: fixed; top: 0; right: 0; bottom: 0;` — starting from the very top of the viewport (not below the topbar) so it renders as a full-height drawer.
2. It must start off-screen: `transform: translateX(100%)` (RTL: slides in from the right).
3. Add `transition: transform 0.22s cubic-bezier(0.4, 0, 0.2, 1)` for smooth animation.
4. Opening class sets `transform: translateX(0)` and `box-shadow: -4px 0 24px rgba(0,0,0,0.14)`.
5. A separate full-screen `<div class="mobile-overlay">` sits at `z-index: 299`; the sidebar at `z-index: 300`. Clicking the overlay closes the drawer.
6. Lock body scroll when drawer is open: `document.body.style.overflow = 'hidden'`.

**Do NOT:** use `top: var(--topbar-height)` on mobile — the sidebar should cover the full height.

---

### Fix B: Remove Backdrop Blur

**Target:** `.mobile-overlay` or whatever element sits behind the open drawer.

**Strategy:**
- Remove `backdrop-filter: blur(...)` entirely.
- Replace with a plain semi-transparent background: `background: rgba(0, 0, 0, 0.35)`.
- Add `transition: opacity 0.22s ease` so the overlay fades in/out gracefully.
- Use `pointer-events: none` when not visible; `pointer-events: all` when visible.

---

### Fix C: Mobile Sidebar Background Color

**Target:** The sidebar element itself and any open-state modifier class.

**Strategy:**
- The sidebar background must always be `background: #ffffff` (or `var(--sidebar-bg)` token).
- The **only** element allowed to show the brand blue is the `sidebar-header` block (the top strip containing the TNA logo and role badge). That element keeps `background: linear-gradient(135deg, #0E8FD1, #0a6fa3)`.
- Ensure no media query or modifier class (e.g., `.mobile-open`) overrides `background` on the sidebar root element.
- On mobile, the collapsed state class should not apply (the drawer is always full-width when open).

---

### Fix D: Remove User Profile Component

**Target:** The component rendered between the brand header and the navigation list.

**Strategy:**
- Locate the component (likely `<SidebarUserCard>`, `<UserProfileBadge>`, or similar).
- **Delete it entirely** from the sidebar template.
- The brand header already communicates the role (e.g., "TNA / زائر — Visitor"). No second identity block is needed.
- Do **not** remove role-based logic from the **navigation items** — only remove this standalone profile display block.

**Architecture note:** The user's name/avatar may still appear elsewhere (topbar avatar button). That is intentional and should be left as-is.

---

### Fix E: Remove Sidebar Scrollbar

**Target:** The navigation list container inside the sidebar.

**Strategy:**
- Set `overflow: hidden` on the sidebar root and the nav list container. This removes the scrollbar.
- The nav items must fit within the viewport height without scrolling. If the role has too many nav items to fit, use section grouping with compact spacing (`gap: 2px`, `padding: 9px 10px`) rather than enabling scroll.
- **Role-conditional rendering** means that different roles may have different numbers of nav items — design each role's item set so it fits without scrolling:
  - Visitor: 5 items → fits comfortably
  - Higher roles with more items: use section group labels to visually organize; compress `padding-top/bottom` if needed
- **Do not** use `overflow-y: auto` or `overflow-y: scroll` anywhere in the sidebar.

---

### Fix F: Replace Support Footer with Sign-Out Button

**Target:** The footer section of the sidebar (currently showing "الدعم / Support" + login status text).

**Strategy:**
- Remove the entire Support/LoginStatus component.
- Replace with a single **Sign-Out button** styled as a nav-like row:
  - Icon: arrow-right-from-bracket (logout icon)
  - Label: `تسجيل الخروج`
  - Color: red-ish destructive tone (`#d94f4f`) for icon and text
  - Hover: very light red background (`#fdf0f0`)
  - In collapsed state: label hides, only icon shows (with tooltip on hover, same pattern as nav items)
- Add a `border-top: 1px solid var(--divider)` above this footer area to separate it from nav.
- Wire to the app's existing logout/signout action handler.

---

## 4. Design Tokens to Apply Consistently

```css
:root {
  --primary:         #0E8FD1;
  --primary-dark:    #0a6fa3;
  --primary-light:   #e6f4fb;
  --sidebar-bg:      #ffffff;
  --sidebar-border:  #e4eaf1;
  --sidebar-w:       230px;
  --sidebar-w-col:   54px;
  --nav-hover:       #f2f7fb;
  --nav-active-bg:   #e6f4fb;
  --nav-active-txt:  #0E8FD1;
  --text-primary:    #1a2736;
  --text-secondary:  #5f7082;
  --text-muted:      #9aaab8;
  --signout:         #d94f4f;
  --signout-hover:   #fdf0f0;
  --divider:         #edf1f6;
  --topbar-h:        60px;
  --transition:      .22s cubic-bezier(.4,0,.2,1);
}
```

---

## 5. Placeholder Text (Replace Later with i18n Keys)

Use these Arabic placeholders for all nav item labels until the real i18n keys are wired up.

| Slot | Placeholder AR | Icon |
|---|---|---|
| Overview | `نظرة عامة` | `fa-house-chimney` |
| Address Search | `البحث عن عنوان` | `fa-magnifying-glass` |
| Shipping Codes | `رموز الشحن` | `fa-id-card` |
| My Shipments | `شحناتي` | `fa-boxes-stacked` |
| Profile | `الملف الشخصي` | `fa-circle-user` |
| Sign Out | `تسجيل الخروج` | `fa-arrow-right-from-bracket` |
| Group label — Main | `الرئيسية` | — |
| Group label — Services | `الخدمات` | — |
| Group label — Account | `الحساب` | — |

---

## 6. Role-Conditional Rendering Architecture

The sidebar **must** remain role-aware. The following approach preserves hierarchy:

```
SidebarRoot
├── SidebarHeader          (all roles — shows brand + role name)
├── SidebarNav
│   ├── NavGroup: "الرئيسية"
│   │   └── NavItem: Overview        ← ALL roles
│   ├── NavGroup: "الخدمات"  [if role >= Visitor]
│   │   ├── NavItem: Address Search  ← Visitor +
│   │   ├── NavItem: Shipping Codes  ← Visitor +
│   │   └── NavItem: My Shipments    ← Visitor +
│   ├── NavGroup: "الحساب"
│   │   └── NavItem: Profile         ← ALL roles (authenticated)
│   └── [Admin-only items go here]   ← conditionally rendered
└── SidebarFooter
    └── SignOutButton                 ← ALL roles (authenticated)
```

- Wrap each conditional group in `{role >= 'visitor' && <NavGroup>...</NavGroup>}` (or equivalent conditional).
- The `SidebarHeader` brand role badge (`زائر — Visitor`) should read from the auth context, not be hardcoded.
- Never remove the three-state behavior (expanded / collapsed / mobile-open) when refactoring role logic.

---

## 7. Checklist Before Marking Done

- [ ] Mobile sidebar slides in from the right with no blur overlay
- [ ] Mobile sidebar background is `#ffffff` — not blue/gradient
- [ ] No profile/avatar component appears inside the sidebar body
- [ ] No scrollbar is visible in the sidebar (any viewport)
- [ ] The footer shows **only** a sign-out button (no support text, no login status)
- [ ] Collapsed desktop state shows icons only with RTL-correct tooltips
- [ ] Active nav item has right-edge indicator bar and light blue background
- [ ] Role-conditional rendering is still functional for all roles
- [ ] Body scroll is locked when mobile sidebar is open, restored when closed
- [ ] All three states (expanded, collapsed, mobile-open) transition smoothly

---

## 8. Reference HTML

See `sidebar-fix-sample.html` — a standalone reference implementation demonstrating all fixes above. Use it as the visual contract; your task is to reproduce this behaviour inside the existing project component tree.
