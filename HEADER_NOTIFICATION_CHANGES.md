# TNA Project — Header & Notification System: Change Specification

> **Agent instructions**: Apply every change described below precisely.  
> Reference the companion file `header-notification-fix.html` for the complete working prototype.  
> Do **not** deviate from these specs; each section includes the exact logic, CSS, and markup to use.

---

## 0. Pre-flight: SVG Logo Preparation

### Problem
The client-supplied logo (`file.svg`) contains a white-fill background rectangle as its first `<path>` element (`fill="#FEFEFF"`). This must be removed before the SVG can be used as a transparent logo on the white header.

### Action
1. Open `file.svg`.
2. Delete the **entire first `<path>` element** — the one with `fill="#FEFEFF"`. It is the outermost bounding rectangle covering the whole canvas.
3. Also remove the deprecated attribute `enable-background="new 0 0 155 153"` from the `<svg>` root tag.
4. Remove `x="0px" y="0px"` from the `<svg>` root tag (unused, causes linting warnings).
5. Save the result as `logo-clean.svg` (or overwrite the original, per your project convention).
6. The cleaned SVG should open with `<svg version="1.1" ... viewBox="0 0 155 153" xml:space="preserve">` and its first child should be a `<path fill="#29BBE3" ...>` element.

---

## 1. HEADER DOMAIN

### 1-A. Remove the broken i18n label

**Target element**: the element currently displaying the text `common.roles.Visitor.overview` in the header's right side.

This is a role-conditional label that was never replaced with its translated value. It may appear as:
- A `<span>`, `<p>`, `<h1>`, or a router/navigation title element
- Possibly guarded by a computed property like `pageTitle`, `headerLabel`, or `$t('common.roles.Visitor.overview')`

**Action**: Remove this element (and its wrapping container if it becomes empty after removal) from the header template entirely. Do not translate it — it is being replaced by the logo (see 1-B).

---

### 1-B. Insert the logo in place of the removed label

**Position**: Right side of the header, to the left of the hamburger/menu button — exactly where the label was.

**Markup pattern** (adapt to your framework):

```html
<a
  class="header-logo-link"
  :href="logoHomeHref"
  aria-label="Go to home"
>
  <!-- Inline SVG from logo-clean.svg — paste full SVG here -->
  <svg viewBox="0 0 155 153" xmlns="http://www.w3.org/2000/svg" xml:space="preserve">
    <!-- all paths from logo-clean.svg -->
  </svg>
</a>
```

**Computed property** (Vue example — adapt to your framework):

```js
// maps each user role to its home route
const ROLE_HOME_MAP = {
  visitor:  '/',
  customer: '/customer/dashboard',
  admin:    '/admin/dashboard',
  agent:    '/agent/dashboard',
  // add other roles as needed
};

computed: {
  logoHomeHref() {
    return ROLE_HOME_MAP[this.userRole] ?? '/';
  }
}
```

> If your app already has a role-based home-route computed property, reuse it here — no need to duplicate.

---

### 1-C. Logo sizing — CSS

Add these rules to your header component stylesheet. The goal is ~1/6 of the header width (business standard: logo occupies 14–18% of the header bar, clearly visible but not dominant).

```css
.header-logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  flex-shrink: 0;

  /* ≈ 1/6 of header: clamp keeps it readable on all breakpoints */
  width: clamp(80px, 14vw, 140px);
  height: calc(var(--header-height, 60px) - 16px); /* vertically centered with 8px top+bottom breathing room */
  padding: 4px 0;
  transition: opacity 0.2s ease;
}

.header-logo-link svg {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.header-logo-link:hover {
  opacity: 0.8;
}

/* Mobile: shrink further but keep visible */
@media (max-width: 600px) {
  .header-logo-link {
    width: clamp(60px, 22vw, 100px);
  }
}
```

---

## 2. NOTIFICATION DOMAIN

### 2-A. Remove backdrop-blur on notification open

