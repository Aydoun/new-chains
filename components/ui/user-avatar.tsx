"use client";

import { useState } from "react";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

/** Background and text colour pairs for the initials fallback. */
const FALLBACK_COLORS = [
  "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-100",
  "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
  "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-100",
  "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100",
  "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-100",
  "bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-100",
];

/** Up to two initials, from the first two words of the name. */
export function initialsOf(name?: string | null) {
  return (name ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => Array.from(word)[0]?.toUpperCase() ?? "")
    .join("");
}

/** The same user always gets the same colour. */
export function fallbackColorFor(seed: string | number) {
  const text = `${seed}`;
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  }
  return FALLBACK_COLORS[hash % FALLBACK_COLORS.length];
}

type Props = {
  name?: string | null;
  src?: string | null;
  /** Picks the fallback colour; the user id, so it stays stable. */
  seed?: string | number;
  className?: string;
};

/**
 * A round avatar: the user's picture, else their initials on a colour picked
 * from their id, else a generic person icon.
 */
export function UserAvatar({ name, src, seed, className }: Props) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const initials = initialsOf(name);
  const base = cn(
    "flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full text-xs font-medium",
    className,
  );

  if (src && src !== failedSrc) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- avatars come from several hosts and are tiny
      <img
        src={src}
        alt={name ?? ""}
        referrerPolicy="no-referrer"
        className={cn(base, "object-cover")}
        onError={() => setFailedSrc(src)}
      />
    );
  }

  if (initials) {
    return (
      <span
        role="img"
        aria-label={name ?? ""}
        data-testid="avatar-initials"
        className={cn(base, fallbackColorFor(seed ?? name ?? ""))}
      >
        {initials}
      </span>
    );
  }

  return (
    <span
      role="img"
      aria-label={name ?? ""}
      data-testid="avatar-icon"
      className={cn(base, "border border-border bg-muted text-muted-foreground")}
    >
      <User className="h-4 w-4" aria-hidden="true" />
    </span>
  );
}
