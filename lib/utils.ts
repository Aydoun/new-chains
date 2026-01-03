import { PaginationParams } from "@/app/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

type RelativeTimeOptions = {
  locale?: string;
  nowThresholdSeconds?: number;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timeAgo(
  isoDate: string | undefined,
  { locale = "en", nowThresholdSeconds = 5 }: RelativeTimeOptions = {}
): string {
  if (!isoDate) return "";

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

export function getQueryParams(query: PaginationParams) {
  const { page, limit, userId, timeFilter, search } = query;
  const params = new URLSearchParams({
    page: `${page}`,
    limit: `${limit}`,
  });

  if (userId) params.set("userId", userId);
  if (timeFilter) params.set("timeFilter", timeFilter);
  if (search) params.set("search", search);

  return params.toString();
}
