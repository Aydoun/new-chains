export const SEQUENCE_STATUSES = [
  "DRAFT",
  "STABLE",
  "EXPERIMENTAL",
] as const;

export type SequenceStatus = (typeof SEQUENCE_STATUSES)[number];

export const DEFAULT_SEQUENCE_STATUS: SequenceStatus = "DRAFT";

export const SEQUENCE_STATUS_LABELS: Record<SequenceStatus, string> = {
  DRAFT: "Draft",
  STABLE: "Stable",
  EXPERIMENTAL: "Experimental",
};

export const SEQUENCE_STATUS_STYLES: Record<
  SequenceStatus,
  { badge: string; dot: string }
> = {
  DRAFT: {
    badge: "bg-blue-500/10 text-blue-100 border border-blue-500/30",
    dot: "bg-blue-400",
  },
  STABLE: {
    badge: "bg-emerald-500/10 text-emerald-100 border border-emerald-500/30",
    dot: "bg-emerald-400",
  },
  EXPERIMENTAL: {
    badge: "bg-purple-500/10 text-purple-100 border border-purple-500/30",
    dot: "bg-purple-400",
  },
};

export function isSequenceStatus(value: unknown): value is SequenceStatus {
  return (
    typeof value === "string" &&
    SEQUENCE_STATUSES.includes(value as SequenceStatus)
  );
}

export function normalizeSequenceStatus(
  value: unknown,
  fallback: SequenceStatus = DEFAULT_SEQUENCE_STATUS
): SequenceStatus {
  if (typeof value !== "string") return fallback;

  const normalized = value.toUpperCase();

  return isSequenceStatus(normalized) ? normalized : fallback;
}

export function parseStatusFilters(
  input?: string | string[] | null
): SequenceStatus[] {
  if (!input) return [];

  const values = Array.isArray(input) ? input : `${input}`.split(",");

  return values
    .map((value) => value.trim().toUpperCase())
    .filter(isSequenceStatus);
}
