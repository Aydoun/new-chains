import createHandler from "@/pages/api/snippet/create";
import listHandler from "@/pages/api/snippet/list";
import type { NextApiRequest, NextApiResponse } from "next";
import { vi } from "vitest";

const mocks = vi.hoisted(() => {
  const createMock = vi.fn(async ({ data }: { data: any }) => ({
    id: 10,
    ...data,
    frame: { id: data.frameId, content: "Frame body", description: "" },
    originSequence: { id: data.originSequenceId, title: "Origin" },
  }));

  const findFirstSequenceMock = vi.fn(async ({ where }: { where: any }) =>
    where?.id && where.FrameOrder?.has === 2
      ? { id: where.id, title: "Origin sequence" }
      : null
  );
  const findUniqueFrameMock = vi.fn(async () => ({
    id: 2,
    type: "PHRASE",
    content: "Frame body",
    description: "",
  }));
  const findManyMock = vi.fn(async () => [
    {
      id: 1,
      type: "PHRASE",
      notes: "Keep handy",
      frameId: 2,
      originSequenceId: 1,
      createdById: 1,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-02",
      frame: { id: 2, content: "Frame body", description: "" },
      originSequence: { id: 1, title: "Origin sequence" },
    },
  ]);

  return {
    createMock,
    findFirstSequenceMock,
    findUniqueFrameMock,
    findManyMock,
  };
});

vi.mock("@/lib/prisma", () => ({
  default: {
    snippet: {
      create: mocks.createMock,
      findMany: mocks.findManyMock,
    },
    sequence: {
      findFirst: mocks.findFirstSequenceMock,
    },
    frame: {
      findUnique: mocks.findUniqueFrameMock,
    },
  },
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

const sessionMock = vi.hoisted(() =>
  vi.fn(async () => ({
    session: {},
    userId: 1,
  }))
);

vi.mock("@/lib/api/auth", () => ({
  requireApiSession: (...args: unknown[]) => sessionMock(...args),
}));

describe("api/snippet endpoints", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionMock.mockResolvedValue({ session: {}, userId: 1 });
  });

  it("rejects invalid payloads", async () => {
    const req = {
      method: "POST",
      body: { frameId: "abc" },
    } as unknown as NextApiRequest;
    const { res, store } = createMockResponse();

    await createHandler(req, res);
    expect(store.status).toBe(400);
  });

  it("creates a snippet with notes and origin metadata", async () => {
    const req = {
      method: "POST",
      body: { frameId: 2, originSequenceId: 1, type: "PHRASE", notes: "keep" },
    } as unknown as NextApiRequest;
    const { res, store } = createMockResponse();

    await createHandler(req, res);

    expect(store.status).toBe(201);
    expect(mocks.findFirstSequenceMock).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          FrameOrder: { has: 2 },
          id: 1,
        }),
      })
    );
    expect(mocks.createMock).toHaveBeenCalledTimes(1);
    const payload = store.body as { originSequence?: { title: string } };
    expect(payload.originSequence?.title).toBe("Origin");
  });

  it("returns snippets belonging to the user", async () => {
    const req = {
      method: "GET",
    } as unknown as NextApiRequest;
    const { res, store } = createMockResponse();

    await listHandler(req, res);
    expect(store.status).toBe(200);
    expect(Array.isArray(store.body)).toBe(true);
    expect(mocks.findManyMock).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { createdById: 1 },
      })
    );
  });
});
