import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getStorageItem(key: string) {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(key);
}

const hasDocument = typeof document !== "undefined";

export function getCookie(name: string) {
  if (!hasDocument) return null;

  const escapedName = name.replace(/[-.*+?^${}()|[\]\\]/g, "\\$&");
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${escapedName}=([^;]*)`)
  );

  return match ? decodeURIComponent(match[1]) : null;
}

export function setCookie(
  name: string,
  value: string,
  options: { days?: number; path?: string } = {}
) {
  if (!hasDocument) return;

  const { days = 365, path = "/" } = options;
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires.toUTCString()}; path=${path}`;
}

export function deleteCookie(name: string, path = "/") {
  if (!hasDocument) return;

  document.cookie = `${name}=; Max-Age=0; path=${path}`;
}

export function getUserIdWithFallback(defaultId = "1") {
  const cookieUserId = getCookie("userId");

  return cookieUserId ?? defaultId;
}
