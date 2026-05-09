# Implementation Plan - Sprint 2: Visitor Lifecycle Completion

This plan completes the Visitor lifecycle logic, focusing on the unbind guard, checkout persistence, and shipment wizard synchronization.

## User Review Required

> [!IMPORTANT]
> - I will create a new route `/visitor/tnas/[id]/unbind` which will contain the logic to block unbinding if `IN_TRANSIT` shipments exist for that TNA.
> - I will update `CheckoutModule.tsx` to simulate balance persistence using a global context or local storage (to avoid real API but maintain consistency).

## Proposed Changes

### 1. Unbind Guard Logic

#### [Unbind Page](tna-project/src/app/[locale]/visitor/tnas/[id]/unbind/page.tsx) (New File)
- Check `shipments.mock.ts` for any shipment with `tna_id === id` and `status === 'IN_TRANSIT'`.
- If blocked: Show a SPATIAL-compliant error UI with a list of active tracking numbers.
- If allowed: Show a confirmation wizard to unbind.
- Integration: Update `VisitorTnaDetailPage` to add an "Unbind" button in the sidebar when status is `ACTIVE`.

---

### 2. Checkout & Payment Persistence

#### [Financials Mock](tna-project/src/lib/mock/financials.mock.ts)
- Currently, `mockBalances` is a static object. I will wrap its usage in a hook or update the `CheckoutModule` to use local storage to simulate a "live" wallet.

#### [Checkout Module](tna-project/src/components/modules/visitor/CheckoutModule.tsx)
- Update `handlePayment` to subtract from the local storage balance.
- Update `handleTopUp` to add to the local storage balance.

---

### 3. Shipment Wizard Synchronization

#### [New Shipment Page](tna-project/src/app/[locale]/visitor/shipments/new/page.tsx)
- Filter the `origin` and `destination` selects to only show `ACTIVE` TNAs from the `visitorTnas` context.
- (Wait, the strategy says "Order Shipment wizard must only list ACTIVE (bound) source addresses"). I will ensure that if a TNA is `UNLINKED` or `PENDING_OWNER_APPROVAL`, it is excluded from the source list.

---

## Verification Plan

### Automated Tests
- Add Playwright test `tests/e2e/unbind-guard.spec.ts`:
  - Scenario 1: Visitor attempts to unbind a TNA with an `IN_TRANSIT` shipment -> Should be blocked.
  - Scenario 2: Visitor attempts to unbind a TNA with only `DELIVERED` shipments -> Should be allowed.

### Manual Verification
1. **Unbind Guard:**
   - Go to TNA details for `tna-1` (which has an in-transit shipment in mocks).
   - Click "Unbind".
   - Verify the error message and listed tracking number `TRK-789012`.
2. **Checkout Persistence:**
   - Top up the wallet via `CheckoutModule`.
   - Refresh the page.
   - Verify the balance persists in the `Header` and `CheckoutModule`.
3. **Shipment Wizard:**
   - Create a new shipment.
   - Verify that only `ACTIVE` TNAs appear in the dropdown.