**Problem**: When the notification bell is clicked, a backdrop-blur or overlay effect is applied to the entire page background — this is incorrect UX for a notification panel.

**Action**: Find where the backdrop effect is triggered on bell click. It may be:
- A CSS class toggled on `<body>` or `<main>` (e.g., `body.notif-open { backdrop-filter: blur(...); }`)
- An overlay component rendered conditionally (`v-if="notifOpen"`)
- A global store state that drives a blur wrapper

Remove the backdrop-blur entirely. The notification panel should appear **without any background obscuration**. The page content remains fully visible and interactive behind the panel.

Replace the full-page overlay with a **transparent click-capture overlay** (see 2-C for toggle logic) that only handles outside-click dismissal, not visual blurring.

---

### 2-B. Notification panel — theme & styling

Apply these styles to the notification panel component. The theme is: **white background, black primary text, blue accent (`#0964AC` / `#29BBE3`)**.

```css
/* ── Panel container ── */
.notif-panel {
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 8px 32px rgba(9, 100, 172, 0.15), 0 4px 12px rgba(0, 0, 0, 0.10);
  border: 1px solid #e8edf3;
  overflow: hidden;
  width: 360px;
  max-height: 480px;
  display: flex;
  flex-direction: column;
}

/* ── Panel header ── */
.notif-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px 12px;
  border-bottom: 1px solid #e8edf3;
  flex-shrink: 0;
}

.notif-panel-title {
  font-size: 14px;
  font-weight: 700;
  color: #1a202c;
  display: flex;
  align-items: center;
  gap: 8px;
}

.notif-unread-count-badge {
  background: #0964AC;
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  padding: 1px 7px;
  border-radius: 10px;
}

.notif-mark-all-btn {
  font-size: 12px;
  color: #0964AC;
  font-weight: 600;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.15s;
}
.notif-mark-all-btn:hover { background: #e8f4fd; }

/* ── Scrollable body ── */
.notif-panel-body {
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
}
.notif-panel-body::-webkit-scrollbar { width: 4px; }
.notif-panel-body::-webkit-scrollbar-thumb {
  background: #e8edf3;
  border-radius: 4px;
}

/* ── Individual notification item ── */
.notif-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid #e8edf3;
  cursor: pointer;
  transition: background 0.15s ease;
  position: relative;
}
.notif-item:last-child { border-bottom: none; }
.notif-item:hover { background: #e8f4fd; }

/* Unread state */
.notif-item.unread { background: #f0f7ff; }
.notif-item.unread:hover { background: #daeeff; }

/* Left accent bar for unread items */
.notif-item.unread::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #0964AC;
  border-radius: 0 2px 2px 0;
}

/* Icon circle */
.notif-item-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #e8f4fd;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* Text content */
.notif-item-title {
  font-size: 13px;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.notif-item-desc {
  font-size: 12px;
  color: #64748b;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.notif-item-time {
  font-size: 11px;
  color: #9ba8b8;
  margin-top: 5px;
}

/* ── Footer ── */
.notif-panel-footer {
  padding: 10px 16px;
  border-top: 1px solid #e8edf3;
  flex-shrink: 0;
}
.notif-view-all-link {
  display: block;
  text-align: center;
  padding: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #0964AC;
  text-decoration: none;
  border-radius: 6px;
  transition: background 0.15s;
}
.notif-view-all-link:hover { background: #e8f4fd; }
```

---

### 2-C. Toggle via bell icon — no close button

**Remove**: Any dedicated close (`✕`) button inside the notification panel.

**Replace with**: Bell icon toggling. The bell already visible in the header acts as the only open/close control.

**Logic**:

```js
// State
isNotifOpen: false,

// Toggle — call this on bell icon click
toggleNotifications() {
  this.isNotifOpen = !this.isNotifOpen;
},

// Close — call this on outside-click (overlay click)
closeNotifications() {
  this.isNotifOpen = false;
},
```

**Bell button** (the `active` class keeps it highlighted while panel is open):

