# TNA Platform — UX & Flow Fix Strategy
**Target: Production-Finalized Frontend (No Live API)**
**Generated: 2026-05-07 | Version: 1.0**

---

## 0. Prime Directives for the Coding Agent

1. **No real API calls.** All data is mocked via static JSON fixtures or Zustand stores pre-seeded with realistic data.
2. **No structural destruction.** Extend and refactor the existing Next.js App Router codebase (`src/`). Do not rewrite from scratch.
3. **Role context is sacred.** Every page must gate on the Zustand `useAuthStore` role field. Unauthenticated visitors are redirected to `/login`.
4. **RTL + LTR parity.** Every layout fix must work in both `ar` and `en` locale. Use CSS logical properties (`margin-inline`, `padding-inline-start`, etc.).
5. **Mobile-first.** The client's reference design (from `CFIP-V1.5.pdf`) is mobile-centric. Responsive breakpoints: `sm: 390px`, `md: 768px`, `lg: 1280px`.
6. **Wallet is never a primary CTA.** Wallet top-up is embedded inside the payment checkout flow, not a standalone menu item for visitors.

---

## 1. Current-State Audit Summary

### 1.1 What Exists (from `hidden-eagle.md`)

| Area | Status |
|------|--------|
| Next.js App Router + i18n | ✅ Working |
| Auth flow (login / register 3-step) | ✅ Scaffolded |
| Design tokens (CSS vars, Tailwind) | ✅ Implemented |
| RTL logical properties | ✅ Applied |
| Visitor routes (home, wallet, tnas, shipments, profile) | ⚠️ Scaffolded, flow gaps |
| Owner routes (home, properties, bindings, earnings) | ⚠️ Scaffolded, incomplete |
| Carrier routes (home, fleet, shipments, driver) | ⚠️ Scaffolded, incomplete |
| Gov routes (home, verification, audit, policy) | ⚠️ Scaffolded, incomplete |
| Payment / checkout flow | ❌ Missing |
| TNA issuance → bind → payment end-to-end | ❌ Broken / fragmented |
| Wallet as embedded sub-flow | ❌ Wallet exists as standalone page (wrong) |
| `AppShell` deprecation (two copies exist) | ⚠️ Needs cleanup |
| Mock data layer | ❌ Missing |

### 1.2 Critical Flow Gaps

1. **Visitor cannot complete Create TNA → Bind TNA → Pay in one continuous flow.**
2. **Owner has no way to set up sub-addresses (NA variants / 4-letter suffix).**
3. **Carrier lacks a driver-facing delivery confirmation loop.**
4. **Gov verification detail view is absent.**
5. **Wallet top-up appears in the Visitor sidebar as a primary destination** — it must be removed from nav and surfaced only during checkout.

---

## 2. Mock Data Layer (Do This First)

Create `/src/lib/mock/` with the following files. All components consume from here; no real fetch calls.

### 2.1 File Structure

```
src/lib/mock/
├── index.ts            # barrel export
├── auth.mock.ts        # users per role
├── tnas.mock.ts        # visitor TNAs (UNLINKED, ACTIVE, SUSPENDED, EXPIRED)
├── bindings.mock.ts    # binding requests (PENDING, ACTIVE, REJECTED, TERMINATED)
├── properties.mock.ts  # owner NAs + na_variants
├── shipments.mock.ts   # deliveries per TNA
├── carriers.mock.ts    # fleet, drivers, tasks
├── gov.mock.ts         # issuance queue, audit log, policy config
└── financials.mock.ts  # orders, payments, wallet balance
```

### 2.2 Seed Data Rules

- At least **3 TNAs per visitor**: one `ACTIVE` (bound), one `UNLINKED`, one `SUSPENDED`.
- At least **2 properties per owner**, each with **2 na_variants**.
- At least **1 PENDING binding request** waiting for owner approval.
- At least **3 shipments** per carrier in different statuses.
- At least **5 items** in the gov verification queue (mix of `PENDING_REVIEW` and `AUTO_APPROVED`).
- Wallet balance: `SAR 450.00` (visitor), `SAR 12,300.00` (owner).

### 2.3 Custom Hook Pattern

