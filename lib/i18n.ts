import en from "@/locales/en.json";

type TranslationValue = string | string[] | TranslationDictionary;

type TranslationDictionary = {
  [key: string]: TranslationValue;
};

const dictionaries: Record<Locale, TranslationDictionary> = {
  en,
};

export type Locale = "en";
export const defaultLocale: Locale = "en";

function isDictionary(
  value: TranslationValue | undefined
): value is TranslationDictionary {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function resolveValue(
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

function formatTranslation(
  template: string,
  params: Record<string, string | number> = {}
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
  params?: Record<string, string | number>,
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
