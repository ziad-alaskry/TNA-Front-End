### 1. Constraint & Utility Audit

Based on the functional requirements and data models, utilities are categorized by operational priority to guide frontend weight distribution.

**Core Daily Utilities (High-Frequency/Mission-Critical)**
*   **Visitor**: TNA Issuance Request, TNA-to-NA Binding (Linking), Real-time Shipment Tracking.
*   **Owner**: NA Registration, Sub-address (Variant) Creation, Binding Approval/Rejection, Live Earnings Summary.
*   **Carrier**: TNA Resolver (TNA → NA Translation), Delivery Status Updates (Patching).
*   **Authority**: Issuance Review Queue, Sub-address Verification.

**Secondary/Administrative Utilities (Low-Frequency/Configuration)**
*   **System Admin**: Immutable Audit Log Viewing, Dispute Resolution, Emergency Binding Overrides.
*   **Authority**: Issuance Policy Config (Autonomous vs. Moderated), Pricing Catalog Management.
*   **Shared**: User Profile Management, KYC Documentation Uploads, Financial Transaction History/Invoices.

### 2. Information Architecture Optimization

To reduce **Dashboard Bloat** identified in existing flows, the architecture enforces a "Current State Only" rule for primary views.

*   **Relocation Logic**:
    *   **Financial History**: Migrate from "Home" to `/visitor/wallet` or `/owner/earnings/history`.
    *   **Identity/KYC**: Relegate to a "Security & Verification" tab within `/profile`.
    *   **Completed Shipments**: Move to an "Archive" sub-page; Dashboard only shows `IN_TRANSIT` or `OUT_FOR_DELIVERY`.
    *   **System Policies**: Authority dashboard should only show active "Policy Alerts"; full config moves to `/gov/settings/policy`.

### 3. Functional Gap Analysis

Cross-referencing the **Backend Design** [docx] against the **Current State** [md] identifies the following orphaned or under-implemented requirements:

*   **Financial Settlement UI**: Backend contains `settlement_adjustments` and `ledger_entries`, but the frontend lacks an interface for dispute-related financial corrections.
*   **KYC Workflow**: Backend requires `kyc_status` and `supporting_documents` for Visitors, but the current registration flow only captures basic personal info.
*   **Carrier Webhooks**: The `carriers` table specifies a `webhook_url` for delivery updates; the frontend requires a Carrier "Developer Portal" to manage these credentials.
*   **Pricing Management**: Backend supports `price_catalog` with dynamic rules, yet no Authority UI exists to modify these rates.

---

### 4. Technical Specifications for Implementation

#### A. Hierarchical Sitemap
A strictly nested navigation map for the autonomous agent.

*   **Root (/)**
    *   **Auth (/auth)**: Login, Register (Visitor | Owner | Gov | Carrier), Recovery.
    *   **Visitor Portal (/visitor)**
        *   **Dashboard**: Active TNAs, Current Bindings, Active Shipments.
        *   **TNA Hub**: Issuance Wizard, TNA List, Binding Manager.
        *   **Financials**: Wallet, Payment Methods, Transaction History.
        *   **Profile**: Identity Verification (KYC), Settings.
    *   **Owner Portal (/owner)**
        *   **Dashboard**: Pending Requests, Active Rentals, Daily Earnings.
        *   **Properties**: NA Registry, Sub-address (Suffix) Management.
        *   **Rentals**: Binding Approvals, Termination Tool.
        *   **Earnings**: Ledger, Payout Methods, Payout History.
    *   **Authority Portal (/gov)**
        *   **Review Center**: Issuance Queue, Sub-address Verification Queue.
        *   **Control Plane**: Issuance Policy, Price Catalog Mgmt.
        *   **Compliance**: Audit Log Viewer, System Reports.
    *   **Carrier Portal (/carrier)**
        *   **Ops**: TNA Resolver, Active Fleet/Staff.
        *   **Deliveries**: Shipment Tracking, Status Management.

#### B. Utility Mapping Matrix

| Feature Name | User Intent | Backend Entity / Endpoint | UI Implementation Point |
| :--- | :--- | :--- | :--- |
| **KYC Upload** | Verify Visitor Identity | `visitors.supporting_documents` | `/visitor/profile/verify` |
| **Suffix Manager** | Create NA Variants | `na_sub_addresses` | `/owner/properties/[id]/units` |
| **Binding Request** | Link TNA to NA | `bindings` / `rent_contracts` | `/visitor/tnas/bind` |
| **Payment Block** | Prevent unverified binding | `financial_transactions.status` | `BindingRequestModule` (Logic Gate) |
| **Safe Unlink** | Terminate address link | `POST /v1/bindings/{id}/terminate` | `/visitor/tnas/[id]` (Button) |
| **TNA Resolver** | Resolve TNA to Physical NA | `POST /v1/resolve` | `/carrier/tasks/resolve` |
| **Policy Toggle** | Switch Issuance Mode | `issuance_policy.issuance_mode` | `/gov/settings/policy` |

#### C. Flow Logic Blueprints

**Flow 1: Binding Activation with Mandatory Payment**
1.  **Trigger**: Visitor selects "Confirm Binding" on a selected NA Variant.
2.  **State Change**: Backend creates `bindings` entry (Status: `PENDING`) and `rent_contracts` entry.
3.  **Financial Gate**: Frontend redirects to `POST /v1/orders/{id}/pay`.
4.  **Verification**: Poll `financial_transactions.status`. Logic: **IF** status != `PAID`, **BLOCK** activation.
5.  **Activation**: Once `PAID`, update `bindings.status` to `ACTIVE`. UI reflects success state.

**Flow 2: Safe Unlinking (Termination Protection)**
1.  **Trigger**: User clicks "Terminate Binding".
2.  **In-Transit Check**: Frontend calls `GET /v1/tna/{tna_code}/binding`.
3.  **Logic Gate**: Backend checks `shipments` table for any records where `status` is `IN_TRANSIT`.
4.  **Error Handling**: If in-transit exists, return `409 Conflict`. UI displays: "Cannot unlink: Active deliveries in progress."
5.  **Finalization**: If no deliveries, `POST /v1/bindings/{id}/terminate`. Status updates to `TERMINATED`.

#### D. High-Density Dashboard Specification

**Top Tier (Actionable Signals - 40% Height)**
*   **Urgent Widgets**: "Action Required" list (Pending Approvals for Owners, Review Queue for Gov).
*   **Active Proxy**: High-visibility "Current TNA Code" with 1-click copy for Visitors.
*   **Critical Alerts**: "Shipment arriving today" or "Binding expiring in 48h".

**Middle Tier (Operational Summary - 40% Height)**
*   **Status Cards**: Active TNAs count, Active Bindings count, Total Monthly Earnings (SAR).
*   **Shipment Feed**: Mini-map or status list of the 3 most recent active deliveries.

**Bottom Tier (Global Actions - 20% Height)**
*   **Quick Actions**: "Issue New TNA," "Register Property," "Download Last Invoice".
*   **System Health**: (Admin/Carrier only) API status and Resolver latency.