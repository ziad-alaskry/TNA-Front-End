# Backend Endpoint Map for Current Frontend

This document maps the backend endpoints needed to replace the current mock/context-driven frontend behavior. It is based on:

- Existing API client files in `src/lib/api/*`
- Shared frontend types in `src/lib/types/*`
- Mocked page flows in `src/app`
- Local providers in `src/context/*`

Base URL expected by the frontend API client:

```env
NEXT_PUBLIC_API_URL=/api
```

All authenticated requests should accept:

```http
Authorization: Bearer <token>
Content-Type: application/json
```

Recommended common response shape:

```ts
{
  data: T;
  message?: string;
  status?: number;
}
```

Recommended validation/error shape:

```ts
{
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}
```

## Status Enums Used by Frontend

```ts
UserRole = "VISITOR" | "OWNER" | "GOV_USER" | "CARRIER_STAFF";

TNARequestStatus =
  | "PENDING"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "ISSUED";

TNAStatus =
  | "UNLINKED"
  | "ACTIVE"
  | "EXPIRED"
  | "REVOKED"
  | "PENDING_OWNER_APPROVAL"
  | "SUSPENDED";

BindingStatus =
  | "PENDING"
  | "ACTIVE"
  | "COMPLETED"
  | "CANCELLED"
  | "TERMINATED";

ShipmentStatus =
  | "CREATED"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "FAILED"
  | "RETURNED";

CarrierVehicleStatus = "IDLE" | "ON_TRIP" | "MAINTENANCE";
OwnershipProofStatus = "PENDING" | "VERIFIED" | "REJECTED";
GovUserRole = "REVIEWER" | "APPROVER" | "ADMIN" | "AUDITOR";
```

## Existing API Client Endpoints

These endpoints are already referenced in `src/lib/api`.

### Auth

Source: `src/lib/api/auth.ts`, `src/lib/types/auth.ts`

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/login` | Login and return JWT plus user |
| POST | `/auth/signup` | Create user/profile and return JWT plus user |
| POST | `/auth/logout` | End current session |
| POST | `/auth/refresh` | Refresh JWT |
| POST | `/auth/forgot-password` | Start password reset flow |

#### POST `/auth/login`

Request:

```ts
{
  username: string;
  password_hash: string; // frontend comment says this may become plain password
}
```

Response:

```ts
{
  token: string;
  user: {
    user_id: string;
    username: string;
    email: string;
    user_role: UserRole;
    is_active: boolean;
    last_login_at?: string;
    created_at: string;
    updated_at: string;
  }
}
```

#### POST `/auth/signup`

Request:

```ts
{
  username: string;
  email: string;
  password?: string;
  password_hash?: string;
  user_role: UserRole;
  full_name: string;
  nationality: string;
  mobile: string;
  date_of_birth: string;
  document_type: "PASSPORT" | "VISA" | "IQAMA";
  document_number: string;
  is_entity?: boolean;
  entity_name?: string;
  license_number?: string;
  agency_type?: "HOTEL" | "TOURISM" | "OTHER";
}
```

Response: same as `/auth/login`.

#### POST `/auth/refresh`

Response:

```ts
{ token: string }
```

#### POST `/auth/forgot-password`

Request:

```ts
{ email: string }
```

### TNAs

Source: `src/lib/api/tna.ts`, `src/lib/types/tna.ts`, `src/context/BindingContext.tsx`, `src/context/GovContext.tsx`

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/tnas` | List TNAs for current user/context |
| GET | `/tnas/:id` | Get TNA detail |
| POST | `/tnas/request` | Create TNA issuance request |
| POST | `/tnas/:id/cancel` | Cancel/revoke a TNA |

#### TNA Object

```ts
{
  tna_id: string;
  visitor_id: string;
  issuance_request_id: string;
  tna_code: string;
  status: TNAStatus;
  issued_at: string;
  expires_at: string;
  revoked_at?: string;
  revocation_reason?: string;
  created_at?: string;
}
```

#### TNA Issuance Request Object

