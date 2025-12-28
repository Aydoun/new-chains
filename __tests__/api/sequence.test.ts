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
    const baseSequence = {
      description: "",
      url: null,
      FrameOrder: [],
      visibility: "PUBLIC",
      isDeleted: false,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-02",
      user: {
        id: 11,
        username: "creator",
        avatarUrl: null,
      },
    };

    if (!where)
      return [
        {
          ...baseSequence,
          id: 1,
          title: "Example",
          userId: 2,
        },
      ];

    const userIdFilter = (where as { userId?: number | { not: number } }).userId;
    const filteredUserId =
      userIdFilter && typeof userIdFilter === "object"
        ? (userIdFilter as { not: number }).not
        : (userIdFilter as number);

    return [
      {
        ...baseSequence,
        id: 2,
        title: "Filtered",
        userId: filteredUserId ?? 2,
        user: {
          id: filteredUserId ?? 2,
          username: "filtered-user",
          avatarUrl: null,
        },
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

const sessionMock = vi.hoisted(() =>
  vi.fn(async () => ({
    session: {},
    userId: 1,
  }))
);

vi.mock("@/lib/api/auth", () => ({
  requireApiSession: (...args: unknown[]) => sessionMock(...args),
}));

describe("api/sequence endpoints", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionMock.mockResolvedValue({ session: {}, userId: 1 });
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
    sessionMock.mockResolvedValueOnce({ session: {}, userId: 3 });
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
    sessionMock.mockResolvedValueOnce({ session: {}, userId: 10 });
    const req = {
      method: "GET",
      query: { id: "99" },
    } as unknown as NextApiRequest;
    const { res, store } = createMockResponse();

    await fetchHandler(req, res);
    expect(store.status).toBe(200);
    const json = store.body as Array<{ userId: number; user: { id: number; username: string } }>;
    expect(json[0].user).toMatchObject({
      id: expect.any(Number),
      username: expect.any(String),
    });
    expect(mocks.findManyMock).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          userId: { not: 10 },
          isDeleted: false,
          visibility: "PUBLIC",
        },
        include: {
          user: {
            select: {
              avatarUrl: true,
              id: true,
              username: true,
            },
          },
        },
      })
    );
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
    expect(mocks.findFirstMock).toHaveBeenCalledWith({
      where: { id: 5, isDeleted: false },
    });
    expect(mocks.findManyFramesMock).toHaveBeenCalledTimes(1);
  });
});
