# CFIP — UX/UI & User-Flow Refactor Blueprint
**Document Version:** 1.0 | **Author:** Product Manager & UX Architect Analysis  
**Source Documents:** CFIP-V1.5 spec, Data Model v2.1, hidden-eagle.md, sitemap_final.json  
**Date:** May 2026

---

## CROSS-DOCUMENT DIVERGENCE AUDIT (Pre-Analysis)

Before diving into phases, the following critical misalignments were identified by reconciling all four documents:

| # | Gap | Location | Impact |
|---|-----|----------|--------|
| G-01 | `na_sub_addresses` requires `gov_users` verification before binding — **no UI route exists** for this in sitemap | Sitemap ↔ Data Model | **CRITICAL** — Binding flow is blocked |
| G-02 | `financial_transactions` → `rent_contracts` → `ledger_entries` flow entirely absent from sitemap; `/visitor/checkout` maps to `payouts` (wrong table) | Sitemap ↔ Data Model | **CRITICAL** — Checkout broken |
| G-03 | Carrier entity onboarding (`carriers` table: api_key, CR, license) has no UI route | Sitemap ↔ Data Model | **HIGH** — Carrier can't be registered |
| G-04 | `visitor.kyc_status` (PENDING/VERIFIED/REJECTED) has no verification UI route in sitemap | Sitemap ↔ hidden-eagle | **HIGH** — KYC flow disconnected |
| G-05 | Sitemap maps `/carrier/fleet` to `carrier_vehicles` table — **table doesn't exist** in data model v2.1 | Sitemap ↔ Data Model | **HIGH** — Broken API contract |
| G-06 | `government_agencies` table (hierarchy, permissions) absent from `/gov/agencies` mapping | Sitemap ↔ Data Model | **MEDIUM** — Gov RBAC incomplete |
| G-07 | `shipment_messages` table (visitor ↔ carrier messaging) has no UI surface | Data Model | **MEDIUM** — Feature gap |
| G-08 | `settlement_adjustments` (requires approval workflow) has no admin UI route | Data Model | **MEDIUM** — Financial reconciliation gap |
| G-09 | `/owner/bindings` doesn't include `rent_contract_id` — owners can't see their contract financial split | Sitemap ↔ Data Model | **MEDIUM** — Owner revenue opacity |
| G-10 | `tna_issuance_requests.supporting_documents` (JSON array of doc URLs) has no upload UI | Spec PDF ↔ Sitemap | **MEDIUM** — Document submission broken |
| G-11 | Auth store has conflicting field `doc_number` vs `document_number` (data model uses `document_number`) | hidden-eagle ↔ Data Model | **LOW** — Type mismatch |
| G-12 | `GovContext` provides hardcoded mock `tnaData` while Zustand has real `role` — dual source-of-truth | hidden-eagle | **LOW** — State divergence |

---

# PHASE 1: USER PERSONA & REQUIREMENT MAPPING

## 1.1 User Role Definitions

### PERSONA 1 — The Visitor (Foreign National / Tourist)
**Backend Role:** `VISITOR` | **Primary Route:** `/visitor/home`

**Profile:**
- Foreign national (tourist, business traveler, Hajj/Umrah pilgrim) with limited permanent presence
- Likely bilingual but Arabic-dominant; relies on RTL-first interface
- Uses smartphone as primary device; low technical proficiency
- Has urgent, time-sensitive needs (package arrivals, government services)

**Goals:**
1. Obtain a TNA code as quickly as possible after arrival
2. Link TNA to a physical address so shipments are deliverable
3. Track incoming packages in real time
4. Pay for services seamlessly (no friction at checkout)

**Pain Points:**
- Confusion between "TNA issuance request" (gov approval) vs. "binding request" (owner approval) — two separate approval gates
- Anxiety about TNA expiry while shipments are in transit
- Opaque payment process — no clear quote before committing
- KYC verification blocking TNA issuance — no feedback on status

**Technical Proficiency:** Low–Medium  
**Primary Device:** Mobile (portrait, RTL)

---

### PERSONA 2 — The Owner (National Address Holder)
**Backend Role:** `OWNER` | **Primary Route:** `/owner/home`

**Profile:**
- Saudi national or business entity owning a registered property
- Business-oriented; treats address rental as passive income stream
- Expects bank-grade financial transparency
- Uses both web (desktop for earnings management) and mobile (binding approvals on the go)

**Goals:**
1. Register properties and sub-addresses with minimal friction
2. Review and approve/reject binding requests from visitors quickly
3. Understand exactly how much they earn per binding
4. Receive reliable, timely payouts to their bank account

**Pain Points:**
- Property verification process (`ownership_proof_status` flow) is opaque — no feedback timeline
- Sub-address management is disconnected from property management
- No clear breakdown of gross → platform_fee → authority_share → net payout
- Binding approval requires understanding visitor KYC status

**Technical Proficiency:** Medium  
**Primary Device:** Mobile (approvals), Desktop (financial reporting)

---

### PERSONA 3 — The Government User (Authority Reviewer)
**Backend Role:** `GOV_USER` | **Primary Route:** `/gov/home`

**Profile:**
- Civil servant in MOFA, MOI_PASSPORT, MOI_IMMIGRATION, MOMRA, or CUSTOMS
- Compliance-driven; values structure, audit trails, and decision accountability
- Uses desktop exclusively; processes high volume of requests daily
- Role varies: REVIEWER → APPROVER → ADMIN → AUDITOR (different permissions per role)

**Goals:**
1. Process TNA issuance queue efficiently (approve/reject with reason codes)
2. Verify national address sub-addresses before they can be used in bindings
3. Configure issuance policy (MODERATED vs AUTONOMOUS, eligibility rules)
4. Access immutable audit log for compliance reporting

**Pain Points:**
- No separation between TNA review queue and address verification queue (both need distinct UX)
- Policy configuration currently maps to a static detail view — needs a proper form interface
- Audit log has no filtering or export capability in the current sitemap
- Agency hierarchy management (parent_agency_id) has no visual representation

**Technical Proficiency:** Medium–High  
**Primary Device:** Desktop (web portal)

---

### PERSONA 4 — The Carrier Staff (Logistics Operator)
**Backend Role:** `CARRIER_STAFF` | **Primary Route:** `/carrier/home`

**Profile:**
- Driver or dispatcher at a logistics company (Aramex, DHL, SMSA equivalent)
- Extremely time-pressured; needs instant TNA-to-address resolution
- Driver is mobile-only (in-van tablet/phone); dispatcher is desktop
- Company entity (`carriers` table) must be pre-registered and verified with API credentials

**Goals (Driver):**
1. Scan or enter a TNA code and immediately get the physical address
2. Navigate to the delivery location on a map
3. Confirm delivery with recipient code / photo proof
4. Communicate with recipient if delivery issues arise

**Goals (Dispatcher/Manager):**
1. Monitor all active shipments assigned to carrier
2. Register new shipments against TNA codes
3. Manage fleet roster (staff members)
4. Access delivery reports and success rates

**Pain Points:**
- No carrier company registration flow — API credentials (`api_key`, `api_secret_hash`) can't be obtained
- TNA resolution failure (unlinked TNA) gives no actionable guidance
- Driver map (`/carrier/driver/map`) has no offline fallback for poor connectivity
- Fleet management uses `carrier_vehicles` (non-existent table) — crashes on API call

**Technical Proficiency:** Medium (dispatcher), Low (driver)  
**Primary Device:** Mobile (driver), Desktop (dispatcher)

---

## 1.2 Granular Feature Matrix

### Visitor Feature Matrix

| Feature | Route | Data Tables | Priority |
|---------|-------|-------------|----------|
| Register account (Visitor type) | `/auth/register` | `users`, `visitors` | P0 |
| KYC document upload & status tracking | `/visitor/profile/kyc` | `visitors.kyc_status`, `tna_issuance_requests.supporting_documents` | P0 |
| Request new TNA (with document upload) | `/visitor/tna/new` | `tna_issuance_requests`, `visitor_tnas` | P0 |
| View all TNAs with status badges | `/visitor/tnas` | `visitor_tnas`, `tna_issuance_requests` | P0 |
| TNA detail — lifecycle, binding status | `/visitor/tnas/[id]` | `visitor_tnas`, `bindings`, `rent_contracts` | P0 |
| Search available addresses to link | `/visitor/search` | `owner_national_addresses`, `na_sub_addresses` | P0 |
| Request binding (TNA → sub-address) | `/visitor/tnas/[id]/bind` | `bindings`, `na_sub_addresses` | P0 |
| Get price quote before paying | `/visitor/tnas/[id]/bind/quote` | `price_catalog`, `rent_contracts` | P0 |
| Payment checkout (financial transaction) | `/visitor/checkout/[binding_id]` | `financial_transactions`, `rent_contracts` | P0 |
| Track incoming shipments | `/visitor/shipments` | `shipments`, `shipment_status_logs` | P0 |
| Shipment detail with messages | `/visitor/shipments/[id]` | `shipments`, `shipment_messages`, `shipment_status_logs` | P1 |
| Unbind TNA from address | `/visitor/tnas/[id]/unbind` | `bindings` (checks in-transit shipments) | P0 |
| Transaction history & receipts | `/visitor/wallet` | `financial_transactions`, `ledger_entries` | P1 |
| Profile management | `/visitor/profile` | `visitors`, `users` | P1 |

---

### Owner Feature Matrix

| Feature | Route | Data Tables | Priority |
|---------|-------|-------------|----------|
| Register account (Owner type) | `/auth/register` | `users`, `owners` | P0 |
| Owner dashboard (stats + balance) | `/owner/home` | `owners`, `owner_accounts`, `bindings` | P0 |
| Property list with verification status | `/owner/properties` | `owner_national_addresses` | P0 |
| Add new property (with deed upload) | `/owner/properties/new` | `owner_national_addresses` (incl. `title_deed_reference`) | P0 |
| Property detail & sub-address management | `/owner/properties/[id]` | `owner_national_addresses`, `na_sub_addresses` | P0 |
| Add sub-address to property | `/owner/properties/[id]/sub-addresses/new` | `na_sub_addresses` | P0 |
| Sub-address verification status tracking | `/owner/properties/[id]/sub-addresses/[sub_id]` | `na_sub_addresses.is_verified`, `verified_by_gov_user_id` | P1 |
| Binding management (all) | `/owner/bindings` | `bindings`, `rental_status_history` | P0 |
| Binding detail (incl. contract split) | `/owner/bindings/[id]` | `bindings`, `rent_contracts`, `ledger_entries` | P0 |
| Approve binding request | `/owner/bindings/[id]` (action) | `bindings`, `rent_contracts` | P0 |
| Reject binding request | `/owner/bindings/[id]` (action) | `bindings` | P0 |
| Terminate binding (in-transit check) | `/owner/bindings/[id]` (action) | `bindings`, `shipments` | P0 |
| Earnings dashboard (balance, pending) | `/owner/earnings` | `owner_accounts`, `rent_contracts` | P0 |
| Payout history | `/owner/payouts` | `payout_records` | P0 |
| Update payout method | `/owner/settings/payout` | `owner_accounts.payout_details` | P1 |

