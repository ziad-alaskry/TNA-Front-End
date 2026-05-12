# Backend API Integration Plan

This document outlines a detailed plan for integrating the backend APIs, as described in `BACKEND_ENDPOINT_MAP.md`, into the frontend application. The goal is to replace mock data and context-driven behavior with real data fetched from the backend, ensuring a fully functional and robust application.

## 1. Introduction
This plan details the strategic approach, prioritized tasks, and technical considerations for integrating the defined backend API endpoints into the existing Next.js frontend application.

## 2. Project Context
- **Technology Stack:** Next.js (App Router), Tailwind CSS, TypeScript, Context API.
- **Design Standards:** Production-grade, distinctive UI/UX, slate-100/200 palette, Rubik/JetBrains Mono fonts, modern best practices. (Refer to `GEMINI.md` for full details).
- **API Client Base URL:** `NEXT_PUBLIC_API_URL=/api`
- **Authentication:** JWT-based, with token refresh mechanism.

## 3. Overall Integration Strategy
The integration will be performed in phases, following the priority order outlined in `BACKEND_ENDPOINT_MAP.md`. Each phase will involve:
1.  **API Client Updates:** Creating or updating corresponding API client files in `src/lib/api/`.
2.  **Type Definitions:** Defining or updating TypeScript types in `src/lib/types/`.
3.  **Context/State Management:** Integrating API calls into relevant Context API providers (e.g., `TNAContext`, `BindingContext`, new contexts).
4.  **Component Implementation:** Modifying or creating frontend components to consume API data and handle user interactions.
5.  **Error Handling:** Implementing robust error handling and user feedback mechanisms.
6.  **Validation:** Thorough testing at each stage.

## 4. Phased Implementation Plan

### Phase 1: Authentication (Priority 1)

**Objective:** Implement core authentication flows and user session management.

**Endpoints:**
- `POST /auth/login`
- `POST /auth/signup`
- `POST /auth/logout`
- `POST /auth/refresh`
- `POST /auth/forgot-password`
- `POST /auth/password-reset/request`
- `POST /auth/password-reset/verify`
- `POST /auth/password-reset/complete`
- `GET /auth/me`

**Frontend Actions:**
1.  **Update/Create API Client:** Enhance `src/lib/api/auth.ts` to handle all listed endpoints.
2.  **Update Types:** Ensure `src/lib/types/auth.ts` accurately reflects request/response payloads.
3.  **State Management:**
    *   Implement logic in `src/context/AuthContext` (or create if not exists) for managing JWT, user session, login, logout, and refresh.
    *   Handle automatic token refresh on expiry.
4.  **Component Implementation:**
    *   Update/create components for login, signup, forgot password, and password reset forms.
    *   Implement logic to display user profile/session info (`/auth/me`).
5.  **Error Handling:** Display appropriate messages for authentication failures.
6.  **NextAuth Route:** Evaluate `src/app/api/auth/[...nextauth]/route.ts`. If backend handles JWT directly, this placeholder can be removed or ignored.

### Phase 2: Visitor/Owner Core Data (Priority 2)

**Objective:** Integrate core data related to TNAs, Properties, and Bindings for Visitors and Owners.

#### 2.1 TNA Management

**Endpoints:**
- `GET /tnas` (List TNAs)
- `GET /tnas/:id` (Get TNA detail)
- `POST /tnas/request` (Create TNA issuance request)
- `POST /tnas/:id/cancel` (Cancel/revoke TNA)
- `GET /tnas/eligibility` (Check TNA eligibility)
- `GET /tnas/requests` (List issuance requests)
- `GET /tnas/requests/:id` (Get issuance request detail)
- `PATCH /tnas/requests/:id/status` (Gov update request status)
- `POST /tnas/requests/:id/approve` (Gov approve request and issue TNA)
- `POST /tnas/requests/:id/reject` (Gov reject request)

**Frontend Actions:**
1.  **Update/Create API Client:** Enhance `src/lib/api/tna.ts`.
2.  **Update Types:** Update `src/lib/types/tna.ts`.
3.  **State Management:** Integrate into `TNAContext.tsx` and `GovContext.tsx`.
4.  **Component Implementation:** Update components for TNA listing, detail view, request submission, and government review/approval screens.

