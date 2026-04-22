# TNA Project - v0 UI Generation System Brief 

Provide this technical blueprint to v0 or any AI code generator to ensure newly generated modules strictly adhere to the established project architecture, global styling contracts, and CSS containment rules.

---

### 1. Project Rules & Design Constraints
Ensure all generated React components adhere EXACTLY to the following DNA:
- **Typography:** Strictly use `font-sans` which maps to 'Public Sans'. Do NOT use 'Manrope' or default sans-serifs.
- **Button Styling:** All action buttons must use `bg-primary`, `text-white`, and `font-sans`. Do NOT use arbitrary hex codes (e.g. `bg-[#137fec]`) inline. Use Tailwind classes.
- **UI DNA (Flattening):** Absolutely NO Gradients (`bg-gradient`, `from-*`, `to-*`). All surface containers must be flat with a 1px border.
- **Card Containers:** Use `bg-white`, `border border-slate-200`, `rounded-lg`, and flat shadows (`shadow-none` is globally enforced).
- **Icons:** Use **Phosphor Icons (Regular Weight)**. Example usage: `<i className="ph ph-house text-xl"></i>`. Do not use SVG blobs unless absolutely necessary.
- **Data Placeholders:** Use standard React props for Arabic names, phone numbers, and IDs (e.g., `{user.name}`, `{user.phone}`, `{shipment.id}`). Do not hardcode Arabic mock data.
- **Avatars:** Do not use `<img>` tags for user avatars. Use a standard div: `<div className="w-10 h-10 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-sm font-sans">{user.initials}</div>`.

---

### 2. Theme Specs

**[tailwind.config.js](file:///c:/Users/Kimo%20Store/Desktop/project-tna/project-a/frontend/tna-project/tailwind.config.js)**
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#137fec',
                },
                role: {
                    owner: '#0d9488',
                    carrier: '#2563eb',
                    gov: '#d97706',
                    visitor: '#64748b'
                },
                success: 'hsl(142, 69%, 41%)',
                danger: 'hsl(0, 84%, 60%)',
                warning: 'hsl(39, 100%, 50%)',
                'tna-gray': {
                    50: 'hsl(210, 20%, 98%)',
                    200: '#e2e8f0', // Enforced border color
                    400: 'hsl(210, 10%, 70%)',
                    600: 'hsl(210, 8%, 45%)',
                    900: 'hsl(210, 10%, 15%)',
                },
            },
            borderRadius: {
                'md': '6px',
                'lg': '8px', // UI DNA requirement
            },
            spacing: {
                '3': '12px',
                '4': '16px',
                '6': '24px',
            },
            fontFamily: {
                sans: ['Public Sans', 'sans-serif'], // UI DNA Typography
            },
            boxShadow: {
                // Enforce flat design by resetting default shadows
                'sm': 'none',
                'md': 'none',
                'lg': 'none',
                'xl': 'none',
                '2xl': 'none',
            }
        },
    },
    plugins: [],
}
```

**[src/app/globals.css](file:///c:/Users/Kimo%20Store/Desktop/project-tna/project-a/frontend/tna-project/src/app/globals.css)**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;600;700&family=Noto+Sans+Arabic:wght@400;500;600;700&display=swap');
@import url('https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css');

@layer base {
  :root {
    --foreground-rgb: 0, 0, 0;
    --background-start-rgb: 255, 255, 255;
    --background-end-rgb: 255, 255, 255;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --foreground-rgb: 255, 255, 255;
      --background-start-rgb: 0, 0, 0;
      --background-end-rgb: 0, 0, 0;
    }
  }

  html, body {
    font-family: 'Public Sans', sans-serif;
  }

  body {
    color: rgb(var(--foreground-rgb));
    background: #ffffff; /* Enforcing Flat UI Design: No Gradients */
  }
}

@layer components {
  /* UI DNA: All cards/containers must be flat with a 1px border */
  .ui-contract-card {
    border: 1px solid #e2e8f0;
    border-radius: 8px; /* rounded-lg */
    box-shadow: none;
  }
}
```

---

