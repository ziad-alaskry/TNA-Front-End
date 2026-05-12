# Auth Flow Audit Fix List

## 1. Logic & Routing
- [CRITICAL] **Broken Link in Login:** The "Forgot Password" link on the login page points to `/en/auth/forgot-password` (404). It should point to `/en/forgot-password`.
- [CRITICAL] **Broken Link in Register:** The "Next" button in `RegisterTypeModule.tsx` points to `/auth/register/personal` (missing locale prefix and 404). Should be `/${locale}/register/personal`.
- [BUG] **Hardcoded Validation:** The Forgot Password flow uses a hardcoded verification code (`123456`) which is fine for dev but lacks a clear "Mock Mode" indicator.

## 2. Design & Visual Consistency
- [UI] **Icon Inconsistency:** Login page uses Google Material Symbols, while Register and Forgot Password pages use Phosphor Icons. Recommendation: Standardize on Phosphor Icons as per project TNA specs.
- [UI] **Layout Divergence:** The Login page uses a full-screen centered card with a geometric background, while the Forgot Password page uses a mobile-first header-main-footer layout. Recommendation: Unify the Auth container component.
- [UI] **Backdrop Blur:** The Forgot Password header correctly uses `backdrop-blur`, but this is missing from the Login and Register headers.

## 3. Internationalization (i18n)
- [MISSING] **Language Switcher:** There is no language switcher present on any of the authentication pages (Login, Register, Forgot Password).
- [BUG] **Hardcoded Direction:** `LoginPage.tsx` and `RegisterTypeModule.tsx` have `dir="rtl"` hardcoded on the root div. This prevents the English (LTR) layout from rendering correctly. These should respect the locale's direction from `LocaleProvider`.
- [IMPROVEMENT] **Hardcoded Strings:** Many Arabic strings are hardcoded in the component files (e.g., `LoginPage.tsx`). Move all text to `/public/locales/` JSON files to support English translation.

## 4. Responsivity
- [UX] **Mobile Viewports:** The `max-w-[480px]` constraint works well for mobile, but the decorative geometric patterns on the Login page should be hidden on smaller screens to reduce visual clutter.

## 5. Summary of Tested URLs
- Login: `http://localhost:3000/en/login` [FOUND]
- Register Type: `http://localhost:3000/en/register/type` [FOUND]
- Forgot Password: `http://localhost:3000/en/forgot-password` [FOUND - but linked incorrectly as /auth/forgot-password]
- Register Personal: `http://localhost:3000/en/register/personal` [NOT FOUND / 404]
