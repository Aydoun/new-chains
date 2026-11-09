import createHandler from "@/pages/api/sequence/create";
import fetchHandler from "@/pages/api/sequence/fetch";
import studioHandler from "@/pages/api/sequence/studio";
import readHandler from "@/pages/api/sequence/[id]";
import { requireApiSession } from "@/lib/api/auth";
import { mockRequest, mockResponse } from "../helpers/api";

const db = vi.hoisted(() => {
  const tx = {
    frame: { create: vi.fn() },
    sequence: { create: vi.fn() },
  };
  return {
    tx,
    sequence: { findMany: vi.fn(), findFirst: vi.fn() },
    frame: { findMany: vi.fn() },
    snippet: { findMany: vi.fn() },
    asset: { findMany: vi.fn() },
    $transaction: vi.fn(async (fn: (t: typeof tx) => unknown) => fn(tx)),
  };
});

vi.mock("@/lib/prisma", () => ({ default: db }));
vi.mock("@/lib/api/auth", () => ({
  requireApiSession: vi.fn(async () => ({ session: {}, userId: 1 })),
}));

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(requireApiSession).mockResolvedValue({
    session: {} as never,
    userId: 1,
  });
  db.sequence.findMany.mockResolvedValue([]);
  db.frame.findMany.mockResolvedValue([]);
  db.snippet.findMany.mockResolvedValue([]);
  db.asset.findMany.mockResolvedValue([]);
});

describe("POST /api/sequence/create", () => {
  it("rejects a payload without frames", async () => {
    const { res, store } = mockResponse();
    await createHandler(mockRequest({ method: "POST", body: { title: "T" } }), res);

    expect(store.status).toBe(400);
    expect(store.body.message).toBe("Invalid request body");
  });

  it("rejects a client-supplied userId", async () => {
    const { res, store } = mockResponse();
    await createHandler(
      mockRequest({
        method: "POST",
        body: { title: "T", userId: 2, frames: [{ content: "a" }] },
      }),
      res,
    );

    expect(store.status).toBe(400);
  });

  it("creates the frames and the sequence for the session user in one transaction", async () => {
    db.tx.frame.create
      .mockResolvedValueOnce({ id: 10 })
      .mockResolvedValueOnce({ id: 11 });
    db.tx.sequence.create.mockImplementation(async ({ data }) => ({ id: 5, ...data }));

    const { res, store } = mockResponse();
    await createHandler(
      mockRequest({
        method: "POST",
        body: {
          title: "  Morning  ",
          frames: [{ content: "Wake up" }, { content: "Stretch", description: "5 min" }],
        },
      }),
      res,
    );

    expect(store.status).toBe(201);
    expect(db.$transaction).toHaveBeenCalledTimes(1);
    expect(db.tx.frame.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { type: "PHRASE", content: "Wake up", description: "", createdById: 1 },
      }),
    );
    expect(db.tx.sequence.create).toHaveBeenCalledWith({
      data: {
        title: "Morning",
        description: "",
        visibility: "PUBLIC",
        userId: 1,
        FrameOrder: [10, 11],
      },
    });
  });
});

describe("POST /api/sequence/create with images", () => {
  const body = (assetId: number) => ({
    title: "Trip",
    frames: [{ content: "Beach", assetId }, { content: "Text only" }],
  });

  it("makes frames with the user's own image IMAGE frames", async () => {
    db.asset.findMany.mockResolvedValue([{ id: 42 }]);
    db.tx.frame.create
      .mockResolvedValueOnce({ id: 10 })
      .mockResolvedValueOnce({ id: 11 });
    db.tx.sequence.create.mockResolvedValue({ id: 5 });

    const { res, store } = mockResponse();
    await createHandler(mockRequest({ method: "POST", body: body(42) }), res);

    expect(store.status).toBe(201);
    expect(db.asset.findMany).toHaveBeenCalledWith({
      where: { id: { in: [42] }, uploadedById: 1 },
      select: { id: true },
    });
    expect(db.tx.frame.create.mock.calls.map(([arg]) => arg.data)).toEqual([
      { type: "IMAGE", content: "Beach", description: "", assetId: 42, createdById: 1 },
      { type: "PHRASE", content: "Text only", description: "", createdById: 1 },
    ]);
  });

  it("refuses an image someone else uploaded, and creates nothing", async () => {
    db.asset.findMany.mockResolvedValue([]);

    const { res, store } = mockResponse();
    await createHandler(mockRequest({ method: "POST", body: body(99) }), res);

    expect(store.status).toBe(400);
    expect(store.body.message).toBe("Unknown image");
    expect(db.$transaction).not.toHaveBeenCalled();
  });
});

