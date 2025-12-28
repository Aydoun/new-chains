import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "./prisma";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!googleClientId || !googleClientSecret) {
  console.warn(
    "Google OAuth credentials are not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to enable sign-in."
  );
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: googleClientId ?? "",
      clientSecret: googleClientSecret ?? "",
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, profile }) {
      const email = profile?.email ?? token.email;
      const avatarUrl =
        (profile && "picture" in profile ? profile.picture : token.picture) ??
        undefined;
      const username = profile?.name ?? token.name ?? email?.split("@")[0];

      if (!email) return token;

      try {
        const user = profile
          ? await prisma.user.upsert({
              where: { email },
              update: {
                avatarUrl: avatarUrl as string,
              },
              create: {
                email,
                username: username ?? email.split("@")[0],
                avatarUrl: avatarUrl as string,
              },
            })
          : await prisma.user.findUnique({ where: { email } });

        if (user) {
          token.sub = `${user.id}`;
          token.name = user.username ?? token.name;
          token.picture = user.avatarUrl ?? token.picture;
          token.email = user.email ?? token.email;
        }
      } catch (error) {
        console.error("Unable to sync user with database", error);
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.name = token.name ?? session.user.name;
        session.user.email = token.email ?? session.user.email;
        session.user.image = (token.picture as string | undefined) ?? null;
      }

      return session;
    },
  },
};
