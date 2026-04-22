# TNA UI System - Quick Reference Guide

## 🎯 Component Selection Guide

**Choose the right layout for your feature:**

| Use Case | Component | When to Use |
|----------|-----------|------------|
| Dashboard/Overview | **DashboardLayout** | Role dashboards, stats, activity feeds |
| Tables & Lists | **DataTableLayout** | Audit logs, shipment lists, records |
| Multi-Step Forms | **FormWizardLayout** | KYC, registration, wizards |
| Detail Pages | **DetailViewLayout** | Shipment tracking, ledger entries |
| Maps | **MapTaskLayout** | Routes, geolocation, delivery tracking |
| Dialogs | **ModalOverlay** | Confirmations, settings, filters |
| Page Layout | **AppShell** | Wrap all pages for navigation |

---

## 🎨 Using Design Tokens

### Colors
```tsx
// Brand colors
className="text-brand-primary"           // Navy (#02488D)
className="bg-brand-secondary"          // Cyan (#00B4C9)
className="border-brand-accent"         // Cyan Light (#18CCE5)

// Status colors
className="text-status-success"         // Green (#28A745)
className="bg-status-error-bg"          // Light red bg
className="border-status-warning"       // Amber (#F5A623)
className="text-status-pending"         // Blue (#1A6FC4)

// Neutral scale
className="text-neutral-900"            // Darkest text
className="bg-neutral-100"              // Light backgrounds
className="border-neutral-300"          // Borders
className="text-neutral-500"            // Secondary text
```

### Spacing
```tsx
className="p-4"    // padding: var(--space-4) = 16px
className="gap-6"  // gap: var(--space-6) = 24px
className="my-8"   // margin-y: var(--space-8) = 32px
```

### Border Radius
```tsx
className="rounded-xs"      // 6px - small elements
className="rounded-sm"      // 10px - inputs
className="rounded-md"      // 14px - cards
className="rounded-lg"      // 20px - modals
className="rounded-pill"    // 999px - buttons
```

### Shadows
```tsx
className="shadow-card"     // Subtle card shadow
className="shadow-modal"    // Modal shadow
className="shadow-btn"      // Button hover shadow
```

---

## 🧩 Component Examples

### Basic Setup
```tsx
import { AppShell, DashboardLayout, Button } from '@/components'

export default function Dashboard() {
  return (
    <AppShell role="Gov" header={<h1>Dashboard</h1>} sidebar={<Nav />}>
      <DashboardLayout title="Welcome" stats={[...]} activity={[...]} />
    </AppShell>
  )
}
```

### Table with Search
```tsx
<DataTableLayout
  title="Transactions"
  columns={[
    { key: 'date', label: 'Date', sortable: true },
    { 
      key: 'status', 
      label: 'Status',
      render: (val) => <StatusBadge status={val.toLowerCase()} label={val} />
    },
  ]}
  data={transactions}
  onSearch={(query) => filterTransactions(query)}
/>
```

### Form Wizard
```tsx
const [step, setStep] = useState(0)

<FormWizardLayout
  steps={[
    { id: '1', label: 'Info', description: 'Basic info' },
    { id: '2', label: 'Docs', description: 'Upload docs' },
    { id: '3', label: 'Review', description: 'Review' },
  ]}
  currentStep={step}
  onStepChange={setStep}
  onSubmit={() => submitForm()}
>
  {step === 0 && <InfoForm />}
  {step === 1 && <DocumentUpload />}
  {step === 2 && <Review />}
</FormWizardLayout>
```

### Detail Page
```tsx
<DetailViewLayout
  title="Shipment #2341"
  breadcrumb={['Shipments', 'Active']}
  mainContent={[
    {
      title: 'Details',
      items: [
        { label: 'Tracking', value: '#2341' },
        { label: 'Status', value: '🟢 In Transit' },
      ],
    },
  ]}
  sidebar={<div>Additional Info</div>}
/>
```

### Reusable UI Components
```tsx
import { Button, Input, StatusBadge } from '@/components'

// Button variants
<Button variant="primary" size="lg">Submit</Button>
<Button variant="outline" icon={<ArrowRight />}>Learn More</Button>
<Button variant="ghost" disabled isLoading>Processing...</Button>

// Input field
<Input
  label="Email"
  placeholder="user@example.com"
  error={emailError}
  helperText="We'll never share your email"
  icon={<Mail size={20} />}
/>

// Status badge
<StatusBadge status="success" label="Completed" size="md" />
<StatusBadge status="pending" label="Processing" showIcon={true} />
```

---

## 🌍 RTL Support

All components use **logical properties** - no manual RTL work needed:

```tsx
// ✅ CORRECT - Works both LTR and RTL
<div className="ps-4 pe-6 start-0">Content</div>  // padding-start, padding-end, position-start

// ❌ WRONG - Don't use these
<div className="pl-4 pr-6 left-0">Content</div>   // These don't work in RTL

// Change direction via HTML attribute
<html dir="rtl" lang="ar">
  {/* Everything automatically flips */}
</html>
```

---

## 📱 Responsive Patterns

```tsx
// Mobile-first grid
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
  {/* 1 col on mobile, 2 on tablet, 4 on desktop */}
</div>

// Flex layout
<div className="flex flex-col gap-3 lg:flex-row lg:items-center">
  {/* Stack on mobile, row on desktop */}
</div>

// Hide/show on breakpoints
<nav className="hidden md:block">Desktop Nav</nav>
<button className="md:hidden">Mobile Menu</button>
```

