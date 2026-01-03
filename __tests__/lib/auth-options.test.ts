import { authOptions } from "@/lib/auth-options";
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

    const token = await authOptions.callbacks?.jwt?.({
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

  it("returns the existing token when the email is missing or persistence fails", async () => {
    const fallbackToken = { sub: "1", email: "fallback@example.com" };
    prismaMocks.upsert.mockRejectedValueOnce(new Error("db offline"));

    const token = await authOptions.callbacks?.jwt?.({
      token: fallbackToken,
      profile: { name: "No Email" },
    });

    expect(token).toMatchObject(fallbackToken);
  });

  it("hydrates the session user fields from the token", async () => {
    const session = {
      user: {
        id: "",
        name: "",
        email: "",
        image: null,
      },
    };

    const result = await authOptions.callbacks?.session?.({
      session,
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
