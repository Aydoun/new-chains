import "./globals.css";
import type { Metadata } from "next";
import { connection } from "next/server";
import { Providers } from "./providers";

// The root layout is a server component so the page title comes from
// `metadata`. A <title> rendered inside <html> by a client component shifts
// React's useId values and breaks hydration (e.g. Radix dropdown ids).
export const metadata: Metadata = {
  title: "LT",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Render every page per request: the CSP nonce set in proxy.ts is only
  // applied to Next.js scripts on dynamically rendered pages.
  await connection();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground transition-colors">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
