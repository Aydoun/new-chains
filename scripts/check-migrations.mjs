#!/usr/bin/env node
// Migration safety check: a migration must never break the code that is
// running in production while (or after) it is applied.
//
// Production applies migrations *before* the new code goes live (see
// scripts/vercel-build.sh), and a failed build or an instant rollback leaves
// the previous code running on the new schema. So every pending migration
// must be EXPAND-ONLY: add tables, nullable columns, columns with defaults,
// indexes, enum values. Anything that removes, renames or tightens what the
// current code relies on is refused.
//
// To ship a CONTRACT step on purpose (e.g. drop a column that no deployed
// code uses anymore), add a line to that migration's SQL:
//   -- migration-safety: allow <rule> -- <why it is safe now>
//
// Usage:
//   node scripts/check-migrations.mjs            pending vs DATABASE_URL
//   node scripts/check-migrations.mjs --all      every migration, no DB needed
// Exit code 1 when a pending migration breaks a rule.
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const MIGRATIONS_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../prisma/migrations",
);

/**
 * `block` rules fail the check; `warn` rules are printed for review.
 * Patterns run on SQL with comments stripped and whitespace collapsed.
 */
export const RULES = [
  {
    id: "drop-table",
    level: "block",
    pattern: /\bDROP\s+TABLE\b/i,
    why: "running code still reads or writes this table",
  },
  {
    id: "drop-column",
    level: "block",
    pattern: /\bDROP\s+COLUMN\b/i,
    why: "running code still selects this column (Prisma lists columns explicitly)",
  },
  {
    id: "rename",
    level: "block",
    pattern: /\bRENAME\b/i,
    why: "running code still uses the old name; add the new one, migrate data, drop later",
  },
  {
    id: "change-type",
    level: "block",
    pattern: /\bALTER\s+COLUMN\s+"?\w+"?\s+(SET\s+DATA\s+)?TYPE\b/i,
    why: "can fail on existing rows, rewrites the table, and breaks code expecting the old type",
  },
  {
    id: "set-not-null",
    level: "block",
    pattern: /\bSET\s+NOT\s+NULL\b/i,
    why: "running code may still insert NULL here",
  },
  {
    id: "add-required-column",
    level: "block",
    // ADD COLUMN ... NOT NULL without a DEFAULT, up to the end of that clause.
    test: (sql) =>
      [...sql.matchAll(/\bADD\s+COLUMN\b([^,;]*)/gi)].some(
        ([, clause]) => /\bNOT\s+NULL\b/i.test(clause) && !/\bDEFAULT\b/i.test(clause),
      ),
    why: "fails on tables with rows, and running code doesn't send a value",
  },
  {
    id: "drop-other",
    level: "block",
    pattern: /\bDROP\s+(TYPE|SCHEMA|VIEW|MATERIALIZED\s+VIEW|FUNCTION|SEQUENCE|DEFAULT)\b/i,
    why: "running code may depend on it",
  },
  {
    id: "delete-data",
    level: "block",
    pattern: /\b(TRUNCATE|DELETE\s+FROM)\b/i,
    why: "deletes production data",
  },
  {
    id: "update-data",
    level: "warn",
    pattern: /\bUPDATE\s+"?\w+"?\s+SET\b/i,
    why: "rewrites production rows: check it is idempotent and fast on the real table size",
  },
  {
    id: "add-enum-value",
    level: "warn",
    pattern: /\bALTER\s+TYPE\b[^;]*\bADD\s+VALUE\b/i,
    why: "once new code stores the value, rolling back to older code fails on those rows",
  },
  {
    id: "constraint-on-existing-data",
    level: "warn",
    test: (sql) =>
      [
        ...sql.matchAll(
          /\bALTER\s+TABLE\s+"?(\w+)"?\s+ADD\s+CONSTRAINT\b[^;]*\b(UNIQUE|CHECK|FOREIGN\s+KEY)\b/gi,
        ),
      ].some(([, table]) => !createdTables(sql).has(table)),
    why: "fails if existing rows violate it: check production data first",
  },
  {
    id: "unique-index",
    level: "warn",
    test: (sql) =>
      [...sql.matchAll(/\bCREATE\s+UNIQUE\s+INDEX\b[^;]*?\bON\s+"?(\w+)"?/gi)].some(
        ([, table]) => !createdTables(sql).has(table),
      ),
    why: "fails if existing rows have duplicates: check production data first",
  },
];