#### 2.2 Address / Property Management

**Endpoints:**
- `GET /addresses/search?q=` (Search addresses)
- `GET /addresses/:id` (Get address detail)
- `POST /addresses/register` (Register owner property)

**Frontend Actions:**
1.  **Update/Create API Client:** Enhance `src/lib/api/naVariants.ts` (or create new if appropriate).
2.  **Update Types:** Update `src/lib/types/na.ts`, `src/lib/types/owner.ts`.
3.  **State Management:** Potentially new context for property management or integrate with owner-related context.
4.  **Component Implementation:** Update property registration forms (`src/app/[locale]/owner/property/add/page.tsx`) and property listing/detail views.

#### 2.3 Bindings

**Endpoints:**
- `GET /bindings?role=visitor|owner` (List binding requests)
- `POST /bindings/:id/approve` (Owner approves binding)
- `POST /bindings/:id/reject` (Owner rejects binding)

**Frontend Actions:**
1.  **Update/Create API Client:** Enhance `src/lib/api/bindings.ts`.
2.  **Update Types:** Update `src/lib/types/bindings.ts`.
3.  **State Management:** Integrate into `BindingContext.tsx`.
4.  **Component Implementation:** Update components for displaying binding requests and handling owner approval/rejection.

### Phase 3: Wallet / Account (Priority 3)

**Objective:** Integrate financial data and transaction history for Visitors and Owners.

**Endpoints:**
- `GET /visitor/dashboard` (Visitor summary)
- `GET /visitor/profile` (Visitor profile)
- `PATCH /visitor/profile` (Update visitor profile)
- `GET /visitor/wallet` (Wallet balance)
- `GET /visitor/wallet/transactions` (Wallet transaction history)
- `POST /visitor/wallet/top-up` (Add funds)
- `GET /owner/dashboard` (Owner summary)
- `GET /owner/account` (Owner account/balance)
- `GET /owner/earnings` (Income records)
- `GET /owner/payouts` (Payout records)
- `POST /owner/payouts` (Request withdrawal)

**Frontend Actions:**
1.  **Update/Create API Client:** Create new files like `src/lib/api/visitor.ts`, `src/lib/api/owner.ts`.
2.  **Update Types:** Create new types in `src/lib/types/visitor.ts`, `src/lib/types/owner.ts`.
3.  **State Management:** Integrate into existing or new contexts for visitor and owner dashboards/accounts.
4.  **Component Implementation:** Implement or update components for profile management, wallet balance display, transaction history, and payout requests.

### Phase 4: Shipments / Deliveries (Priority 4)

**Objective:** Implement shipment creation, tracking, and management for Visitors and Carriers.

**Endpoints:**
- `POST /shipments/quote` (Carrier options/prices)
- `POST /shipments` (Create shipment)
- `GET /shipments/:id/waybill` (Download/get waybill)
- `POST /shipments/:id/assign-driver` (Assign driver)
- `POST /shipments/bulk-dispatch` (Dispatch selected shipments)
- `GET /shipments/:id/status-logs` (Tracking/status timeline)
- `GET /shipments?role=visitor|carrier` (List shipments)
- `GET /shipments/:id` (Get shipment detail)
- `PATCH /shipments/:id/status` (Update shipment status)

**Frontend Actions:**
1.  **Update/Create API Client:** Enhance `src/lib/api/deliveries.ts`.
2.  **Update Types:** Update `src/lib/types/deliveries.ts`.
3.  **State Management:** Integrate into relevant contexts for shipment management.
4.  **Component Implementation:** Implement shipment creation forms, quote display, tracking views, and carrier-specific shipment management interfaces.

### Phase 5: Carrier Company, Staff, Fleet, Reports, Integration (Priority 5)

**Objective:** Implement features for carrier companies to manage their operations.

