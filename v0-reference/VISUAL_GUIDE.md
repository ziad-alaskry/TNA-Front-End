# TNA UI System - Visual Component Guide

## 🎨 Component Visual Reference

### AppShell Layout

```
┌─────────────────────────────────────────────────┐
│ ▰▰▰ HEADER (Role-based color: Navy/Cyan)     │
├────────────┬─────────────────────────────────────┤
│            │                                     │
│ SIDEBAR    │       MAIN CONTENT                  │
│ (drawer    │       (DashboardLayout,             │
│  on        │        DataTableLayout, etc)        │
│  mobile)   │                                     │
│            │                                     │
│            │                                     │
├────────────┴─────────────────────────────────────┤
│ FOOTER (optional)                               │
├─────────────────────────────────────────────────┤
│ BOTTOM NAV (mobile only)                        │
└─────────────────────────────────────────────────┘
```

---

## 📊 DashboardLayout

```
┌──────────────────────────────────────────────────┐
│ Dashboard Overview                               │
└──────────────────────────────────────────────────┘

┌──────────────┬──────────────┬──────────────┬────┐
│ Total Users  │ Revenue      │ Growth       │ ... │
│ 1,203        │ $45.2K       │ 98.5%        │    │
└──────────────┴──────────────┴──────────────┴────┘

┌──────────────────────────────────────────────────┐
│ Recent Activity                                  │
├──────────────────────────────────────────────────┤
│ ✅ Payment processed          [2 hours ago]      │
│ ⏳ Document verification      [1 day ago]        │
│ ❌ Connection failed          [3 days ago]       │
└──────────────────────────────────────────────────┘
```

---

## 📋 DataTableLayout

```
┌──────────────────────────────────────────────────┐
│ Transaction History                              │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ 🔍 Search...                      [+ Add New]   │
└──────────────────────────────────────────────────┘

┌──────────┬──────────┬──────────┬──────────┬─────┐
│ Date     │ User     │ Status   │ Amount   │ Act │
├──────────┼──────────┼──────────┼──────────┼─────┤
│ 2024-01-15│ John Doe│ ✅Complete│$1,200   │View│
│ 2024-01-14│ Jane    │ ⏳Pending │ $850    │View│
│ 2024-01-13│ Bob     │ ❌Failed  │ $2,100  │ ... │
└──────────┴──────────┴──────────┴──────────┴─────┘

[< Prev]  Page 1 of 10 [Next >]
```

---

## ✨ FormWizardLayout

```
┌──────────────────────────────────────────────────┐
│ KYC Registration - Step 2 of 3: Documents       │
└──────────────────────────────────────────────────┘

     ① Info          ②  Docs          ③ Verify
     ✅───────────────●───────────────○

┌──────────────────────────────────────────────────┐
│                                                  │
│   📋 Upload Your Documents                      │
│                                                  │
│   [Drag files here or click to browse]          │
│                                                  │
│   ✓ Passport                                    │
│   ✓ Address Proof                              │
│   ○ Bank Statement                             │
│                                                  │
└──────────────────────────────────────────────────┘

[Cancel]                              [Continue]
```

---

## ℹ️ DetailViewLayout

```
┌──────────────────────────────────────────────────┐
│ ← Shipments / Active / SHP-001    [Track Real-time]│
│ Shipment #SHP-2024-001                           │
└──────────────────────────────────────────────────┘

┌──────────────────────────────┬───────────────────┐
│ Details (2/3)               │ Sidebar (1/3)     │
├──────────────────────────────┤───────────────────┤
│ Tracking ID:  #SHP-2024-001 │ Status:           │
│ Status:       🟢 In Transit  │ 🟢 On Time       │
│ Origin:       New York, NY   │                   │
│ Destination:  Los Angeles    │ Current Location: │
│                              │ 100 km away       │
├──────────────────────────────┤───────────────────┤
│ Timeline                    │ ETA:              │
├──────────────────────────────┤ Today, 5:30 PM   │
│ Pickup:    Jan 15, 9:30 AM  │                   │
│ In Transit: Jan 16, 2:15 PM │ Driver:           │
│ Delivery:  Jan 18, 2024     │ James Wilson      │
└──────────────────────────────┴───────────────────┘
```

---

## 🗺️ MapTaskLayout

```
┌──────────────────────────────────────────────────┐
│                                                  │
│      [Full-Bleed Map Background]                │
│                                                  │
│      🗺️  Interactive Map Area                   │
│                                                  │
│                              ┌──────────────────┐│
│                              │ Active Delivery  ││
│                              │                  ││
│                              │ Driver: James W. ││
│                              │ Vehicle: Truck #2││
│                              │ ETA: 15 min      ││
│                              │ [X]              ││
│                              └──────────────────┘│
│                                                  │
│   ▓▓▓▓▓▓▓▓▓ Gradient Overlay ▓▓▓▓▓▓▓▓▓         │
└──────────────────────────────────────────────────┘
```

---