---

### Government User Feature Matrix

| Feature | Route | Data Tables | Priority |
|---------|-------|-------------|----------|
| Gov dashboard (queue volumes, metrics) | `/gov/home` | `tna_issuance_requests`, `na_sub_addresses`, `admin_audit_log` | P0 |
| TNA issuance request queue | `/gov/tna-queue` | `tna_issuance_requests`, `visitors` | P0 |
| TNA request detail + approve/reject | `/gov/tna-queue/[id]` | `tna_issuance_requests`, `visitors`, `supporting_documents` | P0 |
| Address sub-address verification queue | `/gov/address-queue` | `na_sub_addresses`, `owner_national_addresses`, `owners` | P0 |
| Address verification detail | `/gov/address-queue/[id]` | `na_sub_addresses`, `owner_national_addresses` | P0 |
| Issuance policy configuration | `/gov/policy` | `issuance_policy` | P0 |
| Audit log browser (filterable) | `/gov/audit` | `admin_audit_log`, `user_activity_log` | P0 |
| Agency & user management | `/gov/agencies` | `government_agencies`, `gov_users` | P1 |
| Agency hierarchy view | `/gov/agencies/[id]` | `government_agencies` (self-referencing) | P2 |
| Settlement adjustment approval | `/gov/adjustments` | `settlement_adjustments` | P1 |

---

### Carrier Staff Feature Matrix

| Feature | Route | Data Tables | Priority |
|---------|-------|-------------|----------|
| Carrier company registration | `/auth/register/carrier` | `carriers` (CR, license, api_key) | P0 |
| Staff account creation | `/auth/register` | `users`, `carrier_staff`, `carriers` | P0 |
| Carrier dashboard (metrics) | `/carrier/home` | `carriers`, `carrier_staff`, `shipments` | P0 |
| TNA resolver (scan/enter → address) | `/carrier/resolve` | `visitor_tnas`, `bindings`, `na_sub_addresses`, `owner_national_addresses` | P0 |
| Shipment registration (TNA-addressed) | `/carrier/shipments/new` | `shipments`, `visitor_tnas` | P0 |
| Shipment list (all company shipments) | `/carrier/shipments` | `shipments` | P0 |
| Shipment detail + status update | `/carrier/shipments/[id]` | `shipments`, `shipment_status_logs`, `shipment_messages` | P0 |
| Driver: Daily task list | `/carrier/driver/tasks` | `shipments`, `visitor_tnas` | P0 |
| Driver: Delivery map navigation | `/carrier/driver/map` | `owner_national_addresses` (lat/lng), `shipments` | P0 |
| Driver: Delivery confirmation | `/carrier/driver/confirm` | `shipments.delivery_signature`, `delivery_photo_url` | P0 |
| Staff roster management | `/carrier/staff` | `carrier_staff`, `carriers` | P1 |
| API integration settings | `/carrier/settings/integration` | `carriers.api_key`, `webhook_url` | P1 |

---

## 1.3 Dashboard Optimization — High-Frequency Actions

### Visitor Home Dashboard
**HFA-1:** TNA status chip (UNLINKED / ACTIVE / EXPIRED) — inline CTA "Link Now" or "Request TNA"  
**HFA-2:** Active shipments count with latest status update  
**HFA-3:** Binding expiry countdown (days remaining)  
**HFA-4:** Quick-action: "Create New TNA" floating button  

**Dashboard Primary Components:**
- `TNA Status Card` (tna_code, status badge, expires_at, binding status)
- `Shipments Feed` (last 3 shipments: carrier, tracking number, estimated_delivery, TNA code)
- `Pending Actions Banner` (KYC verification pending / payment required / binding approval pending)

---

### Owner Home Dashboard
**HFA-1:** Pending binding requests (count + quick approve/reject)  
**HFA-2:** Wallet balance (current_balance + pending_balance)  
**HFA-3:** Properties with unverified sub-addresses (action: "Follow Up")  
**HFA-4:** Recent earnings (last 7 days from ledger_entries)  

**Dashboard Primary Components:**
- `Wallet Balance Widget` (owner_accounts: current_balance, pending_balance, total_earned)
- `Binding Requests Feed` (PENDING bindings with visitor TNA + requested period + quick action buttons)
- `Property Health Panel` (na count, verified sub-addresses, active bindings count)

---

### Government Dashboard
**HFA-1:** TNA review queue depth (PENDING count)  
**HFA-2:** Address verification queue depth (unverified na_sub_addresses)  
**HFA-3:** Auto-approval rate (AUTONOMOUS vs MODERATED split, last 30 days)  
**HFA-4:** Recent audit events (last 5 from admin_audit_log)  

**Dashboard Primary Components:**
- `Queue Metrics Panel` (TNA pending, address pending, rejected today, approved today)
- `Recent Activity Feed` (admin_audit_log: last 5 entries)
- `Policy Status Banner` (issuance_mode, max_active_tnas_per_visitor)

---

### Carrier Home Dashboard
**HFA-1:** Active deliveries count with status breakdown  
**HFA-2:** TNA resolver quick-scan (immediate resolution without navigating away)  
**HFA-3:** Failed/returned shipments requiring action  
**HFA-4:** Staff on-duty count  

**Dashboard Primary Components:**
- `Live Delivery Metrics` (IN_TRANSIT, OUT_FOR_DELIVERY, DELIVERED today, FAILED)
- `Quick TNA Resolver` (inline scan/enter → shows physical address instantly)
- `Staff Activity Panel` (carrier_staff active today)

---

# PHASE 2: STRUCTURAL RE-ARCHITECTING

## 2.1 Logic-Driven User Flow Pipeline

### FLOW A — Visitor End-to-End Journey

```
REGISTER
└── /auth/register
    ├── Step 1: Account Type Selection (VISITOR)
    ├── Step 2: Personal Data (full_name, nationality, DOB, document_type, document_number, mobile)
    │          → writes: users + visitors
    └── Step 3: Account Credentials (username, email, password)
               → writes: users.password_hash, is_active=TRUE

KYC VERIFICATION (prerequisite for TNA issuance)
└── /visitor/profile/kyc
    ├── Upload supporting documents (VISA / IQAMA / PASSPORT scan)
    │   → writes: tna_issuance_requests.supporting_documents
    └── Await gov review → visitors.kyc_status (PENDING → VERIFIED)
    [If REJECTED: re-upload with clarification notes]

TNA ISSUANCE
└── /visitor/tna/new
    ├── System checks: kyc_status=VERIFIED + active_tnas < max_active_tnas_per_visitor
    ├── Policy check: issuance_mode
    │   ├── AUTONOMOUS: eligibility_rules evaluated → AUTO_APPROVED → TNA issued immediately
    │   └── MODERATED: tna_issuance_requests.status=PENDING_REVIEW → awaits gov approval
    └── On APPROVED: visitor_tnas created (status=UNLINKED, tna_code generated)

ADDRESS DISCOVERY & BINDING REQUEST
└── /visitor/search
    ├── Browse owner_national_addresses (city/district filter)
    ├── View sub-addresses (na_sub_addresses where is_verified=TRUE, is_available=TRUE)
    └── /visitor/tnas/[id]/bind
        ├── Select TNA + Select na_sub_address
        ├── Choose rental period (DAILY/MONTHLY/YEARLY + duration)
        ├── → GET price quote from price_catalog
        └── Submit binding request → bindings.status=PENDING

PAYMENT FLOW (CRITICAL PATH - payment gates activation)
└── /visitor/checkout/[binding_id]
    ├── Display rent_contracts (gross_amount, platform_fee, authority_share, net_owner_amount)
    ├── Initiate financial_transaction (status=PENDING)
    ├── Payment gateway integration → webhook confirmation
    └── On financial_transaction.status=PAID:
        → bindings.status=ACTIVE
        → rent_contracts.status=ACTIVE
        → ledger_entries created (double-entry)
        → owner_accounts.pending_balance updated
        → visitor_tnas.status=ACTIVE

SHIPMENT TRACKING
└── /visitor/shipments
    ├── View all shipments addressed to visitor's TNAs
    ├── /visitor/shipments/[id]
    │   ├── Status timeline (shipment_status_logs)
    │   ├── Package details
    │   └── Message carrier (shipment_messages)
    └── Delivery confirmed → shipments.status=DELIVERED

TNA UNBINDING (end of rental period or manual termination)
└── /visitor/tnas/[id]/unbind
    ├── System checks: shipments where tna_id=X AND status IN (IN_TRANSIT, OUT_FOR_DELIVERY)
    ├── If in-transit exists: BLOCK with 409 error + show active shipments
    └── If clear: bindings.status=TERMINATED, visitor_tnas.status=UNLINKED
```

---

### FLOW B — Owner End-to-End Journey

```
REGISTER
└── /auth/register (Owner type)
    ├── owner_type: INDIVIDUAL or BUSINESS
    ├── If BUSINESS: commercial_registration, business_name, tax_id
    └── → writes: users + owners (is_verified=FALSE)

PROPERTY REGISTRATION
└── /owner/properties/new
    ├── Full address entry (building_number, street, district, city, postal_code)
    ├── Upload title_deed_reference (REQUIRED) + na_certificate_url
    ├── → writes: owner_national_addresses (ownership_proof_status=PENDING)
    └── Gov reviews → ownership_proof_status: PENDING → VERIFIED/REJECTED

SUB-ADDRESS CREATION (only after property VERIFIED)
└── /owner/properties/[id]/sub-addresses/new
    ├── suffix_code (4-letter, unique per na_id)
    ├── label (human readable: "Apartment 101")
    ├── → writes: na_sub_addresses (is_verified=FALSE, is_available=TRUE)
    └── Submit for gov verification → is_verified: FALSE → TRUE

BINDING APPROVAL WORKFLOW
└── /owner/bindings
    ├── Incoming PENDING binding requests
    └── /owner/bindings/[id]
        ├── View: TNA code, visitor details, requested period, pricing breakdown
        ├── Approve → bindings.status=ACTIVE (triggers payment gate for visitor)
        └── Reject → bindings.status=REJECTED (with reason)

EARNINGS & PAYOUTS
└── /owner/earnings
    ├── owner_accounts: current_balance, pending_balance, total_earned, total_paid_out
    ├── Per-contract breakdown: rent_contracts (gross → fees → net_owner_amount)
    └── /owner/payouts
        ├── payout_records history (status, amount, bank_confirmation)
        └── Trigger manual payout request (if balance ≥ minimum_payout_threshold)
```

