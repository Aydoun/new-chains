import handler from "@/pages/api/contact/send";
import type { NextApiRequest, NextApiResponse } from "next";
import { CONTACT_MESSAGE_MAX_LENGTH } from "@/lib/constants";
import { vi } from "vitest";

const prismaMocks = vi.hoisted(() => ({
  create: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  default: {
    contact: {
      create: prismaMocks.create,
    },
  },
}));

const sessionMock = vi.hoisted(() =>
  vi.fn(async () => ({
    session: {},
    userId: 3,
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

describe("api/contact/send", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionMock.mockResolvedValue({ session: {}, userId: 3 });
  });

  it("rejects empty messages", async () => {
    const req = {
      method: "POST",
      body: {},
    } as unknown as NextApiRequest;
    const { res, store } = createMockResponse();

    await handler(req, res);

    expect(store.status).toBe(400);
    expect(store.body).toEqual({ message: "Message is required" });
    expect(prismaMocks.create).not.toHaveBeenCalled();
  });

  it("enforces the message length limit", async () => {
    const req = {
      method: "POST",
      body: { message: "a".repeat(CONTACT_MESSAGE_MAX_LENGTH + 1) },
    } as unknown as NextApiRequest;
    const { res, store } = createMockResponse();

    await handler(req, res);

    expect(store.status).toBe(400);
    expect(store.body).toEqual({
      message: `Message must be ${CONTACT_MESSAGE_MAX_LENGTH} characters or fewer`,
    });
  });

  it("creates a contact with trimmed content", async () => {
    prismaMocks.create.mockResolvedValueOnce({ id: 1, message: "hello" });

    const req = {
      method: "POST",
      body: { message: "   hello   " },
    } as unknown as NextApiRequest;
    const { res, store } = createMockResponse();

    await handler(req, res);

    expect(store.status).toBe(201);
    expect(prismaMocks.create).toHaveBeenCalledWith({
      data: { userId: 3, message: "hello" },
    });
    expect(store.body).toEqual({ id: 1, message: "hello" });
  });
});
