import { defineConfig } from '@playwright/test';

const requestedPort = process.env.PLAYWRIGHT_PORT ?? '4173';
const port = Number(requestedPort);

if (!/^\d+$/.test(requestedPort) || !Number.isInteger(port) || port < 1 || port > 65_535) {
  throw new Error('PLAYWRIGHT_PORT must be an integer between 1 and 65535');
}

const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.e2e.ts',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'line',
  timeout: 30_000,
  use: {
    baseURL,
    trace: 'retain-on-failure',
  },
  webServer: {
    command: `node -e "require('node:fs').rmSync('.next',{recursive:true,force:true})" && exec ./node_modules/.bin/next dev --hostname 127.0.0.1 --port ${port}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