---

### FLOW C — Government User End-to-End Journey

```
LOGIN (No self-registration — provisioned by admin)
└── /auth/login → gov_users role-based redirect → /gov/home

TNA ISSUANCE REVIEW
└── /gov/tna-queue
    ├── Filter by: status, mode_at_submission, visitor_nationality, date range
    └── /gov/tna-queue/[id]
        ├── View: visitor profile, document scans, eligibility_snapshot
        ├── APPROVE → tna_issuance_requests.status=APPROVED → visitor_tnas created
        └── REJECT → status=REJECTED, rejection_reason required

ADDRESS SUB-ADDRESS VERIFICATION
└── /gov/address-queue
    ├── Queue of na_sub_addresses where is_verified=FALSE
    └── /gov/address-queue/[id]
        ├── View: parent national address, owner details, suffix_code, label
        ├── VERIFY → na_sub_addresses.is_verified=TRUE, verified_by_gov_user_id set
        └── REJECT → is_verified remains FALSE, verification_notes recorded

POLICY MANAGEMENT
└── /gov/policy
    ├── issuance_mode toggle: MODERATED ↔ AUTONOMOUS
    ├── max_active_tnas_per_visitor (numeric input)
    ├── tna_validity_days, minimum_rental_period_days
    └── eligibility_rules JSON editor (visual form, not raw JSON)

AUDIT LOG
└── /gov/audit
    ├── Filter: actor_type, action_type, target_entity, date range
    ├── Export CSV
    └── Per-entry: old_values/new_values diff view
```

---

### FLOW D — Carrier Staff End-to-End Journey

```
CARRIER COMPANY REGISTRATION (one-time, by company admin)
└── /auth/register/carrier
    ├── company_name, commercial_registration, license_number, contact_email
    ├── → writes: carriers (is_verified=FALSE)
    ├── Platform reviews and issues: api_key, api_secret_hash
    └── webhook_url configuration → /carrier/settings/integration

STAFF ACCOUNT CREATION
└── /auth/register (Carrier type, with carrier_id association)
    └── → writes: users + carrier_staff (carrier_id FK)

DAILY DRIVER WORKFLOW
└── /carrier/driver/tasks (task list for today)
    └── Select shipment
        └── /carrier/driver/map
            ├── TNA → binding → na_sub_address → lat/lng navigation
            ├── Contact recipient button (shipment_messages)
            └── /carrier/driver/confirm
                ├── Enter delivery code (sent to visitor)
                ├── Upload delivery_photo_url
                └── → shipments.status=DELIVERED, actual_delivery timestamp

DISPATCHER WORKFLOW
└── /carrier/shipments
    ├── /carrier/shipments/new (register new shipment against TNA)
    │   → writes: shipments (carrier_id, tna_id, tracking_number)
    └── /carrier/shipments/[id]
        ├── Update status (CREATED → PICKED_UP → IN_TRANSIT → OUT_FOR_DELIVERY)
        └── View shipment_status_logs timeline
```

---

## 2.2 Optimized Sitemap (Refactored)