### 3. Layout Shell Context
**[src/components/AppShell.tsx](file:///c:/Users/Kimo%20Store/Desktop/project-tna/project-a/frontend/tna-project/src/components/AppShell.tsx)**

*Note for AI Generator: If generating a page screen, assume it is being slotted into the `{children}` of this shell. DO NOT generate additional outer `<header>`, `<nav>`, or Sidebars. Our Shell uses CSS rules (`[&_header]:hidden [&_nav]:hidden`) to forcefully strip out duplicate structural headers rendered locally inside `{children}`.*

```tsx
'use client';

import React, { ReactNode, useState } from 'react';
import Link from 'next/link';

export type Role = 'owner' | 'carrier' | 'gov' | 'visitor';

interface AppShellProps {
  children: ReactNode;
  role: Role;
  userName?: string;
  avatarUrl?: string; // We map this structurally or ignore for CSS avatars
}

export default function AppShell({ 
  children, 
  role = 'visitor',
  userName = 'User',
}: AppShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks: Record<Role, { label: string; href: string; icon: string }[]> = {
    owner: [
      { label: 'Home', href: '/owner/home', icon: 'ph-house' },
      { label: 'Properties', href: '/owner/properties', icon: 'ph-buildings' },
      { label: 'Earnings', href: '/owner/earnings', icon: 'ph-currency-circle-dollar' },
      { label: 'Requests', href: '/owner/linking', icon: 'ph-envelope-simple' },
    ],
    carrier: [
      { label: 'Home', href: '/carrier/home', icon: 'ph-house' },
      { label: 'Shipments', href: '/carrier/shipments', icon: 'ph-truck' },
      { label: 'Reports', href: '/carrier/reports', icon: 'ph-chart-bar' },
      { label: 'Settings', href: '/carrier/settings', icon: 'ph-gear' },
    ],
    gov: [
      { label: 'Home', href: '/gov/home', icon: 'ph-house' },
      { label: 'Issuance', href: '/gov/issuance', icon: 'ph-file-text' },
      { label: 'Addresses', href: '/gov/addresses', icon: 'ph-map-pin' },
      { label: 'Audit', href: '/gov/audit', icon: 'ph-shield-check' },
    ],
    visitor: [
      { label: 'Home', href: '/visitor/home', icon: 'ph-house' },
      { label: 'Addresses', href: '/visitor/addresses', icon: 'ph-map-pin' },
      { label: 'Shipments', href: '/visitor/shipments', icon: 'ph-truck' },
    ]
  };

  const currentLinks = navLinks[role];

  const getRoleBadgeClass = (r: Role) => {
    switch (r) {
      case 'owner': return 'bg-role-owner/10 text-role-owner border-role-owner/20';
      case 'carrier': return 'bg-role-carrier/10 text-role-carrier border-role-carrier/20';
      case 'gov': return 'bg-role-gov/10 text-role-gov border-role-gov/20';
      case 'visitor': return 'bg-role-visitor/10 text-role-visitor border-role-visitor/20';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="fixed top-0 inset-x-0 h-16 bg-white border-b border-tna-gray-200 z-50 flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <Link href={`/${role}/home`} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">T</div>
            <span className="font-bold text-xl tracking-tight hidden sm:block">TNA Tracker</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className={`hidden sm:flex border px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${getRoleBadgeClass(role)}`}>
              {role}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 pt-16">
        <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-tna-gray-200 h-[calc(100vh-4rem)] sticky top-16">
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {currentLinks.map((link) => (
              <Link key={link.href} href={link.href} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors font-medium">
                <i className={`ph ${link.icon} text-xl`}></i>
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1 flex justify-center p-4 md:p-6 lg:p-8 bg-gray-50/50">
          <div className="w-full max-w-6xl [&_header]:hidden [&_nav]:hidden font-sans text-primary">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
```

---

### 4. Data Schemas (TypeScript Environment)
Always build UI components interacting with these schemas. Avoid `any` types.

```typescript
// Core Types
export type UserType = 'visitor' | 'owner' | 'gov' | 'logistics' | null;

export interface BaseUser {
  id: string; // Internal system UUID or Saudi ID
  name: string;
  initials: string;
  phone: string;
  role: UserType;
  isActive: boolean;
}

export interface Owner extends BaseUser {
  role: 'owner';
  activePropertiesCount: number;
  totalEarningsSAR: number;
  linkingRequests: LinkingRequest[];
}

export interface Carrier extends BaseUser {
  role: 'logistics';
  licenseNumber: string;
  activeShipments: Shipment[];
}

export interface Government extends BaseUser {
  role: 'gov';
  departmentId: string;
  auditClearanceLevel: number;
}

export interface Shipment {
  id: string;      // Format: #12345
  status: 'pending' | 'in_transit' | 'delivered' | 'cancelled';
  carrierId: string;
  destinationAddressId: string;
  priceSAR: number;
  dateCreated: string; // ISO 8601
}

export interface LinkingRequest {
  requestId: string;
  ownerId: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
}

export interface FormatData {
  amount: (value: number) => string;
  dateFormatted: (dateString: string) => string;
  timeFormatted: (dateString: string) => string;
}
```
