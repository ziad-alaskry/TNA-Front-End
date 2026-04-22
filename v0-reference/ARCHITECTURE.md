# TNA Master UI System - Architecture Diagram

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT.JS APPLICATION                          │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │          app/layout.tsx (Root Layout)                     │ │
│  │  • Rubik Font Setup (300-800 weights)                     │ │
│  │  • Global Styles Import (globals.css)                    │ │
│  │  • Analytics & Head Setup                                 │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              ↓                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │          app/globals.css (Design Token System)            │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │ CSS CUSTOM PROPERTIES (170+ tokens)                  │ │ │
│  │  ├────────────────────────────────────────────────────┤ │ │
│  │  │ 1. BRAND PRIMITIVES (8 colors)                      │ │ │
│  │  │    --primitive-navy, --primitive-cyan-mid, etc      │ │ │
│  │  │                                                    │ │ │
│  │  │ 2. SEMANTIC COLORS (Brand, Status)                 │ │ │
│  │  │    --color-brand-primary, --color-success, etc     │ │ │
│  │  │                                                    │ │ │
│  │  │ 3. NEUTRAL SCALE (9-step, 50-900)                 │ │ │
│  │  │    --neutral-50 through --neutral-900              │ │ │
│  │  │                                                    │ │ │
│  │  │ 4. TYPOGRAPHY (7 levels)                           │ │ │
│  │  │    --text-display, --text-heading, etc             │ │ │
│  │  │                                                    │ │ │
│  │  │ 5. SPACING (4px base, 1-16 scale)                 │ │ │
│  │  │    --space-1 through --space-16                    │ │ │
│  │  │                                                    │ │ │
│  │  │ 6. BORDER RADIUS (xs, sm, md, lg, pill)           │ │ │
│  │  │    --radius-xs through --radius-pill               │ │ │
│  │  │                                                    │ │ │
│  │  │ 7. SHADOWS (card, modal, button)                   │ │ │
│  │  │    --shadow-card, --shadow-modal, etc              │ │ │
│  │  │                                                    │ │ │
│  │  │ 8. COMPONENT SPECS                                 │ │ │
│  │  │    Button heights, input radius, navbar height     │ │ │
│  │  └────────────────────────────────────────────────────┘ │ │
│  │                              ↓                             │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │ TAILWIND CONFIG MAPPINGS                             │ │ │
│  │  │ (tailwind.config.ts extends theme with tokens)      │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              ↓                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              COMPONENTS LAYER                              │ │
│  │                                                            │ │
│  │  ┌──────────────────┐  ┌──────────────────┐             │ │
│  │  │ SHELL            │  │ LAYOUTS (6)      │             │ │
│  │  ├──────────────────┤  ├──────────────────┤             │ │
│  │  │ AppShell         │  │ Dashboard        │             │ │
│  │  │                  │  │ DataTable        │             │ │
│  │  │ • Role-based     │  │ FormWizard       │             │ │
│  │  │ • Navigation     │  │ DetailView       │             │ │
│  │  │ • Responsive     │  │ MapTask          │             │ │
│  │  │ • RTL-compliant  │  │ ModalOverlay     │             │ │
│  │  └──────────────────┘  └──────────────────┘             │ │
│  │                                                            │ │
│  │  ┌──────────────────────────────────────┐              │ │
│  │  │ UI COMPONENTS (3)                    │              │ │
│  │  ├──────────────────────────────────────┤              │ │
│  │  │ • Button (4 variants, 3 sizes)       │              │ │
│  │  │ • Input (label, error, icon support) │              │ │
│  │  │ • StatusBadge (5 types, 3 sizes)     │              │ │
│  │  └──────────────────────────────────────┘              │ │
│  │                                                            │ │
│  │  All use design tokens from globals.css                 │ │
│  │  All RTL-compliant with logical properties              │ │
│  │  All fully typed with TypeScript                        │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              ↓                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              APPLICATION PAGES                            │ │
│  │  (Use AppShell wrapper + 1 or more Layout templates)     │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Component Hierarchy

```
AppShell (Master Wrapper)
├── Header Slot
│   └── Role-based Branding (Visitor/Owner/Gov/Carrier)
├── Sidebar Slot
│   └── Navigation Menu
├── Main Content Area
│   └── Child Component (1 of 6 layouts)
│       ├── DashboardLayout
│       │   ├── Stat Cards (Stats[])
│       │   └── Activity List (Activity[])
│       ├── DataTableLayout
│       │   ├── Search Bar
│       │   ├── Table (Columns[], Data[])
│       │   └── Pagination
│       ├── FormWizardLayout
│       │   ├── Progress Stepper
│       │   ├── Form Content
│       │   └── Footer CTA Buttons
│       ├── DetailViewLayout
│       │   ├── Header (Breadcrumb, Back Button)
│       │   ├── Main Content (2/3 width)
│       │   │   └── Detail Sections[]
│       │   └── Sidebar (1/3 width)
│       ├── MapTaskLayout
│       │   ├── Full-bleed Map Component
│       │   └── Floating Task Card
│       └── ModalOverlay
│           ├── Blurred Backdrop
│           ├── Header (Title, Close)
│           ├── Content
│           └── Footer Actions
├── Footer Slot (Optional)
└── Bottom Nav (Mobile, Optional)
```

