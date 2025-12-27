import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

type RelativeTimeOptions = {
  locale?: string;
  nowThresholdSeconds?: number;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getStorageItem(key: string) {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(key);
}

export function timeAgo(
  isoDate: string,
  { locale = "en", nowThresholdSeconds = 5 }: RelativeTimeOptions = {}
): string {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid ISO date string");
  }

  const now = Date.now();
  const diffSeconds = Math.round((date.getTime() - now) / 1000);
  const abs = Math.abs(diffSeconds);

  if (abs <= nowThresholdSeconds) {
    return rtf.format(0, "second"); // "now"
  }

  const divisions: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["week", 60 * 60 * 24 * 7],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
    ["second", 1],
  ];

  for (const [unit, secondsInUnit] of divisions) {
    if (abs >= secondsInUnit) {
      const value = Math.round(diffSeconds / secondsInUnit);
      return rtf.format(value, unit);
    }
  }

  return rtf.format(0, "second");
}
