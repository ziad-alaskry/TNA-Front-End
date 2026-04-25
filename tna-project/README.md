# TNA Platform Frontend

This is the official frontend application for the **Temporary National Address (TNA)** platform. Built with Next.js 14 (App Router), React 18, and Tailwind CSS. The design system closely follows the SPATIAL token specifications by SDAIA.

## 🏗️ Architecture Overview

The TNA frontend is a multi-tenant application acting as the control plane for:
- **Visitors:** Issuing short-lived national addresses (`TNAs`).
- **Property Owners:** Managing their real estate and authorizing/binding visitor addresses to their registry references.
- **Carriers/Logistics:** Tracking active shipments against dynamic temporary addresses.
- **Government Agencies:** Auditing, policy creation, and manual verification of document discrepancies.

### Core Technologies
- **Framework:** Next.js 14 App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS (extended with SPATIAL UI tokens)
- **Icons:** Phosphor Icons
- **State Management:** Zustand (Stores), React Context (Domain state)
- **i18n:** `next-intl` (Built-in custom implementation matching Next.js middleware standards for RTL/LTR).
- **Forms & Validation:** React Hook Form + Zod

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have Node.js 18.x or 20.x installed.

### 2. Installation
```bash
npm install
```

### 3. Environment Variables
Copy the `.env.example` file to create a local `.env.local`:
```bash
cp .env.example .env.local
```
Fill in the necessary values (specifically API URLs).

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### 5. Running Tests
The project utilizes Vitest and React Testing Library for testing.
```bash
npm run test
```

## 📂 Project Structure

```text
src/
├── app/               # Next.js App Router (Pages, Layouts, APIs)
│   ├── [locale]/      # i18n dynamic routing layer
│   └── globals.css    # PostCSS directives
├── components/        # React Components
│   ├── layout/        # AppShell, Navigation bounds
│   ├── modules/       # Complex domain-specific views (e.g. VisitorHomeModule)
│   ├── shared/        # Multi-domain shared pieces (Breadcrumbs, Switchers)
│   ├── templates/     # Structural UI (DataTables, DashboardLayouts)
│   └── ui/            # Atomic components (Buttons, Inputs, Cards, SPATIAL design tokens)
├── i18n/              # Localization files and configurations
├── lib/               # Utilities, API integrations, and Store definitions
│   ├── api/           # Axios/Fetch wrappers pointing to microservices
│   ├── context/       # Domain-specific React Context Providers
│   ├── store/         # Zustand global stores
│   ├── types/         # TypeScript interfaces map to CFIP schema
│   └── utils/         # Helper functions (cn, tnaValidator)
```

## 🎨 SPATIAL Design System

The platform implements a strict semantic tokens setup. Never use hardcoded HEX/RGB values in Tailwind classes. Rely on standard semantic classes:
- **Surfaces:** `bg-surface-100`, `bg-surface-200`
- **Typography:** `text-neutral-900`, `text-display`, `text-body`
- **Actions:** `bg-btn-primary`, `bg-success`

Ensure RTL support is verified utilizing the logical property plugins or Tailwind's `rtl:` specifier correctly.

## 📄 License
Internal SDAIA use only.
