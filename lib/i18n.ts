import en from "@/locales/en.json";
import fr from "@/locales/fr.json";
import nl from "@/locales/nl.json";
import zh from "@/locales/zh.json";

type TranslationValue = string | string[] | TranslationDictionary;

type TranslationDictionary = {
  [key: string]: TranslationValue;
};

export type TranslationParams = Record<string, string | number>;

export const supportedLocales = ["en", "fr", "nl", "zh"] as const;

export type Locale = (typeof supportedLocales)[number];

export type LocaleOption = {
  code: Locale;
  /** Language name written in the language itself. */
  nativeName: string;
  /** ISO 3166-1 alpha-2 code of the flag shown next to the language. */
  country: "gb" | "fr" | "nl" | "cn";
};

export const localeOptions: LocaleOption[] = [
  { code: "en", nativeName: "English", country: "gb" },
  { code: "fr", nativeName: "Français", country: "fr" },
  { code: "nl", nativeName: "Nederlands", country: "nl" },
  { code: "zh", nativeName: "中文", country: "cn" },
];

const dictionaries: Record<Locale, TranslationDictionary> = {
  en,
  fr,
  nl,
  zh,
};

export const defaultLocale: Locale = "en";

export function isLocale(value: unknown): value is Locale {
  return (
    typeof value === "string" &&
    (supportedLocales as readonly string[]).includes(value)
  );
}

/**
 * Picks the first supported locale from a list of BCP 47 language tags
 * (e.g. `navigator.languages`), matching on the primary subtag so "fr-BE"
 * resolves to "fr" and "zh-TW" to "zh". Falls back to English.
 */
export function detectLocale(languages: readonly string[] = []): Locale {
  for (const tag of languages) {
    const primary = tag.toLowerCase().split("-")[0];
    if (isLocale(primary)) return primary;
  }

  return defaultLocale;
}

function isDictionary(
  value: TranslationValue | undefined
): value is TranslationDictionary {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function lookup(
  key: string,
  locale: Locale
): TranslationValue | undefined {
  return key
    .split(".")
    .reduce<TranslationValue | undefined>((current, segment) => {
      if (current === undefined) return undefined;

      if (isDictionary(current)) {
        return current[segment];
      }

      return undefined;
    }, dictionaries[locale]);
}

// Keys missing from a translation fall back to the English text.
function resolveValue(
  key: string,
  locale: Locale
): TranslationValue | undefined {
  const value = lookup(key, locale);
  if (value !== undefined || locale === defaultLocale) return value;

  return lookup(key, defaultLocale);
}

function formatTranslation(
  template: string,
  params: TranslationParams = {}
): string {
  return template.replace(/\{(.*?)\}/g, (match, token) => {
    if (Object.prototype.hasOwnProperty.call(params, token)) {
      return String(params[token]);
    }

    return match;
  });
}

export function translate(
  key: string,
  params?: TranslationParams,
  locale: Locale = defaultLocale
): string {
  const value = resolveValue(key, locale);

  if (typeof value === "string") {
    return formatTranslation(value, params);
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  return key;
}

export function translateList(
  key: string,
  locale: Locale = defaultLocale
): string[] {
  const value = resolveValue(key, locale);

  if (Array.isArray(value)) {
    return [...value];
  }

  if (typeof value === "string") {
    return [value];
  }

  return [];
}