---

## 🎭 Role-Based Branding

Automatically set in AppShell:

```tsx
<AppShell role="Visitor">  {/* Cyan (#00B4C9) */}
<AppShell role="Owner">    {/* Navy (#02488D) */}
<AppShell role="Gov">      {/* Navy (#02488D) */}
<AppShell role="Carrier">  {/* Amber (#F5A623) */}
```

The header color changes automatically. No additional styling needed.

---

## ✅ Common Tasks

### Search & Filter Table
```tsx
const [search, setSearch] = useState('')
const filtered = data.filter(item => 
  item.name.toLowerCase().includes(search.toLowerCase())
)

<DataTableLayout
  data={filtered}
  onSearch={setSearch}
/>
```

### Status Timeline
```tsx
const activities = [
  { title: 'Order placed', status: 'success', timestamp: '10m ago' },
  { title: 'Payment verified', status: 'success', timestamp: '5m ago' },
  { title: 'Processing', status: 'pending', timestamp: 'now' },
]

<DashboardLayout activity={activities} />
```

### Modal with Form
```tsx
const [open, setOpen] = useState(false)

<ModalOverlay
  isOpen={open}
  onClose={() => setOpen(false)}
  title="Edit Profile"
  footer={
    <>
      <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
      <Button variant="primary" onClick={handleSave}>Save</Button>
    </>
  }
>
  <Input label="Name" placeholder="Full name" />
  <Input label="Email" placeholder="Email" />
</ModalOverlay>
```

### Loading State
```tsx
<Button isLoading variant="primary" disabled>
  Uploading...
</Button>

<DataTableLayout data={data} isLoading={loading} />
```

---

## 🔗 Typography Classes

```tsx
// Headings
<h1 className="text-display">Main Title</h1>        {/* 32px, 800 weight */}
<h2 className="text-heading">Section Title</h2>    {/* 22px, 700 weight */}
<h3 className="text-subheading">Card Title</h3>    {/* 17px, 600 weight */}

// Body text
<p className="text-body">Body paragraph</p>        {/* 15px, 400 weight */}
<label className="text-label">Input Label</label>  {/* 13px */}
<span className="text-caption">Helper text</span>  {/* 11px */}
<code className="text-code">const x = 1</code>  {/* 14px, monospace */}
```

---

## 🚀 Performance Optimizations

```tsx
// Lazy load heavy components
const MapTaskLayout = dynamic(() => import('@/components').then(m => m.MapTaskLayout))

// Debounce search
const [search, setSearch] = useState('')
const debouncedSearch = useMemo(() => 
  debounce((q) => handleSearch(q), 300),
  []
)

// Pagination for large datasets
<DataTableLayout
  data={paginatedData}
  pageSize={10}
/>
```

---

## 🎨 Customizing Colors

**For a specific page/section:**

```tsx
// Inline override (not recommended - use design tokens instead)
<div className="bg-[#your-color]">...</div>

// Better: Update CSS variable
<style>{`
  :root { --color-brand-primary: #your-color; }
`}</style>

// Best: Edit globals.css and use throughout
```

---

## 🚨 Common Mistakes

```tsx
// ❌ DON'T - hardcoded LTR properties
<div className="pl-4 left-0">Wrong</div>

// ✅ DO - use logical properties
<div className="ps-4 start-0">Correct</div>

// ❌ DON'T - custom colors everywhere
<div className="text-[#FF0000]">Wrong</div>

// ✅ DO - use design tokens
<div className="text-status-error">Correct</div>

// ❌ DON'T - break grid on mobile
<div className="grid grid-cols-4">Desktop only</div>

// ✅ DO - responsive grid
<div className="grid grid-cols-1 md:grid-cols-4">Mobile first</div>
```

---

## 📚 File Organization

```
app/
  ├── page.tsx           ← Main page
  ├── layout.tsx         ← Root layout (fonts set here)
  └── globals.css        ← Design tokens

components/
  ├── shell/
  │   └── AppShell.tsx
  ├── layouts/
  │   ├── DashboardLayout.tsx
  │   ├── DataTableLayout.tsx
  │   ├── FormWizardLayout.tsx
  │   ├── DetailViewLayout.tsx
  │   ├── MapTaskLayout.tsx
  │   └── ModalOverlay.tsx
  ├── ui/
  │   ├── Button.tsx
  │   ├── Input.tsx
  │   └── StatusBadge.tsx
  └── index.ts           ← Barrel exports

tailwind.config.ts        ← Tailwind token mappings
```

---

## 🧪 Testing Components

```tsx
// Test modal
const [open, setOpen] = useState(false)
return (
  <>
    <button onClick={() => setOpen(true)}>Open</button>
    <ModalOverlay isOpen={open} onClose={() => setOpen(false)}>
      Test content
    </ModalOverlay>
  </>
)

// Test form wizard
const [step, setStep] = useState(0)
// Try each step: step 0, 1, 2
// Test navigation buttons
```

---

## 💡 Pro Tips

1. **Always wrap pages with AppShell** - Gets you navigation + consistent branding
2. **Use StatusBadge for status columns** - Consistent styling + icons
3. **Leverage responsive classes** - Don't hardcode widths
4. **Import from @/components** - Shorter paths, easier refactoring
5. **Check globals.css for tokens** - Don't guess colors
6. **Use role prop on AppShell** - Automatic brand color switching
7. **Copy demo patterns** - `/app/page.tsx` has working examples

---

**Last Updated:** April 2026 | **Status:** Production Ready ✅
