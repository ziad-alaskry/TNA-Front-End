// Key config points:
// - baseURL: 'http://localhost:3000'
// - projects: [chromium, firefox, mobile-chrome]
// - retries: 1 (CI), 0 (local)
// - trace: 'on-first-retry'
// - screenshot: 'only-on-failure'
// - webServer: { command: 'npm run dev', port: 3000 }
import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Config for Project TNA
 * Focused on Visual Regression Testing (VRT) and Role-Based Dashboards
 */
export default defineConfig({
  testDir: './tests',
  /* Maximum time one test can run for. */
  timeout: 60 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For VRT, we use a balanced maxDiffPixelRatio to handle anti-aliasing.
     */
    timeout: 10000,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.02,
      animations: 'disabled',
    },
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { open: 'never' }],
    ['list']
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    /* Standardized viewport for data-dense dashboards */
    viewport: { width: 1440, height: 900 },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },

  /* Snapshot path configuration */
  snapshotPathTemplate: '{testDir}/__screenshots__/{testFilePath}/{arg}{ext}',
});