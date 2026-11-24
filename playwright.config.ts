import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

/** Addresses can be overridden from the environment, for example BASE_URL=https://staging.example.com */
const baseURL = process.env.BASE_URL ?? 'https://www.saucedemo.com';
const apiBaseURL = process.env.API_BASE_URL ?? 'https://restful-booker.herokuapp.com';

const STORAGE_STATE = 'playwright/.auth/standard-user.json';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI, // fail the build if a stray test.only is committed
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,
  timeout: 30_000,
  expect: { timeout: 7_000 },

  reporter: isCI
    ? [['list'], ['html', { open: 'never' }], ['junit', { outputFile: 'test-results/junit.xml' }]]
    : [['list'], ['html', { open: 'never' }]],

  use: {
    testIdAttribute: 'data-test', // lets getByTestId() find Sauce Demo's data-test attributes
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
  },

  projects: [
    // Logs in once and saves the session, so UI tests start already signed in.
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
      use: { baseURL },
    },

    {
      name: 'chromium',
      testMatch: /ui\/.*\.spec\.ts/,
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'], baseURL, storageState: STORAGE_STATE },
    },
    {
      name: 'firefox',
      testMatch: /ui\/.*\.spec\.ts/,
      dependencies: ['setup'],
      use: { ...devices['Desktop Firefox'], baseURL, storageState: STORAGE_STATE },
    },
    {
      name: 'webkit',
      testMatch: /ui\/.*\.spec\.ts/,
      dependencies: ['setup'],
      use: { ...devices['Desktop Safari'], baseURL, storageState: STORAGE_STATE },
    },
    {
      name: 'mobile-chrome',
      testMatch: /ui\/.*\.spec\.ts/,
      dependencies: ['setup'],
      use: { ...devices['Pixel 7'], baseURL, storageState: STORAGE_STATE },
    },

    // API tests need no browser.
    {
      name: 'api',
      testMatch: /api\/.*\.spec\.ts/,
      use: { baseURL: apiBaseURL, extraHTTPHeaders: { Accept: 'application/json' } },
    },
  ],
});
