"use client";

import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { store } from "./store";
import { Provider } from "react-redux";
import { Theme } from "@radix-ui/themes";
import { SessionProvider } from "next-auth/react";
import { AuthStateSync } from "@/hooks/authStateSync";
import { MobileMenu } from "@/components/mobile-menu";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { KeyboardShortcutsHelp } from "@/components/keyboard-shortcuts-help";

type THEME = "dark" | "light";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme: THEME = "dark";

  useKeyboardShortcuts([
    {
      key: "b",
      modifier: "metaOrCtrl",
      allowInInput: true,
      onTrigger: () => {
        const event = new Event("toggle-sidebar");
        window.dispatchEvent(event);
      },
    },
  ]);

  return (
    <html lang="en" className={theme}>
      <title>LT</title>
      <body className={`antialiased bg-background text-foreground`}>
        <SessionProvider>
          <Provider store={store}>
            <Theme appearance={theme} accentColor="blue">
              <SidebarProvider>
                <AppSidebar />
                <main className="flex w-full flex-col bg-[#0f1723] text-foreground">
                  <AuthStateSync />
                  <div className="relative">
                    <MobileMenu />
                    <div className="absolute right-4 top-3 z-20">
                      <KeyboardShortcutsHelp />
                    </div>
                    {children}
                  </div>
                </main>
              </SidebarProvider>
            </Theme>
          </Provider>
        </SessionProvider>
      </body>
    </html>
  );
}
