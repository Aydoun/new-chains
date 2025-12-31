import { cn, getStorageItem, timeAgo } from "@/lib/utils";
import { describe, expect, it, vi } from "vitest";

describe("cn", () => {
  it("merges class names and resolves conflicts", () => {
    const result = cn("px-2", "text-sm", ["px-4"], { hidden: false });

    expect(result).toContain("px-4");
    expect(result).toContain("text-sm");
    expect(result.includes("px-2")).toBe(false);
  });
});

describe("getStorageItem", () => {
  it("returns null when window is undefined", () => {
    const originalWindow = (globalThis as { window?: Window }).window;
    // @ts-expect-error Testing environment toggle
    delete (globalThis as { window?: Window }).window;

    expect(getStorageItem("missing")).toBeNull();

    (globalThis as { window?: Window }).window = originalWindow;
  });

  it("reads the value from localStorage when available", () => {
    const key = "token";
    const value = "abc123";
    window.localStorage.setItem(key, value);

    expect(getStorageItem(key)).toBe(value);
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
