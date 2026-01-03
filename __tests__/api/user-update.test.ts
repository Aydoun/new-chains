import handler from "@/pages/api/user/update";
import type { NextApiRequest, NextApiResponse } from "next";
import { BIO_MAX_LENGTH } from "@/lib/constants";
import { vi } from "vitest";

const prismaMocks = vi.hoisted(() => ({
  update: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  default: {
    user: {
      update: prismaMocks.update,
    },
  },
}));

const sessionMock = vi.hoisted(() =>
  vi.fn(async () => ({
    session: {},
    userId: 5,
  }))
);

vi.mock("@/lib/api/auth", () => ({
  requireApiSession: (...args: unknown[]) => sessionMock(...args),
}));

const createMockResponse = () => {
  const store: { status?: number; body?: unknown } = {};
  const res = {
    status(code: number) {
      store.status = code;
      return res as NextApiResponse;
    },
    json(data: unknown) {
      store.body = data;
      return res as NextApiResponse;
    },
  } as unknown as NextApiResponse;

  return { res, store };
};

describe("api/user/update", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionMock.mockResolvedValue({ session: {}, userId: 5 });
  });

  it("prevents updating another user", async () => {
    const req = {
      method: "PUT",
      query: { id: "9" },
      body: { bio: "hello" },
    } as unknown as NextApiRequest;
    const { res, store } = createMockResponse();

    await handler(req, res);

    expect(store.status).toBe(403);
    expect(prismaMocks.update).not.toHaveBeenCalled();
  });

  it("rejects bios that exceed the maximum length", async () => {
    const req = {
      method: "PUT",
      query: { id: "5" },
      body: { bio: "a".repeat(BIO_MAX_LENGTH + 1) },
    } as unknown as NextApiRequest;
    const { res, store } = createMockResponse();

    await handler(req, res);

    expect(store.status).toBe(400);
    expect(store.body).toEqual({
      message: `Bio must be ${BIO_MAX_LENGTH} characters or fewer`,
    });
  });

  it("updates the bio for the authenticated user", async () => {
    prismaMocks.update.mockResolvedValueOnce({ id: 5, bio: "Updated bio" });

    const req = {
      method: "PUT",
      query: { id: "5" },
      body: { bio: "Updated bio" },
    } as unknown as NextApiRequest;
    const { res, store } = createMockResponse();

    await handler(req, res);

    expect(store.status).toBe(200);
    expect(prismaMocks.update).toHaveBeenCalledWith({
      where: { id: 5 },
      data: { bio: "Updated bio" },
    });
    expect(store.body).toEqual({ id: 5, bio: "Updated bio" });
  });
});