## 💬 ModalOverlay

```
                    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
                  ▓  Backdrop (Blurred)  ▓
                  ▓                      ▓
                  ▓  ┌──────────────┐   ▓
                  ▓  │ Confirm      │   ▓
                  ▓  │              │ × ▓
                  ▓  ├──────────────┤   ▓
                  ▓  │              │   ▓
                  ▓  │ Are you sure?│   ▓
                  ▓  │              │   ▓
                  ▓  ├──────────────┤   ▓
                  ▓  │[Cancel][OK]  │   ▓
                  ▓  └──────────────┘   ▓
                  ▓                      ▓
                  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
```

---

## 🧩 Button Component

```
┌──────────────────────────────────────────────────┐
│ VARIANTS                                         │
├──────────────────────────────────────────────────┤
│ [● Primary (Navy→Cyan gradient)]                │
│ [○ Secondary (Cyan)]                            │
│ [○ Outline (Border + transparent)]              │
│ [○ Ghost (Text only)]                           │
│                                                  │
│ SIZES                                           │
├──────────────────────────────────────────────────┤
│ [Small Button]                                   │
│ [Medium Button]                                  │
│ [Large Full-Width Button]                       │
│                                                  │
│ STATES                                          │
├──────────────────────────────────────────────────┤
│ [Normal State]                                   │
│ [⟳ Loading State]                              │
│ [Disabled State]    (disabled)                  │
│ [🔑 With Icon]                                  │
└──────────────────────────────────────────────────┘
```

---

## 📝 Input Component

```
┌──────────────────────────────────────────────────┐
│ Email                                            │
│ [✉️ user@example.com        ]                   │
│ 💡 We'll never share your email                 │
│                                                  │
│ Password                                         │
│ [● ● ● ● ● ● ● ●            ]  👁️             │
│                                                  │
│ Invalid Field                                    │
│ [❌ Something went wrong      ]                 │
│ ✖ This field is required                       │
│                                                  │
│ Disabled Field                                   │
│ [readonly disabled          ]  (grayed out)     │
└──────────────────────────────────────────────────┘
```

---

## 🏷️ StatusBadge Component

```
┌──────────────────────────────────────────────────┐
│ STATUS TYPES                                     │
├──────────────────────────────────────────────────┤
│ ✅ Completed  (Green background)                │
│ ⏳ Processing (Blue background)                 │
│ ⚠️ Warning    (Amber background)                │
│ ❌ Error      (Red background)                  │
│ ℹ️ Information (Cyan background)                │
│                                                  │
│ SIZES                                           │
├──────────────────────────────────────────────────┤
│ Small:  ✅ Completed                            │
│ Medium: ✅ Completed                            │
│ Large:  ✅ Completed                            │
│                                                  │
│ WITH/WITHOUT ICONS                             │
├──────────────────────────────────────────────────┤
│ ✅ Completed  (icon visible)                    │
│ Completed     (icon hidden)                     │
└──────────────────────────────────────────────────┘
```

---

## 🎨 Color Palette Visual

```
BRAND COLORS
┌─────────┬─────────┬─────────┬─────────┐
│ Navy    │ Cyan    │ Cyan    │ Amber   │
│ #02488D │ #00B4C9 │ #18CCE5 │ #F5A623 │
│ ▰▰▰▰▰▰▰ │ ▰▰▰▰▰▰▰ │ ▰▰▰▰▰▰▰ │ ▰▰▰▰▰▰▰ │
└─────────┴─────────┴─────────┴─────────┘

STATUS COLORS
┌──────────┬─────────┬─────────┬──────────┐
│ Success  │ Error   │ Warning │ Pending  │
│ #28A745  │ #DC3545 │ #F5A623 │ #1A6FC4  │
│ ▰▰▰▰▰▰▰▰ │ ▰▰▰▰▰▰▰ │ ▰▰▰▰▰▰▰ │ ▰▰▰▰▰▰▰▰ │
└──────────┴─────────┴─────────┴──────────┘

NEUTRAL SCALE (9-step)
▰ 50    ▰ 100   ▰ 200   ▰ 300   ▰ 400   ▰ 500   ▰ 600   ▰ 700   ▰ 800   ▰ 900
Light ────────────────────────────────────────────────────────────────────── Dark
```

---

## 📐 Typography Hierarchy

```
Display (32px, 800) - App Names, Main Titles
───────────────────────────────────────────

Heading (22px, 700) - Section Headings
─────────────────────────────────────

Subheading (17px, 600) - Card Titles
──────────────────────────────────

Body (15px, 400) - Main content paragraph text with line height 1.6
─────────────────────────────────────────────────────────────────

Label (13px, 400) - Form labels and captions
─────────────────────────────────────

Caption (11px, 400) - Helper text
─────────────────────────

Code (14px, 500 mono) - Addresses, codes
```

---

## 🔲 Spacing System

