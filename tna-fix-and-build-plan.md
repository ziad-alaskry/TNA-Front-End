# TNA Frontend — Fix & Build Plan

**Objective:** Address high-priority UI/UX bugs and implement missing core modules across all user roles to achieve full functional depth.

---

## Phase 1: High Priority Fixes 🛠️

### 1.1 — Dynamic Role-Based Branding
- **Problem:** Primary colors are currently static.
- **Solution:** 
  - Update `globals.css` to support role-specific CSS variables (e.g., `--primary-visitor`, `--primary-owner`).
  - Implement a `ThemeWrapper` or update `AppShell` to apply a role-specific class to the body (e.g., `theme-visitor`, `theme-owner`).
  - Update `tailwind.config.js` to use these dynamic variables for `primary` and `accent` colors.

### 1.2 — i18n Audit & UI Polish
- **Problem:** Missing translations, raw keys showing in UI, low contrast language switcher, and non-clickable buttons.
- **Solution:**
  - **Audit:** Search for all `t('...')` calls and ensure they exist in both `ar.json` and `en.json`.
  - **Placeholders:** Fix `searchPlaceholders` and component titles by mapping them to correct i18n keys.
  - **Language Switcher:** Restyle with high-contrast borders and backdrop-blur; ensure it stands out against all role-based themes.
  - **Interactivity:** Audit all `<Button>` and `<a>` tags to ensure `onClick` handlers or `href` attributes are correctly wired and not blocked by overlays.

---

## Phase 2: Missing Screens & Features (To-Build) 🏗️

### A — Visitor Module
- **TNA Request Code Flow:**
  - Implement the "Request New TNA" wizard (Address Selection → Link Duration → Payment → Issuance).
  - Add logic to check eligibility before allowing a request.
- **Shipment Request Flow:**
  - Build the "Create Shipment" screen.
  - Integration with registered TNAs as origin/destination.

### B — Owner Module
- **Binding Automation:**
  - Fix the "Auto Accept Binding" toggle logic in the property management screen.
- **Withdrawal Wizard:**
  - Implement a multi-step withdrawal dialog (Amount → Method [Bank Transfer / STC Pay] → Confirmation).
  - Add validation for minimum withdrawal amounts and wallet balance.
- **B2B Support:**
  - Extend Owner registration/profile to handle "Hotels" and "Tourism Agencies" as entity types.
  - Add B2B-specific fields (License Number, Agency Type).

### C — Government Module
- **Agency Management:**
  - Screen for "Add New Agency" (Name, Region, Department, Admin User).
  - Screen for "Add Employee/Personnel" within specific agencies.
- **Policy Engine:**
  - Add "Conditions" editor within the Policy Configuration module.
  - Allow Gov users to define rules (e.g., "Max 3 TNAs per visitor", "Restricted regions").

### D — Carrier Module
- **Enterprise Registration:**
  - "Logistics Company Registration" screen.
  - API Connection/Integration settings panel (Webhook URLs, API Keys).
- **Operations & Personnel:**
  - Screen for "Add Employee/Personnel" (Dispatchers, Fleet Managers).
  - Shipment Request & Control module for managing high-volume logistics tasks.

---

## Phase 3: Verification & Integration 🔍

- **RTL/LTR Validation:** Ensure all new screens flip correctly and translations are accurate.
- **Theme Testing:** Verify that primary colors shift correctly when switching between roles.
- **Flow Validation:** Smoke test the new wizards (Withdrawal, TNA Request, Agency Creation).
