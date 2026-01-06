"use client";

import { Theme } from "@radix-ui/themes";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

type ThemeContextValue = {
  theme: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setTheme: (value: ThemePreference) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = "theme-preference";
const DARK_MEDIA_QUERY = "(prefers-color-scheme: dark)";

function resolveTheme(preference: ThemePreference): ResolvedTheme {
  if (preference === "system") {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function")
      return "light";

    return window.matchMedia(DARK_MEDIA_QUERY).matches ? "dark" : "light";
  }

  return preference;
}

function updateDocumentTheme(resolvedTheme: ResolvedTheme) {
  const root = document.documentElement;
  root.classList.toggle("dark", resolvedTheme === "dark");
  root.dataset.theme = resolvedTheme;
  root.style.colorScheme = resolvedTheme;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemePreference>("system");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(
    () => resolveTheme("system")
  );

  useEffect(() => {
    const storedPreference = (typeof window !== "undefined"
      ? window.localStorage.getItem(STORAGE_KEY)
      : null) as ThemePreference | null;

    const initialPreference =
      storedPreference === "light" ||
      storedPreference === "dark" ||
      storedPreference === "system"
        ? storedPreference
        : "system";

    setTheme(initialPreference);
    setResolvedTheme(resolveTheme(initialPreference));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery =
      typeof window.matchMedia === "function"
        ? window.matchMedia(DARK_MEDIA_QUERY)
        : null;

    const nextResolvedTheme = resolveTheme(theme);
    setResolvedTheme(nextResolvedTheme);
    updateDocumentTheme(nextResolvedTheme);
    window.localStorage.setItem(STORAGE_KEY, theme);

    if (!mediaQuery) return;

    const handleMediaChange = (event: MediaQueryListEvent) => {
      if (theme !== "system") return;

      const updatedTheme = event.matches ? "dark" : "light";
      setResolvedTheme(updatedTheme);
      updateDocumentTheme(updatedTheme);
    };

    mediaQuery.addEventListener("change", handleMediaChange);

    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme: () =>
        setTheme((previous) => {
          const baseTheme =
            previous === "system" ? resolveTheme(previous) : previous;
          return baseTheme === "dark" ? "light" : "dark";
        }),
    }),
    [theme, resolvedTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      <Theme appearance={resolvedTheme} accentColor="blue">
        {children}
      </Theme>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
