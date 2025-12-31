export type TimeFilterValue =
  | "last-hour"
  | "today"
  | "this-week"
  | "this-month";

function normalizeTimeFilter(value?: string | string[]): TimeFilterValue | null {
  const filterValue = Array.isArray(value) ? value[0] : value;

  if (!filterValue) return null;

  const allowedFilters: TimeFilterValue[] = [
    "last-hour",
    "today",
    "this-week",
    "this-month",
  ];

  return allowedFilters.includes(filterValue as TimeFilterValue)
    ? (filterValue as TimeFilterValue)
    : null;
}

function startOfDay(now: Date) {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  return start;
}

function startOfWeek(now: Date) {
  const start = startOfDay(now);
  const day = start.getDay();
  const diffFromMonday = (day + 6) % 7;

  start.setDate(start.getDate() - diffFromMonday);
  return start;
}

export function resolveTimeFilterDate(
  timeFilter?: string | string[]
): Date | null {
  const normalized = normalizeTimeFilter(timeFilter);
  const now = new Date();

  switch (normalized) {
    case "last-hour": {
      return new Date(now.getTime() - 60 * 60 * 1000);
    }
    case "today": {
      return startOfDay(now);
    }
    case "this-week": {
      return startOfWeek(now);
    }
    case "this-month": {
      return new Date(now.getFullYear(), now.getMonth(), 1);
    }
    default:
      return null;
  }
}