**Endpoints:**
- `GET /carrier/dashboard` (Carrier home summary)
- `POST /carriers/register` (Register carrier company)
- `GET /carrier/profile` (Current carrier company)
- `PATCH /carrier/profile` (Update carrier company)
- `GET /carrier/staff` (List carrier staff)
- `POST /carrier/staff` (Add staff/driver)
- `PATCH /carrier/staff/:id` (Update staff)
- `GET /carrier/fleet` (List vehicles/fleet)
- `POST /carrier/fleet` (Add vehicle)
- `PATCH /carrier/fleet/:id` (Update vehicle)
- `POST /carrier/fleet/:id/assign-driver` (Assign driver to vehicle)
- `PATCH /carrier/fleet/:id/status` (Update vehicle status)
- `GET /carrier/driver/tasks` (Driver task list)
- `GET /carrier/driver/tasks/:id` (Driver task/map detail)
- `PATCH /carrier/driver/tasks/:id/status` (Driver updates task state)
- `GET /carrier/reports` (Available reports)
- `GET /carrier/reports/metrics` (Report metrics)
- `GET /carrier/integration` (API key/webhook config)
- `POST /carrier/integration/api-key/rotate` (Generate/rotate API key)
- `PATCH /carrier/integration/webhook` (Save webhook URL)

**Frontend Actions:**
1.  **Update/Create API Client:** Create new file `src/lib/api/carrier.ts`.
2.  **Update Types:** Create new types in `src/lib/types/carrier.ts`.
3.  **State Management:** Implement new contexts or integrate into existing ones for carrier operations.
4.  **Component Implementation:** Build out carrier-specific dashboards, registration forms, staff management, fleet management, driver task views, and integration settings.

### Phase 6: Government Agencies (Priority 6)

**Objective:** Implement administrative features for government users.

**Endpoints:**
- `GET /admin/agencies` (List government agencies)
- `POST /admin/agencies` (Create agency)
- `PATCH /admin/agencies/:id` (Update agency)
- `GET /admin/agencies/:id/users` (List users for agency)
- `POST /admin/agencies/:id/users` (Add government staff to agency)
- `GET /admin/audit-logs` (List audit logs)
- `GET /admin/policy-config` (Get active policy config)
- `PATCH /admin/policy-config` (Update policy config)
- `GET /admin/gov-users` (List government users)
- `PATCH /admin/gov-users/:id` (Update government user)

**Frontend Actions:**
1.  **Update/Create API Client:** Create new file `src/lib/api/admin.ts`.
2.  **Update Types:** Create new types in `src/lib/types/admin.ts`.
3.  **State Management:** Integrate into `GovContext.tsx` or create new admin-specific contexts.
4.  **Component Implementation:** Develop interfaces for agency management, user management, policy configuration, and audit log viewing.

## 5. Technical Considerations

### 5.1 API Client Structure
- Maintain a consistent naming convention for API client files and functions.
- Abstract common request/response handling (e.g., adding JWT, processing common response shapes, error interception) into a base API client utility.

### 5.2 State Management
- Leverage Next.js Context API for global state management.
- Ensure new contexts are created for distinct domains (e.g., `CarrierContext`, `AdminContext`) as needed.
- Use dedicated hooks to expose API data and loading/error states to components.

### 5.3 Error Handling
- Implement a centralized error handling mechanism.
- Display user-friendly error messages for API failures (e.g., using toasts or dedicated error components).
- Handle specific error codes or messages from the backend for more nuanced feedback.

### 5.4 Authentication and Authorization
- Securely store JWT tokens (e.g., using HTTP-only cookies or local storage with appropriate security measures).
- Implement automatic token refresh using the `/auth/refresh` endpoint.
- Protect routes and API calls based on user roles (`UserRole` enum).

### 5.5 Type Safety
- Ensure all API request and response payloads are strictly typed using TypeScript.
- Utilize the provided status enums and recommended shapes.

### 5.6 Environment Variables
- Confirm `NEXT_PUBLIC_API_URL` is correctly configured in the environment.

## 6. Validation Strategy
- **Unit Tests:** Write unit tests for each API client function to verify request formatting, response parsing, and error handling.
- **Integration Tests:** Test components that consume API data to ensure they correctly display information and handle loading/error states.
- **End-to-End Tests:** Implement E2E tests for critical user flows (e.g., user signup, TNA request, shipment creation) to validate the complete integration.
- **Code Reviews:** Conduct thorough code reviews for all API integration changes.

## 7. Conclusion
Successful implementation of this plan will transition the application from mock data to live backend data, enabling full functionality across all user roles and features.
