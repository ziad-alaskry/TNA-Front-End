# hidden-eagle.md — TNA Platform Technical Source of Truth

> **SPATIAL Design System v2.0 Architecture Documentation**  
> **Base Unit:** 4px grid | **Directionality:** RTL (Arabic) primary, LTR (English) secondary

---

## 1. ARCHITECTURAL DIRECTORY TOPOLOGY

```
src/
├── app/
│   ├── [locale]/                     # Dynamic locale route segment (ar|en)
│   │   ├── layout.tsx                # Root layout with Gov/Fleet/Binding providers
│   │   ├── (auth)/                   # Auth route group (parallel segment)
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx              # Auth landing
│   │   │   ├── login/page.tsx        # Login page
│   │   │   ├── login/__tests__/
│   │   │   ├── register/page.tsx
│   │   │   ├── register/type/page.tsx
│   │   │   ├── register/personal/page.tsx
│   │   │   └── register/account/page.tsx
│   │   ├── carrier/                  # Carrier Staff routes
│   │   │   ├── home/page.tsx
│   │   │   ├── fleet/page.tsx
│   │   │   ├── shipments/page.tsx
│   │   │   ├── driver/tasks/page.tsx
│   │   │   ├── driver/map/page.tsx
│   │   │   ├── scan/page.tsx
│   │   │   ├── staff/page.tsx
│   │   │   ├── staff/add/page.tsx
│   │   │   ├── reports/page.tsx
│   │   │   ├── settings/integration/page.tsx
│   │   │   └── register/company/page.tsx
│   │   ├── gov/                      # Government User routes
│   │   │   ├── home/page.tsx
│   │   │   ├── verification/queue/page.tsx
│   │   │   ├── verify/page.tsx
│   │   │   ├── audit/page.tsx
│   │   │   ├── agencies/page.tsx
│   │   │   ├── policy/page.tsx
│   │   │   ├── queue/page.tsx
│   │   │   └── queue/[id]/page.tsx   # Dynamic route segment
│   │   ├── owner/                    # Property Owner routes
│   │   │   ├── home/page.tsx
│   │   │   ├── properties/page.tsx
│   │   │   ├── properties/new/page.tsx
│   │   │   ├── properties/[id]/page.tsx
│   │   │   ├── property/add/page.tsx
│   │   │   ├── bindings/page.tsx
│   │   │   ├── payouts/page.tsx
│   │   │   ├── earnings/page.tsx
│   │   │   └── payouts/page.tsx
│   │   └── visitor/                  # Visitor routes
│   │       ├── layout.tsx            # Visitor-specific layout
│   │       ├── home/page.tsx
│   │       ├── search/page.tsx
│   │       ├── profile/page.tsx
│   │       ├── profile/verify/page.tsx
│   │       ├── request/page.tsx
│   │       ├── checkout/page.tsx
│   │       ├── shipments/page.tsx
│   │       ├── shipments/new/page.tsx
│   │       ├── tnas/page.tsx
│   │       ├── tnas/create/page.tsx
│   │       ├── tnas/[id]/page.tsx
│   │       ├── tnas/[id]/bind/page.tsx
│   │       ├── tnas/[id]/unbind/page.tsx
│   │       └── wallet/page.tsx
│   ├── api/auth/[...nextauth]/route.ts
│   ├── error.tsx
│   ├── globals.css
│   └── tokens.css                    # SPATIAL Design Token System
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx              # Master layout wrapper
│   │   ├── RoleSidebar.tsx           # Role-based navigation
│   │   └── BottomNav.tsx             # Mobile navigation
│   ├── shell/
│   │   ├── Providers.tsx             # React Query provider
│   │   ├── Header.tsx
│   │   ├── AuthLayout.tsx
│   │   └── ClientLayout.tsx
│   ├── templates/
│   │   ├── DashboardLayout.tsx
│   │   ├── DataTableLayout.tsx       # Production-Ready table template
│   │   ├── DetailViewLayout.tsx
│   │   ├── FormWizardLayout.tsx      # Production-Ready wizard template
│   │   ├── MapTaskLayout.tsx
│   │   └── ModalOverlay.tsx          # Production-Ready modal template
│   ├── ui/                           # Shared UI primitives
│   │   ├── Badge.tsx, Button.tsx, Card.tsx
│   │   ├── InputField.tsx, Select.tsx
│   │   ├── Modal.tsx (deprecated, use ModalOverlay)
│   │   ├── ProgressStepper.tsx
│   │   ├── SkeletonCard.tsx
│   │   ├── Spinner.tsx, Toast.tsx
│   │   ├── UserAvatar.tsx, WalletBalanceChip.tsx
│   │   └── ErrorAlert.tsx
│   ├── modules/                      # Feature-specific composites
│   │   ├── auth/*.tsx                # Login/Register modules
│   │   ├── carrier/*.tsx
│   │   ├── gov/*.tsx
│   │   ├── owner/*.tsx
│   │   └── visitor/*.tsx
│   ├── forms/
│   │   ├── RegistrationFormBase.tsx
│   │   ├── RegistrationExtension_Visitor.tsx
│   │   ├── RegistrationExtension_Owner.tsx
│   │   └── RegistrationExtension_Carrier.tsx
│   └── shared/
│       ├── Breadcrumbs.tsx
│       ├── LocaleLink.tsx
│       ├── MirrorIcon.tsx            # RTL-aware icon flipping
│       ├── QuickLogin.tsx
│       ├── RoleGuard.tsx
│       ├── TenantSwitcher.tsx
│       └── EmptyState.tsx
├── context/
│   ├── GovContext.tsx                # Gov user TNA data context
│   ├── FleetContext.tsx              # Carrier fleet context
│   └── BindingContext.tsx            # Address binding context
├── i18n/
│   ├── config.ts                     # Locale validation (ar|en)
│   ├── LocaleProvider.tsx            # Translation context
│   └── request.ts
├── lib/
│   ├── store/                        # Zustand state management
│   │   ├── useAuthStore.ts
│   │   ├── useUIStore.ts
│   │   ├── useRegistrationStore.ts
│   │   ├── useLanguageStore.ts
│   │   ├── useKYCStore.ts
│   │   ├── usePriceCatalogStore.ts
│   │   ├── useSettlementStore.ts
│   │   └── useWebhookStore.ts
│   ├── hooks/
│   │   ├── useT.ts
│   │   ├── useMounted.ts
│   │   ├── useMock.ts
│   │   └── useWallet.ts
│   ├── api/
│   │   ├── admin.ts, auth.ts, bindings.ts
│   │   ├── client.ts, deliverables.ts
│   │   ├── naVariants.ts, tna.ts, types.ts
│   ├── types/
│   │   ├── auth.ts, admin.ts, bindings.ts
│   │   ├── carrier.ts, deliverables.ts, gov.mock.ts
│   │   ├── index.ts, kyc.ts, ledger.ts
│   │   ├── na.ts, naOwner.ts, owner.ts
│   │   ├── priceCatalog.ts, settlement.ts, tna.ts, webhook.ts
│   └── utils/
│       └── cn.ts
└── middleware.ts                     # Next.js middleware
```

