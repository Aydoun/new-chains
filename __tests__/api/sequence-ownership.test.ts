import createHandler from "@/pages/api/sequence/create";
import updateHandler from "@/pages/api/sequence/update";
import type { NextApiRequest, NextApiResponse } from "next";
import { vi } from "vitest";

const prismaMocks = vi.hoisted(() => {
  return {
    create: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
  };
});

vi.mock("@/lib/prisma", () => ({
  default: {
    sequence: {
      create: prismaMocks.create,
      findUnique: prismaMocks.findUnique,
      update: prismaMocks.update,
    },
  },
}));

const sessionMock = vi.hoisted(() =>
  vi.fn(async () => ({
    session: {},
    userId: 1,
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

describe("sequence ownership protections", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionMock.mockResolvedValue({ session: {}, userId: 1 });
  });

  it("rejects creating a sequence for another user", async () => {
    const req = {
      method: "POST",
      body: {
        title: "Example",
        userId: "2",
        frameOrder: [1, 2],
      },
    } as unknown as NextApiRequest;

    const { res, store } = createMockResponse();

    await createHandler(req, res);

    expect(store.status).toBe(403);
    expect(prismaMocks.create).not.toHaveBeenCalled();
  });

  it("returns 404 when updating a sequence not owned by the user", async () => {
    prismaMocks.findUnique.mockResolvedValueOnce({
      id: 7,
      userId: 2,
      isDeleted: false,
    });

    const req = {
      method: "PUT",
      query: { id: "7" },
      body: { title: "New title" },
    } as unknown as NextApiRequest;
    const { res, store } = createMockResponse();

    await updateHandler(req, res);

    expect(store.status).toBe(404);
    expect(prismaMocks.update).not.toHaveBeenCalled();
  });

  it("updates when the owner matches the session", async () => {
    prismaMocks.findUnique.mockResolvedValueOnce({
      id: 7,
      userId: 1,
      isDeleted: false,
    });
    prismaMocks.update.mockResolvedValueOnce({ id: 7, title: "Updated" });

    const req = {
      method: "PUT",
      query: { id: "7" },
      body: { title: "Updated" },
    } as unknown as NextApiRequest;
    const { res, store } = createMockResponse();

    await updateHandler(req, res);

    expect(store.status).toBe(200);
    expect(prismaMocks.update).toHaveBeenCalledWith({
      where: { id: 7 },
      data: { isDeleted: undefined, title: "Updated" },
    });
    expect(store.body).toMatchObject({ id: 7, title: "Updated" });
  });
});