/** Tables created in this same migration hold no existing rows. */
const createdTables = (sql) =>
  new Set([...sql.matchAll(/\bCREATE\s+TABLE\s+"?(\w+)"?/gi)].map(([, t]) => t));

const stripComments = (sql) =>
  sql.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/--[^\n]*/g, " ").replace(/\s+/g, " ");

/** Rules explicitly allowed in the SQL via `-- migration-safety: allow <rule>`. */
function allowedRules(sql) {
  return new Set(
    [...sql.matchAll(/--\s*migration-safety:\s*allow\s+([\w-]+)\s+--\s*\S/gi)].map(
      ([, id]) => id,
    ),
  );
}

/** Findings for one migration's SQL. */
export function lintMigration(sql) {
  const code = stripComments(sql);
  const allowed = allowedRules(sql);
  return RULES.filter((rule) =>
    rule.test ? rule.test(code) : rule.pattern.test(code),
  ).map((rule) => ({
    rule: rule.id,
    level: allowed.has(rule.id) ? "allowed" : rule.level,
    why: rule.why,
  }));
}

export function listMigrations(dir = MIGRATIONS_DIR) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

/** Applied migration names, and failed ones that block `migrate deploy`. */
async function migrationState(connectionString) {
  const { default: pg } = await import("pg");
  const client = new pg.Client({ connectionString, connectionTimeoutMillis: 15_000 });
  await client.connect();
  try {
    const { rows: [table] } = await client.query(
      `SELECT to_regclass('public._prisma_migrations') AS name`,
    );
    if (!table.name) return { applied: new Set(), failed: [] };
    const { rows } = await client.query(
      `SELECT migration_name, finished_at, rolled_back_at FROM "_prisma_migrations"`,
    );
    return {
      applied: new Set(
        rows.filter((r) => r.finished_at && !r.rolled_back_at).map((r) => r.migration_name),
      ),
      failed: rows
        .filter((r) => !r.finished_at && !r.rolled_back_at)
        .map((r) => r.migration_name),
    };
  } finally {
    await client.end();
  }
}

async function main() {
  const all = process.argv.includes("--all");
  const migrations = listMigrations();
  let pending = migrations;

  if (!all) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      console.error("DATABASE_URL is not set (or pass --all to check every migration).");
      process.exit(1);
    }
    const host = new URL(url.replace(/^['"]|['"]$/g, "")).hostname;
    const { applied, failed } = await migrationState(url);
    if (failed.length) {
      console.error(
        `✖ ${host} has failed migrations: ${failed.join(", ")}.\n` +
          "  Nothing new can be applied until they are resolved. See docs/database-migrations.md.",
      );
      process.exit(1);
    }
    pending = migrations.filter((name) => !applied.has(name));
    console.log(`Migration safety check against ${host}: ${pending.length} pending.`);
  }

  let blocked = 0;
  for (const name of pending) {
    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, name, "migration.sql"), "utf8");
    const findings = lintMigration(sql);
    const status = findings.some((f) => f.level === "block") ? "✖" : "✔";
    console.log(`${status} ${name}`);
    for (const f of findings) {
      const tag = { block: "BLOCKED", warn: "review ", allowed: "allowed" }[f.level];
      console.log(`    ${tag}  ${f.rule}: ${f.why}`);
      if (f.level === "block") blocked += 1;
    }
  }

  if (blocked) {
    console.error(
      `\n✖ ${blocked} unsafe change(s). Split them into expand now / contract later, ` +
        "or allow one explicitly once no deployed code depends on it:\n" +
        "    -- migration-safety: allow <rule> -- <why it is safe now>\n" +
        "  See docs/database-migrations.md.",
    );
    process.exit(1);
  }
  console.log("Migrations are safe to apply while the current code runs.");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error("Migration safety check failed to run:", error.message);
    process.exit(1);
  });
}
