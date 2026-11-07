import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { test as setup } from "@playwright/test";
import { encode } from "next-auth/jwt";
import { AUTH_FILE, TEST_USER } from "./support/constants";
import { assertDedicatedTestDatabase, resetTestUser } from "./support/test-db";

/**
 * Prepares the Neon test database and signs the test user in.
 *
 * Google sign-in can't be automated, so instead of going through it we mint
 * the same session cookie next-auth would set after a successful login: a JWT
 * signed with NEXTAUTH_SECRET whose `sub` is the user's database id.
 */
setup("prepare test database and sign in", async ({ baseURL }) => {
  assertDedicatedTestDatabase();

  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("E2E: NEXTAUTH_SECRET is not set in .env.test.");
  }

  execSync("npx prisma migrate deploy", { stdio: "inherit" });

  const userId = await resetTestUser();

  const sessionToken = await encode({
    secret,
    token: {
      sub: `${userId}`,
      name: TEST_USER.username,
      email: TEST_USER.email,
      picture: null,
    },
  });

  const url = new URL(baseURL!);
  const secure = url.protocol === "https:";

  fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });
  fs.writeFileSync(
    AUTH_FILE,
    JSON.stringify(
      {
        cookies: [
          {
            name: secure
              ? "__Secure-next-auth.session-token"
              : "next-auth.session-token",
            value: sessionToken,
            domain: url.hostname,
            path: "/",
            expires: Math.floor(Date.now() / 1000) + 60 * 60,
            httpOnly: true,
            secure,
            sameSite: "Lax",
          },
        ],
        origins: [],
      },
      null,
      2,
    ),
  );
});
