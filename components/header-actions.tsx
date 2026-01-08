"use client";

import { useTheme } from "./theme-provider";
// import { ThemeToggle } from "./theme-toggle";
import { MobileMenu } from "./mobile-menu";

export function HeaderActions() {
  const { theme, resolvedTheme, toggleTheme } = useTheme();

  return (
    <div className="absolute right-6 md:right-8 top-8 z-30 flex items-center">
      {/* <ThemeToggle
        theme={theme}
        resolvedTheme={resolvedTheme}
        onToggle={toggleTheme}
      /> */}
      <MobileMenu />
    </div>
  );
}
