# TNA Master UI Architecture v2.1
## Production-Ready Government Platform UI System

A comprehensive React + Tailwind CSS component library built for high-fidelity government applications. Includes a Master AppShell and 6 reusable layout templates with full RTL-first compliance and design token system.

---

## 📦 What's Included

### Core Components

#### 1. **AppShell** - Master layout wrapper
- Role-based branding (Visitor, Owner, Gov, Carrier)
- Responsive side/bottom navigation
- Mobile-first with drawer pattern
- Flexible header, sidebar, and footer slots
- Uses Tailwind logical properties for RTL

```tsx
<AppShell
  role="Gov"
  header={<Header />}
  sidebar={<Navigation />}
>
  {children}
</AppShell>
```

#### 2. **DashboardLayout** - Stats dashboard
- Grid of metric cards
- Activity timeline/list section
- Click handlers for metrics
- Status color indicators
- Usage: Role tracking, earnings overview, fleet stats

```tsx
<DashboardLayout
  title="Dashboard"
  stats={[
    { label: 'Revenue', value: '$45.2K', icon: <Icon /> },
  ]}
  activity={[{ id: '1', title: 'Event', status: 'success' }]}
/>
```

#### 3. **DataTableLayout** - High-density data grid
- Searchable & filterable table
- Column sorting indicators
- Pagination controls
- Custom column rendering
- Loading states
- Usage: Audit logs, shipment lists, payout records

```tsx
<DataTableLayout
  title="Transactions"
  columns={[
    { key: 'date', label: 'Date', sortable: true },
    { key: 'status', label: 'Status', render: (val) => <Badge>{val}</Badge> },
  ]}
  data={data}
  pageSize={10}
  onSearch={(query) => console.log(query)}
/>
```

#### 4. **FormWizardLayout** - Multi-step form stepper
- Visual progress indicator
- Step validation
- Sticky CTA footer
- Back/Continue/Submit actions
- Disabled step navigation
- Usage: KYC, TNA registration, address creation

```tsx
<FormWizardLayout
  steps={[
    { id: 'info', label: 'Info', description: '...' },
    { id: 'docs', label: 'Documents' },
    { id: 'verify', label: 'Verify' },
  ]}
  currentStep={0}
  onStepChange={setStep}
  onSubmit={handleSubmit}
>
  {/* Step content */}
</FormWizardLayout>
```

#### 5. **DetailViewLayout** - Two-column detail page
- Grouped information cards
- Optional sidebar (sticky)
- Breadcrumb navigation
- Back button
- Action buttons
- Usage: Shipment tracking, title deeds, ledger entries

```tsx
<DetailViewLayout
  title="Shipment #SHP-2024-001"
  breadcrumb={['Shipments', 'Active']}
  mainContent={[
    {
      title: 'Details',
      items: [
        { label: 'ID', value: '#SHP-001' },
        { label: 'Status', value: 'In Transit' },
      ],
    },
  ]}
  sidebar={<SidebarContent />}
/>
```

#### 6. **MapTaskLayout** - Full-screen map + overlay
- Full-bleed background for map component
- Floating task card overlay
- Customizable position (4 corners)
- Blurred gradient footer
- Close button on card
- Usage: Delivery routes, property geolocation

```tsx
<MapTaskLayout
  mapComponent={<Leaflet />}
  taskCard={<Card>Delivery Info</Card>}
  taskPosition="bottom-right"
  showTaskCard={true}
/>
```

#### 7. **ModalOverlay** - Standardized dialog
- Blurred backdrop
- Escape key & backdrop click handling
- Customizable sizes (sm, md, lg, xl)
- Header with close button
- Optional footer
- Body scroll prevention
- Usage: Confirmations, filters, language toggle

```tsx
<ModalOverlay
  isOpen={isOpen}
  onClose={handleClose}
  title="Confirm Action"
  size="md"
  footer={<Actions />}
>
  <Content />
</ModalOverlay>
```

---

## 🎨 Design Tokens System

### Color Palette

**Brand Primitives:**
```css
--primitive-navy: #02488D           /* Primary brand */
--primitive-cyan-mid: #00B4C9       /* Visitor branding */
--primitive-amber: #F5A623          /* Carrier branding */
--primitive-green: #28A745          /* Success state */
--primitive-red: #DC3545            /* Error state */
```

**Semantic Colors:**
```css
--color-brand-primary: var(--primitive-navy)
--color-brand-secondary: var(--primitive-cyan-mid)
--color-brand-accent: var(--primitive-cyan-light)

--color-success: #28A745
--color-error: #DC3545
--color-warning: #F5A623
--color-pending: #1A6FC4
```