### Routing Architecture Notes
- **Locale Pattern:** `/[locale]/(auth)` parallel routes isolate auth without affecting URL hierarchy
- **Dynamic Routes:** `[locale]`, `[id]` segments with Next.js App Router
- **Shared Component Library:** `components/ui/*` (primitives), `components/shared/*` (composites)

---

## 2. DESIGN SYSTEM & TOKEN REGISTRY

### Surfaces (Backgrounds, Elevations)
| Token | Value | Usage |
|-------|-------|-------|
| `--color-background` | `#F2F2F7` | Page backgrounds |
| `--color-surface` | `#FFFFFF` | Card/container surfaces |
| `--color-surface-200` | `#F5F5F7` | Header/bar backgrounds |
| `--color-overlay` | `rgba(0,0,0,0.04)` | Modal overlays |
| `--shadow-card` | `0px 2px 8px rgba(0,0,0,0.06)` | Card elevation |
| `--shadow-card-hover` | `0px 4px 16px rgba(0,0,0,0.10)` | Hover state |
| `--shadow-modal` | Modal-specific elevation |

### Spacing & Layout (4px Base Unit)
| Token | Value |
|-------|-------|
| `--space-0` | 0px |
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 20px |
| `--space-6` | 24px |
| `--space-7` | 28px |
| `--space-8` | 32px |
| `--space-10` | 40px |
| `--space-12` | 48px |
| `--layout-content-max-width` | 960px |
| `--navbar-height` | 83px |
| `--header-height` | 44px |
| `--input-height` | 52px |
| `--btn-primary-height` | 52px |

