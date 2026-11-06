"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { store } from "./store";
import { Provider } from "react-redux";
import { SessionProvider } from "next-auth/react";
import { HeaderActions } from "@/components/header-actions";
import { ThemeProvider } from "@/components/theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Provider store={store}>
        <ThemeProvider>
          <SidebarProvider>
            <AppSidebar />
            <main className="flex w-full flex-col bg-background text-foreground transition-colors">
              <div className="relative">
                <HeaderActions />
                {children}
              </div>
            </main>
          </SidebarProvider>
        </ThemeProvider>
      </Provider>
    </SessionProvider>
  );
}
