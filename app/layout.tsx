"use client";

import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { store } from "./store";
import { Provider } from "react-redux";
import { SessionProvider } from "next-auth/react";
import { AuthStateSync } from "@/hooks/authStateSync";
import { HeaderActions } from "@/components/header-actions";
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <title>LT</title>
      <body className="antialiased bg-background text-foreground transition-colors">
        <SessionProvider>
          <Provider store={store}>
            <ThemeProvider>
              <SidebarProvider>
                <AppSidebar />
                <main className="flex w-full flex-col bg-background text-foreground transition-colors">
                  <AuthStateSync />
                  <div className="relative">
                    <HeaderActions />
                    {children}
                  </div>
                </main>
              </SidebarProvider>
            </ThemeProvider>
          </Provider>
        </SessionProvider>
      </body>
    </html>
  );
}
