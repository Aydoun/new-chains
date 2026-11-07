#!/bin/sh
# Vercel runs this instead of `npm run build` (see "vercel-build" in package.json).
#
# Production deploys apply pending Prisma migrations before building, so the
# code never goes live against an older schema. Preview builds skip it:
# DATABASE_URL is shared between Preview and Production in Vercel, and a
# branch's migrations must not reach the production database.
set -e

if [ "$VERCEL_ENV" = "production" ]; then
  echo "Applying database migrations…"
  npx prisma migrate deploy
else
  echo "Skipping migrations (VERCEL_ENV=${VERCEL_ENV:-unset})."
fi

npx next build
