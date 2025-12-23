import createHandler from "@/pages/api/sequence/create";
import fetchHandler from "@/pages/api/sequence/fetch";
import readHandler from "@/pages/api/sequence/read";
import type { NextApiRequest, NextApiResponse } from "next";
import { vi } from "vitest";

const mocks = vi.hoisted(() => {
  const createMock = vi.fn(async (data: { data: any }) => ({
    id: 1,
    title: data.data.title,
    userId: parseInt(data.data.userId, 10),
    FrameOrder: data.data.frameOrder ?? [],
  }));
  const findManyMock = vi.fn(async ({ where }: { where?: object }) => {
    if (!where) return [{ id: 1, title: "Example", userId: 2, FrameOrder: [] }];
    return [
      {
        id: 2,
        title: "Filtered",
        userId: (where as { userId: number }).userId,
        FrameOrder: [],
      },
    ];
  });
  const findFirstMock = vi.fn(async ({ where }: { where?: { id: number } }) =>
    where?.id
      ? { id: where.id, FrameOrder: [4, 5], title: "Single", userId: 1 }
      : null
  );
  const findManyFramesMock = vi.fn(async () => [
    { id: 4, content: "Frame 4" },
    { id: 5, content: "Frame 5" },
  ]);

  return { createMock, findManyMock, findFirstMock, findManyFramesMock };
});

vi.mock("@/lib/prisma", () => ({
  default: {
    sequence: {
      create: mocks.createMock,
      findMany: mocks.findManyMock,
      findFirst: mocks.findFirstMock,
    },
    frame: {
      findMany: mocks.findManyFramesMock,
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

describe("api/sequence endpoints", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 when creating a sequence without required fields", async () => {
    const req = {
      method: "POST",
      body: { title: "Missing", frameOrder: [] },
    } as unknown as NextApiRequest;
    const { res, store } = createMockResponse();

    await createHandler(req, res);
    expect(store.status).toBe(400);
  });

  it("creates a sequence when payload is valid", async () => {
    const req = {
      method: "POST",
      body: {
        title: "New Sequence",
        userId: "3",
        frameOrder: [1, 2],
      },
    } as unknown as NextApiRequest;
    const { res, store } = createMockResponse();

    await createHandler(req, res);
    expect(store.status).toBe(201);
    expect(store.body).toMatchObject({ title: "New Sequence" });
    expect(mocks.createMock).toHaveBeenCalledTimes(1);
  });

  it("fetches sequences filtered by user id", async () => {
    const req = {
      method: "GET",
      query: { id: "99" },
    } as unknown as NextApiRequest;
    const { res, store } = createMockResponse();

    await fetchHandler(req, res);
    expect(store.status).toBe(200);
    const json = store.body as Array<{ userId: number }>;
    expect(json[0].userId).toBe(99);
    expect(mocks.findManyMock).toHaveBeenCalledWith({ where: { userId: 99 } });
  });

  it("reads a sequence and hydrates frames", async () => {
    const req = {
      method: "GET",
      query: { id: "5" },
    } as unknown as NextApiRequest;
    const { res, store } = createMockResponse();

    await readHandler(req, res);
    expect(store.status).toBe(200);
    const json = store.body as { frames: unknown[] };
    expect(json.frames).toHaveLength(2);
    expect(mocks.findFirstMock).toHaveBeenCalledWith({ where: { id: 5 } });
    expect(mocks.findManyFramesMock).toHaveBeenCalledTimes(1);
  });
});
