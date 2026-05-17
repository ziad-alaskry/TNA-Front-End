# Visual Regression Testing (VRT) Operational Guide

The VRT infrastructure is now fully operational. This guide provides the necessary commands and workflows for maintaining visual integrity across the project.

## Core Infrastructure Components

1.  **Configuration:** `playwright.config.ts` is tuned for VRT with a `maxDiffPixelRatio: 0.02` and desktop-optimized viewports (1440x900).
2.  **Auth Helper:** `tests/helpers/auth.ts` allows bypassing UI login by injecting `auth-storage` into `localStorage`.
3.  **Visual Suite:** `tests/visual/dashboards.spec.ts` covers all four core roles (Visitor, Owner, Carrier, Authority) with dynamic masking for volatile content.

## Workflow Commands

### 1. Local Verification
Run this command to check for visual regressions against existing baselines:
```bash
npm run test:vrt
```

### 2. Interactive Debugging
Open the Playwright UI to visually inspect diffs and adjust masks:
```bash
npm run test:vrt:ui
```

### 3. Authorized Baseline Generation (Docker)
**Crucial:** To prevent "Host OS drift" (where Windows fonts differ from Linux), baselines MUST be generated using the official Playwright Docker container. This ensures parity between your local machine and the CI environment.

```powershell
# Run from the project root (PowerShell)
docker run --rm --network host -v ${PWD}:/work/ -w /work/ mcr.microsoft.com/playwright:v1.43.0-jammy npx playwright test tests/visual --update-snapshots
```

## Maintenance Best Practices

*   **Adding Dynamic Content:** If you add a new chart or timestamp to a dashboard, ensure you add a `data-vrt="timestamp"` attribute or update the masking array in `dashboards.spec.ts`.
*   **Layout Changes:** If a layout change is intentional, run the Docker update command above to rebase the baselines.
*   **PR Reviews:** Always include the `__screenshots__` directory in your PR if baselines have been updated.

---
**Engineering Note:** Snapshot baselines are stored in `tests/__screenshots__`.
