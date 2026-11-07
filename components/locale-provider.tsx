"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  defaultLocale,
  detectLocale,
  isLocale,
  translate,
  translateList,
  type Locale,
  type TranslationParams,
} from "@/lib/i18n";

export const LOCALE_STORAGE_KEY = "locale-preference";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: TranslationParams) => string;
  tList: (key: string) => string[];
};

function createValue(
  locale: Locale,
  setLocale: (locale: Locale) => void
): LocaleContextValue {
  return {
    locale,
    setLocale,
    t: (key, params) => translate(key, params, locale),
    tList: (key) => translateList(key, locale),
  };
}

// Used when no provider is mounted (e.g. isolated component tests).
const fallbackValue = createValue(defaultLocale, () => {});

const LocaleContext = createContext<LocaleContextValue>(fallbackValue);

function readStoredLocale(): Locale | null {
  try {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    return isLocale(stored) ? stored : null;
  } catch {
    return null;
  }
}

function browserLanguages(): readonly string[] {
  if (typeof navigator === "undefined") return [];
  if (navigator.languages?.length) return navigator.languages;
  return navigator.language ? [navigator.language] : [];
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  // Must match the server render (English); the stored or browser locale is
  // applied after hydration to avoid a hydration mismatch.
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    setLocaleState(readStoredLocale() ?? detectLocale(browserLanguages()));
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      // Storage can be unavailable (private mode); the choice still applies
      // for this visit.
    }
  }, []);

  const value = useMemo(
    () => createValue(locale, setLocale),
    [locale, setLocale]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LocaleContext);
}