```json
[
  {
    "route": "/auth/login",
    "template": "Detail View",
    "role": "Public",
    "ui_states": ["idle", "loading", "error_invalid_credentials", "error_account_inactive"],
    "logical_blueprint": "Secure authentication portal. Redirects to role-specific home after login.",
    "data_mapping": "users.email, users.password_hash, users.user_role, users.is_active",
    "backend_api": "POST /v1/auth/login"
  },
  {
    "route": "/auth/register",
    "template": "Form/Wizard",
    "role": "Public",
    "ui_states": ["step_1_role_select", "step_2_personal_data", "step_3_account_credentials", "step_4_confirmation"],
    "logical_blueprint": "Multi-step registration for Visitors and Owners. Step 1 selects account type (VISITOR, OWNER). Steps 2-3 adapt fields based on type. CARRIER_STAFF has separate flow at /auth/register/carrier.",
    "data_mapping": "users.full_name*, users.email*, users.password_hash*, users.user_role*; visitors.nationality, visitors.date_of_birth, visitors.document_type, visitors.document_number, visitors.mobile; owners.owner_type, owners.business_name, owners.commercial_registration",
    "backend_api": "POST /v1/auth/register",
    "notes": "*shared user fields written to users table; role-specific fields to visitors or owners"
  },
  {
    "route": "/auth/register/carrier",
    "template": "Form/Wizard",
    "role": "Public",
    "ui_states": ["step_1_company_details", "step_2_licensing", "step_3_contact", "step_4_pending_verification"],
    "logical_blueprint": "Carrier company onboarding. Creates carriers entity (is_verified=FALSE). Platform admin reviews and issues api_key. Staff accounts are created separately after carrier is verified.",
    "data_mapping": "carriers.company_name, carriers.commercial_registration, carriers.license_number, carriers.tax_id, carriers.contact_email, carriers.contact_phone, carriers.webhook_url",
    "backend_api": "POST /v1/carriers/register"
  },

  {
    "route": "/visitor/home",
    "template": "Dashboard",
    "role": "Visitor",
    "ui_states": ["no_tna", "has_unlinked_tna", "has_active_tna", "kyc_pending", "payment_pending"],
    "logical_blueprint": "Primary visitor hub. Shows TNA status cards, active shipments feed, and pending actions banner. High-frequency actions surfaced inline.",
    "data_mapping": "visitors.visitor_id, visitors.full_name, visitors.kyc_status; visitor_tnas.tna_code, visitor_tnas.status, visitor_tnas.expires_at; bindings.status, bindings.end_at; shipments.tracking_number, shipments.status, shipments.estimated_delivery; financial_transactions.status (payment_pending flag)",
    "hfa": ["Create New TNA", "Link TNA", "View Shipments"]
  },
  {
    "route": "/visitor/profile",
    "template": "Detail View",
    "role": "Visitor",
    "ui_states": ["view", "editing", "kyc_pending", "kyc_verified", "kyc_rejected"],
    "logical_blueprint": "Profile management and KYC status tracking.",
    "data_mapping": "visitors.full_name, visitors.nationality, visitors.date_of_birth, visitors.document_type, visitors.document_number, visitors.mobile, visitors.kyc_status, visitors.kyc_verified_at"
  },
  {
    "route": "/visitor/profile/kyc",
    "template": "Form/Wizard",
    "role": "Visitor",
    "ui_states": ["upload", "uploading", "pending_review", "approved", "rejected_with_reason"],
    "logical_blueprint": "KYC document submission flow. Visitor uploads identity documents. Triggers gov review queue entry. Prerequisite for TNA issuance.",
    "data_mapping": "visitors.kyc_status; tna_issuance_requests.supporting_documents (array of doc URLs)",
    "backend_api": "POST /v1/visitors/kyc/documents"
  },
  {
    "route": "/visitor/tnas",
    "template": "Data Table",
    "role": "Visitor",
    "ui_states": ["empty", "loading", "populated", "filter_active"],
    "logical_blueprint": "Full list of visitor TNAs with status filtering. Links to detail and create flows.",
    "data_mapping": "visitor_tnas.tna_id, visitor_tnas.tna_code, visitor_tnas.status, visitor_tnas.issued_at, visitor_tnas.expires_at; bindings.status (linked sub-address name)"
  },
  {
    "route": "/visitor/tna/new",
    "template": "Form/Wizard",
    "role": "Visitor",
    "ui_states": ["eligibility_check", "autonomous_approved", "moderated_pending", "max_tna_reached", "kyc_required"],
    "logical_blueprint": "TNA issuance request. Checks kyc_status, active TNA count vs max_active_tnas_per_visitor. Routes through AUTONOMOUS or MODERATED based on issuance_policy.",
    "data_mapping": "tna_issuance_requests.visitor_id, tna_issuance_requests.mode_at_submission, tna_issuance_requests.supporting_documents; issuance_policy.issuance_mode, issuance_policy.max_active_tnas_per_visitor",
    "backend_api": "POST /v1/tna/issue-request"
  },
  {
    "route": "/visitor/tnas/[id]",
    "template": "Detail View",
    "role": "Visitor",
    "ui_states": ["unlinked", "pending_owner_approval", "payment_required", "active_linked", "expiring_soon", "expired", "revoked"],
    "logical_blueprint": "TNA lifecycle hub. Shows issuance status, binding status, active rental contract summary, and available actions (bind, unbind, renew).",
    "data_mapping": "visitor_tnas.tna_id, visitor_tnas.tna_code, visitor_tnas.status, visitor_tnas.issued_at, visitor_tnas.expires_at; tna_issuance_requests.request_status, tna_issuance_requests.rejection_reason; bindings.status, bindings.start_at, bindings.end_at, bindings.approved_by_owner_id; rent_contracts.gross_amount, rent_contracts.net_owner_amount"
  },
  {
    "route": "/visitor/search",
    "template": "Data Table",
    "role": "Visitor",
    "ui_states": ["idle", "loading", "results", "no_results", "filter_applied"],
    "logical_blueprint": "Browse verified national addresses and their available sub-addresses. Filter by city, district. Each result shows available verified sub-addresses.",
    "data_mapping": "owner_national_addresses.na_id, owner_national_addresses.full_address, owner_national_addresses.city, owner_national_addresses.district, owner_national_addresses.latitude, owner_national_addresses.longitude; na_sub_addresses.sub_address_id, na_sub_addresses.suffix_code, na_sub_addresses.label, na_sub_addresses.is_available (where is_verified=TRUE)"
  },
  {
    "route": "/visitor/tnas/[id]/bind",
    "template": "Form/Wizard",
    "role": "Visitor",
    "ui_states": ["select_sub_address", "select_period", "pricing_quote", "submitting", "pending_owner_approval"],
    "logical_blueprint": "Step 1: Select sub-address. Step 2: Choose rental period (type + duration). Step 3: View price quote (from price_catalog). Step 4: Submit binding request. Binding goes PENDING until owner approves, then visitor proceeds to checkout.",
    "data_mapping": "bindings.tna_id, bindings.sub_address_id, bindings.start_at, bindings.end_at; na_sub_addresses.suffix_code, na_sub_addresses.label; price_catalog.item_type, price_catalog.base_price, price_catalog.platform_fee_percentage, price_catalog.authority_share_percentage",
    "backend_api": "POST /v1/bindings"
  },
  {
    "route": "/visitor/checkout/[binding_id]",
    "template": "Form/Wizard",
    "role": "Visitor",
    "ui_states": ["quote_display", "payment_processing", "payment_success", "payment_failed", "binding_activated"],
    "logical_blueprint": "Financial checkout for an owner-approved binding. Displays full contract breakdown: gross_amount, platform_fee_amount, authority_share_amount, net_owner_amount. Triggers payment gateway. On PAID: binding activates, TNA becomes ACTIVE.",
    "data_mapping": "rent_contracts.gross_amount, rent_contracts.platform_fee_amount, rent_contracts.authority_share_amount, rent_contracts.net_owner_amount, rent_contracts.rental_period_type, rent_contracts.rental_duration; financial_transactions.status; bindings.status",
    "backend_api": "POST /v1/orders → POST /v1/orders/{order_id}/pay → POST /v1/payments/webhook",
    "critical_rule": "Binding activation BLOCKED until financial_transaction.status=PAID"
  },
  {
    "route": "/visitor/tnas/[id]/unbind",
    "template": "Form/Wizard",
    "role": "Visitor",
    "ui_states": ["confirming", "in_transit_blocked", "submitting", "success"],
    "logical_blueprint": "Unbinding request. System checks for in-transit shipments. If found: shows blocking error with list of active shipments. If clear: proceeds to termination.",
    "data_mapping": "bindings.binding_id, bindings.status; shipments (where tna_id=X AND status IN [IN_TRANSIT, OUT_FOR_DELIVERY])",
    "backend_api": "POST /v1/bindings/{binding_id}/terminate (returns 409 if in-transit)",
    "critical_rule": "409 if any shipment for this TNA has status IN_TRANSIT or OUT_FOR_DELIVERY"
  },
  {
    "route": "/visitor/shipments",
    "template": "Data Table",
    "role": "Visitor",
    "ui_states": ["empty", "loading", "populated", "filter_by_status", "filter_by_tna"],
    "logical_blueprint": "All shipments addressed to visitor TNAs. Status filtering. Links to detail.",
    "data_mapping": "shipments.shipment_id, shipments.tracking_number, shipments.status, shipments.carrier_id, shipments.estimated_delivery, shipments.actual_delivery; visitor_tnas.tna_code"
  },
  {
    "route": "/visitor/shipments/[id]",
    "template": "Detail View",
    "role": "Visitor",
    "ui_states": ["loading", "active", "delivered", "failed", "returned"],
    "logical_blueprint": "Full shipment detail: status timeline, package details, carrier contact, message thread.",
    "data_mapping": "shipments.*, shipment_status_logs.status, shipment_status_logs.location, shipment_status_logs.logged_at; shipment_messages.message_text, shipment_messages.sender_user_id, shipment_messages.created_at"
  },
  {
    "route": "/visitor/wallet",
    "template": "Data Table",
    "role": "Visitor",
    "ui_states": ["loading", "populated", "empty"],
    "logical_blueprint": "Transaction history: TNA issuance fees, rental payments, refunds.",
    "data_mapping": "financial_transactions.transaction_id, financial_transactions.transaction_type, financial_transactions.amount, financial_transactions.status, financial_transactions.created_at"
  },

  {
    "route": "/owner/home",
    "template": "Dashboard",
    "role": "Owner",
    "ui_states": ["unverified", "verified_no_properties", "active"],
    "logical_blueprint": "Owner command center. Surfaces pending binding approvals, wallet balance, and property health stats.",
    "data_mapping": "owners.owner_id, owners.full_name, owners.is_verified; owner_accounts.current_balance, owner_accounts.pending_balance, owner_accounts.total_earned; bindings (PENDING count); owner_national_addresses (count, verified count)",
    "hfa": ["Review Binding Requests", "Check Wallet", "Add Property"]
  },
  {
    "route": "/owner/properties",
    "template": "Data Table",
    "role": "Owner",
    "ui_states": ["empty", "loading", "populated", "filter_by_verification_status"],
    "logical_blueprint": "All registered national addresses with ownership_proof_status and active binding count.",
    "data_mapping": "owner_national_addresses.na_id, owner_national_addresses.full_address, owner_national_addresses.city, owner_national_addresses.district, owner_national_addresses.ownership_proof_status, owner_national_addresses.verified_at"
  },
  {
    "route": "/owner/properties/new",
    "template": "Form/Wizard",
    "role": "Owner",
    "ui_states": ["address_entry", "document_upload", "submitting", "pending_verification"],
    "logical_blueprint": "Register a new national address. REQUIRES title_deed_reference upload and na_certificate_url. Ownership goes PENDING until gov verifies.",
    "data_mapping": "owner_national_addresses.full_address, owner_national_addresses.building_number, owner_national_addresses.street_name, owner_national_addresses.district, owner_national_addresses.city, owner_national_addresses.postal_code, owner_national_addresses.latitude, owner_national_addresses.longitude, owner_national_addresses.title_deed_reference (REQUIRED), owner_national_addresses.na_certificate_url, owner_national_addresses.registry_reference",
    "critical_rule": "title_deed_reference is REQUIRED — form cannot submit without it"
  },
  {
    "route": "/owner/properties/[id]",
    "template": "Detail View",
    "role": "Owner",
    "ui_states": ["loading", "pending_verification", "verified", "rejected"],
    "logical_blueprint": "Property detail hub with sub-address list. Shows verification status. If VERIFIED, shows sub-address management panel.",
    "data_mapping": "owner_national_addresses.*; na_sub_addresses.sub_address_id, na_sub_addresses.suffix_code, na_sub_addresses.label, na_sub_addresses.is_available, na_sub_addresses.is_verified"
  },
  {
    "route": "/owner/properties/[id]/sub-addresses/new",
    "template": "Form/Wizard",
    "role": "Owner",
    "ui_states": ["form", "submitting", "pending_verification"],
    "logical_blueprint": "Add a new sub-address (unit) to a verified property. Gov verification required before sub-address can be used in bindings.",
    "data_mapping": "na_sub_addresses.na_id, na_sub_addresses.suffix_code (4 chars, unique per na), na_sub_addresses.label, na_sub_addresses.description; na_sub_addresses.is_verified=FALSE on creation",
    "critical_rule": "UNIQUE(na_id, suffix_code) constraint — validate before submit"
  },
  {
    "route": "/owner/bindings",
    "template": "Data Table",
    "role": "Owner",
    "ui_states": ["loading", "populated", "empty", "filter_by_status"],
    "logical_blueprint": "All binding requests and active rentals. Status filters: PENDING (action required), ACTIVE, COMPLETED, TERMINATED.",
    "data_mapping": "bindings.binding_id, bindings.tna_id, bindings.sub_address_id, bindings.status, bindings.start_at, bindings.end_at, bindings.approved_at; visitor_tnas.tna_code; na_sub_addresses.label; rent_contracts.net_owner_amount"
  },
  {
    "route": "/owner/bindings/[id]",
    "template": "Detail View",
    "role": "Owner",
    "ui_states": ["pending_approval", "active", "completed", "terminated"],
    "logical_blueprint": "Full binding detail. Shows visitor TNA, sub-address, rental period, and FULL FINANCIAL CONTRACT breakdown (gross → platform_fee → authority_share → net_owner_amount). Action buttons: Approve / Reject / Terminate.",
    "data_mapping": "bindings.*; rental_status_history.*; rent_contracts.gross_amount, rent_contracts.platform_fee_percentage, rent_contracts.platform_fee_amount, rent_contracts.authority_share_percentage, rent_contracts.authority_share_amount, rent_contracts.net_owner_amount, rent_contracts.status; visitor_tnas.tna_code; na_sub_addresses.label",
    "backend_api": "POST /v1/bindings/{id}/approve | POST /v1/bindings/{id}/terminate"
  },
  {
    "route": "/owner/earnings",
    "template": "Dashboard",
    "role": "Owner",
    "ui_states": ["loading", "active", "no_earnings"],
    "logical_blueprint": "Financial earnings dashboard with current balance, pending settlements, and per-contract breakdown.",
    "data_mapping": "owner_accounts.current_balance, owner_accounts.pending_balance, owner_accounts.total_earned, owner_accounts.total_paid_out, owner_accounts.last_payout_at; rent_contracts (per binding: gross, net, status); ledger_entries (credits to OWNER_REVENUE)"
  },
  {
    "route": "/owner/payouts",
    "template": "Data Table",
    "role": "Owner",
    "ui_states": ["loading", "populated", "empty", "payout_below_threshold"],
    "logical_blueprint": "Payout history. Shows each payout_record. If current_balance >= minimum_payout_threshold, shows 'Request Payout' CTA.",
    "data_mapping": "payout_records.payout_id, payout_records.payout_amount, payout_records.net_payout_amount, payout_records.processing_fee, payout_records.status, payout_records.initiated_at, payout_records.completed_at, payout_records.bank_confirmation; owner_accounts.current_balance, owner_accounts.minimum_payout_threshold"
  },
  {
    "route": "/owner/settings/payout",
    "template": "Form/Wizard",
    "role": "Owner",
    "ui_states": ["view", "editing", "saved"],
    "logical_blueprint": "Update bank account details for payouts.",
    "data_mapping": "owner_accounts.payout_method, owner_accounts.payout_details (bank_name, account_number, iban, swift)"
  },

  {
    "route": "/gov/home",
    "template": "Dashboard",
    "role": "Government",
    "ui_states": ["loading", "active"],
    "logical_blueprint": "Gov command center. Shows TNA queue depth, address verification queue, policy status, and recent audit entries.",
    "data_mapping": "tna_issuance_requests (PENDING count, APPROVED today, REJECTED today); na_sub_addresses (unverified count); issuance_policy.issuance_mode; admin_audit_log (last 5 entries)",
    "hfa": ["Review TNA Queue", "Review Address Queue", "Manage Policy"]
  },
  {
    "route": "/gov/tna-queue",
    "template": "Data Table",
    "role": "Government",
    "ui_states": ["loading", "populated", "empty", "filter_active"],
    "logical_blueprint": "TNA issuance request queue. Filterable by status, mode_at_submission, nationality, date. Replaces /gov/verification/queue.",
    "data_mapping": "tna_issuance_requests.request_id, tna_issuance_requests.request_status, tna_issuance_requests.mode_at_submission, tna_issuance_requests.created_at; visitors.full_name, visitors.nationality, visitors.document_type"
  },
  {
    "route": "/gov/tna-queue/[id]",
    "template": "Detail View",
    "role": "Government",
    "ui_states": ["loading", "pending_review", "already_reviewed"],
    "logical_blueprint": "Full TNA issuance review. Shows visitor profile, KYC documents (supporting_documents), eligibility snapshot. Approve with auto-issue or Reject with mandatory reason code.",
    "data_mapping": "tna_issuance_requests.*; visitors.full_name, visitors.nationality, visitors.date_of_birth, visitors.document_type, visitors.document_number, visitors.kyc_status; tna_issuance_requests.supporting_documents (doc viewer)",
    "backend_api": "POST /v1/authority/issue-requests/{request_id}/approve | reject"
  },
  {
    "route": "/gov/address-queue",
    "template": "Data Table",
    "role": "Government",
    "ui_states": ["loading", "populated", "empty", "filter_active"],
    "logical_blueprint": "NEW ROUTE. Sub-address verification queue. Lists na_sub_addresses where is_verified=FALSE. Critical gap in original sitemap.",
    "data_mapping": "na_sub_addresses.sub_address_id, na_sub_addresses.suffix_code, na_sub_addresses.label, na_sub_addresses.created_at; owner_national_addresses.full_address, owner_national_addresses.city; owners.full_name"
  },
  {
    "route": "/gov/address-queue/[id]",
    "template": "Detail View",
    "role": "Government",
    "ui_states": ["loading", "pending_verification", "already_verified"],
    "logical_blueprint": "NEW ROUTE. Sub-address verification detail. Shows parent national address, ownership_proof_status, owner deed documents, suffix_code, label. Verify or Reject with notes.",
    "data_mapping": "na_sub_addresses.*; owner_national_addresses.full_address, owner_national_addresses.title_deed_reference, owner_national_addresses.na_certificate_url, owner_national_addresses.ownership_proof_status; owners.full_name, owners.national_id",
    "backend_api": "PATCH /v1/na/sub-addresses/{sub_address_id}/verify"
  },
  {
    "route": "/gov/policy",
    "template": "Form/Wizard",
    "role": "Government",
    "ui_states": ["loading", "view", "editing", "saving", "saved"],
    "logical_blueprint": "System-wide issuance policy management. Visual form (not raw JSON) for eligibility_rules. Toggle MODERATED/AUTONOMOUS. Numeric inputs for limits and validity periods.",
    "data_mapping": "issuance_policy.issuance_mode, issuance_policy.max_active_tnas_per_visitor, issuance_policy.tna_validity_days, issuance_policy.minimum_rental_period_days, issuance_policy.eligibility_rules",
    "backend_api": "PUT /v1/authority/issuance-policy"
  },
  {
    "route": "/gov/audit",
    "template": "Data Table",
    "role": "Government",
    "ui_states": ["loading", "populated", "filter_active", "detail_expanded"],
    "logical_blueprint": "Immutable audit log browser. Filter by actor_type, action_type, target_entity, date range. Row expand shows old_values/new_values diff. CSV export.",
    "data_mapping": "admin_audit_log.audit_id, admin_audit_log.actor_type, admin_audit_log.actor_id, admin_audit_log.action_type, admin_audit_log.target_entity, admin_audit_log.entity_id, admin_audit_log.old_values, admin_audit_log.new_values, admin_audit_log.ip_address, admin_audit_log.created_at"
  },
  {
    "route": "/gov/agencies",
    "template": "Data Table",
    "role": "Government",
    "ui_states": ["loading", "populated"],
    "logical_blueprint": "Government agency list with hierarchy display. Manages gov_users per agency.",
    "data_mapping": "government_agencies.agency_id, government_agencies.agency_code, government_agencies.agency_name_en, government_agencies.agency_name_ar, government_agencies.parent_agency_id, government_agencies.permissions, government_agencies.is_active; gov_users.full_name, gov_users.role, gov_users.department"
  },
  {
    "route": "/gov/adjustments",
    "template": "Data Table",
    "role": "Government",
    "ui_states": ["loading", "populated", "filter_pending_approval"],
    "logical_blueprint": "Settlement adjustment approval queue. Adjustments with approval_required=TRUE appear here. Approve to trigger ledger corrections.",
    "data_mapping": "settlement_adjustments.adjustment_id, settlement_adjustments.adjustment_type, settlement_adjustments.adjustment_amount, settlement_adjustments.reason, settlement_adjustments.status, settlement_adjustments.initiated_by_user_id, settlement_adjustments.created_at"
  },

  {
    "route": "/carrier/home",
    "template": "Dashboard",
    "role": "Carrier",
    "ui_states": ["loading", "active", "carrier_unverified"],
    "logical_blueprint": "Carrier operations hub. Live delivery metrics, quick TNA resolver widget, staff activity. Blocks if carrier.is_verified=FALSE.",
    "data_mapping": "carriers.company_name, carriers.is_verified; carrier_staff.staff_id; shipments (grouped by status: IN_TRANSIT, DELIVERED today, FAILED, RETURNED)",
    "hfa": ["Resolve TNA", "Register Shipment", "Update Delivery Status"]
  },
  {
    "route": "/carrier/resolve",
    "template": "Detail View",
    "role": "Carrier",
    "ui_states": ["idle", "loading", "resolved_deliverable", "resolved_unlinked", "invalid_tna"],
    "logical_blueprint": "TNA resolver. Enter or scan TNA code. Returns: deliverable=true with na_sub_address + parent national address (NO visitor identity) OR deliverable=false with return-to-sender reason.",
    "data_mapping": "visitor_tnas.tna_code, visitor_tnas.status; bindings.status; na_sub_addresses.suffix_code, na_sub_addresses.label; owner_national_addresses.full_address, owner_national_addresses.latitude, owner_national_addresses.longitude",
    "backend_api": "POST /v1/resolve",
    "security": "Resolver output must NOT include visitor identity fields (name, nationality, document_number)"
  },
  {
    "route": "/carrier/shipments",
    "template": "Data Table",
    "role": "Carrier",
    "ui_states": ["loading", "populated", "empty", "filter_by_status", "filter_by_staff"],
    "logical_blueprint": "Master shipment list for carrier company. All shipments by carrier_id.",
    "data_mapping": "shipments.shipment_id, shipments.tracking_number, shipments.status, shipments.tna_id, shipments.assigned_staff_id, shipments.estimated_delivery, shipments.actual_delivery; visitor_tnas.tna_code; carrier_staff.full_name (assigned)"
  },
  {
    "route": "/carrier/shipments/new",
    "template": "Form/Wizard",
    "role": "Carrier",
    "ui_states": ["form", "tna_validating", "tna_resolved", "tna_unlinked_error", "submitting", "success"],
    "logical_blueprint": "Register a new shipment. Enter TNA code → system validates and resolves to verify deliverability. Fill package details. Assign to staff.",
    "data_mapping": "shipments.carrier_id, shipments.tracking_number, shipments.tna_id, shipments.assigned_staff_id, shipments.origin_address, shipments.estimated_delivery, shipments.package_details"
  },
  {
    "route": "/carrier/shipments/[id]",
    "template": "Detail View",
    "role": "Carrier",
    "ui_states": ["loading", "active", "delivered", "failed"],
    "logical_blueprint": "Full shipment detail. Status update dropdown, status log timeline, message thread with visitor.",
    "data_mapping": "shipments.*; shipment_status_logs.*; shipment_messages.*",
    "backend_api": "PATCH /v1/deliveries/{delivery_id}"
  },
  {
    "route": "/carrier/driver/tasks",
    "template": "Dashboard",
    "role": "Carrier",
    "ui_states": ["loading", "populated", "empty_today"],
    "logical_blueprint": "Driver's daily task list. Shipments assigned to this staff member today, sorted by estimated_delivery.",
    "data_mapping": "shipments (where assigned_staff_id=current_user, status != DELIVERED/RETURNED); visitor_tnas.tna_code; shipments.destination_address_full"
  },
  {
    "route": "/carrier/driver/map",
    "template": "Map/Task",
    "role": "Carrier",
    "ui_states": ["loading_map", "navigating", "arrived", "offline_fallback"],
    "logical_blueprint": "Geospatial delivery navigation. Shows lat/lng from owner_national_addresses. Contact recipient button. Navigate-to CTA.",
    "data_mapping": "owner_national_addresses.latitude, owner_national_addresses.longitude, owner_national_addresses.full_address; na_sub_addresses.label (unit to deliver to); shipments.tracking_number"
  },
  {
    "route": "/carrier/driver/confirm",
    "template": "Form/Wizard",
    "role": "Carrier",
    "ui_states": ["code_entry", "photo_upload", "submitting", "success", "error"],
    "logical_blueprint": "Delivery confirmation. Enter OTP code sent to visitor. Upload photo proof. Triggers shipments.status=DELIVERED.",
    "data_mapping": "shipments.delivery_signature, shipments.delivery_photo_url, shipments.actual_delivery; shipments.status=DELIVERED",
    "backend_api": "PATCH /v1/deliveries/{delivery_id} {status: DELIVERED, delivery_signature, delivery_photo_url}"
  },
  {
    "route": "/carrier/staff",
    "template": "Data Table",
    "role": "Carrier",
    "ui_states": ["loading", "populated", "empty"],
    "logical_blueprint": "Staff roster management. List all carrier_staff for this carriers.carrier_id.",
    "data_mapping": "carrier_staff.staff_id, carrier_staff.full_name, carrier_staff.employee_id, carrier_staff.position, carrier_staff.mobile, carrier_staff.is_active"
  },
  {
    "route": "/carrier/settings/integration",
    "template": "Detail View",
    "role": "Carrier",
    "ui_states": ["loading", "view", "editing"],
    "logical_blueprint": "API credentials and webhook management for carrier system integration.",
    "data_mapping": "carriers.api_key (masked), carriers.webhook_url, carriers.is_verified, carriers.verified_at"
  }
]
```