```
1  2  3  4  5  6  7  8     10    12         16
4  8  12 16 20 24 28 32    40    48         64 px

Padding:  p-1 p-2 p-3 p-4 ... p-16
Margin:   m-1 m-2 m-3 m-4 ... m-16
Gap:      gap-1 gap-2 ... gap-16
```

---

## 🔲 Border Radius

```
xs:   ┌─────┐  (6px - checkboxes, small tags)
      └─────┘

sm:   ┌────────┐  (10px - inputs, small cards)
      └────────┘

md:   ┌──────────┐  (14px - standard cards)
      └──────────┘

lg:   ┌────────────┐  (20px - large modals)
      └────────────┘

pill: ┌──────────────────┐  (999px - buttons)
      └──────────────────┘
```

---

## 🌍 RTL Layout Flip

### LTR (English)
```
┌─────────────────────────────────────────────────┐
│ ← Back   Dashboard Title              Settings→ │
├────────────┬─────────────────────────────────────┤
│ Sidebar    │ Main Content                        │
│ (left)     │ (center-right)                      │
└────────────┴─────────────────────────────────────┘
```

### RTL (Arabic)
```
┌─────────────────────────────────────────────────┐
│ ←Settings   Dashboard Title              Back  │
├─────────────────────────────────┬────────────────┤
│ Main Content                   │ Sidebar        │
│ (center-left)                  │ (right)        │
└─────────────────────────────────┴────────────────┘
```

**Key:** Logical properties auto-flip! No code changes needed.

---

## 📱 Responsive Breakpoints

```
MOBILE (< 768px)
┌─────────────┐
│    HEADER   │ 
├─────────────┤
│ ≡ MENU      │ (drawer hidden)
├─────────────┤
│   CONTENT   │
│             │
├─────────────┤
│  BOTTOM NAV │
└─────────────┘

TABLET (768px - 1024px)
┌──────────────────────────────┐
│      HEADER                  │
├──────────┬───────────────────┤
│ SIDEBAR  │ CONTENT           │
│ (visible)│                   │
│          │                   │
├──────────┴───────────────────┤
│ FOOTER                       │
└──────────────────────────────┘

DESKTOP (> 1024px)
┌─────────────────────────────────┐
│      HEADER                     │
├──────────┬──────────────────────┤
│ SIDEBAR  │ CONTENT (2-3 cols)   │
│ (sticky) │                      │
│          │                      │
├──────────┴──────────────────────┤
│ FOOTER                          │
└─────────────────────────────────┘
```

---

## 🎭 Role-Based Header Colors

```
┌──────────────────────────────────────────────────┐
│ VISITOR - Cyan Header                            │
│ ▰▰▰▰▰▰▰ #00B4C9 ▰▰▰▰▰▰▰ (Public users)         │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ OWNER - Navy Header                              │
│ ▰▰▰▰▰▰▰ #02488D ▰▰▰▰▰▰▰ (Owners/Businesses)   │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ GOV - Navy Header                                │
│ ▰▰▰▰▰▰▰ #02488D ▰▰▰▰▰▰▰ (Government officials)│
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ CARRIER - Amber Header                           │
│ ▰▰▰▰▰▰▰ #F5A623 ▰▰▰▰▰▰▰ (Logistics/Carriers)  │
└──────────────────────────────────────────────────┘
```

---

## ⚡ Shadow System

```
CARD SHADOW        MODAL SHADOW       BUTTON SHADOW
▰ Subtle           ▰ Strong           ▰ Interactive
▰ For cards        ▰ For modals       ▰ Hover state
▰ 2px blur         ▰ 8px blur         ▰ 4px blur
▰ 8% opacity       ▰ 16% opacity      ▰ 30% opacity
```

---

## 🎯 Component Usage Flow

```
                    START
                      │
                      ↓
              "What do I need?"
              /     |     |     \
             /      |     |      \
            /       |     |       \
    Dashboard  DataTable Form    Detail
    Layout     Layout   Wizard    Layout
       │          │       │         │
       │          │       │         │
       ↓          ↓       ↓         ↓
    (Stats)  (Search) (Steps)  (Info)
       │          │       │         │
       │          │       │         │
       └──────────┴───────┴─────────┘
              │
              ↓
         All wrapped with:
          AppShell
              │
         (Role branding)
              │
              ↓
          READY TO USE
```

---

## 🎨 Quick Color Reference Card

```
PRIMARY ACTIONS        SECONDARY ACTIONS    STATES
┌──────────────┐       ┌──────────────┐     ┌─────────┐
│ Navy→Cyan    │       │ Cyan Border  │     │ ✅ Green│
│ Gradient     │       │ Transparent  │     │ ❌ Red  │
│ (Primary)    │       │ (Outline)    │     │ ⚠️ Amber│
└──────────────┘       └──────────────┘     │ ⏳ Blue │
                                             └─────────┘
```

---

**Visual Guide Complete!** 🎨

Use these diagrams alongside the code to build beautiful, consistent UIs.

All components follow these visual patterns automatically. ✨
