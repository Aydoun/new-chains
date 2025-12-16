"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { translate } from "@/lib/i18n";

type Theme = "light" | "dark";

type ThemeToggleProps = {
  theme: Theme;
  onToggle: () => void;
};

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isDarkMode = theme === "dark";
  const targetMode = isDarkMode ? "light" : "dark";
  const label = translate("theme.switchLabel", {
    mode: translate(`theme.${targetMode}`),
  });

  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      aria-label={label}
      onClick={onToggle}
    >
      {isDarkMode ? (
        <Sun className="h-5 w-5" aria-hidden="true" />
      ) : (
        <Moon className="h-5 w-5" aria-hidden="true" />
      )}
    </Button>
  );
}