**Neutral Scale (9-step):**
```css
--neutral-50:  #FAFAFA    (lightest)
--neutral-100: #F4F5F6
--neutral-200: #EAECEE
--neutral-300: #D8DBDF
--neutral-400: #B7B7B7
--neutral-500: #8C9098
--neutral-600: #5C6370
--neutral-700: #3A3F47
--neutral-800: #1E2228
--neutral-900: #0A0D10    (darkest)
```

### Typography Scale

| Level | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| Display | 32px | 800 | 1.2 | Main headings |
| Heading | 22px | 700 | 1.3 | Section titles |
| Subheading | 17px | 600 | 1.4 | Card titles |
| Body | 15px | 400 | 1.6 | Body text |
| Label | 13px | 400 | 1.5 | Input labels |
| Caption | 11px | 400 | 1.4 | Helper text |
| Code | 14px | 500 | 1.5 | Code blocks |

**Font Family:** Rubik (all weights: 300, 400, 500, 600, 700, 800)

### Spacing System (4px base)

```css
--space-1: 4px     --space-2: 8px      --space-3: 12px
--space-4: 16px    --space-5: 20px     --space-6: 24px
--space-7: 28px    --space-8: 32px     --space-10: 40px
--space-12: 48px   --space-16: 64px
```

### Border Radius

```css
--radius-xs: 6px        /* Checkboxes, small tags */
--radius-sm: 10px       /* Input fields */
--radius-md: 14px       /* Standard cards */
--radius-lg: 20px       /* Large modals */
--radius-pill: 999px    /* Primary buttons */
```

### Shadows

```css
--shadow-card: 0 2px 8px rgba(2,72,141,0.08)         /* Cards */
--shadow-modal: 0 8px 32px rgba(2,72,141,0.16)       /* Modals */
--shadow-btn: 0 4px 16px rgba(0,180,201,0.30)        /* Button hover */
```

---

## 🌍 RTL-First Architecture

All components use **Tailwind Logical Properties** for full RTL/LTR support:

| LTR Property | Logical Property | Example |
|---|---|---|
| `pl-*` | `ps-*` | `ps-4` (padding-start) |
| `pr-*` | `pe-*` | `pe-6` (padding-end) |
| `left-*` | `start-*` | `start-0` (position-start) |
| `right-*` | `end-*` | `end-6` (position-end) |
| `flex-row-reverse` | `flex-row-reverse` | RTL friendly |

No hardcoded LTR positions in the codebase.

---

## 🚀 Quick Start

### Installation

```bash
# Clone the repo
git clone <repo-url>
cd tna-master-ui

# Install dependencies
pnpm install

# Run dev server
pnpm dev
```

### File Structure

```
components/
├── shell/
│   └── AppShell.tsx              # Master layout wrapper
├── layouts/
│   ├── DashboardLayout.tsx       # Stats + activity
│   ├── DataTableLayout.tsx       # Searchable table
│   ├── FormWizardLayout.tsx      # Multi-step form
│   ├── DetailViewLayout.tsx      # Info groupings
│   ├── MapTaskLayout.tsx         # Map + overlay
│   └── ModalOverlay.tsx          # Dialog template
└── index.ts                       # Barrel export

app/
├── layout.tsx                     # Root layout with Rubik font
├── globals.css                    # Design tokens + base styles
└── page.tsx                       # Interactive demo

tailwind.config.ts                 # Tailwind token mappings
```

### Usage Example

```tsx
import { AppShell, DashboardLayout, DashboardLayout } from '@/components'
import { TrendingUp } from 'lucide-react'

export default function Dashboard() {
  return (
    <AppShell
      role="Gov"
      header={<header className="flex-1"><h1>Portal</h1></header>}
      sidebar={<Navigation />}
    >
      <DashboardLayout
        title="Overview"
        stats={[
          {
            label: 'Total Revenue',
            value: '$156.8K',
            change: '+14% from last month',
            icon: <TrendingUp size={24} />,
          },
        ]}
        activity={[
          {
            id: '1',
            title: 'Payment processed',
            description: 'Order #2341',
            timestamp: '2 hours ago',
            status: 'success',
          },
        ]}
      />
    </AppShell>
  )
}
```

---

## 🎯 Component Props Reference

### AppShell
```tsx
interface AppShellProps {
  children: ReactNode
  role: 'Visitor' | 'Owner' | 'Gov' | 'Carrier'
  sidebar?: ReactNode
  header?: ReactNode
  footer?: ReactNode
  showBottomNav?: boolean
}
```

### DashboardLayout
```tsx
interface DashboardLayoutProps {
  title: string
  subtitle?: string
  stats?: StatCard[]
  activity?: ActivityItem[]
  children?: ReactNode
  onStatClick?: (stat: StatCard) => void
}
```

### DataTableLayout
```tsx
interface DataTableLayoutProps<T> {
  title: string
  columns: DataTableColumn<T>[]
  data: T[]
  onSearch?: (query: string) => void
  onFilter?: (filters: any) => void
  onRowClick?: (row: T) => void
  pageSize?: number
  isLoading?: boolean
}
```