```ts
// src/lib/hooks/useMock.ts
// Each hook returns { data, isLoading, error } to mimic real API shape
// isLoading: simulate 600ms delay with setTimeout
// All mutations (approve, bind, pay) update Zustand store in memory
```

---

## 3. Global UX Fixes

### 3.1 Navigation Overhaul (All Roles)

**Remove from Visitor sidebar/bottom-nav:**
- `Wallet` (standalone link) — replace with wallet balance widget in header only

**Visitor bottom-nav (mobile, 5 tabs):**
```
Home | My TNAs | Shipments | Order Shipment | Menu
```

**Owner bottom-nav (mobile, 4 tabs):**
```
Home | Properties | Bindings | Earnings
```

**Carrier bottom-nav (mobile, 4 tabs):**
```
Home | Fleet | Shipments | Driver Tasks
```

**Gov sidebar (desktop-primary, 5 items):**
```
Dashboard | Verification Queue | TNA Issuance | Address Registry | Agencies | Audit Log
```

### 3.2 Header

All roles share the same `Header.tsx`. Adjust per role:

- **Visitor:** Show wallet balance chip (read-only) + notification bell + avatar.
- **Owner:** Show current balance chip + notification bell + avatar.
- **Carrier:** Show active shipment count chip + notification bell + avatar.
- **Gov:** Show pending review count chip + notification bell + avatar.

Remove the standalone wallet page from the Visitor route tree. The balance chip in the header is the only wallet exposure.

### 3.3 AppShell Cleanup

- Delete `components/shell/AppShell.tsx` (marked DEPRECATED).
- Ensure all routes use `components/layout/AppShell.tsx` only.
- Validate `RoleSidebar` and `BottomNav` receive the correct `role` prop from `useAuthStore`.

### 3.4 Empty States

Every list/table must show `EmptyState.tsx` with a context-specific CTA:
- TNA list empty → "Request Your First TNA" button
- Bindings empty → "Request a Binding" button
- Shipments empty → "Order a Shipment" button

---

## 4. Visitor Role — Full Flow

### 4.1 Page Map (Target)

| Route | Page Title | Purpose |
|-------|-----------|---------|
| `/visitor/home` | Dashboard | Stats + active TNA cards + recent shipments |
| `/visitor/tnas` | My TNAs | List all TNAs with status chips |
| `/visitor/tnas/[id]` | TNA Detail | Status, binding info, actions |
| `/visitor/tnas/create` | Request TNA | Issuance wizard (3 steps) |
| `/visitor/tnas/[id]/bind` | Bind TNA | Search NA → select → period picker |
| `/visitor/tnas/[id]/unbind` | Unbind TNA | Confirmation + block if in-transit |
| `/visitor/shipments` | My Shipments | List shipments by TNA |
| `/visitor/shipments/order` | Order Shipment | Wizard: select TNA → carrier → submit |
| `/visitor/checkout` | Checkout | Fee summary → wallet check → pay |
| `/visitor/profile` | Profile | Personal info, document, change password |

**DELETE:** `/visitor/wallet` page route entirely.

### 4.2 Visitor Home Dashboard

```
┌─────────────────────────────────────────┐
│  HEADER: Balance chip | Bell | Avatar    │
├─────────────────────────────────────────┤
│  HERO BANNER (carousel, 3 slides)        │
│  "Now with TNA — receive shipments..."   │
├─────────────────────────────────────────┤
│  STATS ROW: [Active TNAs] [Shipments]    │
├─────────────────────────────────────────┤
│  SECTION: My TNAs → [Manage Addresses]   │
│  Horizontal scroll card list             │
│  Card: TNA code | status chip | expiry   │
│  [+ Request New TNA] CTA button          │
├─────────────────────────────────────────┤
│  SECTION: Recent Shipments → [View All]  │
│  Last 2 shipment cards                   │
└─────────────────────────────────────────┘
```

### 4.3 TNA Issuance Wizard (`/visitor/tnas/create`)

**Step 1 — Identity Confirmation**
- Display pre-filled identity data from `useAuthStore` (name, document, nationality).
- Checkbox: "I confirm all personal data is correct."
- CTA: "Next →"

