"use client";

import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

type Theme = "light" | "dark";

type ThemeToggleProps = {
  theme: Theme;
  onToggle: () => void;
};

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isDarkMode = theme === "dark";

  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
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