### FormWizardLayout
```tsx
interface FormWizardLayoutProps {
  steps: StepConfig[]
  currentStep: number
  onStepChange?: (step: number) => void
  onSubmit?: () => void
  onCancel?: () => void
  children: ReactNode
  isSubmitting?: boolean
  canProceed?: boolean
}
```

### DetailViewLayout
```tsx
interface DetailViewLayoutProps {
  title: string
  breadcrumb?: string[]
  mainContent: DetailSection[]
  sidebar?: ReactNode
  onBack?: () => void
  actions?: ReactNode
}
```

### MapTaskLayout
```tsx
interface MapTaskLayoutProps {
  mapComponent: ReactNode
  taskCard?: ReactNode
  onTaskClose?: () => void
  showTaskCard?: boolean
  taskPosition?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
}
```

### ModalOverlay
```tsx
interface ModalOverlayProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showCloseButton?: boolean
  closeOnBackdropClick?: boolean
  closeOnEscapeKey?: boolean
}
```

---

## 🎨 Role-Based Branding

The **AppShell** automatically applies role-specific colors:

| Role | Primary Color | Secondary | Use Case |
|------|---|---|---|
| **Visitor** | Cyan Mid (#00B4C9) | Cyan Light | Public-facing users |
| **Owner** | Navy (#02488D) | Cyan Mid | Property/business owners |
| **Gov** | Navy (#02488D) | Cyan Mid | Government officials |
| **Carrier** | Amber (#F5A623) | Cyan Mid | Logistics/delivery |

```tsx
<AppShell role="Carrier">
  {/* Header background will be Amber */}
</AppShell>
```

---

## 🔌 Icon Integration

All components use **Lucide React** icons. Example:

```tsx
import { TrendingUp, Users, MapPin, X } from 'lucide-react'

// In stat cards
<TrendingUp size={24} className="text-brand-secondary" />

// In buttons
<button><MapPin size={20} /> View Map</button>
```

**Common sizes:** 16px, 20px, 24px, 32px

---

## 🧪 Interactive Demo

A fully functional demo is included in `/app/page.tsx` showcasing all 6 templates with sample data.

Run the dev server:
```bash
pnpm dev
```

Then open `http://localhost:3000` to see:
- ✅ AppShell with role-based branding
- ✅ Dashboard with metrics
- ✅ Searchable data table with pagination
- ✅ Multi-step form wizard
- ✅ Detail view with sidebar
- ✅ Map overlay with task card
- ✅ Modal dialog patterns

---

## 📱 Responsive Behavior

All layouts are **mobile-first** with Tailwind breakpoints:

- **Mobile (default):** Single column, bottom nav, drawer sidebar
- **Tablet (md:):** Two columns, side nav
- **Desktop (lg:):** Full-width layouts, sticky sidebars

Example responsive grid:
```tsx
<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
  {/* 1 col mobile, 2 tablet, 4 desktop */}
</div>
```

---

## ♿ Accessibility

- ✅ Semantic HTML elements
- ✅ ARIA labels on interactive elements
- ✅ Keyboard navigation (Escape closes modals)
- ✅ Focus states and outlines
- ✅ Color contrast compliance (WCAG AA)
- ✅ Form labels paired with inputs

---

## 🛠️ Customization

### Override Design Tokens

Edit `/app/globals.css` `:root` section:

```css
:root {
  --color-brand-primary: #your-color;
  --text-body-size: 16px; /* Change base font size */
}
```

### Extend Tailwind Config

Add to `tailwind.config.ts`:

```ts
theme: {
  extend: {
    colors: {
      'custom': '#your-color',
    },
  },
}
```

### Custom Components

Create new layouts following the existing pattern:

```tsx
export function CustomLayout({ title, children, ...props }) {
  return (
    <div className="min-h-screen bg-surface-100">
      {/* Your layout */}
    </div>
  )
}
```

---

## 🚀 Performance Tips

1. **Lazy load map components** - MapTaskLayout integrates external maps
2. **Virtualize large tables** - For 1000+ rows, use react-window
3. **Debounce search** - DataTableLayout search input
4. **Code split layouts** - Import only needed templates

```tsx
import dynamic from 'next/dynamic'

const MapTaskLayout = dynamic(
  () => import('@/components').then(m => m.MapTaskLayout),
  { loading: () => <Skeleton /> }
)
```

---

## 📄 License

Production-ready for government & enterprise applications.

---

## 🤝 Support

- Review the interactive demo at `http://localhost:3000`
- Check design tokens in `/app/globals.css`
- Reference component types in component files
- Inspect example usage in `/app/page.tsx`

---

**Built with:** React 18+ • Next.js 15+ • Tailwind CSS 4+ • Lucide React
**Compliance:** RTL-first • WCAG AA • Mobile-responsive • Production-ready