**Step 2 — Policy Acknowledgment**
- Show issuance policy summary (from `gov.mock.ts` → `issuance_policy_config`).
- If `issuance_mode === 'AUTONOMOUS'`: show "Your TNA will be issued immediately."
- If `issuance_mode === 'MODERATED'`: show "Your request will be reviewed within 24 hours."
- Checkbox: "I agree to TNA Terms and Conditions."
- CTA: "Submit Request →"

**Step 3 — Result Screen**
- **Auto-approved path:** Display new TNA code in large format (`TNA-XXXX0000`). Confetti animation. Two CTAs: "Bind This TNA" | "Go to Dashboard".
- **Pending review path:** Display status card with `PENDING_REVIEW` badge. CTA: "Go to Dashboard".

**Mock behavior:** 70% of requests auto-approve (random on submit). 30% go pending.

### 4.4 Bind TNA Wizard (`/visitor/tnas/[id]/bind`)

**Guard:** Only available for TNAs with status `UNLINKED`. Show disabled state with tooltip for other statuses.

**Step 1 — Search National Address**
- Search input with mock results list (from `properties.mock.ts`).
- Each result card shows: full address, city, available variants count, owner rating.
- Select → highlight card.

**Step 2 — Select NA Variant + Period**
- Show available na_variants for selected NA (dropdown or card list).
- Date range picker: Start date (today) → End date.
- Show computed fee from mock pricing: `SAR X per day × N days = SAR total`.

**Step 3 — Review & Submit**
- Summary card: TNA code ↔ NA variant code, period, fee.
- CTA: "Submit Binding Request →"
- On submit → redirect to **Checkout** page with pre-populated order.

### 4.5 Checkout Page (`/visitor/checkout`)

```
┌──────────────────────────────────────────┐
│  Order Summary                            │
│  ─────────────────                        │
│  TNA Binding: TNA-XXXX → RDEC8736        │
│  Period: 01/11/2024 → 01/02/2025          │
│  Rental fee:              SAR 450.00      │
│  Issuance fee:            SAR  50.00      │
│  ─────────────────                        │
│  TOTAL:                   SAR 500.00      │
│                                           │
│  💳 Current Wallet Balance: SAR 450.00    │
│  ⚠️  Insufficient — Top Up Required       │
│  [+ Add SAR 50 to Wallet]  ←── ONLY HERE │
│                                           │
│  [Confirm & Pay]                          │
└──────────────────────────────────────────┘
```

**Wallet top-up sub-flow (modal, NOT a page):**
- Amount input (pre-filled with deficit).
- Payment method selector: Credit Card | Apple Pay | STC Pay (mock UI only).
- "Top Up" → updates Zustand wallet balance mock → closes modal → checkout re-evaluates.

**On successful payment:**
- Show success screen: "Binding request submitted! Awaiting owner approval."
- Redirect to `/visitor/tnas/[id]` after 3 seconds.

### 4.6 Unbind TNA (`/visitor/tnas/[id]/unbind`)

**Guard logic (mock):**
- Check `shipments.mock.ts` for any shipment with `status: 'IN_TRANSIT'` linked to this TNA.
- If found: show **red error card** "Cannot unbind — active deliveries in transit" (disabled CTA). This mirrors the CFIP spec rule.
- If clear: show confirmation screen with TNA + linked NA, CTA "Submit Unbind Request".

### 4.7 Order Shipment Wizard (`/visitor/shipments/order`)

**Step 1:** Select TNA (dropdown, only `ACTIVE` / bound TNAs).
**Step 2:** Enter sender info + package details (dimensions, weight, fragile checkbox).
**Step 3:** Select carrier (mock list with price estimates).
**Step 4:** Review + Submit → success confirmation.

---

## 5. Owner Role — Full Flow

### 5.1 Page Map (Target)

| Route | Page Title | Purpose |
|-------|-----------|---------|
| `/owner/home` | Dashboard | Balance, active bindings count, pending requests |
| `/owner/properties` | My Properties | List NAs with variant count |
| `/owner/properties/add` | Add Property | Multi-step address registration wizard |
| `/owner/properties/[id]` | Property Detail | NA details + sub-address manager |
| `/owner/properties/[id]/variants/add` | Add Sub-Address | Create NA variant with 4-letter suffix |
| `/owner/bindings` | Binding Requests | All requests (PENDING, ACTIVE, TERMINATED) |
| `/owner/bindings/[id]` | Binding Detail | Full detail + accept/reject |
| `/owner/earnings` | Earnings | Balance, income chart, payout history |
| `/owner/profile` | Profile | Owner info, verification status |

