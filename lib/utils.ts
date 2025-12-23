import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getStorageItem(key: string) {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(key);
}
