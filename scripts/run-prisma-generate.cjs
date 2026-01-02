#!/usr/bin/env node

const { execFileSync } = require("child_process");
const { dirname, join } = require("path");
const { readdirSync } = require("fs");

function resolveSchemaEngineBinary() {
  if (process.env.PRISMA_SCHEMA_ENGINE_BINARY) {
    return process.env.PRISMA_SCHEMA_ENGINE_BINARY;
  }

  const enginesDir = dirname(require.resolve("@prisma/engines/package.json"));
  const schemaEngine = readdirSync(enginesDir).find((file) =>
    file.startsWith("schema-engine")
  );

  if (!schemaEngine) {
    throw new Error("Could not locate Prisma schema engine binary");
  }

  return join(enginesDir, schemaEngine);
}

function run() {
  const env = {
    ...process.env,
    PRISMA_SCHEMA_ENGINE_BINARY: resolveSchemaEngineBinary(),
    PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING: process.env
      .PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING ?? "1",
    DATABASE_URL:
      process.env.DATABASE_URL ??
      "postgres://user:password@localhost:5432/db",
  };

  execFileSync("prisma", ["generate"], {
    stdio: "inherit",
    env,
  });
}

run();