```ts
{
  request_id: string;
  visitor_id: string;
  request_status: TNARequestStatus;
  mode_at_submission: "MODERATED" | "AUTONOMOUS";
  reviewed_by_gov_user_id?: string;
  rejection_reason?: string;
  eligibility_snapshot?: unknown;
  supporting_documents: {
    doc_type: string;
    url: string;
    uploaded_at: string;
  }[];
  created_at: string;
  reviewed_at?: string;
  issued_at?: string;
}
```

#### GET `/tnas`

Response:

```ts
{ data: TNA[] }
```

#### GET `/tnas/:id`

Response:

```ts
{ data: TNA }
```

#### POST `/tnas/request`

Existing API type accepts `Partial<TNAIssuanceRequest>`, but the current visitor UI submits this effective payload:

```ts
{
  selectedAddress: string; // property/sub-address id from realEstateObjects
  selectedDuration: "1_month" | "3_months" | "6_months" | "12_months";
  paymentConfirmed: boolean;
}
```

Recommended backend request:

```ts
{
  sub_address_id: string;
  duration: "1_month" | "3_months" | "6_months" | "12_months";
  payment_confirmed: boolean;
  supporting_documents?: {
    doc_type: string;
    url: string;
  }[];
}
```

Response:

```ts
{ data: TNAIssuanceRequest }
```

The frontend will need either the issuance request or a created pending TNA with `tna_code`.

#### POST `/tnas/:id/cancel`

Request:

```ts
{ reason?: string }
```

### Address / Property

Source: `src/lib/api/naVariants.ts`, `src/lib/types/na.ts`, `src/lib/types/owner.ts`, `src/app/[locale]/owner/property/add/page.tsx`

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/addresses/search?q=` | Search national/registered addresses |
| GET | `/addresses/:id` | Get address detail |
| POST | `/addresses/register` | Register owner property/address |

#### NationalAddress Object

```ts
{
  na_id: string;
  owner_id: string;
  full_address: string;
  building_number?: string;
  street_name?: string;
  district?: string;
  city: string;
  postal_code?: string;
  additional_number?: string;
  unit_number?: string;
  latitude?: number;
  longitude?: number;
  registry_reference?: unknown;
  title_deed_reference: string;
  na_certificate_url?: string;
  ownership_proof_status: OwnershipProofStatus;
  verified_at?: string;
  created_at: string;
}
```

#### GET `/addresses/search?q=query`

Response:

```ts
{ data: NationalAddress[] }
```

#### POST `/addresses/register`

Current owner property form submits:

```ts
{
  name: string;
  city: string;
  district: string;
  registry_ref: string;
  building_number: string;
  has_docs: boolean;
}
```

Recommended backend request:

```ts
{
  name: string;
  city: string;
  district: string;
  building_number: string;
  title_deed_reference: string;
  registry_reference?: unknown;
  document_urls?: string[];
}
```

Response:

```ts
{ data: NationalAddress }
```

### Bindings

Source: `src/lib/api/bindings.ts`, `src/lib/types/bindings.ts`, `src/context/BindingContext.tsx`, `src/app/[locale]/owner/bindings/page.tsx`

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/bindings?role=visitor|owner` | List binding/linking requests |
| POST | `/bindings/:id/approve` | Owner approves binding |
| POST | `/bindings/:id/reject` | Owner rejects binding |

#### Binding Object

```ts
{
  binding_id: string;
  tna_id: string;
  sub_address_id: string;
  rent_contract_id?: string;
  status: BindingStatus;
  start_at: string;
  end_at: string;
  approved_by_owner_id?: string;
  approved_at?: string;
  termination_reason?: string;
  created_at: string;
  updated_at: string;
  tna_code?: string;
  na_id?: string;
  visitor_id?: string;
}
```

#### POST `/bindings/:id/approve`

Response:

```ts
{ data: Binding }
```

Side effects expected by UI:

- Binding/TNA becomes active
- Owner account balance increases by fee

#### POST `/bindings/:id/reject`

Request:

```ts
{ reason?: string }
```

### Shipments / Deliveries

