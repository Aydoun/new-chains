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
      if (profile?.email) {
        console.log("called: ", profile);
        const email = profile.email;
        const avatarUrl = "picture" in profile ? profile.picture : undefined;
        const username = profile.name ?? email.split("@")[0];

        try {
          const user = await prisma.user.upsert({
            where: { email },
            update: {
              avatarUrl: avatarUrl as string,
            },
            create: {
              email,
              username,
              avatarUrl: avatarUrl as string,
            },
          });

          token.sub = String(user.id);
          token.name = user.username;
          token.picture = user.avatarUrl ?? token.picture;
          token.email = user.email;
        } catch (error) {
          console.error("Unable to sync user with database", error);
        }
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
