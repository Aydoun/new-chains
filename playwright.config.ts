import fs from "node:fs";
import path from "node:path";
import { defineConfig, devices } from "@playwright/test";
import { parse } from "dotenv";
import { AUTH_FILE } from "./e2e/support/constants";
import { assertDedicatedTestDatabase } from "./e2e/support/test-db";

/**
 * End-to-end tests run against a dedicated Neon test database, never the
 * development or production one. Its settings live in `.env.test` (see the
 * E2E section of `.env.example`); `e2e/global.setup.ts` refuses to run if that
 * database also appears in another env file.
 *
 * Values from `.env.test` are handed to the Next.js server as real
 * environment variables, so they win over `.env` / `.env.local`.
 */
const envFile = path.resolve(__dirname, ".env.test");
const testEnv = fs.existsSync(envFile)
  ? parse(fs.readFileSync(envFile))
  : {};

// Make the same values visible to the setup project and the tests.
for (const [key, value] of Object.entries(testEnv)) {
  process.env[key] ??= value;
}

// Fail before anything starts (dev server included) if .env.test is not
// pointing at a dedicated test database.
assertDedicatedTestDatabase();

// One Faker seed per run. Workers inherit it from this process, and each
// test derives its own seed from it (see e2e/support/fixtures.ts). Replay a
// failing run with `E2E_SEED=<seed> yarn test:e2e`.
process.env.E2E_SEED ??= String(Math.floor(Math.random() * 2 ** 31));

const PORT = Number(process.env.E2E_PORT ?? 3100);
const LOCAL_URL = `http://localhost:${PORT}`;
// Set PLAYWRIGHT_BASE_URL to test an already-running deployment instead.
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? LOCAL_URL;

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI
    ? [["list"], ["html", { open: "never" }]]
    : [["list"], ["html", { open: "on-failure" }]],
  // Neon can take a few seconds to wake up, and the dev server compiles each
  // page on first visit.
  timeout: 60_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "setup",
      testMatch: /global\.setup\.ts/,
    },
    {
      name: "public",
      testMatch: /public\/.*\.spec\.ts/,
      // Still needs migrations applied and the seeded users in place.
      dependencies: ["setup"],
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "signed-in",
      testMatch: /signed-in\/.*\.spec\.ts/,
      dependencies: ["setup"],
      use: { ...devices["Desktop Chrome"], storageState: AUTH_FILE },
    },
    {
      // Live API endpoints, called directly with the test user's session.
      name: "api",
      testMatch: /api\/.*\.spec\.ts/,
      dependencies: ["setup"],
      use: { storageState: AUTH_FILE },
    },
  ],
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: `npx next dev --turbopack --port ${PORT}`,
        url: LOCAL_URL,
        // Never attach to a server started some other way: it could be
        // connected to the development database.
        reuseExistingServer: false,
        timeout: 120_000,
        env: {
          ...testEnv,
          NODE_OPTIONS: "--use-system-ca",
          NEXTAUTH_URL: LOCAL_URL,
          // Separate build folder, so a running `yarn dev` doesn't block it.
          NEXT_DIST_DIR: ".next/e2e",
        },
      },
});
