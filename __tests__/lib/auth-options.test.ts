import { authOptions, isDatabaseUserId } from "@/lib/auth-options";
import { vi, describe, it, expect, beforeEach } from "vitest";

const prismaMocks = vi.hoisted(() => ({
  upsert: vi.fn(),
  findUnique: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  default: {
    user: {
      upsert: prismaMocks.upsert,
      findUnique: prismaMocks.findUnique,
    },
  },
}));

// The callbacks are called with only the fields each scenario needs.
type Loose = (params: Record<string, unknown>) => Promise<unknown>;
const jwt = (params: Record<string, unknown>) =>
  (authOptions.callbacks!.jwt as unknown as Loose)(params);
const session = (params: Record<string, unknown>) =>
  (authOptions.callbacks!.session as unknown as Loose)(params) as Promise<{
    user?: Record<string, unknown>;
  }>;

describe("authOptions callbacks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("syncs the profile into the token when a profile is provided", async () => {
    prismaMocks.upsert.mockResolvedValueOnce({
      id: 10,
      username: "demo-user",
      avatarUrl: "https://example.com/avatar.png",
      email: "demo@example.com",
    });

    const token = await jwt({
      token: {},
      profile: {
        email: "demo@example.com",
        name: "Demo",
        picture: "https://example.com/avatar.png",
        sub: "google-123",
      },
    });

    expect(prismaMocks.upsert).toHaveBeenCalledWith({
      where: { email: "demo@example.com" },
      update: { avatarUrl: "https://example.com/avatar.png" },
      create: {
        email: "demo@example.com",
        username: "Demo",
        avatarUrl: "https://example.com/avatar.png",
      },
    });
    expect(token).toMatchObject({
      sub: "10",
      name: "demo-user",
      email: "demo@example.com",
      picture: "https://example.com/avatar.png",
    });
  });

  it("returns the token untouched when the profile has no email", async () => {
    const token = await jwt({
      token: {},
      profile: { name: "No Email" },
    });

    expect(token).toEqual({});
    expect(prismaMocks.upsert).not.toHaveBeenCalled();
  });

  it("fails sign-in instead of issuing an unlinked token when the database is down", async () => {
    prismaMocks.upsert.mockRejectedValueOnce(new Error("db offline"));
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(
      jwt({
        token: { sub: "google-123" },
        profile: { email: "demo@example.com", name: "Demo" },
      })
    ).rejects.toThrow("db offline");

    consoleError.mockRestore();
  });

  it("does not query the database on regular session reads", async () => {
    const existing = { sub: "7", email: "demo@example.com" };

    const token = await jwt({ token: existing });

    expect(token).toBe(existing);
    expect(prismaMocks.findUnique).not.toHaveBeenCalled();
  });

  it("repairs a legacy token whose sub is still the Google id", async () => {
    prismaMocks.findUnique.mockResolvedValueOnce({
      id: 7,
      username: "demo",
      avatarUrl: null,
      email: "demo@example.com",
    });

    const token = await jwt({
      token: { sub: "109876543210987654321", email: "demo@example.com" },
    });

    expect(prismaMocks.findUnique).toHaveBeenCalledWith({
      where: { email: "demo@example.com" },
    });
    expect(token).toMatchObject({ sub: "7" });
  });

  it("only accepts database-sized numeric ids", () => {
    expect(isDatabaseUserId("42")).toBe(true);
    expect(isDatabaseUserId("109876543210987654321")).toBe(false);
    expect(isDatabaseUserId("0")).toBe(false);
    expect(isDatabaseUserId("12abc")).toBe(false);
    expect(isDatabaseUserId(undefined)).toBe(false);
  });

  it("hydrates the session user fields from the token", async () => {
    const existingSession = {
      user: {
        id: "",
        name: "",
        email: "",
        image: null,
      },
    };

    const result = await session({
      session: existingSession,
      token: {
        sub: "42",
        name: "Test User",
        email: "test@example.com",
        picture: "https://example.com/pic.png",
      },
    });

    expect(result?.user).toEqual({
      id: "42",
      name: "Test User",
      email: "test@example.com",
      image: "https://example.com/pic.png",
    });
  });
});