describe("GET /api/sequence/fetch", () => {
  it("lists public sequences from other users", async () => {
    const { res, store } = mockResponse();
    await fetchHandler(mockRequest({ method: "GET", query: { page: "1" } }), res);

    expect(store.status).toBe(200);
    expect(db.sequence.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          userId: { not: 1 },
          visibility: "PUBLIC",
          isDeleted: false,
        }),
      }),
    );
  });

  it("applies the time filter", async () => {
    const { res } = mockResponse();
    await fetchHandler(
      mockRequest({ method: "GET", query: { timeFilter: "today" } }),
      res,
    );

    const { where } = db.sequence.findMany.mock.calls[0][0];
    expect(where.createdAt.gte).toBeInstanceOf(Date);
  });

  it("rejects an unknown time filter", async () => {
    const { res, store } = mockResponse();
    await fetchHandler(
      mockRequest({ method: "GET", query: { timeFilter: "forever" } }),
      res,
    );
    expect(store.status).toBe(400);
  });

  it("returns the first frame of each sequence", async () => {
    db.sequence.findMany.mockResolvedValue([
      { id: 1, FrameOrder: [7, 8], user: { id: 2, username: "a" } },
    ]);
    db.frame.findMany.mockResolvedValue([{ id: 7, content: "first" }]);

    const { res, store } = mockResponse();
    await fetchHandler(mockRequest({ method: "GET" }), res);

    expect(store.body.items[0].firstFrame).toEqual({ id: 7, content: "first" });
    expect(store.body.hasMore).toBe(false);
  });
});

describe("GET /api/sequence/studio", () => {
  it("includes private sequences in your own studio", async () => {
    const { res } = mockResponse();
    await studioHandler(mockRequest({ method: "GET" }), res);

    const { where } = db.sequence.findMany.mock.calls[0][0];
    expect(where.userId).toBe(1);
    expect(where.visibility).toBeUndefined();
  });

  it("shows only public sequences of another user", async () => {
    const { res } = mockResponse();
    await studioHandler(mockRequest({ method: "GET", query: { userId: "4" } }), res);

    const { where } = db.sequence.findMany.mock.calls[0][0];
    expect(where.userId).toBe(4);
    expect(where.visibility).toBe("PUBLIC");
  });
});

describe("GET /api/sequence/[id]", () => {
  it("only finds sequences that are public or yours", async () => {
    db.sequence.findFirst.mockResolvedValue(null);

    const { res, store } = mockResponse();
    await readHandler(mockRequest({ method: "GET", query: { id: "3" } }), res);

    expect(db.sequence.findFirst).toHaveBeenCalledWith({
      where: {
        id: 3,
        isDeleted: false,
        OR: [{ visibility: "PUBLIC" }, { userId: 1 }],
      },
    });
    expect(store.status).toBe(404);
    expect(store.body).toEqual({ message: "Sequence not found" });
  });

  it("returns frames in sequence order with liked frames", async () => {
    db.sequence.findFirst.mockResolvedValue({ id: 3, FrameOrder: [9, 4] });
    db.frame.findMany.mockResolvedValue([{ id: 4 }, { id: 9 }]);
    db.snippet.findMany.mockResolvedValue([{ frameId: 4 }]);

    const { res, store } = mockResponse();
    await readHandler(mockRequest({ method: "GET", query: { id: "3" } }), res);

    expect(store.status).toBe(200);
    expect(store.body.frames.map((f: { id: number }) => f.id)).toEqual([9, 4]);
    expect(store.body.likedFrames).toEqual([4]);
  });

  it("rejects a non-numeric id", async () => {
    const { res, store } = mockResponse();
    await readHandler(mockRequest({ method: "GET", query: { id: "abc" } }), res);
    expect(store.status).toBe(400);
  });
});
