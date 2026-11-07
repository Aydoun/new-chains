import fs from "node:fs";
import path from "node:path";
import { parse } from "dotenv";
import { Client } from "pg";
import { TEST_USER } from "./constants";

const ROOT = path.resolve(__dirname, "../..");

// Env files that point at databases the tests must never touch.
const PROTECTED_ENV_FILES = [
  ".env",
  ".env.local",
  ".env.development",
  ".env.development.local",
  ".env.production",
  ".env.production.local",
];

function databaseHost(url: string | undefined) {
  if (!url) return null;
  try {
    return new URL(url.replace(/^['"]|['"]$/g, "")).hostname;
  } catch {
    return null;
  }
}

/**
 * Throws unless DATABASE_URL points at a database used only for tests: one
 * that no other env file in the project uses.
 */
export function assertDedicatedTestDatabase() {
  const testHost = databaseHost(process.env.DATABASE_URL);
  if (!testHost) {
    throw new Error(
      "E2E: DATABASE_URL is not set. Put the Neon test database URL in .env.test.",
    );
  }

  for (const file of PROTECTED_ENV_FILES) {
    const fullPath = path.join(ROOT, file);
    if (!fs.existsSync(fullPath)) continue;
    const env = parse(fs.readFileSync(fullPath));
    const hosts = [env.DATABASE_URL, env.POSTGRES_PRISMA_URL, env.POSTGRES_URL]
      .map(databaseHost)
      .filter(Boolean);
    if (hosts.includes(testHost)) {
      throw new Error(
        `E2E: .env.test uses the same database as ${file} (${testHost}). ` +
          "Point it at a dedicated Neon test branch before running end-to-end tests.",
      );
    }
  }
}

async function withClient<T>(fn: (client: Client) => Promise<T>) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 15_000,
  });
  await client.connect();
  try {
    return await fn(client);
  } finally {
    await client.end();
  }
}

/**
 * Creates the test user if needed, wipes everything it created in earlier
 * runs, and returns its id.
 */
export async function resetTestUser() {
  return withClient(async (client) => {
    await client.query("BEGIN");
    try {
      const { rows } = await client.query<{ id: number }>(
        `INSERT INTO "User" (email, username, "updatedAt")
         VALUES ($1, $2, NOW())
         ON CONFLICT (email) DO UPDATE SET username = EXCLUDED.username
         RETURNING id`,
        [TEST_USER.email, TEST_USER.username],
      );
      const userId = rows[0].id;

      await client.query(
        `DELETE FROM "Snippet"
         WHERE "createdById" = $1
            OR "originSequenceId" IN (SELECT id FROM "Sequence" WHERE "userId" = $1)`,
        [userId],
      );
      await client.query(`DELETE FROM "Sequence" WHERE "userId" = $1`, [userId]);
      await client.query(
        `DELETE FROM "Frame" f
         WHERE f."createdById" = $1
           AND NOT EXISTS (SELECT 1 FROM "Snippet" s WHERE s."frameId" = f.id)`,
        [userId],
      );
      await client.query(`DELETE FROM "Contact" WHERE "userId" = $1`, [userId]);

      await client.query("COMMIT");
      return userId;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  });
}
