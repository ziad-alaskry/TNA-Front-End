# Project TNA — Development Progress Report

This report analyzes the current frontend development progress of the TNA platform, cross-referencing the implemented Next.js routes within `src/app/[locale]` against the overarching targets established in `sitemap_final.json` and the backend `CFIP_Complete_Data_Model_v2.1_FINAL`.

## 1. Executive Summary

- **Overall Frontend UI Progress**: **~44%** (11 out of 25 planned core routes implemented).
- **Core Templates Progress**: **Complete**. All primary UI layouts (DashboardLayout, DataTableLayout, FormWizardLayout, DetailViewLayout) are established and reusable.
- **Architectural Implementation**: **Healthy**. App router is set up with multi-locale `[locale]` directionality (RTL/LTR) architecture, robust UI primitive components (Button, InputField, Select, FileUpload) integrated properly with React Hook Form + Zod validation.

---

## 2. Route Implementation Breakdown 

### 🔐 Auth Domain
*Status: 100% Complete*
- ✅ `/auth/login`: Implemented.
- ✅ `/auth/register/*`: Implemented (expanded into a multi-step sub-routing structure rather than a single `/auth/signup`).
- Uses Data Model: `users` table.

### 🏠 Visitor Portal
*Status: ~33% Complete (2/6 planned)*
- ✅ `/visitor/home`: Main dashboard built.
- ✅ `/visitor/request`: (Serves as `/visitor/tna/request`) Form Wizard integrated with mocked `tna_issuance_requests`.
- ➕ `/visitor/profile` & `/visitor/wallet`: Extra implemented modules adding value.
- ❌ **Missing**: `/visitor/search` (Address discovery), `/visitor/tna/detail` (TNA lifecycle), `/visitor/shipments` (Tracking tracking), `/visitor/checkout` (integrating with `financial_transactions`).

### 🏢 Owner Portal
*Status: ~33% Complete (2/6 planned)*
- ✅ `/owner/home`: Implemented Dashboard.
- ✅ `/owner/property/add`: Form Wizard mapping to `owner_national_addresses` implemented with `zod` validation.
- ❌ **Missing**: `/owner/properties` (Data Table for portfolio), `/owner/bindings` (Tenant links mapping to `rent_contracts`), `/owner/earnings`, `/owner/payouts` (integrating with `owner_accounts` and `payout_records`).

### 🚚 Carrier Portal
*Status: ~60% Complete (3/5 planned)*
- ✅ `/carrier/home`: Dashboard implemented.
- ✅ `/carrier/fleet`: Implemented Data Table connecting to `carrier_vehicles` and `carrier_staff`.
- ✅ `/carrier/shipments`: Implemented Data Table connecting to `shipments`.
- ➕ `/carrier/reports`: Extra module implemented.
- ❌ **Missing**: `/carrier/driver/tasks` (Daily route), `/carrier/driver/map` (Geospatial `MapTaskLayout` guidance).

### 🏛️ Government Portal
*Status: ~50% Complete (3/6 planned)*
- ✅ `/gov/home`: Implemented Governance Dashboard.
- ✅ `/gov/verification/queue`: Data Table implemented mapping to `tna_issuance_requests` pending queues.
- ✅ `/gov/verify`: (Matches `/gov/verification/detail`) Detail interface for document audits.
- ❌ **Missing**: `/gov/policy` (Mapping to `issuance_policy`), `/gov/audit` (Mapping to `admin_audit_log`), `/gov/agencies` (RBAC management mapping to `government_agencies`).

---

## 3. Data Model Alignment Analysis

The `CFIP` structure establishes a robust 25-table, 8-domain ecosystem. Based on current code analysis, we have started scaffolding the data consumption via TypeScript interfaces / Zod schemas matched exactly to CFIP columns:

1. **Identity & User Management (Domain 1)**: Integrated into auth forms. Zod schemas collect the correct fields (`document_type`, `document_number`, `national_id`).
2. **TNA Lifecycle (Domain 2)**: Form Wizards directly model `tna_issuance_requests` fields (`mode_at_submission`, `supporting_documents`).
3. **Physical Property Registry (Domain 3)**: Properly integrated. `/owner/property/add` collects `buildingName`, `unitNumber`, translating to `building_number`, `street_name`.
4. **Logistics & Delivery (Domain 5)**: Carrier sections contain precise Typescript definitions corresponding directly to `shipments`, `carrier_vehicles`, mapping fields like `status` ('at_hub', 'dispatched') correctly.
5. **Financial System & Ledger (Domain 6)**: *Pending Heavy Integration.* While frontend logic contains placeholders for payments (e.g., in visitor request), the formal connections to `financial_transactions`, `ledger_entries`, `price_catalog`, and `owner_accounts` have not been fully constructed on the front-end forms. 

## 4. Next Steps & Recommendations

To maintain momentum and address the gaps identified in this report:

1. **Construct Missing Financial/Owner Modules**: Implement the high-priority `/owner/bindings` and `/owner/earnings` data tables. This will unblock visualizing the Domain 6 logic (Rent Contracts & Owner Accounts).
2. **Build Visitor Search & Payment Flows**: Finalize the core loop for the visitor by creating `/visitor/search` (Address discovery constraint) and `/visitor/checkout`.
3. **Geospatial Map Integration**: Implement `/carrier/driver/map` utilizing the pre-existing `MapTaskLayout.tsx` to handle the `latitude` and `longitude` requirements of Domain 5.