---

# PHASE 3: IMPLEMENTATION BLUEPRINT — CODING AGENT MASTER PROMPT

---

## AGENT SYSTEM PROMPT

```
You are a Senior Full-Stack Frontend Engineer specializing in Next.js 14 App Router, TypeScript,
Tailwind CSS, and Zustand. You are executing a production-grade UX/UI refactor of the CFIP
Temporary National Address (TNA) platform.

CRITICAL CONTEXT: This is NOT a greenfield project. You are refactoring an existing codebase
described in hidden-eagle.md. You must preserve and extend existing SPATIAL Design System
tokens, component maturity, and architectural patterns.

STRICT REQUIREMENT: Every page you implement must be production-ready with:
  1. Full loading states (SkeletonCard components from existing ui/ library)
  2. Error boundaries with ErrorAlert component
  3. Empty states (EmptyState component)
  4. RTL/LTR bidirectional support (IBM Plex Sans Arabic / Rubik fonts)
  5. Mobile-responsive layout (AppShell + BottomNav)
  6. All data bindings matched to the exact DB column names in this prompt
  7. API call integration using existing lib/api/ pattern (no direct fetch in components)
  8. Role-based access guard using existing RoleGuard component
```

---

## SECTION 1: CRITICAL FIXES (Execute Before New Features)