### 5.2 Owner Home Dashboard

```
┌─────────────────────────────────────────┐
│  HEADER: Balance SAR 12,300 | Bell | Av  │
├─────────────────────────────────────────┤
│  STATS ROW (3 cards):                    │
│  [Total Addresses: 15]                   │
│  [Bound: 13] [Unbound: 2]               │
├─────────────────────────────────────────┤
│  SECTION: My National Addresses          │
│  Horizontal scroll — property cards      │
│  Card: address | variant count | status  │
├─────────────────────────────────────────┤
│  SECTION: Pending Binding Requests       │
│  Mini-cards, newest first, max 3 shown  │
│  [View All →]                            │
└─────────────────────────────────────────┘
```

### 5.3 Property Detail + Sub-Address Manager (`/owner/properties/[id]`)

```
┌──────────────────────────────────────────┐
│  ← Back   Property: RDEC8736             │
│  City: Riyadh | District: Al Malaz      │
│  Status: ✅ Verified                      │
├──────────────────────────────────────────┤
│  Sub-Addresses (NA Variants)             │
│  ─────────────────────────────           │
│  [ROOM] suffix: ROOM — bound to TNA-xxx  │
│  [GRND] suffix: GRND — available         │
│  [+ Add Sub-Address]                     │
└──────────────────────────────────────────┘
```

**Add Sub-Address:** Simple form — 4-letter suffix input (uppercase enforced, pattern `[A-Z]{4}`) + label. Validates uniqueness against existing variants (mock check). On save, appears in list.

### 5.4 Binding Request Review (`/owner/bindings/[id]`)

Replicate the reference UI from `CFIP-V1.5.pdf` page 26 exactly:
- TNA ↔ NA pair display
- Binding period (start → end)
- Reason field
- Owner info section (collapsible)
- Visitor info section (collapsible)
- Two CTAs: **"Accept Binding Request"** (blue) | **"Reject Binding Request"** (red)

On Accept:
- Update mock binding status to `ACTIVE`.
- Show toast: "Binding accepted."
- Redirect to `/owner/bindings`.

On Reject:
- Show modal: reason input (required).
- Update mock status to `REJECTED`.

### 5.5 Earnings Page (`/owner/earnings`)

- Balance card: `SAR 12,300.00` with "Withdraw" button (mock modal).
- Line chart: monthly income (last 6 months) — use `ChartPlaceholder.tsx` or upgrade to recharts.
- Payout history table: date, amount, method, status.

---

## 6. Carrier Role — Full Flow

### 6.1 Page Map (Target)

| Route | Page Title | Purpose |
|-------|-----------|---------|
| `/carrier/home` | Dashboard | Fleet stats, active shipments count |
| `/carrier/fleet` | Fleet & Drivers | Vehicles list + driver assignment |
| `/carrier/fleet/drivers/add` | Register Driver | Form wizard |
| `/carrier/shipments` | Shipments | All shipments, filter by status |
| `/carrier/shipments/[id]` | Shipment Detail | Full tracking + assign driver |
| `/carrier/driver/tasks` | Driver Task Board | Daily task list (driver view) |
| `/carrier/driver/tasks/[id]` | Delivery Confirmation | Scan TNA + confirm delivery |
| `/carrier/support` | Support Chats | Thread list with visitors |
| `/carrier/profile` | Profile | Carrier company info |

### 6.2 Carrier Home Dashboard

```
┌─────────────────────────────────────────┐
│  STATS ROW:                              │
│  [Active Vehicles] [Drivers] [Today's   │
│   Deliveries] [Pending Assignments]     │
├─────────────────────────────────────────┤
│  SECTION: Shipments Needing Assignment  │
│  List of 3 most recent unassigned       │
│  [View All Shipments →]                 │
├─────────────────────────────────────────┤
│  SECTION: Driver Status                  │
│  Mini-list: driver name | current task   │
└─────────────────────────────────────────┘
```