### Border Radius Scale
| Token | Value |
|-------|-------|
| `--radius-sm` | 6px |
| `--radius-md` | 10px |
| `--radius-lg` | 14px |
| `--radius-xl` | 18px |
| `--radius-2xl` | 24px |
| `--radius-full` | 9999px |

### Logical Properties (RTL Support)
| Transform | LTR Value | RTL Value |
|-----------|-----------|-----------|
| `translate-x-s-full` | `100%` | `-100%` |
| `-translate-x-s-full` | `-100%` | `100%` |
| Tailwind variants: `rtl:` / `ltr:` | `[dir="rtl"] &` selector |

### Typography
| Token | Value |
|-------|-------|
| `--font-arabic` | IBM Plex Sans Arabic |
| `--font-english` | Rubik |
| `--text-xs` | 11px |
| `--text-sm` | 13px |
| `--text-base` | 15px |
| `--text-md` | 17px |
| `--text-lg` | 20px |
| `--text-xl` | 24px |
| `--text-2xl` | 28px |
| `--text-3xl` | 34px |

---

## 3. STATE MANAGEMENT SCHEMA

### useAuthStore (Auth Slice)
**State Properties:**
```typescript
interface AuthState {
  user: User | null
  token: string | null
  role: UserRole | null
}
```

**Actions:**
| Action | Signature | Description |
|--------|-----------|-------------|
| `setAuth` | `(user: User, token: string) => void` | Sets authenticated user + token |
| `logout` | `() => void` | Clears auth state |

**Data Flow:** Local storage persistence via `zustand/middleware`

---

### useUIStore (UI Slice)
**State Properties:**
```typescript
interface UIState {
  isSidebarOpen: boolean
  toasts: Toast[]
  modalStack: string[]
}
```

**Actions:**
| Action | Description |
|--------|-------------|
| `toggleSidebar` | Toggle mobile sidebar |
| `setSidebarOpen` | Set sidebar state |
| `addToast` / `removeToast` | Toast notification management |
| `pushModal` / `popModal` | Modal stack management |

---

### useRegistrationStore (Session Slice)
**State Properties:**
```typescript
interface RegistrationState {
  step: number
  formData: Partial<SignupRequest>
}
```

**Actions:**
| Action | Description |
|--------|-------------|
| `setStep` | Navigate wizard step |
| `updateFormData` | Merge partial form data |
| `resetRegistration` | Reset to initial state |

---

### useLanguageStore (Session Slice)
**State Properties:**
```typescript
interface LanguageState {
  locale: string
  lang: 'ar' | 'en'
  dir: 'rtl' | 'ltr'
}
```

**Actions:**
| Action | Signature |
|--------|-----------|
| `setLanguage` | `(locale: string) => void` |

---

### useKYCStore (Data Slice)
**State Properties:**
```typescript
interface KYCState {
  verifications: KYCVerification[]
  loading: boolean
  error: string | null
}
```

**Actions:** `fetchVerifications`, `updateVerification`, `getVerificationByUserId`
**Data Flow:** Stub implementations with TODO markers — requires API integration

---

### usePriceCatalogStore (Data Slice)
**Actions:** `fetchEntries`, `updateEntry`
**Status:** Stub implementation

---

### useSettlementStore (Data Slice)
**Actions:** `fetchAdjustments`, `createAdjustment`, `updateAdjustment`
**Status:** Stub implementation

---

### useWebhookStore (Data Slice)
**Actions:** `fetchConfigurations`, `updateConfiguration`, `testWebhook`, `fetchLogs`
**Status:** Stub implementation

---

## 4. COMPONENT MATURITY MATRIX