### FIX-01: Resolve Type Conflict in Auth Store

```typescript
// FILE: lib/types/auth.ts
// PROBLEM: doc_number vs document_number field naming conflict
// RESOLUTION: Align to data model column name

export interface User {
  user_id: string
  username: string
  email: string
  user_role: 'VISITOR' | 'OWNER' | 'GOV_USER' | 'CARRIER_STAFF'
  is_active: boolean
}

export interface VisitorProfile {
  visitor_id: string
  user_id: string
  full_name: string
  nationality: string
  date_of_birth: string
  document_type: 'VISA' | 'IQAMA' | 'PASSPORT'
  document_number: string   // FIXED: was doc_number in some places
  document_expiry?: string
  mobile: string
  kyc_status: 'PENDING' | 'VERIFIED' | 'REJECTED'
  kyc_verified_at?: string
  max_active_tnas: number
}
```

### FIX-02: Eliminate GovContext / Zustand Source-of-Truth Conflict

```typescript
// FILE: context/GovContext.tsx
// PROBLEM: Hardcoded mock tnaData mixed with real auth role
// RESOLUTION: GovContext should ONLY derive from API calls, never hardcode

// DELETE: initialGovTnaData hardcoded object
// REPLACE WITH: useQuery from React Query for gov-specific data
// The role field should come from useAuthStore exclusively

export const GovProvider = ({ children }: { children: React.ReactNode }) => {
  // Only provide computed/derived state that can't live in Zustand
  // Remove: activeRole (use useAuthStore.role instead)
  // Remove: tnaData (use React Query useQuery(govTnaQueue) instead)
}
```

### FIX-03: Fix Carrier Fleet Route (carrier_vehicles table does not exist)

```typescript
// FILE: app/[locale]/carrier/fleet/page.tsx
// PROBLEM: Maps to carrier_vehicles table which doesn't exist in data model v2.1
// RESOLUTION: This page should be renamed to /carrier/staff and map to carrier_staff table

// REMOVE: /carrier/fleet route
// CREATE: /carrier/staff/page.tsx
// DATA MAPPING: carrier_staff.staff_id, full_name, position, mobile, is_active
// SECONDARY: carriers.carrier_id (company info header)
```

### FIX-04: Repair /visitor/checkout Data Mapping

```typescript
// FILE: app/[locale]/visitor/checkout/page.tsx
// PROBLEM: Currently maps to payouts.total_amount (WRONG - that's owner payout table)
// RESOLUTION: Checkout maps to financial_transactions + rent_contracts

// CORRECT data fetching:
// 1. GET rent_contracts where binding_id = {binding_id}
//    → gross_amount, platform_fee_amount, authority_share_amount, net_owner_amount
// 2. POST /v1/orders to create financial_transaction
// 3. POST /v1/orders/{order_id}/pay to initiate payment
// 4. Listen for POST /v1/payments/webhook for PAID confirmation
// 5. On PAID: binding becomes ACTIVE → redirect to /visitor/tnas/{id}
```

---

## SECTION 2: NEW ROUTES TO IMPLEMENT

### IMPLEMENTATION SPEC: `/visitor/profile/kyc`

**Component Hierarchy:**
```
KYCPage (app/[locale]/visitor/profile/kyc/page.tsx)
└── RoleGuard(role="VISITOR")
    └── FormWizardLayout (existing template)
        ├── Step 1: KYCStatusBanner (shows current visitors.kyc_status)
        ├── Step 2: DocumentTypeSelector (VISA | IQAMA | PASSPORT)
        ├── Step 3: DocumentUploader
        │   ├── FileUploadZone (drag-drop + tap to select, max 10MB, PDF/JPG/PNG)
        │   └── UploadedDocumentPreview (shows filename, size, delete button)
        └── Step 4: SubmitConfirmation
            └── Shows tna_issuance_requests.supporting_documents preview

State: useKYCStore (extend stub with real API call)
API: POST /v1/visitors/kyc/documents
     Body: { document_type, documents: [{doc_type, file_base64, filename}] }
     
Loading State: SkeletonCard (3 rows)
Error State: ErrorAlert ("Document upload failed. Please try again.")
Success State: Toast("Documents submitted. Review takes 1-3 business days.") + redirect to /visitor/profile
Pending State: Banner "Your documents are under review" with visitors.kyc_status = PENDING
```

---

### IMPLEMENTATION SPEC: `/visitor/tna/new`

**Component Hierarchy:**
```
NewTNAPage (app/[locale]/visitor/tna/new/page.tsx)
└── RoleGuard(role="VISITOR")
    └── FormWizardLayout
        ├── EligibilityGate (pre-check component)
        │   ├── Check: visitors.kyc_status === 'VERIFIED' → else show KYCRequired card
        │   └── Check: active_tnas.length < issuance_policy.max_active_tnas_per_visitor → else show MaxTNAReached card
        ├── Step 1: IssuanceModeInfo
        │   ├── If issuance_policy.issuance_mode === 'AUTONOMOUS': "Your TNA will be issued automatically"
        │   └── If 'MODERATED': "Your request will be reviewed by government officials (1-5 days)"
        ├── Step 2: DocumentReview (shows already-submitted supporting_documents from KYC)
        └── Step 3: RequestConfirmation → Submit

State: useRegistrationStore for wizard steps
API: POST /v1/tna/issue-request
Success (AUTONOMOUS): Toast("TNA-XXXX1234 has been issued!") → redirect /visitor/tnas/{id}
Success (MODERATED): Inline state "Your request is pending review" → redirect /visitor/tnas
Error (max_tna): ErrorAlert with count: "You have {n} active TNAs. Maximum is {max}."
Error (kyc_required): KYCRequired card with CTA "Complete KYC Verification" → /visitor/profile/kyc
```

---

### IMPLEMENTATION SPEC: `/visitor/tnas/[id]/bind` (REVISED)

**Component Hierarchy:**
```
BindTNAPage (app/[locale]/visitor/tnas/[id]/bind/page.tsx)
└── RoleGuard(role="VISITOR")
    └── FormWizardLayout (4 steps)
        ├── Step 1: SubAddressSelector
        │   ├── SearchInput (city/district filter)
        │   ├── AddressResultsList → AddressCard[]
        │   │   └── AddressCard: full_address, city, district
        │   │       └── expand → SubAddressList (na_sub_addresses where is_verified=TRUE, is_available=TRUE)
        │   └── SubAddressCard: suffix_code, label → SelectButton
        ├── Step 2: RentalPeriodPicker
        │   ├── PeriodTypeSelector (DAILY | MONTHLY | YEARLY)
        │   └── DurationInput (number + unit label)
        ├── Step 3: PriceQuoteDisplay
        │   ├── Calls GET /v1/pricing/rent-quote with selected period
        │   ├── QuoteBreakdownCard:
        │   │   ├── Gross Amount (price_catalog.base_price × duration)
        │   │   ├── Platform Fee (platform_fee_percentage %)
        │   │   ├── Authority Share (authority_share_percentage %)
        │   │   └── Your Total: gross_amount (what visitor pays)
        │   └── Note: "Owner will receive {net_owner_amount} SAR"
        └── Step 4: SubmitConfirmation
            └── "Your request will be sent to the address owner for approval"
            
API: POST /v1/bindings {tna_id, sub_address_id, start_at, end_at}
Success: Toast("Binding request sent. Awaiting owner approval.") → /visitor/tnas/{id}
Error (already_bound): ErrorAlert "This TNA already has an active binding"
Error (sub_address_unavailable): ErrorAlert "This address unit is no longer available"
```

---

### IMPLEMENTATION SPEC: `/visitor/checkout/[binding_id]` (REBUILT)

**Component Hierarchy:**
```
CheckoutPage (app/[locale]/visitor/checkout/[binding_id]/page.tsx)
└── RoleGuard(role="VISITOR")
    └── FormWizardLayout
        ├── ContractSummaryCard
        │   ├── Sub-address: na_sub_addresses.label + parent address
        │   ├── Period: rental_period_type × rental_duration
        │   ├── FinancialBreakdownTable:
        │   │   ├── Gross Amount: {gross_amount} SAR
        │   │   ├── (minus) Platform Fee ({platform_fee_percentage}%): -{platform_fee_amount} SAR
        │   │   ├── (minus) Authority Fee ({authority_share_percentage}%): -{authority_share_amount} SAR
        │   │   └── Total You Pay: {gross_amount} SAR ← visitor pays full gross
        │   └── owner earns {net_owner_amount} SAR (informational)
        ├── PaymentMethodSelector (credit card / bank transfer)
        └── PayButton → POST /v1/orders/{id}/pay

State machine:
  QUOTE_DISPLAY → PAYMENT_PROCESSING → PAYMENT_SUCCESS → BINDING_ACTIVATED
  PAYMENT_PROCESSING → PAYMENT_FAILED (retry or cancel)

On webhook PAID confirmation:
  → bindings.status = ACTIVE
  → visitor_tnas.status = ACTIVE  
  → Toast("Payment confirmed! TNA is now active.")
  → redirect /visitor/tnas/{tna_id}

CRITICAL ERROR STATES:
  - binding.status !== PENDING: "This binding is no longer available for payment"
  - financial_transaction.status === PAID already: "Payment already confirmed" + redirect
  - Payment gateway timeout: "Payment is processing. We'll notify you when confirmed."
```