### 6.3 Shipment Detail (`/carrier/shipments/[id]`)

- Shipment header: tracking number, TNA code → linked NA (resolved from mock).
- Package info: dimensions, weight, special notes.
- Status update dropdown: `CREATED` → `IN_TRANSIT` → `DELIVERED` / `RETURNED`.
- Driver assignment: select from available drivers (dropdown, mock fleet).
- "View Delivery Location" button → opens simple mock map placeholder.
- "Contact Visitor" button → opens support chat thread (mock).

### 6.4 Delivery Confirmation (`/carrier/driver/tasks/[id]`)

Replicates `CFIP-V1.5.pdf` pages 27-28:
- Shipment tracking number (large display).
- TNA → NA resolution shown visually.
- Status update with notes textarea.
- "Show Delivery Location" button.
- "Contact Recipient" button.
- "Enter Delivery Code & Confirm" (full-width, primary CTA) → OTP input modal → on submit, status → `DELIVERED`.

### 6.5 Support Chat Thread (`/carrier/support`)

- List of threads, each linked to a shipment + visitor.
- Chat bubble UI (no real socket — pre-seeded messages in mock).
- Input + send button updates local Zustand state.

---

## 7. Gov Role — Full Flow

### 7.1 Page Map (Target)

| Route | Page Title | Purpose |
|-------|-----------|---------|
| `/gov/home` | Dashboard | System health KPIs |
| `/gov/verification/queue` | Issuance Queue | TNA request review list |
| `/gov/verification/[id]` | Review Detail | Document + eligibility review |
| `/gov/tna-issuance` | TNA Issuance | Issue TNA directly (admin path) |
| `/gov/addresses` | Address Registry | View + verify owner-registered NAs |
| `/gov/agencies` | Agencies | Gov user management |
| `/gov/policy` | Issuance Policy | Toggle MODERATED/AUTONOMOUS + rules |
| `/gov/audit` | Audit Log | Immutable action log |
| `/gov/profile` | Profile | Gov user info |

### 7.2 Gov Home Dashboard

```
┌─────────────────────────────────────────┐
│  KPI CARDS (4):                          │
│  [Pending Review: 12] [Auto-Approved]   │
│  [Issued Today: 47]   [Active TNAs: 892]│
├─────────────────────────────────────────┤
│  CHART: Issuance volume (7-day)          │
├─────────────────────────────────────────┤
│  RECENT AUDIT EVENTS (last 5)           │
│  [View Full Audit Log →]                │
└─────────────────────────────────────────┘
```

### 7.3 Verification Queue (`/gov/verification/queue`)

- `DataTableLayout` with columns: Request ID, Visitor Name, Nationality, Submitted At, Mode, Status.
- Filter tabs: `All | PENDING_REVIEW | AUTO_APPROVED | REJECTED`.
- Row click → `/gov/verification/[id]`.

### 7.4 Verification Detail (`/gov/verification/[id]`) — **MISSING, BUILD THIS**

```
┌──────────────────────────────────────────┐
│  ← Back   Review Request: REQ-00123      │
├──────────────────────────────────────────┤
│  APPLICANT INFO                          │
│  Name: Abdullah Omar Al-Ghamdi           │
│  Document: Passport | No: AB123456       │
│  Nationality: Saudi Arabia               │
│  Submitted: 2024-10-15 09:00             │
├──────────────────────────────────────────┤
│  ELIGIBILITY SNAPSHOT (from mock JSON)   │
│  Visa status: Valid tourist visa         │
│  Iqama: N/A                              │
│  Max TNAs allowed: 3 | Current: 1        │
│  Result: ✅ Eligible (auto path)         │
├──────────────────────────────────────────┤
│  UPLOADED DOCUMENTS                      │
│  [📄 Passport Scan] [📄 Visa Copy]       │
│  (FileUpload.tsx in view-only mode)      │
├──────────────────────────────────────────┤
│  DECISION                                │
│  [Approve Request] (blue)               │
│  [Reject Request]  (red) → reason modal │
└──────────────────────────────────────────┘
```

### 7.5 Issuance Policy (`/gov/policy`)