---

## 🎯 Data Flow

```
┌──────────────┐
│  App State   │
│  (useState)  │
└──────┬───────┘
       │
       ↓
┌──────────────────────────┐
│  Page Component          │
│  (wrap with AppShell)    │
└──────┬───────────────────┘
       │
       ├─→ Role Selection (Gov)
       │
       ├─→ Layout Selection (DashboardLayout)
       │
       └─→ Data Mapping
           │
           ├─→ Stats: StatCard[]
           │   └─→ DashboardLayout
           │       └─→ Stat Cards Grid
           │
           ├─→ Activity: ActivityItem[]
           │   └─→ DashboardLayout
           │       └─→ Activity Timeline
           │
           └─→ Table Data: T[]
               └─→ DataTableLayout
                   └─→ Paginated Table
```

---

## 🌍 RTL Architecture

```
Standard (LTR) Flow            →  RTL Flow
────────────────────────         ──────────
<html lang="en">                  <html lang="ar" dir="rtl">
  <div class="ps-4">                <div class="ps-4">
    Content                           Content
  </div>                            </div>
</html>                           </html>

Physical Properties (WRONG)        Logical Properties (CORRECT)
────────────────────────────       ─────────────────────────────
pl-4  (padding-left)       →       ps-4  (padding-start)
pr-4  (padding-right)      →       pe-4  (padding-end)
left-0 (position: left)    →       start-0 (inset-inline-start)
right-0 (position: right)  →       end-0 (inset-inline-end)
flex-row-reverse                    flex-row-reverse (works both)

Result: No additional CSS needed for RTL! 🎉
```

---

## 🎨 Design Token Structure

```
:root {
  /* TIER 1: BRAND PRIMITIVES */
  --primitive-navy: #02488D        ← Base colors
  --primitive-cyan-mid: #00B4C9    ← Direct from brand
  --primitive-amber: #F5A623       ← No derivation
  
    ↓
    
  /* TIER 2: SEMANTIC COLORS */
  --color-brand-primary: var(--primitive-navy)     ← Reusable aliases
  --color-success: #28A745                         ← Status colors
  --color-error: #DC3545                           ← Functional
  
    ↓
    
  /* TIER 3: COMPONENT COLORS */
  --btn-primary-bg-from: var(--color-brand-primary)  ← For buttons
  --input-border: 1px solid var(--neutral-300)       ← For inputs
  
    ↓
    
  /* TIER 4: TAILWIND CLASSES */
  className="bg-brand-primary"         ← Used in components
  className="border-neutral-300"       ← Via tailwind.config.ts
  className="text-status-success"      ← No hardcoding!
}
```

---

## 🔄 Role-Based Branding Flow

```
User Logs In
    │
    ├─→ Get Role (Visitor/Owner/Gov/Carrier)
    │
    ↓
┌─────────────────────────────────┐
│ AppShell { role: 'Gov' }        │
│                                 │
│  getBrandingClass() function    │
│  ├─ 'Visitor' → bg-cyan-mid    │
│  ├─ 'Owner'   → bg-navy        │
│  ├─ 'Gov'     → bg-navy        │
│  └─ 'Carrier' → bg-amber       │
│                                 │
│  Result: className applied      │
│  to header element              │
└─────────────────────────────────┘
    │
    ↓
<header className="bg-primitive-navy text-white">
  {/* Navy header for Gov role */}
</header>
```

---

## 📱 Responsive Behavior

```
Mobile (320px)          Tablet (768px)         Desktop (1024px)
────────────────        ──────────────         ───────────────

┌─────────┐            ┌──────────────────┐   ┌───────────────────┐
│ Header  │            │ Header           │   │ Header            │
├─────────┤            ├─────────┬────────┤   ├─────────┬─────────┤
│≡ Menu   │            │Sidebar  │Content │   │Sidebar  │Content  │
├─────────┤            │(drawer) │       │   │(sticky) │        │
│         │            │         │       │   │         │        │
│Content  │            │         │       │   │         │        │
│(overlay)│            │         │       │   │         │        │
│         │            │         │       │   │         │        │
│         │            │         │       │   │         │        │
├─────────┤            ├─────────┴────────┤   ├─────────┴─────────┤
│ Bot Nav │            │ Footer (hidden)  │   │ Footer            │
└─────────┘            └──────────────────┘   └───────────────────┘

Key Points:
• Mobile: Single column, drawer menu, bottom nav
• Tablet: Side nav visible, responsive grid
• Desktop: Full layout, 2-3 columns possible
```

