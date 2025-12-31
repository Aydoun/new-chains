"use client";

import { useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { store } from "./store";
import { Provider } from "react-redux";
import { Theme } from "@radix-ui/themes";
import { SessionProvider } from "next-auth/react";
import { UserMenu } from "@/hooks/userMenu";
import { AuthStateSync } from "@/hooks/authStateSync";
import { MobileMenu } from "@/components/mobile-menu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

type THEME = "dark" | "light";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [theme, _] = useState<THEME>("dark");

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
                <main className="flex w-full flex-col bg-[#0f1723] text-foreground">
                  <AuthStateSync />
                  <div className="relative">
                    <MobileMenu />
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
