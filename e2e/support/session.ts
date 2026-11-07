import { encode } from "next-auth/jwt";
import type { UserRow } from "./test-db";

export type SessionCookie = {
  name: string;
  value: string;
  domain: string;
  path: string;
  expires: number;
  httpOnly: boolean;
  secure: boolean;
  sameSite: "Lax";
};

/**
 * The cookie next-auth sets after a successful Google sign-in: a JWT signed
 * with NEXTAUTH_SECRET whose `sub` is the user's database id. Minting it
 * lets tests sign in as any seeded user without going through Google.
 */
export async function sessionCookie(
  user: Pick<UserRow, "id" | "email" | "username">,
  baseURL: string,
): Promise<SessionCookie> {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error("E2E: NEXTAUTH_SECRET is not set in .env.test.");

  const url = new URL(baseURL);
  const secure = url.protocol === "https:";

  return {
    name: secure ? "__Secure-next-auth.session-token" : "next-auth.session-token",
    value: await encode({
      secret,
      token: {
        sub: `${user.id}`,
        name: user.username,
        email: user.email,
        picture: null,
      },
    }),
    domain: url.hostname,
    path: "/",
    expires: Math.floor(Date.now() / 1000) + 60 * 60,
    httpOnly: true,
    secure,
    sameSite: "Lax",
  };
}
