# Phase 0 Deliverable: Current Route Inventory & Gap Analysis

**Generated:** 2026-05-10  
**Source:** `src/current-routes.txt` (47 routes discovered)  
**Target Sitemap:** CFIP Blueprint Section 2.2 (Optimized Sitemap)

---

## CURRENT ROUTES (as found)

### Auth & Public
| Route | Status | Notes |
|-------|--------|-------|
| `/(auth)/page.tsx` | ✓ | Landing page with role selection |
| `/(auth)/login/page.tsx` | ✓ | Login form |
| `/(auth)/forgot-password/page.tsx` | ✓ | Password reset |
| `/(auth)/register/page.tsx` | ✓ | Multi-step registration entry |
| `/(auth)/register/account/page.tsx` | ✓ | Account credentials step |
| `/(auth)/register/personal/page.tsx` | ✓ | Personal data step |
| `/(auth)/register/type/page.tsx` | ✓ | Role selection step |
| `/auth/register/carrier` | ✗ | **MISSING** — Carrier company registration |

### Visitor Portal
| Route | Status | Notes |
|-------|--------|-------|
| `/visitor/home/page.tsx` | ✓ | Dashboard |
| `/visitor/profile/page.tsx` | ✓ | Profile view/edit |
| `/visitor/profile/verify/page.tsx` | ✓ | KYC verification (different route than blueprint) |
| `/visitor/checkout/page.tsx` | ⚠️ | Exists but **NO binding_id param** — needs to become `[binding_id]` |
| `/visitor/home/page.tsx` | ✓ | Dashboard |
| `/visitor/search/page.tsx` | ✓ | Address discovery |
| `/visitor/shipments/page.tsx` | ✓ | Shipment list |
| `/visitor/shipments/new/page.tsx` | ✓ | Create shipment |
| `/visitor/tnas/page.tsx` | ✓ | TNA list |
| `/visitor/tnas/create/page.tsx` | ✓ | **WRONG ROUTE** — should be `/visitor/tna/new` (per blueprint) |
| `/visitor/tnas/[id]/page.tsx` | ✓ | TNA detail |
| `/visitor/tnas/[id]/bind/page.tsx` | ✓ | Binding request wizard |
| `/visitor/tnas/[id]/unbind/page.tsx` ✓ | Unbinding |
| `/visitor/wallet/page.tsx` ✓ | Transaction history |
| `/visitor/profile/kyc` | ✗ | **MISSING** — KYC upload dedicated page |
| `/visitor/tna/new` | ✗ | **MISSING** — canonical route (currently only at `/visitor/tnas/create`) |
| `/visitor/shipments/[id]` | ✗ | **MISSING** — shipment detail with messages/logs |

### Owner Portal
| Route | Status | Notes |
|-------|--------|-------|
| `/owner/home/page.tsx` | ✓ | Dashboard |
| `/owner/properties/page.tsx` | ✓ | Property list |
| `/owner/properties/new/page.tsx` | ✓ | Property registration |
| `/owner/properties/[id]/page.tsx` | ✓ | Property detail |
| `/owner/property/add/page.tsx` | ⚠️ | **DEPRECATED** — duplicate of `/owner/properties/new`, should redirect |
| `/owner/bindings/page.tsx` | ✓ | Binding list |
| `/owner/bindings/[id]/page.tsx` | ✓ | Binding detail |
| `/owner/earnings/page.tsx` | ✓ | Earnings dashboard |
| `/owner/payouts/page.tsx` ✓ | Payout history |
| `/owner/settings/payout/page.tsx` | ✗ | **MISSING** — payout method configuration |
| `/owner/properties/[id]/sub-addresses/new` | ✗ | **MISSING** — sub-address creation |

### Government Portal
| Route | Status | Notes |
|-------|--------|-------|
| `/gov/home/page.tsx` | ✓ | Dashboard |
| `/gov/policy/page.tsx` | ✓ | Policy config |
| `/gov/audit/page.tsx` | ✓ | Audit log |
| `/gov/agencies/page.tsx` | ✓ | Agency management |
| `/gov/verification/queue/page.tsx` | ⚠️ | **DEPRECATED** — replace with `/gov/tna-queue` |
| `/gov/verify/page.tsx` | ⚠️ | **DEPRECATED** — merge into `/gov/tna-queue/[id]` |
| `/gov/queue/page.tsx` | ⚠️ | **DEPRECATED** — TNA queue old name |
| `/gov/queue/[id]/page.tsx` | ⚠️ | **DEPRECATED** — use `/gov/tna-queue/[id]` |
| `/gov/tna-queue` | ✗ | **MISSING** — new canonical TNA queue |
| `/gov/tna-queue/[id]` | ✗ | **MISSING** — TNA review detail |
| `/gov/address-queue` | ✗ | **MISSING** — NEW address verification queue |
| `/gov/address-queue/[id]` | ✗ | **MISSING** — address verification detail |
| `/gov/adjustments` | ✗ | **MISSING** — settlement adjustment approval |

