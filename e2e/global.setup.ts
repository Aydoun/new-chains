import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { test as setup } from "@playwright/test";
import { AUTH_FILE, TEST_USER } from "./support/constants";
import { sessionCookie } from "./support/session";
import { assertDedicatedTestDatabase, resetSeededUsers } from "./support/test-db";

/** DIRECT_DATABASE_URL, or the Neon pooled URL with `-pooler` removed. */
function directDatabaseUrl() {
  if (process.env.DIRECT_DATABASE_URL) return process.env.DIRECT_DATABASE_URL;
  const url = new URL(process.env.DATABASE_URL!);
  url.hostname = url.hostname.replace("-pooler.", ".");
  return url.toString();
}

/**
 * Prepares the Neon test database and signs the test user in:
 * applies migrations, resets the seeded users and their data, and saves a
 * minted next-auth session cookie for the signed-in projects.
 */
setup("prepare test database and sign in", async ({ baseURL }) => {
  assertDedicatedTestDatabase();
  console.log(`Faker seed: ${process.env.E2E_SEED} (rerun with E2E_SEED=${process.env.E2E_SEED})`);

  // Migrations take a Postgres advisory lock, which Neon's pooled
  // connection (PgBouncer) can't hold reliably: use the direct host.
  execSync("npx prisma migrate deploy", {
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL: directDatabaseUrl() },
  });

  const ids = await resetSeededUsers();
  const cookie = await sessionCookie(
    { id: ids[TEST_USER.email], ...TEST_USER },
    baseURL!,
  );

  fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });
  fs.writeFileSync(
    AUTH_FILE,
    JSON.stringify({ cookies: [cookie], origins: [] }, null, 2),
  );
});
