"use client";

import { useEffect, useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { store } from "./store";
import { Provider } from "react-redux";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button, DropdownMenu, Theme } from "@radix-ui/themes";
import { getCookie, setCookie } from "@/lib/utils";
import { translate } from "@/lib/i18n";
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";
import { useAppDispatch } from "./hooks";
import { clearAuth, setAuth } from "./features/auth/authSlice";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

type THEME = "dark" | "light";

const getInitialTheme = (): THEME => {
  const savedTheme = getCookie("theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return "dark";
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [theme, setTheme] = useState<THEME>(getInitialTheme());

  const handleToggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";

    setTheme(newTheme);
    setCookie("theme", newTheme);
  };

  return (
    <html lang="en" className={theme}>
      <title>LT</title>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <SessionProvider>
          <Provider store={store}>
            <Theme appearance={theme} accentColor="blue">
              <SidebarProvider>
                <AppSidebar />
                <main className="flex w-full flex-col bg-background text-foreground">
                  <header className="flex items-center justify-end border-b border-border px-6 py-4 gap-3">
                    <ThemeToggle theme={theme} onToggle={handleToggleTheme} />
                    <UserMenu />
                  </header>
                  <AuthStateSync />
                  <div className="flex-1">{children}</div>
                </main>
              </SidebarProvider>
            </Theme>
          </Provider>
        </SessionProvider>
      </body>
    </html>
  );
}

function UserMenu() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <Button variant="ghost" disabled>
        {translate("common.loading") ?? "Loading"}
      </Button>
    );
  }

  if (!session?.user) {
    return (
      <Button data-testid="app-login" onClick={() => signIn("google")}>
        {translate("auth.login")}
      </Button>
    );
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button variant="soft">
          {session.user.name ?? session.user.email ?? translate("auth.me")}
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        <DropdownMenu.Label>
          {session.user.email ?? translate("auth.me")}
        </DropdownMenu.Label>
        <DropdownMenu.Separator />
        <DropdownMenu.Item onClick={() => signOut({ callbackUrl: "/login" })}>
          {translate("auth.logout") ?? "Log out"}
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

function AuthStateSync() {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      dispatch(
        setAuth({
          status,
          user: {
            id: session.user.id ?? "",
            name: session.user.name ?? "",
            email: session.user.email ?? "",
            image: session.user.image ?? undefined,
          },
        })
      );
    } else if (status === "loading") {
      dispatch(
        setAuth({
          status,
          user: session?.user
            ? {
                id: session.user.id ?? "",
                name: session.user.name ?? "",
                email: session.user.email ?? "",
                image: session.user.image ?? undefined,
              }
            : undefined,
        })
      );
    } else if (status === "unauthenticated") {
      dispatch(clearAuth());
    }
  }, [dispatch, session, status]);

  return null;
}
