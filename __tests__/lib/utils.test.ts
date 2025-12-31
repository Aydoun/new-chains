import { cn, timeAgo } from "@/lib/utils";
import { describe, expect, it, vi } from "vitest";

describe("cn", () => {
  it("merges class names and resolves conflicts", () => {
    const result = cn("px-2", "text-sm", ["px-4"], { hidden: false });

    expect(result).toContain("px-4");
    expect(result).toContain("text-sm");
    expect(result.includes("px-2")).toBe(false);
  });
});

describe("timeAgo", () => {
  it("returns an empty string for missing dates", () => {
    expect(timeAgo(undefined)).toBe("");
  });

  it("throws for invalid dates", () => {
    expect(() => timeAgo("not-a-date")).toThrow("Invalid ISO date string");
  });

  it("returns now when within threshold", () => {
    const now = new Date("2024-01-01T12:00:00Z");
    vi.setSystemTime(now);

    expect(
      timeAgo(new Date(now.getTime() - 2000).toISOString(), {
        nowThresholdSeconds: 5,
      })
    ).toBe("now");

    vi.useRealTimers();
  });

  it("formats past and future dates relative to now", () => {
    const now = new Date("2024-01-01T12:00:00Z");
    vi.setSystemTime(now);

    expect(
      timeAgo(new Date(now.getTime() - 10 * 60 * 1000).toISOString())
    ).toBe("10 minutes ago");
    expect(
      timeAgo(new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString())
    ).toBe("in 2 days");

    vi.useRealTimers();
  });
});
