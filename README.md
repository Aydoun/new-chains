# LinkNTell

LinkNTell lets people write **sequences**: short, ordered series of **frames**
(a message plus optional context) that guide someone through a routine, a
decision or an idea. Signed-in users can browse other people's public
sequences, save individual frames as **snippets**, and manage their own
sequences in the studio.

Live at [linkntell.com](https://linkntell.com).

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router pages, `pages/api` routes) and React 19
- [NextAuth v4](https://next-auth.js.org) with Google sign-in and JWT sessions
- [Prisma 7](https://www.prisma.io) on PostgreSQL ([Neon](https://neon.tech))
- Redux Toolkit Query for data fetching, Radix Themes and Tailwind for UI
- [Zod](https://zod.dev) for API input validation
- Vitest and Testing Library for tests; deployed on Vercel

## Getting started

Requirements: Node 22.15+ (or 23.8+) and Yarn.

```bash
yarn install
cp .env.example .env   # then fill in the values
yarn prisma migrate deploy
yarn dev
```

Open [http://localhost:3000](http://localhost:3000). Unauthenticated pages
redirect to `/login`.

### Environment variables

See [`.env.example`](.env.example). Use a separate database for local
development; production values are configured in Vercel only.

In Google Cloud Console, the OAuth client needs the redirect URI
`http://localhost:3000/api/auth/callback/google` (and the production
equivalent).

### Behind a TLS-inspecting proxy (Netskope, Zscaler…)

`yarn dev` runs Node with `--use-system-ca`, so it trusts the certificates in
the macOS keychain. Without it, Google sign-in fails locally with
`self-signed certificate in certificate chain` / `error=OAuthSignin`.

## Project structure

```
app/                 Pages (App Router), providers, RTK Query services
  services/api.ts    The single RTK Query API; features inject endpoints
pages/api/           API routes, each wrapped in withSession()
lib/api/handler.ts   withSession: method check, auth, Zod validation, errors
lib/validation.ts    Zod schemas for every API input
lib/server/          Data access (sequences, snippets, users)
lib/auth-options.ts  NextAuth configuration
proxy.ts             Auth redirects and the per-request CSP nonce
prisma/              Schema and migrations
```

### API conventions

- Every route requires a signed-in user and validates its input with Zod.
- Errors are always `{ "message": string, "issues"?: [...] }` with a matching
  status code (400 invalid input, 401 signed out, 404 not found or not yours,
  405 wrong method, 500 unexpected).
- Users can only change their own data. Private sequences are visible to their
  owner only.

## Scripts

| Command | What it does |
|---|---|
| `yarn dev` | Start the dev server |
| `yarn build` / `yarn start` | Production build and server |
| `yarn lint` | ESLint |
| `yarn test` | Vitest unit tests |
| `yarn prisma migrate deploy` | Apply pending database migrations |
| `yarn db:studio` | Browse the database with Prisma Studio |

### Deploying

Vercel runs `scripts/vercel-build.sh` (the `vercel-build` script). On
production deploys it runs `prisma migrate deploy` before `next build`, so
new code never goes live against an older schema; if a migration fails, the
deploy stops and the current version stays live. Preview builds skip
migrations because `DATABASE_URL` is shared with Production in Vercel.

To run Prisma against production by hand, load its env file with
`DOTENV_CONFIG_PATH=.env.production npx prisma migrate status`.
