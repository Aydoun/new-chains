"use client";

import { useTheme } from "./theme-provider";
import { ThemeToggle } from "./theme-toggle";
import { MobileMenu } from "./mobile-menu";

export function HeaderActions() {
  const { theme, resolvedTheme, toggleTheme } = useTheme();

  return (
    <div className="absolute right-5 top-3 z-30 flex items-center gap-2">
      <ThemeToggle
        theme={theme}
        resolvedTheme={resolvedTheme}
        onToggle={toggleTheme}
      />
      <MobileMenu />
    </div>
  );
}
