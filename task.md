# TNA Frontend — Implementation Plan (To-Do)

> Generated from the [Implementation Assessment](file:///C:/Users/Kimo%20Store/.gemini/antigravity/brain/ba39a322-bd22-4a06-ad7d-2c6293004738/artifacts/tna_implementation_assessment.md)  
> **Total Estimated Tasks**: 98  
> **Working Directory**: `tna-project/src/`

---

## Phase 0: Foundation 🏗️
> *Priority: BLOCKING — all other work depends on this*

### 0.1 — Design Token System (SPATIAL → Tailwind + CSS)
- [x] Replace all oklch CSS variables in `globals.css` with SPATIAL token set
  - [x] Brand primitives: navy `#02488D`, cyan `#00B4C9`, cyan-light `#18CCE5`
  - [x] 9-step neutral scale (`neutral-50` through `neutral-900`)
  - [x] Semantic status colors: success, error, warning, info, pending (with `-bg` and `-border` variants)
  - [x] Surface levels: `surface-100`, `surface-200`, `surface-300`, `surface-dark-*`
  - [x] Typography vars: `--text-display-*`, `--text-heading-*`, etc.
  - [x] Spacing vars: `--space-1` through `--space-16`
  - [x] Component tokens: button, input, chip, navbar CSS custom properties
- [x] Update `tailwind.config.js` to match SPATIAL spec
  - [x] Replace generic color map with full SPATIAL brand + status + neutral palette
  - [x] Add complete spacing scale (4px base unit, 12 named steps)
  - [x] Add SPATIAL border-radius scale (`xs: 6px` → `pill: 9999px`)
  - [x] Restore box-shadow values (`card`, `modal`, `btn`) — remove `none` overrides
  - [x] Add SPATIAL fontSize entries with line-height + letter-spacing tuples
  - [x] Add `backgroundImage` gradient presets (`btn-primary`, `splash-bg`)
  - [x] Add `height` tokens (`btn-lg: 56px`, `btn-md: 52px`, `input: 52px`, `navbar: 72px`)
- [x] Add `tokens.css` file with all CSS custom properties (deliverable from SPATIAL spec)
- [x] Audit and remove all hardcoded color values in existing pages (e.g., `bg-[#02488D]`, `text-[#00B4C9]`)

### 0.2 — Complete Type System (CFIP Data Model → TypeScript)
- [x] `lib/types/auth.ts` — `User`, `LoginRequest`, `LoginResponse`, `SignupRequest`
- [x] `lib/types/tna.ts` — Expand with full fields: `visitor_id`, `request_status`, `eligibility_snapshot`, `review_decision_reason`, `issued_at`, `expires_at`, `created_at`
- [x] `lib/types/na.ts` — Expand: `owner_national_addresses` full shape including `latitude`, `longitude`, `registry_reference`, `building_number`, `is_verified`
- [x] `lib/types/naOwner.ts` — `Owner`, `OwnerAccount` (wallet_balance, payout info)
- [x] `lib/types/bindings.ts` — `Binding` with `binding_id`, `status`, `start_at`, `end_at`, `visitor_id`, `na_id`
- [x] `lib/types/deliveries.ts` — Expand: `Shipment` with `shipment_id`, `tracking_number`, `status`, `estimated_delivery`, `actual_delivery`, `carrier_id`
- [x] `lib/types/admin.ts` — `GovUser`, `AuditLogEntry`, `PolicyConfiguration`
- [x] Create `lib/types/carrier.ts` — `CarrierStaff`, `CarrierVehicle`, `FleetData` (extract from TNAContext)
- [x] Create `lib/types/index.ts` — barrel export file

### 0.3 — Implement Stub UI Components
- [x] `ui/Badge.tsx` — Status badge with SPATIAL chip tokens (success/pending/warning/unlinked variants)
- [x] `ui/Card.tsx` — Base card with `shadow-card`, `radius-md`, surface-200 background
- [x] `ui/EmptyState.tsx` — Illustration + title + subtitle + optional CTA, per session memory spec
- [x] `ui/ErrorAlert.tsx` — Error banner with `color-error-bg`, `color-error-border` tokens
- [x] `ui/SkeletonCard.tsx` — Animated loading placeholder using neutral-200 shimmer
- [x] `ui/Spinner.tsx` — Branded spinner using `primitive-cyan-mid` + `primitive-navy`
- [x] `ui/ChartPlaceholder.tsx` — Upgrade from static div to basic SVG or Recharts wrapper
- [x] Create `ui/StatusChip.tsx` — Standardized status indicator using `--chip-*` tokens

### 0.4 — Split Monolithic Context / Activate Stores
- [x] Extract `FleetContext.tsx` from TNAContext (vehicles + staff + assignDriver + updateVehicleStatus)
- [x] Extract `GovContext.tsx` from TNAContext (tnaData + updateTnaStatus + activeRole)
- [x] Extract `BindingContext.tsx` from TNAContext (visitorTnas + addVisitorTna + acceptBindingRequest + ownerAccount)
- [x] Implement `lib/store/useAuthStore.ts` — user session, token, role
- [x] Implement `lib/store/useUIStore.ts` — sidebar state, toast queue, modal stack
- [x] Implement `lib/store/useRegistrationStore.ts` — wizard step state for signup
- [x] Implement `lib/store/useLanguageStore.ts` — locale preference, dir
- [x] Update all page imports to use new domain-specific contexts
- [x] Remove monolithic TNAContext after migration is complete

---

## Phase 1: Core Pages (Per Role) 📄
> *Priority: HIGH — brings scaffold pages to functional depth*

### 1.1 — Auth Module
- [x] `(auth)/register/type/page.tsx` — Role selection: Visitor / Owner / Carrier Staff cards
- [x] `(auth)/register/personal/page.tsx` — Personal info form (full_name, nationality, DOB, document_type, document_number, mobile)
- [x] `(auth)/register/account/page.tsx` — Account creation (email, password, confirm) + submit
- [x] Wire all 3 registration steps into a single wizard flow using `useRegistrationStore`
- [x] Add password validation, input masking for phone/document fields
- [ ] Add forgot password / OTP verification placeholder flow

### 1.2 — Visitor Module
- [x] `visitor/home/page.tsx` — Enrich dashboard with:
  - [x] Active TNA count widget with status breakdown
  - [x] Recent shipment activity feed
  - [x] Quick action buttons wired to actual routes (with locale prefix)
- [x] `visitor/search/page.tsx` — Validate search flow against Stitch screens
- [x] `visitor/request/page.tsx` — Validate wizard against Stitch; add eligibility snapshot display
- [x] `visitor/tnas/page.tsx` → Convert to list + drill-down pattern
  - [x] Create `visitor/tnas/[id]/page.tsx` — TNA detail view (lifecycle timeline, linked address, expiry)
- [x] `visitor/shipments/page.tsx` — Full DataTable with tracking_number, status badge, estimated_delivery
- [x] `visitor/checkout/page.tsx` — Payment summary, fee breakdown, confirm CTA
- [x] `visitor/profile/page.tsx` — User profile with document info, account settings
- [x] `visitor/wallet/page.tsx` — Balance display, transaction history, top-up action

### 1.3 — Owner Module
- [x] `owner/home/page.tsx` — Full dashboard:
  - [x] Stat cards from real data (property count, active bindings, wallet balance)
  - [x] Recent binding requests feed
  - [x] Revenue chart using ChartPlaceholder upgrade
- [x] `owner/properties/page.tsx` — Full DataTable with city, district, verification status badge
- [x] `owner/property/add/page.tsx` — Complete multi-step wizard (address → registry ref → building number → upload docs → submit)
- [x] Remove duplicate `owner/properties/new/page.tsx` (consolidate with property/add)
- [x] `owner/bindings/page.tsx` — Full DataTable with status, start/end dates, visitor name, approve/reject actions
- [x] `owner/earnings/page.tsx` — Replace ChartPlaceholder with real chart; add payout history link
- [x] **CREATE** `owner/payouts/page.tsx` — DataTable: payout_id, total_amount, status, payout_method, date filters

### 1.4 — Carrier Module
- [x] `carrier/home/page.tsx` — Full dashboard:
  - [x] Fleet utilization chart (idle vs. on-trip vehicles)
  - [x] Daily delivery stats
  - [x] Active driver count
- [x] `carrier/fleet/page.tsx` — Validate against Stitch; add vehicle status toggle
- [x] `carrier/shipments/page.tsx` — Full DataTable with all CFIP fields; status filters
- [x] **CREATE** `carrier/driver/tasks/page.tsx` — Daily task list: route, TNA code, delivery status, ETA
- [x] **CREATE** `carrier/driver/map/page.tsx` — Wire MapTaskLayout with:
  - [x] Map placeholder (Leaflet or Google Maps stub)
  - [x] Address pin using `latitude`/`longitude` from national address
  - [x] Task sidebar with delivery details
- [x] `carrier/reports/page.tsx` — Delivery completion metrics, issue reports

### 1.5 — Government Module
- [x] `gov/home/page.tsx` — Full dashboard:
  - [x] Verification volume stats (pending, approved, rejected)
  - [x] System health indicators
  - [x] Recent audit log entries
- [x] `gov/verification/queue/page.tsx` — Full DataTable with TNA ID, visitor name, request date, status badge, action buttons
- [x] `gov/verify/page.tsx` — Document viewer panel, decision form (approve/reject with reason), eligibility snapshot
- [x] **CREATE** `gov/policy/page.tsx` — Policy configuration: issuance_mode toggle, eligibility_rules editor, save CTA
- [x] **CREATE** `gov/audit/page.tsx` — DataTable: audit_id, actor_type, action description, timestamp, search/filter
- [x] **CREATE** `gov/agencies/page.tsx` — DataTable: gov_users with full_name, permissions, department, CRUD actions

---

## Phase 2: Integration Layer 🔌
> *Priority: MEDIUM — connects the UI to data sources*

### 2.1 — API Module Implementation
- [x] `lib/api/auth.ts` — `login()`, `signup()`, `logout()`, `refreshToken()`, `forgotPassword()`
- [x] `lib/api/tna.ts` — `getTnas()`, `getTnaById()`, `requestTna()`, `cancelTna()`
- [x] `lib/api/bindings.ts` — `getBindings()`, `approveBinding()`, `rejectBinding()`
- [x] `lib/api/deliveries.ts` — `getShipments()`, `getShipmentById()`, `updateShipmentStatus()`
- [x] `lib/api/naVariants.ts` — `searchAddresses()`, `getAddressById()`, `registerAddress()`
- [x] `lib/api/admin.ts` — `getAuditLog()`, `getPolicyConfig()`, `updatePolicyConfig()`, `getGovUsers()`, `updateGovUser()`
- [x] Add API error handling wrapper with typed error responses
- [x] Add request/response interceptors for auth token injection

### 2.2 — i18n Activation
- [x] Populate `lib/i18n/ar.json` with all UI strings (labels, buttons, messages, statuses)
- [x] Populate `lib/i18n/en.json` with matching English translations
- [x] Replace hardcoded text in core dashboard pages (Visitor, Owner, Carrier, Gov)
- [x] Add namespace organization (auth, visitor, owner, carrier, gov, common)
- [x] Wire `LanguageSwitcher` to actually toggle locale and redirect
- [x] Verify RTL layout flipping for Arabic locale across all templates
- [x] Add date/number formatting with locale-aware utilities

### 2.3 — Navigation & Routing
- [x] Verify all route links use `/${locale}/` prefix consistently (via `LocaleLink`)
- [x] Add role-based route guarding (via `RoleGuard`)
- [x] Wire AppShell sidebar navigation to match sitemap routes per role
- [x] Add breadcrumb support with translated labels
- [x] Implement mobile bottom navigation bars (Visitor, Carrier, Owner, Gov)

---

## Phase 3: Polish & Quality ✨
> *Priority: STANDARD — production readiness*

### 3.1 — Stitch Visual Parity
- [ ] Audit each implemented page against its Stitch screen counterpart
- [ ] Ensure desktop screens use the correct dimensions (1280px content width)
- [ ] Ensure mobile screens implement proper 390px layouts with bottom nav
- [ ] Verify gradient buttons, chip styles, card borders match SPATIAL component specs
- [ ] Implement dark surface variants for nav overlays and headers per SPATIAL spec

### 3.2 — Error, Loading & Empty States
- [ ] Add `Spinner` to all async data-fetching pages
- [ ] Add `SkeletonCard` loading states for dashboard widgets and tables
- [ ] Add `EmptyState` for zero-data scenarios (no properties, no shipments, no TNAs, etc.)
- [ ] Add `ErrorAlert` for API failure scenarios with retry actions
- [ ] Add toast notifications for success/error mutations (approve, reject, create, etc.)

### 3.3 — Responsive & RTL Polish
- [ ] Test all pages at mobile (390px), tablet (768px), and desktop (1280px) breakpoints
- [ ] Verify `rtl:` / `ltr:` Tailwind variants work correctly with locale switching
- [ ] Ensure icon mirroring for directional icons (arrows, chevrons) in RTL
- [ ] Validate form layouts and table layouts in RTL mode

### 3.4 — Testing
- [ ] Set up Vitest test runner with React Testing Library
- [ ] Write unit tests for all UI components (Badge, Card, Button, InputField, Select, etc.)
- [ ] Write unit tests for util functions (`formatDate`, `roleGuard`, `tnaValidator`)
- [ ] Write integration tests for Context providers (Fleet, Gov, Binding)
- [ ] Write page-level smoke tests for critical flows (login, TNA request, fleet management)
- [ ] Add accessibility tests (aria labels, keyboard navigation, focus management)

### 3.5 — Build & Deploy Readiness
- [ ] Run `npm run build` and fix all TypeScript compilation errors
- [ ] Resolve all ESLint warnings
- [ ] Add proper `<title>` and `<meta>` tags to all pages via Next.js metadata
- [ ] Add error boundary components for graceful crash handling
- [ ] Create `README.md` with setup instructions, architecture overview, env var documentation
- [ ] Verify `.env.example` contains all required environment variables

---

## Progress Tracker

| Phase | Total Tasks | Done | Progress |
|---|---|---|---|
| Phase 0: Foundation | 38 | 38 | ▓▓▓▓▓▓▓▓▓▓ 100% |
| Phase 1: Core Pages | 39 | 38 | ▓▓▓▓▓▓▓▓▓▓ 97% |
| Phase 2: Integration | 16 | 14 | ▓▓▓▓▓▓▓▓░░ 87% |
| Phase 3: Polish | 19 | 0 | ░░░░░░░░░░ 0% |
| **Total** | **112** | **90** | ▓▓▓▓▓▓▓▓░░ **80%** |