| Component | Status | Notes |
|-----------|--------|-------|
| **AppShell** | `[PRODUCTION-READY]` | Fully typed, direction-aware, tested |
| **DataTableLayout** | `[PRODUCTION-READY]` | Search, pagination, loading states, RTL support |
| **FormWizardLayout** | `[PRODUCTION-READY]` | Stepper, validation support, progressive disclosure |
| **ModalOverlay** | `[PRODUCTION-READY]` | Keyboard escape, backdrop click, scroll lock |
| **RoleSidebar** | `[PRODUCTION-READY]` | Role-based menu, wallet integration (Owner), RTL |
| **Header** | `[PRODUCTION-READY]` | Notification bell, avatar, language switcher |
| **BottomNav** | `[STUB/PROTOTYPE]` | Structure exists, limited testing |
| **Button** | `[PRODUCTION-READY]` | Multiple variants, loading state |
| **InputField** | `[PRODUCTION-READY]` | Label, error, RTL placeholder |
| **Card** | `[STUB/PROTOTYPE]` | Basic structure, needs variants |
| **Badge** | `[STUB/PROTOTYPE]` | Limited color options |
| **Select** | `[PRODUCTION-READY]` | Searchable, clearable |
| **Toast** | `[PRODUCTION-READY]` | Auto-dismiss, stacking |
| **ProgressStepper** | `[PRODUCTION-READY]` | Step validation, connector lines |
| **Modal** (`components/ui/Modal.tsx`) | `[DEPRECATED/LEGACY]` | Use ModalOverlay instead |

---

## 5. TECHNICAL DEBT & DIVERGENCE AUDIT

### Fragmented Routing Paths
1. **Parallel Route Duplication:** `(auth)` route group exists alongside direct `/[locale]/(auth)` paths—consistent but may cause confusion during refactoring
2. **Orphaned Routes:** `/[locale]/carrier/register/company` exists but registration workflow uses `/register/type` → `/register/personal` → `/register/account`
3. **Dynamic Segment Inconsistency:** `[id]` used for gov/queue but `[...nextauth]` for auth catch-all

### Logic-Heavy Components (Separation of Concerns Violation)
1. **AppShell.tsx:42** — Uses `isRTL ? 'rtl' : 'ltr'` inline instead of consuming from Zustand/LocaleProvider
2. **RoleSidebar.tsx:33-82** — SidebarProfile embeds wallet balance calculation inline (`# Owner` role only)
3. **DataTableLayout:74-76** — Inline translation via `useLocale().t()` instead of centralized translation keys
4. **FormWizardLayout:77** — Hardcoded variant classes (`border-status-success`) instead of token references

### Non-Standard State Management Patterns
1. **Auth Store:** Uses `persist` middleware correctly, but `User` type from `auth.ts` has conflicting `doc_number` vs `document_number` fields
2. **Context Overlap:** GovContext provides `tnaData` and `activeRole` while Zustand provides `role` in useAuthStore—potential source of truth divergence
3. **Store TODO Pattern:** All data stores (KYC, PriceCatalog, Settlement, Webhook) contain stub implementations with `// TODO: Implement API call` comments—indicates incomplete Action-Based Workflow integration
4. **GovContext Hardcoded State:** `initialGovTnaData` is hardcoded mock data mixed with Context pattern, violating separation of data/UI concerns

### Action-Based Workflow Deviations
1. **Registration Flow:** Uses Zustand for state but login page (`login/page.tsx:23-26`) performs direct `router.push` without action dispatch
2. **Missing Action Creators:** No centralized action file—logic dispersed across components and stores
3. **UI State in Components:** AppShell manages `sidebarOpen` local state instead of `useUIStore`

### Internationalization Concerns
1. **Hardcoded Arabic Strings:** `login/page.tsx` contains hardcoded Arabic text (`اسم المستخدم`, `كلمة المرور`) instead of `useLocale().t()`
2. **Font Loading:** Rubik font assumed for English, IBM Plex Sans Arabic for Arabic—implementation verified in `tokens.css:63-65`

---

## APPENDIX A: ROLE ENUMERATION

| Role | Backend Enum | Frontend Label | Primary Route |
|------|--------------|----------------|---------------|
| Visitor | `VISITOR` | Visitor | `/visitor/home` |
| Owner | `OWNER` | Owner | `/owner/home` |
| Gov | `GOV_USER` | Gov | `/gov/home` |
| Carrier | `CARRIER_STAFF` | Carrier | `/carrier/home` |

---

## APPENDIX B: FILE EXTENSION INDEX

| Extension | Count | Purpose |
|-----------|-------|---------|
| `.tsx` | 120+ | React components |
| `.ts` | 40+ | Utilities, types, stores |
| `.css` | 3 | Global styles, tokens, fonts |