- Toggle: `MODERATED` | `AUTONOMOUS` (large switch, prominent).
- Rules JSON editor (simple key-value form, not raw JSON):
  - Max active TNAs per visitor: `[number input]`
  - Auto-approve if: visa valid (checkbox), iqama valid (checkbox)
  - Route to review if: max TNAs exceeded (checkbox)
- "Save Policy" button → toast confirmation + mock store update.

---

## 8. Auth Flow Fixes

### 8.1 Registration Wizard — Role Selection Step

The type selection step (from `CFIP-V1.5.pdf` pages 16-17) must map to roles:

**Individuals (أفراد):**
- `مستخدم - زائر أو سائح` → role: `Visitor`
- `مستخدم - مالك لعنوان وطني` → role: `Owner`

**Business (أعمال):**
- `الجهات اللوجستية` → role: `Carrier`
- `الجهات الحكومية` → role: `Gov`

After selecting role, subsequent form steps should show role-specific fields:
- **Visitor/Owner:** Full name, document type, document number, DOB, mobile.
- **Carrier:** Company name, CR number, contact person, mobile.
- **Gov:** Full name, employee ID, department, supervisor name.

### 8.2 Post-Login Redirect

On login, read role from `useAuthStore` and redirect:
- `Visitor` → `/visitor/home`
- `Owner` → `/owner/home`
- `Carrier` → `/carrier/home`
- `Gov` → `/gov/home`

### 8.3 Mock Login Credentials (for testing)

Add a "Quick Login" dev panel (only shown if `NODE_ENV === 'development'`):
```
Visitor: visitor@tna.test / any
Owner:   owner@tna.test / any
Carrier: carrier@tna.test / any
Gov:     gov@tna.test / any
```

---

## 9. Component Refactoring Checklist

### 9.1 Components to Build (New)

| Component | Location | Purpose |
|-----------|----------|---------|
| `WalletBalanceChip` | `components/ui/` | Header balance display, click → checkout context |
| `TNAStatusChip` | `components/ui/` | Status badge (UNLINKED/ACTIVE/SUSPENDED/EXPIRED) |
| `TNACard` | `components/modules/visitor/` | Horizontal scroll card |
| `BindingRequestCard` | `components/modules/owner/` | Binding queue item |
| `ShipmentCard` | `components/modules/visitor/` | Shipment list item |
| `PropertyVariantList` | `components/modules/owner/` | NA variant manager |
| `DeliveryConfirmModal` | `components/modules/carrier/` | OTP entry for delivery |
| `PolicyToggle` | `components/modules/gov/` | MODERATED/AUTONOMOUS switch |
| `WalletTopupModal` | `components/modules/visitor/` | Top-up sub-flow modal |
| `ChatThread` | `components/modules/carrier/` | Support chat UI |
| `EligibilitySnapshotCard` | `components/modules/gov/` | Read-only eligibility display |

### 9.2 Components to Refactor (Existing)

| Component | Change |
|-----------|--------|
| `RoleSidebar` | Remove Wallet link from Visitor nav |
| `BottomNav` | Update Visitor tabs per §3.1 |
| `Header` | Add balance chip, make role-aware |
| `AppShell` (layout) | Remove dead shell import from `shell/` |
| `DataTableLayout` | Add filter tab row prop |
| `FileUpload` | Add `viewOnly` prop for gov verification |

### 9.3 Components to Delete

- `components/shell/AppShell.tsx` (DEPRECATED, already marked)
- `/visitor/wallet/page.tsx` (route deleted, wallet embedded in checkout)

---

## 10. Design Polish Tasks

### 10.1 Visual Identity Reference

From `CFIP-V1.5.pdf` mobile screens:
- **Primary:** Blue gradient `#1A78C2` → `#2196F3`
- **Accent / Warning:** Gold/Orange `#F5A623`
- **Success:** Green `#27AE60`
- **Error:** Red `#E53935`
- **Background:** Light gray `#F5F5F5` with white cards
- **Borders:** Rounded `24px` on main CTAs, `12px` on cards
- **Logo:** "العنوان الوطني المؤقت / Temporary National Address" bilingual header

### 10.2 Specific Polish Items