---

### IMPLEMENTATION SPEC: `/gov/address-queue` (NEW)

**Component Hierarchy:**
```
AddressQueuePage (app/[locale]/gov/address-queue/page.tsx)
└── RoleGuard(role="GOV_USER")
    └── DataTableLayout (existing template)
        ├── QueueStatsBar: {total_unverified}, {verified_today}, {avg_processing_hours}
        ├── FilterPanel: city, owner_type, submitted_date_range
        └── AddressQueueTable
            Columns:
            - Owner Name (owners.full_name)
            - Address (owner_national_addresses.full_address, city)
            - Sub-address Unit (na_sub_addresses.suffix_code + label)
            - Submitted (na_sub_addresses.created_at)
            - Action: [Review] button → /gov/address-queue/{sub_address_id}
            
API: GET /v1/gov/na/sub-addresses?is_verified=false&page={n}&limit=20
Loading: DataTableLayout skeleton (5 row skeletons)
Empty: EmptyState("No pending address verifications", icon=CheckCircle, "All caught up!")
```

---

### IMPLEMENTATION SPEC: `/gov/address-queue/[id]` (NEW)

**Component Hierarchy:**
```
AddressVerificationDetailPage (app/[locale]/gov/address-queue/[id]/page.tsx)
└── RoleGuard(role="GOV_USER", requiredPermission="verify_addresses")
    └── DetailViewLayout
        ├── OwnerSection
        │   ├── owners.full_name, owners.owner_type, owners.national_id
        │   └── owners.is_verified badge
        ├── NationalAddressSection
        │   ├── owner_national_addresses.full_address (all components)
        │   ├── owner_national_addresses.ownership_proof_status badge
        │   ├── DocumentViewer: title_deed_reference (PDF embed)
        │   └── DocumentViewer: na_certificate_url (PDF embed)
        ├── SubAddressSection
        │   ├── na_sub_addresses.suffix_code
        │   ├── na_sub_addresses.label
        │   └── na_sub_addresses.description
        ├── VerificationNotesInput (textarea → verification_notes)
        └── ActionBar
            ├── VerifyButton → PATCH /v1/gov/na/sub-addresses/{id}/verify
            │   → na_sub_addresses.is_verified=TRUE, verified_by_gov_user_id=current_user
            └── RejectButton → opens RejectionModal
                └── RequiredField: verification_notes (why rejected)

Success: Toast("Sub-address verified. Owner notified.") + redirect to queue
Error (already_verified): Badge "Already verified" + read-only view
```

---

### IMPLEMENTATION SPEC: `/owner/properties/new` (CRITICAL FIX)

**Component Hierarchy:**
```
NewPropertyPage (app/[locale]/owner/properties/new/page.tsx)
└── RoleGuard(role="OWNER")
    └── FormWizardLayout (3 steps)
        ├── Step 1: AddressDetails
        │   ├── building_number (text, required)
        │   ├── street_name (text, required)
        │   ├── district (text, required)
        │   ├── city (text, required)
        │   ├── postal_code (text)
        │   ├── additional_number (text)
        │   ├── unit_number (text)
        │   └── MapPicker → latitude, longitude (optional GPS pin)
        ├── Step 2: OwnershipDocuments
        │   ├── TitleDeedUpload (REQUIRED — form CANNOT advance without this)
        │   │   └── Accepts: PDF, JPG, PNG, max 20MB
        │   │   └── Stores: owner_national_addresses.title_deed_reference
        │   ├── NACertificateUpload (optional but recommended)
        │   │   └── Stores: owner_national_addresses.na_certificate_url
        │   └── RegistryReferenceInput (owner_national_addresses.registry_reference JSON)
        └── Step 3: Review & Submit
            └── Shows: full address + document checklist
            
VALIDATION:
  - title_deed_reference: REQUIRED (data model critical constraint)
  - UNIQUE check on building_number + street_name + city combination (client-side warning)
  
API: POST /v1/na {address fields + document URLs}
Success: Toast("Property registered. Pending verification.") + redirect /owner/properties
ownership_proof_status=PENDING on creation
```

---

### IMPLEMENTATION SPEC: `/owner/properties/[id]` (WITH SUB-ADDRESSES)

**Component Hierarchy:**
```
PropertyDetailPage (app/[locale]/owner/properties/[id]/page.tsx)
└── RoleGuard(role="OWNER")
    └── DetailViewLayout
        ├── PropertyHeader
        │   ├── full_address + city + district
        │   └── OwnershipStatusBadge (PENDING | VERIFIED | REJECTED)
        │       → If REJECTED: RejectionReasonAlert
        ├── DocumentsSection
        │   ├── TitleDeedLink (title_deed_reference)
        │   └── NACertificateLink (na_certificate_url)
        ├── SubAddressesPanel (only shown if ownership_proof_status=VERIFIED)
        │   ├── SubAddressTable
        │   │   Columns: suffix_code, label, is_verified badge, is_available badge, active binding count
        │   │   Row actions: View binding, Mark unavailable
        │   └── AddSubAddressCTA → /owner/properties/[id]/sub-addresses/new
        └── PendingVerificationBanner (if ownership_proof_status=PENDING)
            "Awaiting government verification. This may take 2-5 business days."
```

---

### IMPLEMENTATION SPEC: `/owner/bindings/[id]` (CRITICAL FIX)

**Component Hierarchy:**
```
BindingDetailPage (app/[locale]/owner/bindings/[id]/page.tsx)
└── RoleGuard(role="OWNER")
    └── DetailViewLayout
        ├── BindingHeader
        │   ├── TNA code (visitor_tnas.tna_code) — display only, no visitor PII
        │   ├── Sub-address: na_sub_addresses.label + parent address
        │   └── StatusBadge (PENDING | ACTIVE | COMPLETED | TERMINATED)
        ├── RentalPeriodSection
        │   ├── start_at → end_at date range display
        │   └── Days remaining (if ACTIVE)
        ├── FinancialContractSection (CRITICAL — was missing from original)
        │   ├── rent_contracts.gross_amount (what visitor pays)
        │   ├── rent_contracts.platform_fee_amount (platform takes)
        │   ├── rent_contracts.authority_share_amount (government takes)
        │   └── rent_contracts.net_owner_amount (OWNER RECEIVES — highlighted)
        ├── StatusHistoryTimeline (rental_status_history entries)
        └── ActionBar (conditional by status)
            ├── If PENDING: ApproveButton + RejectButton
            │   └── Approve → POST /v1/bindings/{id}/approve
            │   └── Reject → Modal with required reason
            └── If ACTIVE: TerminateButton
                └── → POST /v1/bindings/{id}/terminate
                    → If 409: Show InTransitBlockerAlert with shipment list
                    → If success: status=TERMINATED, toast confirmation
```

---

### IMPLEMENTATION SPEC: `/carrier/resolve` (NEW)

**Component Hierarchy:**
```
TNAResolverPage (app/[locale]/carrier/resolve/page.tsx)
└── RoleGuard(role="CARRIER_STAFF")
    └── DetailViewLayout
        ├── TNAInputSection
        │   ├── TNATextInput (validates regex: ^TNA-?[A-Z]{4}\d{4}$)
        │   ├── QRScannerButton (mobile camera TNA scan)
        │   └── ResolveButton → POST /v1/resolve
        └── ResolveResultSection (conditional)
            ├── If deliverable=TRUE:
            │   ├── DeliverableCard (green)
            │   │   ├── Sub-address label (na_sub_addresses.label)
            │   │   ├── Full national address (owner_national_addresses.full_address)
            │   │   └── NavigateButton → /carrier/driver/map?lat={lat}&lng={lng}
            │   └── SECURITY: NO visitor name, nationality, or document fields shown
            ├── If deliverable=FALSE:
            │   └── ReturnToSenderCard (red)
            │       ├── Reason: "TNA not linked to any address"
            │       └── Instruction: "Return this package to sender"
            └── If invalid TNA format:
                └── ErrorAlert "Invalid TNA format. Expected: TNA-XXXX1234"
                
API: POST /v1/resolve {tna_code: string}
Loading: Spinner with "Resolving address..."
```

---

## SECTION 3: COMPONENT UPGRADES

### UPGRADE: RegistrationFormBase.tsx — Role-Based Field Rendering

```typescript
// The registration wizard must branch on selected role:
// VISITOR branch: nationality, date_of_birth, document_type, document_number, mobile
// OWNER branch: owner_type (INDIVIDUAL|BUSINESS), and if BUSINESS:
//               business_name, commercial_registration, tax_id
// CARRIER branch: Redirect to /auth/register/carrier (separate company flow)

// State: useRegistrationStore.formData should include:
interface RegistrationFormData {
  role: 'VISITOR' | 'OWNER' | 'CARRIER_STAFF'
  // shared user fields
  email: string
  password: string
  username: string
  // visitor-specific
  full_name?: string
  nationality?: string
  date_of_birth?: string
  document_type?: 'VISA' | 'IQAMA' | 'PASSPORT'
  document_number?: string
  mobile?: string
  // owner-specific
  owner_type?: 'INDIVIDUAL' | 'BUSINESS'
  business_name?: string
  commercial_registration?: string
  tax_id?: string
}
```

### UPGRADE: RoleSidebar.tsx — Add New Routes

