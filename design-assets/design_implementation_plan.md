# TNA UI Restyling Implementation Roadmap

This plan outlines the architectural and visual overhaul of the TNA project to align with the SPATIAL Design System. The goal is to transition from the current setup to a token-driven, scalable architecture that fully supports RTL (Arabic) and production-grade aesthetics.

## User Review Required

> [!IMPORTANT]
> **Font Families**: We will be introducing `IBM Plex Sans Arabic` as the primary typeface for Arabic text, while retaining `Rubik` or `IBM Plex Sans` for English/Numeric values. This requires ensuring these fonts are available via the project's font loading strategy (likely Google Fonts or local assets).

> [!WARNING]
> **CSS Variable Namespace**: The provided `design-tokens.css` uses a specific naming convention (e.g., `--color-primary`). The existing project uses different names (e.g., `--primary`). We will migrate to the design system's naming convention for strict alignment.

## Phase 1: Token & Configuration Migration
Map out the exact steps to merge color palettes, typography, and spacing into the global environment.

1.  **Update CSS Variables**: Inject the core design tokens from `design-tokens.css` into the project's global CSS file (likely `src/app/globals.css` or `src/styles/index.css`).
    - Standardize on `--color-primary`, `--color-secondary`, `--color-neutral`, etc.
    - Define gradient primitives (e.g., `--gradient-primary`, `--gradient-secondary-teal`).
2.  **Tailwind Config Synchronization**: Update `tna-project/tailwind.config.js` to map these variables.
    - **Colors**: Map `primary`, `secondary`, `success`, `error`, `warning`, `info`, and `neutral` to the new CSS variables.
    - **Typography**: Add `IBM Plex Sans Arabic` to the `fontFamily` section.
    - **Spacing**: Ensure the scale (1-12) aligns perfectly with the `4px` base increment.
    - **Border Radius**: Map `sm` (6px), `md` (10px), `lg` (14px), `xl` (18px), and `full` (9999px).
3.  **Conflict Resolution**: Identify and replace any hardcoded hex values in the config with their variable counterparts.

## Phase 2: Base Typography & Global Layout
Implement base typography and structural updates for RTL/Arabic support.

1.  **Global RTL Direction**: Ensure the `[dir="rtl"]` selector is applied to the root element.
    - Configure global text alignment and directionality.
    - Set the default font family for Arabic text to `var(--font-arabic)`.
2.  **Typography Scale Implementation**: Define utility classes or update the Tailwind `fontSize` configuration to match the provided scale (xs: 11px to 3xl: 34px).
3.  **Structural Wrapper Updates**:
    - Update the main layout container to respect the `960px` maximum width.
    - Apply consistent horizontal screen margins (`--screen-margin: 20px`).
    - Standardize the background surface to `#F2F2F7` (iOS-style light gray).

## Phase 3: Core UI Component Restyling
A prioritized checklist for foundational component updates using `cva` and `tailwind-merge`.

1.  **[ ] Buttons**:
    - **Primary**: Gradient `linear-gradient(to right, #2196C9, #1565A8)`, `full` radius, `52px` height, blue glow shadow.
    - **Secondary/Small**: Teal gradient, `9999px` radius, `40px` height.
    - **Outline**: `1.5px` blue border, transparent background.
    - **States**: Define hover (transform), active (scale), and disabled (grayscale/opacity) states.
2.  **[ ] Form Inputs**:
    - **Default**: `#F5F5F5` background, `10px` radius, `1px` border.
    - **Active/Focus**: `#FFFFFF` background, `1.5px` blue border, subtle inner shadow.
    - **Error**: `2px` red border, light red background tint.
3.  **[ ] Cards & Containers**:
    - **Standard**: `14px` radius, `#FFFFFF` surface, `0px 2px 8px` shadow.
    - **Selected**: `2px` blue border, elevated shadow.
    - **Hover**: Increase shadow to `0px 4px 16px`.
4.  **[ ] Badges & Chips**:
    - Implement the pill-shaped status badges with specific light/dark color pairs (e.g., Success: Green/Light Green).

## Phase 4: State Management & Motion Tokens
Apply motion tokens and audit interaction states.

1.  **Motion Token Integration**:
    - Map `duration-fast` (150ms), `duration-normal` (250ms), and `duration-slow` (400ms) to Tailwind's transition durations.
    - Implement the standard easing `cubic-bezier(0.4, 0, 0.2, 1)`.
2.  **Interaction State Audit**:
    - Verify that all interactive elements (buttons, links, inputs) have consistent `focus-visible` rings.
    - Ensure `disabled` states correctly apply the `0.45` opacity and block interactions.
    - Validate that error states are persistent and visually distinct across all components.

## Verification Plan

### Automated Tests
-   **Tailwind Consistency**: Run a check to ensure all new tokens are accessible via Tailwind classes (e.g., `text-brand-primary`, `bg-brand-gradient`).
-   **RTL Layout**: Use browser testing tools to verify that switching `dir="rtl"` to `dir="ltr"` correctly mirrors the layout and icons.

### Manual Verification
-   **Visual Comparison**: Compare the implemented components against the `gemini-code-1777459467601.html` reference and original Figma screenshots.
-   **Motion Feel**: Verify that animations feel smooth and consistent across different devices.
