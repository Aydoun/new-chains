import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { lintMigration, listMigrations } from "@/scripts/check-migrations.mjs";

type Finding = { rule: string; level: "block" | "warn" | "allowed" };

const levels = (sql: string) =>
  Object.fromEntries(
    (lintMigration(sql) as Finding[]).map((f) => [f.rule, f.level]),
  );

describe("migration safety rules", () => {
  it("lets expand-only changes through", () => {
    expect(
      levels(`
        CREATE TABLE "Tag" ("id" SERIAL NOT NULL, "name" TEXT NOT NULL,
          CONSTRAINT "Tag_pkey" PRIMARY KEY ("id"));
        CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");
        ALTER TABLE "Sequence" ADD COLUMN "subtitle" TEXT;
        ALTER TABLE "Sequence" ADD COLUMN "views" INTEGER NOT NULL DEFAULT 0;
        CREATE INDEX "Sequence_views_idx" ON "Sequence"("views");
      `),
    ).toEqual({});
  });

  it.each([
    ["drop-table", `DROP TABLE "Report";`],
    ["drop-column", `ALTER TABLE "User" DROP COLUMN "bio";`],
    ["rename", `ALTER TABLE "User" RENAME COLUMN "bio" TO "about";`],
    ["change-type", `ALTER TABLE "Frame" ALTER COLUMN "content" SET DATA TYPE VARCHAR(10);`],
    ["set-not-null", `ALTER TABLE "Frame" ALTER COLUMN "createdById" SET NOT NULL;`],
    ["add-required-column", `ALTER TABLE "User" ADD COLUMN "role" TEXT NOT NULL;`],
    ["drop-other", `DROP TYPE "Role";`],
    ["delete-data", `DELETE FROM "Contact";`],
  ])("blocks %s", (rule, sql) => {
    expect(levels(sql)[rule]).toBe("block");
  });

  it("flags risky-but-additive changes for review without blocking", () => {
    expect(
      levels(`
        ALTER TYPE "FrameType" ADD VALUE 'GIF';
        UPDATE "User" SET "bio" = '' WHERE "bio" IS NULL;
        ALTER TABLE "Frame" ADD CONSTRAINT "Frame_x_fkey" FOREIGN KEY ("x") REFERENCES "User"("id");
        CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
      `),
    ).toEqual({
      "add-enum-value": "warn",
      "update-data": "warn",
      "constraint-on-existing-data": "warn",
      "unique-index": "warn",
    });
  });

  it("allows a contract step only with an explicit, explained marker", () => {
    const drop = `ALTER TABLE "User" DROP COLUMN "bio";`;

    expect(
      levels(`-- migration-safety: allow drop-column -- unused since release 12\n${drop}`),
    ).toEqual({ "drop-column": "allowed" });
    // No reason given: still blocked.
    expect(levels(`-- migration-safety: allow drop-column\n${drop}`)).toEqual({
      "drop-column": "block",
    });
  });

  it("ignores keywords inside comments", () => {
    expect(levels(`-- we used to DROP TABLE "Old" here\nSELECT 1;`)).toEqual({});
  });

  it("passes the newest migration in the repo", () => {
    const names: string[] = listMigrations();
    const newest = names[names.length - 1];
    const sql = fs.readFileSync(
      path.join("prisma/migrations", newest, "migration.sql"),
      "utf8",
    );

    expect((lintMigration(sql) as Finding[]).filter((f) => f.level === "block")).toEqual([]);
  });
});
