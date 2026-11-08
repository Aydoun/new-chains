#!/bin/sh
# Vercel runs this instead of `npm run build` (see "vercel-build" in package.json).
# The rules and commands behind it: docs/database-migrations.md.
#
# 1. Every build (preview and production) runs the migration safety check:
#    the migrations production hasn't applied yet must be expand-only, so
#    the code currently live keeps working while and after they apply.
#    Preview builds share production's DATABASE_URL, so an unsafe migration
#    already fails the pull request's preview, before it can be merged.
# 2. The app is built.
# 3. Production only: pending migrations are applied, after a successful
#    build (a broken build never touches the database) and before the new
#    code goes live (it never runs against an older schema). Preview builds
#    never apply migrations: their database is production's.
set -e

echo "Checking pending database migrations…"
node scripts/check-migrations.mjs

npx next build

if [ "$VERCEL_ENV" = "production" ]; then
  echo "Applying database migrations…"
  npx prisma migrate deploy
else
  echo "Skipping migrations (VERCEL_ENV=${VERCEL_ENV:-unset})."
fi