1. **CTA Buttons:** All primary CTAs must use the blue gradient with `border-radius: 24px`. Pill shape, not rectangular.
2. **TNA Code Display:** Always render in blue (`#1A78C2`), bold, monospace font.
3. **Status Chips:** Use colored dot + label pattern (green = bound, gray = unlinked, orange = pending, red = suspended).
4. **Cards:** White background, `border-radius: 12px`, subtle `box-shadow: 0 2px 8px rgba(0,0,0,0.08)`.
5. **Section Headers:** Icon + Arabic label right-aligned, "View All" link left-aligned (RTL layout).
6. **Logo:** Check that the bilingual TNA logo renders correctly in both `en` and `ar` layouts.
7. **Confirm/Reject button pair:** Always: Reject left (red outlined), Confirm right (blue filled).
8. **Loading states:** All data loads must show `SkeletonCard` for 600ms before content.

---

## 11. Implementation Sequence

Execute in this exact order to avoid breaking the app:

```
Phase 1 — Foundation (1-2 days)
  □ Build /src/lib/mock/ data layer + useMock hooks
  □ Add mock login credentials + dev quick-login panel
  □ Delete deprecated AppShell + wallet route
  □ Fix navigation per role (sidebar + bottom nav)
  □ Add WalletBalanceChip to Header

Phase 2 — Visitor Critical Path (2-3 days)
  □ TNA Issuance Wizard (3-step)
  □ TNA List page + TNACard component
  □ TNA Detail page (with status-aware actions)
  □ Bind TNA Wizard (3-step, NA search + variant + period)
  □ Unbind TNA page (with in-transit guard)
  □ Checkout page + WalletTopupModal
  □ Order Shipment Wizard

Phase 3 — Owner Critical Path (1-2 days)
  □ Owner Home Dashboard
  □ Properties list + Property Detail + variant manager
  □ Add Sub-Address form
  □ Binding Requests list
  □ Binding Detail with Accept/Reject
  □ Earnings page with chart

Phase 4 — Carrier & Gov (2 days)
  □ Carrier Dashboard
  □ Fleet + Driver registration
  □ Shipment detail + driver assignment
  □ Driver Task Board + Delivery Confirmation modal
  □ Support Chat thread
  □ Gov Dashboard
  □ Verification Queue + Detail view (BUILD FROM SCRATCH)
  □ Issuance Policy page
  □ Audit Log table
  □ Agencies management

Phase 5 — Auth + Cross-cutting (1 day)
  □ Registration wizard role-specific field branching
  □ Post-login role redirect
  □ Profile pages (all 4 roles)
  □ RTL/LTR parity pass
  □ Empty states across all lists
  □ Toast notifications for all mutations

Phase 6 — Polish + QA (1 day)
  □ Design polish pass (buttons, chips, cards, typography)
  □ Mobile responsive check at 390px
  □ Loading skeleton pass (all data loads)
  □ Error state pass (all forms)
  □ i18n key audit (no hard-coded Arabic/English strings)
```

---

## 12. User Flow Test Strategy

### 12.1 Test Types Required

| Type | Tool Suggestion | Coverage |
|------|-----------------|---------|
| **Unit tests** | Jest + React Testing Library | Individual component props/state |
| **Integration tests** | RTL + mock stores | Full page render + interactions |
| **E2E flow tests** | Playwright | Complete user journeys (listed below) |
| **Visual regression** | Playwright screenshots | Design polish consistency |
| **Accessibility** | axe-core via Playwright | WCAG 2.1 AA compliance |

### 12.2 Critical E2E Test Scenarios (Playwright)

**Visitor Flows:**
```
VIS-01: Register as Visitor → Login → Request TNA (auto-approve) → View TNA code
VIS-02: Register as Visitor → Login → Request TNA (pending review) → View pending status
VIS-03: Login → Bind TNA (UNLINKED) → Search NA → Select variant → Checkout → Pay
VIS-04: Login → Attempt Unbind → TNA has in-transit shipment → See blocked message
VIS-05: Login → Attempt Unbind → No in-transit shipments → Submit unbind → Success
VIS-06: Login → Order Shipment → Select TNA → Select carrier → Submit → Confirm
VIS-07: Checkout with insufficient wallet → Top up via modal → Pay successfully
```

