# Database migrations

**Hard rule: a migration must never break production.** The build enforces
it: `scripts/check-migrations.mjs` runs on every Vercel build and refuses
any pending migration that the code currently live couldn't survive.

## The databases

| Env file          | Database (Neon)  | Who migrates it                      |
| ----------------- | ---------------- | ------------------------------------ |
| `.env` / `.env.local` | dev (`noisy-dawn`) | you, with `yarn db:migrate:apply` |
| `.env.production` | production (`delicate-king`) | **only** the Vercel production build |
| `.env.test`       | e2e (`withered-hill`) | Playwright, automatically       |

Prisma CLI commands read `DATABASE_URL` from `.env`, so plain `yarn db:*`
commands always target **dev**. Scripts ending in `:prod` target production
and are read-only.

## Why "expand-only"

On a production deploy Vercel builds the app, applies pending migrations,
then switches traffic to the new code. During that window, after a failed
build, and after an instant rollback in Vercel, the **previous code runs on
the new schema**. That's only safe if migrations only *add*:

| Safe (expand)                              | Refused (contract)                         |
| ------------------------------------------ | ------------------------------------------ |
| new table                                  | drop table / column / type                 |
| new nullable column, or with a `DEFAULT`   | new `NOT NULL` column without a default    |
| new index, new enum value¹                 | rename table / column                      |
| new foreign key on a new column²           | change a column's type, `SET NOT NULL`     |
|                                            | `DELETE` / `TRUNCATE`                      |

¹ Reviewed: after new code stores the new value, rolling back to older code
fails on those rows. ² Reviewed: constraints and unique indexes on existing
tables fail if current rows violate them; check production data first.

### Changing or removing something: two releases

Example, renaming `bio` to `about`:

1. **Expand** (release 1): add `about` (nullable), copy data with an
   `UPDATE`, make the code write both and read `about`.
2. **Contract** (release 2, once release 1 is live): drop `bio`. Mark it
   in that migration's SQL so the check lets it through:

   ```sql
   -- migration-safety: allow drop-column -- no deployed code reads "bio" since release 1
   ALTER TABLE "User" DROP COLUMN "bio";
   ```

## Commands

### The app broke after a pull / branch switch ("column does not exist")

Your dev database is behind the code. Apply what's pending:

```bash
yarn db:migrate:apply
```

It runs the safety check, `prisma migrate deploy` (never resets or deletes
data) and `prisma generate`. See what's pending first with `yarn db:status`.

### Making a schema change

1. Edit `prisma/schema.prisma`.
2. Generate the migration without applying it:
   ```bash
   yarn db:migrate:new add_something
   ```
   If Prisma offers to **reset** the database, answer **No** and ask for help:
   it means dev has drifted, and resetting deletes all dev data.
3. Read the generated `prisma/migrations/<timestamp>_add_something/migration.sql`.
4. Apply it to dev (the safety check runs first):
   ```bash
   yarn db:migrate:apply
   ```
5. Run `yarn test` and `yarn test:e2e` (e2e applies it to the test database).
6. Commit the schema **and** the migration folder together.

### Before merging to `main`

Read-only checks against production:

```bash
yarn db:status:prod
```

```bash
yarn db:check:prod
```

The second one shows exactly which migrations the deploy will apply, and
whether they pass. The pull request's Vercel preview build runs the same
check.

### Deploying

Merge to `main`. The production build checks, builds, then applies the
migrations (`scripts/vercel-build.sh`). Nothing to run by hand. If the
check or the build fails, the database isn't touched and the live site
keeps running.

### If a migration fails in production

The deploy stops and the previous code stays live. Because migrations are
expand-only, it keeps working. Then:

1. `yarn db:status:prod` shows the failed migration.
2. Find out how far it got (Neon's SQL editor), and fix the cause in a
   **new** migration. Never edit a migration that production has seen.
3. Mark the failed one so deploys can continue. Only after checking what it
   did, use `npx dotenv -e .env.production -- npx prisma migrate resolve --rolled-back <name>`
   (nothing was applied) or `--applied <name>` (it was applied in full).
4. Neon keeps a restore history: a branch can be restored to a moment
   before the deploy if data was damaged.

## Never

- `prisma migrate dev`, `prisma migrate reset`, `prisma db push` or
  `yarn prisma:reset` with production's `DATABASE_URL`.
- Editing or deleting a migration folder that any database has applied.
- Allowing a contract rule (`-- migration-safety: allow …`) in the same
  release that stops using the thing being removed.

## What the check can't see

It reads the SQL, not the data or the code: it can't tell that a new index
locks a huge table for a long time, or that an `UPDATE` is slow on
production's row count. Those show up as "review" lines; read them.

## Recommended

Vercel preview deployments currently use the **production** database, so a
preview of an unmerged branch reads and writes production data. Neon's
Vercel integration can give every preview its own database branch instead.
