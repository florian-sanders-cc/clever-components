import { defineConfig } from '@playwright/test';

export default defineConfig({
  snapshotDir: './tests-playwright',
  reporter: 'html',
  testDir: './tests-playwright',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  use: {
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run storybook:dev',
    url: 'http://localhost:6006',
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