---

## 🧩 Component Integration Example

```tsx
// 1. Import components
import { 
  AppShell,           // Master wrapper
  DashboardLayout,    // Pick one layout
  Button, Input       // Use UI components
} from '@/components'

// 2. Wrap with AppShell
export default function Dashboard() {
  return (
    <AppShell 
      role="Gov"                              // Role-based branding
      header={<h1>Government Portal</h1>}    // Header slot
      sidebar={<NavMenu />}                  // Sidebar slot
    >
      {/* 3. Use layout template */}
      <DashboardLayout
        title="Dashboard"
        stats={[
          { label: 'Revenue', value: '$1M', icon: <Icon /> }
        ]}
        activity={[
          { id: '1', title: 'Payment', status: 'success' }
        ]}
      >
        {/* 4. Optional: add custom content */}
        <div className="mt-8">
          <Input label="Search" placeholder="..." />
          <Button variant="primary">Filter</Button>
        </div>
      </DashboardLayout>
    </AppShell>
  )
}

// Result:
// ✅ Navy header (Gov role)
// ✅ Sidebar drawer on mobile
// ✅ Dashboard stats + activity
// ✅ Custom input/button at bottom
// ✅ All RTL-compliant
// ✅ Fully responsive
// ✅ Design tokens applied automatically
```

---

## 📦 Dependency Tree

```
App
├── React 18+
├── Next.js 15+
└── TNA System
    ├── Components (no external deps!)
    │   ├── AppShell
    │   ├── Layouts (6)
    │   ├── UI Components (3)
    │   └── Lucide React (icons only)
    ├── Tailwind CSS 4+
    │   └── Custom tokens from globals.css
    └── Design Tokens
        └── 170+ CSS variables
```

**Zero external dependencies** (except Lucide for icons)

---

## 🎨 Token Inheritance Chain

```
globals.css (:root)
    │
    ├─→ CSS Custom Properties
    │   └─ Defined as: --color-brand-primary: #02488D
    │
    ↓
tailwind.config.ts (theme.extend)
    │
    ├─→ Tailwind Classes
    │   └─ Mapping: colors: { brand: { primary: 'var(--color-brand-primary)' } }
    │
    ↓
React Components
    │
    └─→ className="text-brand-primary"
        └─ Resolves to: color: var(--color-brand-primary) → #02488D

Same for:
• Spacing: --space-4 → space-4 class → p-4, m-4, gap-4
• Shadows: --shadow-card → shadow-card class
• Border Radius: --radius-sm → rounded-sm class
```

---

## 🔌 Extension Points

```
To Add a New Feature:

1. NEW LAYOUT
   ├─ Create components/layouts/MyLayout.tsx
   ├─ Follow existing pattern
   ├─ Export from components/index.ts
   └─ Use in your page

2. NEW UI COMPONENT
   ├─ Create components/ui/MyComponent.tsx
   ├─ Use design tokens from globals.css
   ├─ Export from components/index.ts
   └─ Use in layouts

3. NEW COLOR THEME
   ├─ Add to globals.css :root
   ├─ Map in tailwind.config.ts
   └─ Components auto-inherit

4. NEW ROLE
   ├─ Add case in AppShell.getBrandingClass()
   ├─ Assign color
   └─ Pass role prop to AppShell

5. NEW ICON
   ├─ Import from lucide-react
   ├─ Use in component
   └─ No setup needed
```

---

## ✅ Quality Checklist

```
Architecture:
  ✅ Single responsibility per component
  ✅ Composable - can combine layouts
  ✅ Props-based configuration
  ✅ No global state required
  ✅ SSR-friendly (no window/document in SSR)

Design:
  ✅ Design tokens-based
  ✅ RTL-first with logical properties
  ✅ Mobile-first responsive
  ✅ WCAG AA accessibility

Performance:
  ✅ Minimal JavaScript
  ✅ Tree-shakeable exports
  ✅ No runtime calculations
  ✅ CSS-based styling (fast)
  ✅ Tailwind PurgeCSS removes unused

Maintainability:
  ✅ Full TypeScript support
  ✅ JSDoc comments on props
  ✅ Consistent naming (ps-, pe-, start-, end-)
  ✅ No magic numbers
  ✅ Documented at 3 levels
```

---

**Architecture Version:** 2.1  
**Last Updated:** April 2026  
**Status:** Production Ready ✅