### Carrier Portal
| Route | Status | Notes |
|-------|--------|-------|
| `/carrier/home/page.tsx` | ✓ | Dashboard |
| `/carrier/register/company/page.tsx` | ✓ | Company registration |
| `/carrier/settings/integration/page.tsx` ✓ | API credentials |
| `/carrier/scan/page.tsx` | ✓ | TNA scan (QR/barcode) |
| `/carrier/shipments/page.tsx` | ✓ | Shipment list |
| `/carrier/shipments/new/page.tsx` | ✗ | **MISSING** — register new shipment |
| `/carrier/driver/tasks/page.tsx` | ✓ | Driver task list |
| `/carrier/driver/map/page.tsx` | ✓ | Navigation map |
| `/carrier/reports/page.tsx` | ✓ | Reports |
| `/carrier/fleet/page.tsx` | ⚠️ | **WRONG ENTITY** — uses carrier_vehicles (non-existent). Should be `/carrier/staff` |
| `/carrier/staff/page.tsx` | ✓ | **Exists but mapped to fleet** — needs data fix |
| `/carrier/staff/add/page.tsx` | ✓ | Add staff member |
| `/carrier/resolve` | ✗ | **MISSING** — TNA resolver (critical carrier feature) |
| `/carrier/driver/confirm` | ✗ | **MISSING** — delivery confirmation with OTP/photo |

---

## GAP MATRIX (Blueprint vs Current)

| # | Route | Required By Blueprint | Current Status | Priority |
|---|-------|----------------------|----------------|----------|
| G-01 | `/auth/register/carrier` | Carrier entity onboarding | ✗ MISSING | P0 |
| G-02 | `/visitor/profile/kyc` | KYC document upload | ✗ MISSING | P0 |
| G-03 | `/visitor/tna/new` | TNA issuance (canonical) | ⚠️ WRONG PATH (at `/visitor/tnas/create`) | P0 |
| G-04 | `/visitor/checkout/[binding_id]` | Payment with contract data | ⚠️ NO PARAM (static `/checkout`) | P0 |
| G-05 | `/visitor/shipments/[id]` | Shipment detail view | ✗ MISSING | P1 |
| G-06 | `/owner/properties/[id]/sub-addresses/new` | Sub-address creation | ✗ MISSING | P0 |
| G-07 | `/owner/settings/payout` | Payout method config | ✗ MISSING | P1 |
| G-08 | `/gov/tna-queue` | TNA review queue | ✗ MISSING (old routes exist) | P0 |
| G-09 | `/gov/tna-queue/[id]` | TNA review detail | ✗ MISSING | P0 |
| G-10 | `/gov/address-queue` | Address verification queue | ✗ MISSING (NEW) | P0 |
| G-11 | `/gov/address-queue/[id]` | Address verification detail | ✗ MISSING (NEW) | P0 |
| G-12 | `/gov/adjustments` | Settlement adjustments | ✗ MISSING | P1 |
| G-13 | `/carrier/resolve` | TNA address resolver | ✗ MISSING (CRITICAL for carrier) | P0 |
| G-14 | `/carrier/shipments/new` | Shipment registration | ✗ MISSING | P0 |
| G-15 | `/carrier/driver/confirm` | Delivery confirmation | ✗ MISSING | P0 |
| G-16 | `/carrier/staff` (rename from fleet) | Staff management data fix | ⚠️ WRONG TABLE (carrier_vehicles) | P0 |
| G-17 | `/owner/property/add` | Deprecated duplicate | ⚠️ SHOULD REDIRECT | P2 |
| G-18 | `/gov/verification/queue` | Deprecated old TNA queue | ⚠️ SHOULD REDIRECT | P2 |
| G-19 | `/gov/verify` | Deprecated | ⚠️ SHOULD REDIRECT | P2 |
| G-20 | `/visitor/request` | Deprecated old TNA route | ⚠️ SHOULD REDIRECT | P2 |

---

## ROUTE TYPE BREAKDOWN

- **Stable (✓):** 27 routes — no changes needed
- **Needs Refactor (⚠️):** 7 routes — data fix, route rename, param addition, or redirect setup
- **Missing (✗):** 13 routes — greenfield implementation required

**Total actionable:** 20 routes requiring work in Phases 1–7

---

## IMMEDIATE ACTIONS (Phase 1 prep)

1. Rename `/visitor/tnas/create/page.tsx` → `/visitor/tna/new/page.tsx` (Blueprint canonical)
2. Convert `/visitor/checkout/page.tsx` → `/visitor/checkout/[binding_id]/page.tsx`
3. Rename file system:
   - `carrier/fleet/page.tsx` → `carrier/staff/page.tsx`
4. Set up 301 redirects in `middleware.ts` for deprecated routes (Phase 8)
5. Create feature flag module (complete — see `src/lib/feature-flags.ts`)

---

*End of Phase 0 deliverable. Baseline committed. Ready to proceed to Phase 1.*
