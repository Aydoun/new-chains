"use client";

import { Button } from "@radix-ui/themes";
import { Laptop, Moon, Sun } from "lucide-react";
import { ResolvedTheme, ThemePreference } from "./theme-provider";

type ThemeToggleProps = {
  theme: ThemePreference;
  resolvedTheme: ResolvedTheme;
  onToggle: () => void;
};

export function ThemeToggle({ theme, resolvedTheme, onToggle }: ThemeToggleProps) {
  const isDarkMode = resolvedTheme === "dark";
  const isSystem = theme === "system";

  return (
    <Button
      type="button"
      variant="ghost"
      aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
      title={isSystem ? "System theme" : `${resolvedTheme} theme`}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onToggle();
      }}
      className="transition-colors"
    >
      <span className="relative inline-flex items-center">
        {isDarkMode ? (
          <Sun className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Moon className="h-5 w-5" aria-hidden="true" />
        )}
        {isSystem && (
          <Laptop
            className="absolute -right-3 -top-3 h-3 w-3 opacity-70"
            aria-hidden="true"
          />
        )}
      </span>
    </Button>
  );
}