Source: `src/lib/api/deliveries.ts`, `src/lib/types/deliveries.ts`, `src/app/[locale]/visitor/shipments/new/page.tsx`, `src/app/[locale]/carrier/shipments/page.tsx`

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/shipments?role=visitor|carrier` | List shipments |
| GET | `/shipments/:id` | Get shipment detail |
| PATCH | `/shipments/:id/status` | Update shipment status |

#### Shipment Object

```ts
{
  shipment_id: string;
  carrier_id: string;
  tracking_number: string;
  tna_id: string;
  assigned_staff_id?: string;
  status: ShipmentStatus;
  origin_address?: string;
  destination_address_full?: string;
  estimated_delivery?: string;
  actual_delivery?: string;
  delivery_signature?: string;
  delivery_photo_url?: string;
  package_details?: {
    weight?: number;
    dimensions?: string;
    contents?: string;
  };
  failure_reason?: string;
  created_at: string;
  updated_at: string;
}
```

#### PATCH `/shipments/:id/status`

Request:

```ts
{
  status: ShipmentStatus;
  notes?: string;
}
```

Response:

```ts
{ data: Shipment }
```

### Admin / Government

Source: `src/lib/api/admin.ts`, `src/lib/types/admin.ts`, `src/app/[locale]/gov/*`

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/admin/audit-logs` | List audit logs |
| GET | `/admin/policy-config` | Get active policy config |
| PATCH | `/admin/policy-config` | Update policy config |
| GET | `/admin/gov-users` | List government users |
| PATCH | `/admin/gov-users/:id` | Update government user |

#### AuditLogEntry Object

```ts
{
  log_id: string;
  action_type: string;
  actor_id: string;
  actor_type: string;
  resource_type: string;
  resource_id: string;
  old_value?: unknown;
  new_value?: unknown;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}
```

#### PolicyConfiguration Object

```ts
{
  config_id: string;
  policy_name: string;
  issuance_mode: "MODERATED" | "AUTONOMOUS";
  eligibility_rules: unknown;
  pricing_catalog_id: string;
  is_active: boolean;
  effective_from: string;
  effective_until?: string;
  created_at: string;
}
```

#### GovUser Object

```ts
{
  gov_user_id: string;
  user_id: string;
  agency_id: string;
  full_name: string;
  employee_id: string;
  department?: string;
  position?: string;
  role: GovUserRole;
  additional_permissions?: string[];
  is_active: boolean;
  created_at: string;
}
```

## Additional Endpoints Needed by Mocked UI

These are not all present in `src/lib/api` yet, but the current app pages need them when mocks are removed.

### Auth and Registration Completion

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/password-reset/request` | Request reset code/link |
| POST | `/auth/password-reset/verify` | Verify reset OTP/code |
| POST | `/auth/password-reset/complete` | Set new password |
| GET | `/auth/me` | Load current user/session |

Password reset forms are in `src/components/modules/auth/ForgotPasswordModule.tsx`.

### Visitor Dashboard / Profile / Wallet

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/visitor/dashboard` | Visitor summary cards, recent TNAs, wallet summary |
| GET | `/visitor/profile` | Current visitor profile |
| PATCH | `/visitor/profile` | Update visitor profile |
| GET | `/visitor/wallet` | Wallet balance |
| GET | `/visitor/wallet/transactions` | Wallet transaction history |
| POST | `/visitor/wallet/top-up` | Add funds if supported |

Wallet transaction fields currently displayed:

```ts
{
  id: string;
  type: "DEBIT" | "CREDIT";
  description: string;
  amount: number;
  date: string;
  status: "COMPLETED" | "PENDING" | "FAILED";
}
```

### TNA Eligibility and Government Review

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/tnas/eligibility` | Check whether visitor can request another TNA |
| GET | `/tnas/requests` | List issuance requests for current user/admin |
| GET | `/tnas/requests/:id` | Get issuance request detail |
| PATCH | `/tnas/requests/:id/status` | Government updates request status |
| POST | `/tnas/requests/:id/approve` | Government approves request and issues TNA |
| POST | `/tnas/requests/:id/reject` | Government rejects request |

Current government verify page expects detail like:

```ts
{
  request_id: string;
  visitor: {
    name: string;
    id_number: string;
    nationality: string;
    document_source: string;
  };
  tna: {
    code: string;
    type: "RESIDENTIAL" | "COMMERCIAL";
    request_date: string;
  };
  eligibility: {
    is_new_registrant: boolean;
    has_previous_violations: boolean;
    credit_score_parity?: string;
  };
  supporting_documents: {
    doc_type: string;
    url: string;
    uploaded_at: string;
  }[];
}
```

Approve/reject request:

```ts
{
  reason?: string;
  notes?: string;
}
```

### Owner Properties and Earnings

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/owner/dashboard` | Owner home summary |
| GET | `/owner/properties` | List owner properties |
| GET | `/owner/properties/:id` | Property detail |
| POST | `/owner/properties` | Create property |
| PATCH | `/owner/properties/:id` | Update property |
| PATCH | `/owner/properties/:id/auto-accept` | Toggle auto-accept |
| GET | `/owner/account` | Owner account/balance |
| GET | `/owner/earnings` | Income records |
| GET | `/owner/payouts` | Payout records |
| POST | `/owner/payouts` | Request withdrawal |

Property list UI expects:

```ts
{
  id: string;
  name: string;
  building_number: string;
  sector_id?: string;
  is_verified: boolean | "VERIFIED" | "PENDING";
  auto_accept: boolean;
  created_at?: string;
}
```

Owner account:

```ts
{
  account_id: string;
  owner_id: string;
  current_balance: number;
  pending_balance: number;
  total_earned: number;
  total_paid_out: number;
  currency: string;
  payout_method: "BANK_TRANSFER" | "WALLET" | "CHECK";
  payout_details?: unknown;
  last_payout_at?: string;
  account_status: "ACTIVE" | "SUSPENDED" | "CLOSED";
  updated_at: string;
}
```

Withdrawal request:

```ts
{
  amount: number;
  payout_method: "BANK_TRANSFER" | "WALLET" | "CHECK";
  payout_details?: unknown;
}
```

### Shipment Creation, Carrier Quotes, and Waybills

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/shipments/quote` | Return carrier options/prices |
| POST | `/shipments` | Create shipment |
| GET | `/shipments/:id/waybill` | Download/get waybill |
| POST | `/shipments/:id/assign-driver` | Assign driver to shipment |
| POST | `/shipments/bulk-dispatch` | Dispatch selected shipments |
| GET | `/shipments/:id/status-logs` | Tracking/status timeline |

Current new shipment form submits:

```ts
{
  origin: string; // "current" or TNA code
  destination: string; // TNA code or full address
  weight: string;
  category: "documents" | "electronics" | "clothes" | "food" | "other";
  carrier: string;
}
```

Recommended create shipment request:

```ts
{
  origin_tna_code?: string;
  origin_address?: string;
  destination_tna_code?: string;
  destination_address?: string;
  carrier_id: string;
  package_details: {
    weight?: number;
    dimensions?: string;
    contents?: string;
    category?: string;
  };
}
```

Quote response:

```ts
{
  data: {
    carrier_id: string;
    carrier_name: string;
    price: number;
    currency: "SAR";
    estimated_time: string;
  }[]
}
```

Bulk dispatch request:

```ts
{
  shipment_ids: string[];
}
```

Assign driver request:

```ts
{
  shipment_ids?: string[];
  assigned_staff_id: string;
}
```

### Carrier Company, Staff, Fleet, Reports, Integration

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/carrier/dashboard` | Carrier home summary |
| POST | `/carriers/register` | Register carrier company |
| GET | `/carrier/profile` | Current carrier company |
| PATCH | `/carrier/profile` | Update carrier company |
| GET | `/carrier/staff` | List carrier staff |
| POST | `/carrier/staff` | Add staff/driver |
| PATCH | `/carrier/staff/:id` | Update staff |
| GET | `/carrier/fleet` | List vehicles/fleet |
| POST | `/carrier/fleet` | Add vehicle |
| PATCH | `/carrier/fleet/:id` | Update vehicle |
| POST | `/carrier/fleet/:id/assign-driver` | Assign driver to vehicle |
| PATCH | `/carrier/fleet/:id/status` | Update vehicle status |
| GET | `/carrier/driver/tasks` | Driver task list |
| GET | `/carrier/driver/tasks/:id` | Driver task/map detail |
| PATCH | `/carrier/driver/tasks/:id/status` | Driver updates task state |
| GET | `/carrier/reports` | Available reports |
| GET | `/carrier/reports/metrics` | Report metrics |
| GET | `/carrier/integration` | API key/webhook config |
| POST | `/carrier/integration/api-key/rotate` | Generate/rotate API key |
| PATCH | `/carrier/integration/webhook` | Save webhook URL |

Carrier company registration payload:

```ts
{
  company_name: string;
  company_type: "LOGISTICS" | "DELIVERY" | "OTHER";
  license_number: string;
  mobile: string;
  email: string;
  api_key?: string;
  webhook_url?: string;
  api_data_confirmed: boolean;
}
```

Carrier staff creation payload:

```ts
{
  full_name: string;
  role: "DRIVER" | "DISPATCHER" | "MANAGER";
  mobile: string;
  license_number?: string;
  national_id: string;
  nationality: string;
  date_of_birth: string;
  personalDataConfirmed: boolean;
}
```

Carrier vehicle object:

```ts
{
  vehicle_id: string;
  carrier_id: string;
  plate_number: string;
  vehicle_type: string;
  status: CarrierVehicleStatus;
  assigned_staff_id?: string;
  last_known_latitude?: number;
  last_known_longitude?: number;
  updated_at: string;
}
```

Driver task object currently displayed:

```ts
{
  id: string;
  tna_code: string;
  customer: string;
  address: string;
  time: string;
  status: "PENDING" | "NAVIGATING" | "DELIVERED";
  priority: "HIGH" | "NORMAL";
}
```

### Government Agencies

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/admin/agencies` | List government agencies |
| POST | `/admin/agencies` | Create agency |
| PATCH | `/admin/agencies/:id` | Update agency |
| GET | `/admin/agencies/:id/users` | List users for agency |
| POST | `/admin/agencies/:id/users` | Add government staff to agency |

Agency object:

```ts
{
  agency_id: string;
  agency_code: string;
  agency_name_en: string;
  agency_name_ar?: string;
  parent_agency_id?: string;
  permissions?: string[];
  is_active: boolean;
  created_at: string;
}
```

## Current Local Next.js API Route

Source: `src/app/api/auth/[...nextauth]/route.ts`

The route currently implements:

| Method | Endpoint | Current behavior |
|---|---|---|
| GET | `/api/auth/[...nextauth]` | Returns `{ message: "NextAuth placeholder" }` |
| POST | `/api/auth/[...nextauth]` | Returns `{ message: "NextAuth placeholder" }` |

If NextAuth remains part of the architecture, this route needs a real NextAuth handler. If the backend owns JWT auth directly, this placeholder route can be removed or left unused while the frontend calls `NEXT_PUBLIC_API_URL`.

## Frontend Integration Priority

To replace mocks with real backend data in the least disruptive order:

1. Auth: `/auth/login`, `/auth/signup`, `/auth/me`, `/auth/logout`
2. Visitor/owner core data: `/tnas`, `/tnas/request`, `/owner/properties`, `/bindings`
3. Wallet/account: `/visitor/wallet`, `/visitor/wallet/transactions`, `/owner/account`, `/owner/earnings`
4. Shipments: `/shipments`, `/shipments/quote`, `/shipments/:id/status`, `/shipments/bulk-dispatch`
5. Carrier: `/carrier/staff`, `/carrier/fleet`, `/carrier/driver/tasks`, `/carrier/integration`
6. Government: `/tnas/requests`, `/tnas/requests/:id/approve`, `/admin/audit-logs`, `/admin/policy-config`, `/admin/gov-users`, `/admin/agencies`