```html
<button
  class="notif-bell-btn"
  :class="{ active: isNotifOpen }"
  @click.stop="toggleNotifications"
  :aria-expanded="isNotifOpen"
  aria-label="Notifications"
>
  <!-- bell SVG icon -->
  <span class="notif-badge" v-if="unreadCount > 0">{{ unreadCount }}</span>
</button>
```

**Bell button CSS**:

```css
.notif-bell-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
  position: relative;
}
.notif-bell-btn:hover,
.notif-bell-btn.active {
  background: #e8f4fd;
}
.notif-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  min-width: 16px;
  height: 16px;
  border-radius: 8px;
  background: #e53e3e;
  color: white;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 3px;
  border: 1.5px solid white;
  pointer-events: none;
}
```

---

### 2-D. Panel positioning — no overlap with bell or other components

The panel must appear **below** the bell icon, not overlapping it. Use absolute positioning relative to the bell wrapper.

```css
/* Wrapper must be position:relative */
.notif-wrapper {
  position: relative;
  flex-shrink: 0;
}

/* Panel drops below the bell */
.notif-panel {
  position: absolute;
  top: calc(100% + 8px);  /* 8px gap below the bell button */
  right: 0;               /* right-aligned with the bell */
  z-index: 2000;          /* above header content, below modals */
  /* ... rest of styling from 2-B ... */
}
```

**Outside-click dismissal** — use a transparent overlay behind the panel (no visual effect):

```html
<!-- Sits behind the panel in z-index, covers full viewport -->
<div
  v-if="isNotifOpen"
  class="notif-click-outside"
  @click="closeNotifications"
></div>
```

```css
.notif-click-outside {
  position: fixed;
  inset: 0;
  z-index: 1999; /* one below the panel */
  background: transparent;
  cursor: default;
}
```

**Panel entry animation**:

```css
@keyframes notifPanelIn {
  from { opacity: 0; transform: translateY(-6px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0)   scale(1); }
}

.notif-panel {
  animation: notifPanelIn 0.18s ease;
}
```

---

### 2-E. Mobile responsiveness — proper popup, not full-screen

**Problem**: On mobile the notification panel expands to fill the screen, covering all content behind it.

**Fix**: On viewports ≤ 600px, switch the panel from `position: absolute` to `position: fixed`, anchor it to the top-right corner just below the header, and cap its size.

```css
@media (max-width: 600px) {
  .notif-panel {
    position: fixed;
    top: calc(var(--header-height, 60px) + 6px); /* 6px below header bottom edge */
    right: 8px;
    left: auto;
    width: min(360px, calc(100vw - 16px)); /* max 90vw, never edge-to-edge */
    max-height: 70vh;                       /* never taller than 70% of screen */
    border-radius: 14px;                    /* maintain rounded corners */
  }
}
```

> Do **not** use `width: 100vw`, `left: 0`, `top: 0`, or `height: 100vh` for the notification panel on mobile. These are modal-style values inappropriate for a notification dropdown.

---

## 3. Checklist for QA

After applying all changes, verify:

- [ ] Header shows no text reading "common.roles.Visitor.overview" or any i18n key
- [ ] Logo is visible in the header right side, ~1/6 of header width, transparent background (no white box)
- [ ] Logo is a clickable link; clicking navigates to the correct role-based home route
- [ ] Clicking the bell opens the notification panel; clicking again closes it
- [ ] No close (✕) button exists inside the notification panel
- [ ] Page content is **not** blurred or overlaid when notification panel is open
- [ ] Notification panel has white background, dark text, blue (#0964AC) accent
- [ ] Unread items have a blue left accent bar and lighter blue background
- [ ] Hover states work on all notification items
- [ ] On mobile (≤ 600px), panel is a small popup anchored top-right — not full-screen
- [ ] Clicking outside the panel (on the transparent overlay) closes it
- [ ] Panel appears below the bell button with an 8px gap, no overlap
- [ ] Unread count badge on bell disappears when all items are marked read
