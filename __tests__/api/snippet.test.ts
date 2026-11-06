import createHandler from "@/pages/api/snippet/create";
import deleteHandler from "@/pages/api/snippet/delete";
import listHandler from "@/pages/api/snippet/list";
import { requireApiSession } from "@/lib/api/auth";
import { mockRequest, mockResponse } from "../helpers/api";

const db = vi.hoisted(() => ({
  snippet: { create: vi.fn(), findMany: vi.fn(), deleteMany: vi.fn() },
  sequence: { findFirst: vi.fn() },
  frame: { findUnique: vi.fn() },
}));

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
});

describe("POST /api/snippet/create", () => {
  it("rejects invalid payloads", async () => {
    const { res, store } = mockResponse();
    await createHandler(mockRequest({ method: "POST", body: { frameId: "abc" } }), res);
    expect(store.status).toBe(400);
  });

  it("saves a frame from a sequence the user can see", async () => {
    db.sequence.findFirst.mockResolvedValue({ id: 1, title: "Origin" });
    db.frame.findUnique.mockResolvedValue({ id: 2 });
    db.snippet.create.mockResolvedValue({
      id: 10,
      frame: { id: 2 },
      originSequence: { id: 1, title: "Origin" },
    });

    const { res, store } = mockResponse();
    await createHandler(
      mockRequest({ method: "POST", body: { frameId: 2, originSequenceId: 1 } }),
      res,
    );

    expect(store.status).toBe(201);
    expect(db.sequence.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          id: 1,
          FrameOrder: { has: 2 },
          AND: [{ OR: [{ visibility: "PUBLIC" }, { userId: 1 }] }],
        }),
      }),
    );
    expect(db.snippet.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { frameId: 2, originSequenceId: 1, createdById: 1 },
      }),
    );
    expect(store.body.originSequence.title).toBe("Origin");
  });

  it("returns 404 when the sequence is private or doesn't contain the frame", async () => {
    db.sequence.findFirst.mockResolvedValue(null);

    const { res, store } = mockResponse();
    await createHandler(
      mockRequest({ method: "POST", body: { frameId: 2, originSequenceId: 1 } }),
      res,
    );

    expect(store.status).toBe(404);
    expect(db.snippet.create).not.toHaveBeenCalled();
  });
});

describe("DELETE /api/snippet/delete", () => {
  it("only deletes the user's own snippet", async () => {
    db.snippet.deleteMany.mockResolvedValue({ count: 1 });

    const { res, store } = mockResponse();
    await deleteHandler(mockRequest({ method: "DELETE", query: { id: "5" } }), res);

    expect(db.snippet.deleteMany).toHaveBeenCalledWith({
      where: { id: 5, createdById: 1 },
    });
    expect(store.status).toBe(200);
  });

  it("returns 404 for someone else's snippet", async () => {
    db.snippet.deleteMany.mockResolvedValue({ count: 0 });

    const { res, store } = mockResponse();
    await deleteHandler(mockRequest({ method: "DELETE", query: { id: "5" } }), res);

    expect(store.status).toBe(404);
  });
});

describe("GET /api/snippet/list", () => {
  it("returns the user's snippets with their origin sequence", async () => {
    db.snippet.findMany.mockResolvedValue([{ id: 1 }]);

    const { res, store } = mockResponse();
    await listHandler(mockRequest({ method: "GET" }), res);

    expect(store.status).toBe(200);
    expect(db.snippet.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { createdById: 1 },
        include: expect.objectContaining({ originSequence: expect.anything() }),
      }),
    );
  });
});