**Owner Flows:**
```
OWN-01: Login → Add Property → Fill address form → Submit → See in list
OWN-02: Login → Open Property → Add Sub-address (4-letter suffix) → See in variant list
OWN-03: Login → View Pending Binding → Accept → See status change to ACTIVE
OWN-04: Login → View Pending Binding → Reject (with reason) → See REJECTED
OWN-05: Login → View Earnings → Trigger withdraw modal → Confirm
```

**Carrier Flows:**
```
CAR-01: Login → View Unassigned Shipment → Assign Driver → See status updated
CAR-02: Login → Driver Task view → Enter delivery code → Confirm delivery → DELIVERED
CAR-03: Login → Register new Driver → Fill form → See driver in fleet
```

**Gov Flows:**
```
GOV-01: Login → Verification Queue → Open PENDING_REVIEW item → Approve → Status changes
GOV-02: Login → Verification Queue → Open item → Reject with reason → Status REJECTED
GOV-03: Login → Policy page → Toggle to AUTONOMOUS → Save → Toast confirmation
GOV-04: Login → Audit Log → Filter by actor type → See filtered results
GOV-05: Login → Agencies → Add new agency user → See in list
```

**Auth Flows:**
```
AUTH-01: Register as Visitor (full 3-step wizard) → Auto-redirect to visitor/home
AUTH-02: Register as Carrier (business path) → Auto-redirect to carrier/home
AUTH-03: Login with wrong credentials → See error message
AUTH-04: Post-login role routing (4 tests, one per role)
```

### 12.3 Test File Structure

```
tests/
├── e2e/
│   ├── visitor/
│   │   ├── tna-issuance.spec.ts
│   │   ├── tna-binding.spec.ts
│   │   ├── tna-unbinding.spec.ts
│   │   ├── checkout.spec.ts
│   │   └── shipment-order.spec.ts
│   ├── owner/
│   │   ├── property-management.spec.ts
│   │   └── binding-review.spec.ts
│   ├── carrier/
│   │   ├── fleet-management.spec.ts
│   │   └── delivery-confirmation.spec.ts
│   ├── gov/
│   │   ├── verification-queue.spec.ts
│   │   └── policy-management.spec.ts
│   └── auth/
│       └── registration-login.spec.ts
├── unit/
│   ├── components/
│   └── hooks/
└── visual/
    └── screenshots/
```

### 12.4 Mock Intercept Pattern for E2E

Since there is no real API, Playwright tests should:
1. Seed Zustand stores via `page.evaluate()` before each test.
2. Assert on DOM state and navigation, not network calls.
3. Use `data-testid` attributes on all interactive elements.

**Add `data-testid` to these elements at minimum:**
- All form inputs
- All primary CTAs
- All status chips
- All navigation items
- All modal triggers

---

## 13. Acceptance Checklist

Before marking the frontend as production-finalized, verify:

**Functional:**
- [ ] All 4 roles can log in and are routed to correct home
- [ ] Visitor: TNA issuance → bind → pay flow works end-to-end
- [ ] Owner: Accept/reject binding request works
- [ ] Carrier: Delivery confirmation flow works
- [ ] Gov: Approve/reject verification works + policy toggle
- [ ] Wallet top-up is accessible ONLY from checkout, not sidebar
- [ ] Unbind is blocked when in-transit shipments exist (mock check)
- [ ] All empty states show with correct CTAs
- [ ] All loading states show skeletons before data

**Design:**
- [ ] Blue gradient CTAs (pill-shaped, 24px radius)
- [ ] TNA codes render in blue monospace
- [ ] Status chips use correct color scheme
- [ ] Bilingual logo renders in both locales
- [ ] RTL layout correct at all breakpoints
- [ ] Mobile bottom-nav tabs correct per role

**Quality:**
- [ ] No hard-coded strings (all via i18n keys)
- [ ] No console errors in production build
- [ ] `AppShell` (shell/) deleted, no dead imports
- [ ] All routes are role-guarded via `RoleGuard`
- [ ] 26 sitemap routes are all accessible with mock data

---

*End of Strategy Document*
*Hand this file to your coding agent and execute Phase by Phase.*