```typescript
// VISITOR nav items (add):
{ label: 'My TNAs', route: '/visitor/tnas', icon: 'IdCard' }
{ label: 'Search Addresses', route: '/visitor/search', icon: 'Search' }
{ label: 'Shipments', route: '/visitor/shipments', icon: 'Package' }
{ label: 'Wallet', route: '/visitor/wallet', icon: 'Wallet' }
{ label: 'KYC Verification', route: '/visitor/profile/kyc', icon: 'ShieldCheck', 
  badge: visitors.kyc_status === 'PENDING' ? 'Pending' : null }

// OWNER nav items (add):
{ label: 'Properties', route: '/owner/properties', icon: 'Building' }
{ label: 'Bindings', route: '/owner/bindings', icon: 'Link', 
  badge: pending_bindings_count > 0 ? pending_bindings_count : null }
{ label: 'Earnings', route: '/owner/earnings', icon: 'TrendingUp' }
{ label: 'Payouts', route: '/owner/payouts', icon: 'Banknote' }

// GOV nav items (replace /gov/verification/queue with two separate queues):
{ label: 'TNA Queue', route: '/gov/tna-queue', icon: 'ClipboardList',
  badge: pending_tna_count }
{ label: 'Address Queue', route: '/gov/address-queue', icon: 'MapPin',
  badge: pending_address_count }
{ label: 'Policy', route: '/gov/policy', icon: 'Settings' }
{ label: 'Audit Log', route: '/gov/audit', icon: 'FileText' }
{ label: 'Adjustments', route: '/gov/adjustments', icon: 'RefreshCw' }

// CARRIER nav items (fix fleet → staff):
{ label: 'Resolve TNA', route: '/carrier/resolve', icon: 'Scan' }
{ label: 'Shipments', route: '/carrier/shipments', icon: 'Truck' }
{ label: 'Staff', route: '/carrier/staff', icon: 'Users' }  // was /carrier/fleet
{ label: 'Integration', route: '/carrier/settings/integration', icon: 'Code' }
```

---

## SECTION 4: API LAYER EXTENSIONS

### New API Modules to Create in `lib/api/`

```typescript
// lib/api/kyc.ts
export const submitKYCDocuments = (data: KYCSubmission) =>
  client.post('/v1/visitors/kyc/documents', data)

// lib/api/subAddresses.ts
export const getSubAddresses = (na_id: string) =>
  client.get(`/v1/na/${na_id}/sub-addresses`)
export const createSubAddress = (na_id: string, data: CreateSubAddressRequest) =>
  client.post(`/v1/na/${na_id}/sub-addresses`, data)
export const verifySubAddress = (sub_address_id: string, notes: string) =>
  client.patch(`/v1/gov/na/sub-addresses/${sub_address_id}/verify`, { notes })

// lib/api/resolver.ts  
export const resolveTNA = (tna_code: string) =>
  client.post('/v1/resolve', { tna_code })

// lib/api/financials.ts
export const getRentQuote = (params: RentQuoteParams) =>
  client.post('/v1/pricing/rent-quote', params)
export const createOrder = (binding_id: string) =>
  client.post('/v1/orders', { binding_id })
export const payOrder = (order_id: string, payment_method: string) =>
  client.post(`/v1/orders/${order_id}/pay`, { payment_method })

// lib/api/govQueue.ts
export const getTNAQueue = (filters: TNAQueueFilters) =>
  client.get('/v1/authority/issue-requests', { params: filters })
export const approveTNARequest = (request_id: string) =>
  client.post(`/v1/authority/issue-requests/${request_id}/approve`)
export const rejectTNARequest = (request_id: string, reason: string) =>
  client.post(`/v1/authority/issue-requests/${request_id}/reject`, { reason })
export const getAddressVerificationQueue = (filters) =>
  client.get('/v1/gov/na/sub-addresses', { params: { is_verified: false, ...filters } })
```

---

## SECTION 5: ROUTING & MIDDLEWARE UPDATES

```typescript
// middleware.ts — Add new protected routes

const ROLE_ROUTE_MAP = {
  VISITOR: ['/visitor'],
  OWNER: ['/owner'],
  GOV_USER: ['/gov'],
  CARRIER_STAFF: ['/carrier'],
}

// Add carrier company registration as public route:
const PUBLIC_ROUTES = [
  '/auth/login',
  '/auth/register',
  '/auth/register/carrier',  // ADD: carrier company registration is public
]

// Add dynamic route patterns:
const DYNAMIC_ROUTES = [
  '/visitor/tnas/[id]',
  '/visitor/tnas/[id]/bind',
  '/visitor/tnas/[id]/unbind',
  '/visitor/checkout/[binding_id]',       // RENAME from /visitor/checkout
  '/visitor/shipments/[id]',
  '/owner/properties/[id]',
  '/owner/properties/[id]/sub-addresses/new',
  '/owner/bindings/[id]',
  '/gov/tna-queue/[id]',
  '/gov/address-queue/[id]',              // NEW
  '/carrier/shipments/[id]',
]
```

---

## SECTION 6: STORE IMPLEMENTATIONS (Replacing Stubs)

```typescript
// lib/store/useKYCStore.ts — Replace stub with real implementation
export const useKYCStore = create<KYCState>((set) => ({
  kycStatus: null,
  documents: [],
  loading: false,
  error: null,
  
  fetchKYCStatus: async (visitor_id: string) => {
    set({ loading: true, error: null })
    try {
      const data = await api.get(`/v1/visitors/${visitor_id}/kyc`)
      set({ kycStatus: data.kyc_status, loading: false })
    } catch (err) {
      set({ error: 'Failed to fetch KYC status', loading: false })
    }
  },
  
  submitDocuments: async (documents: KYCDocument[]) => {
    set({ loading: true, error: null })
    try {
      await api.post('/v1/visitors/kyc/documents', { documents })
      set({ kycStatus: 'PENDING', loading: false })
    } catch (err) {
      set({ error: 'Document submission failed', loading: false })
    }
  }
}))

// lib/store/usePriceCatalogStore.ts — Replace stub
export const usePriceCatalogStore = create<PriceCatalogState>((set) => ({
  entries: [],
  loading: false,
  error: null,
  
  fetchEntries: async () => {
    set({ loading: true })
    try {
      const data = await api.get('/v1/pricing/tna-issuance')
      set({ entries: data, loading: false })
    } catch (err) {
      set({ error: 'Failed to fetch pricing', loading: false })
    }
  },
  
  getRentQuote: async (params: RentQuoteParams): Promise<RentQuote> => {
    const data = await api.post('/v1/pricing/rent-quote', params)
    return data
  }
}))
```

---

## SECTION 7: UI STATE EXHAUSTIVENESS REQUIREMENTS

For every page, the following states MUST be handled — not just the happy path:

| State | Component | Trigger |
|-------|-----------|---------|
| `loading` | `SkeletonCard` (existing) | Awaiting API response |
| `error_network` | `ErrorAlert` with "Check connection" | Network failure |
| `error_unauthorized` | Redirect to `/auth/login` | 401 response |
| `error_forbidden` | `ErrorAlert` "You don't have permission" | 403 response |
| `error_not_found` | `EmptyState` with back button | 404 response |
| `error_conflict` | Inline `ErrorAlert` with specific message | 409 response (e.g., in-transit shipment blocking unbind) |
| `empty` | `EmptyState` (existing) with contextual CTA | API returns empty array |
| `partial_error` | Inline field-level error | Validation failure |
| `success` | `Toast` (auto-dismiss 4s) | Successful mutation |
| `optimistic_update` | Immediate UI update + background sync | User action before API confirms |

---

## SECTION 8: BILINGUAL UI REQUIREMENTS

All new text strings must use the `useT()` hook (existing `lib/hooks/useT.ts`). No hardcoded Arabic or English strings in components.

```typescript
// Required translation keys for new features:
{
  "kyc.title": "KYC Verification / التحقق من الهوية",
  "kyc.status.pending": "Under Review / قيد المراجعة",
  "kyc.status.verified": "Verified / موثق",
  "kyc.status.rejected": "Rejected / مرفوض",
  "tna.new.eligibility_check": "Checking eligibility / التحقق من الأهلية",
  "tna.new.kyc_required": "KYC verification required / التحقق من الهوية مطلوب",
  "binding.quote.gross": "Total Amount / المبلغ الإجمالي",
  "binding.quote.platform_fee": "Platform Fee / رسوم المنصة",
  "binding.quote.authority_share": "Authority Fee / رسوم الجهة الحكومية",
  "binding.quote.net_owner": "Owner Receives / يستلم المالك",
  "checkout.payment_blocked": "Binding not yet approved / لم تتم الموافقة على الربط بعد",
  "carrier.resolve.unlinked": "Return to Sender / الإعادة للمرسل",
  "carrier.resolve.deliverable": "Deliver to Address / التسليم للعنوان",
  "gov.address_queue.title": "Address Verification Queue / طابور التحقق من العناوين",
  "owner.property.deed_required": "Title deed is required / وثيقة الملكية مطلوبة"
}
```

---

## SECTION 9: DEPRECATED ROUTES TO CLEAN UP

| Deprecated Route | Replacement | Action |
|-----------------|-------------|--------|
| `/gov/verification/queue` | `/gov/tna-queue` | REDIRECT 301 |
| `/gov/verification/detail` | `/gov/tna-queue/[id]` | REDIRECT 301 |
| `/gov/verify` | `/gov/tna-queue/[id]` | REMOVE (orphaned) |
| `/gov/queue/[id]` | `/gov/tna-queue/[id]` | CONSOLIDATE |
| `/carrier/fleet` | `/carrier/staff` | RENAME |
| `/visitor/request` | `/visitor/tna/new` | REDIRECT 301 |
| `/owner/property/add` | `/owner/properties/new` | REDIRECT 301 |
| `components/ui/Modal.tsx` | `ModalOverlay` (existing) | REMOVE (legacy) |

---

## SECTION 10: PRODUCTION READINESS CHECKLIST

Before marking any page as complete, verify:

- [ ] All DB column references match data model v2.1 exact column names
- [ ] Loading state uses `SkeletonCard` from `components/ui/`
- [ ] Error states use `ErrorAlert` from `components/ui/`
- [ ] Empty state uses `EmptyState` from `components/shared/`
- [ ] Success actions use `Toast` from `components/ui/`
- [ ] API calls are in `lib/api/` modules, not directly in components
- [ ] Page is wrapped in `RoleGuard` with correct role
- [ ] All text uses `useT()` hook — zero hardcoded strings
- [ ] RTL layout tested with `dir="rtl"` class applied
- [ ] Mobile layout tested at 390px viewport width
- [ ] 409 conflict responses handled with user-facing explanation
- [ ] Financial amounts displayed in SAR with 2 decimal places
- [ ] TNA codes displayed with dash format (`TNA-XXXX1234`) in UI (stored without dash in DB)
- [ ] Resolver output never includes visitor PII fields
- [ ] `title_deed_reference` field enforced as required in property registration

---

*End of CFIP UX/UI Refactor Blueprint v1.0*
