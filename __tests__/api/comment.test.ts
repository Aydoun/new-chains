import createHandler from "@/pages/api/comment/create";
import deleteHandler from "@/pages/api/comment/delete";
import listHandler from "@/pages/api/comment/list";
import { requireApiSession } from "@/lib/api/auth";
import { characterCount } from "@/lib/validation";
import { COMMENT_MAX_LENGTH } from "@/lib/constants";
import { mockRequest, mockResponse } from "../helpers/api";

const db = vi.hoisted(() => ({
  comment: {
    create: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
    updateMany: vi.fn(),
  },
  sequence: { findFirst: vi.fn() },
}));

vi.mock("@/lib/prisma", () => ({ default: db }));
vi.mock("@/lib/api/auth", () => ({
  requireApiSession: vi.fn(async () => ({ session: {}, userId: 1 })),
}));

const visibleToMe = { AND: [{ OR: [{ visibility: "PUBLIC" }, { userId: 1 }] }] };

const comment = (id: number) => ({
  id,
  content: `Comment ${id}`,
  sequenceId: 5,
  authorId: 2,
  createdAt: new Date("2026-11-09T10:00:00Z"),
  updatedAt: new Date("2026-11-09T10:00:00Z"),
  author: { id: 2, username: "Sofie", avatarUrl: null },
});

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(requireApiSession).mockResolvedValue({
    session: {} as never,
    userId: 1,
  });
  db.sequence.findFirst.mockResolvedValue({ id: 5, title: "Seq" });
});

describe("GET /api/comment/list", () => {
  it("answers 401 without a session", async () => {
    vi.mocked(requireApiSession).mockImplementation(async (_req, res) => {
      res.status(401).json({ message: "Unauthorized" });
      return null;
    });
    const { res, store } = mockResponse();
    await listHandler(mockRequest({ method: "GET", query: { sequenceId: "5" } }), res);

    expect(store.status).toBe(401);
    expect(db.comment.findMany).not.toHaveBeenCalled();
  });

  it("rejects other methods", async () => {
    const { res, store } = mockResponse();
    await listHandler(mockRequest({ method: "POST", query: { sequenceId: "5" } }), res);
    expect(store.status).toBe(405);
  });

  it("requires a sequence id", async () => {
    const { res, store } = mockResponse();
    await listHandler(mockRequest({ method: "GET" }), res);
    expect(store.status).toBe(400);
  });

  it("answers 404 for a sequence the viewer can't see", async () => {
    db.sequence.findFirst.mockResolvedValue(null);
    const { res, store } = mockResponse();
    await listHandler(mockRequest({ method: "GET", query: { sequenceId: "5" } }), res);

    expect(store.status).toBe(404);
    expect(db.sequence.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: 5, isDeleted: false, ...visibleToMe }),
      }),
    );
    expect(db.comment.findMany).not.toHaveBeenCalled();
  });

  it("returns the newest live comments with a cursor to the next page", async () => {
    db.comment.findMany.mockResolvedValue([comment(30), comment(29), comment(28)]);
    db.comment.count.mockResolvedValue(12);

    const { res, store } = mockResponse();
    await listHandler(
      mockRequest({ method: "GET", query: { sequenceId: "5", limit: "2" } }),
      res,
    );

    expect(store.status).toBe(200);
    expect(store.body.items.map((c: { id: number }) => c.id)).toEqual([30, 29]);
    expect(store.body).toMatchObject({ hasMore: true, nextCursor: 29, total: 12 });
    expect(db.comment.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { sequenceId: 5, isDeleted: false },
        take: 3,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      }),
    );
    expect(db.comment.findMany.mock.calls[0][0]).not.toHaveProperty("cursor");
    expect(db.comment.count).toHaveBeenCalledWith({
      where: { sequenceId: 5, isDeleted: false },
    });
  });

  it("starts after the cursor and reports the last page", async () => {
    db.comment.findMany.mockResolvedValue([comment(28)]);
    db.comment.count.mockResolvedValue(3);

    const { res, store } = mockResponse();
    await listHandler(
      mockRequest({ method: "GET", query: { sequenceId: "5", cursor: "29", limit: "2" } }),
      res,
    );

    expect(store.body).toMatchObject({ hasMore: false, nextCursor: null });
    expect(db.comment.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ cursor: { id: 29 }, skip: 1 }),
    );
  });
});

describe("POST /api/comment/create", () => {
  const post = (body: unknown) => {
    const { res, store } = mockResponse();
    return createHandler(mockRequest({ method: "POST", body }), res).then(() => store);
  };

  it("rejects an empty comment", async () => {
    const store = await post({ sequenceId: 5, content: "   " });
    expect(store.status).toBe(400);
    expect(db.comment.create).not.toHaveBeenCalled();
  });

  it("rejects a comment over the limit", async () => {
    const store = await post({ sequenceId: 5, content: "a".repeat(COMMENT_MAX_LENGTH + 1) });
    expect(store.status).toBe(400);
  });

  it("counts an emoji as one character", async () => {
    db.comment.create.mockResolvedValue(comment(1));
    // 1000 emojis are 2000 UTF-16 units, but 1000 characters.
    const store = await post({ sequenceId: 5, content: "👍".repeat(COMMENT_MAX_LENGTH) });
    expect(store.status).toBe(201);
  });

  it("rejects extra fields such as an authorId", async () => {
    const store = await post({ sequenceId: 5, content: "Hi", authorId: 9 });
    expect(store.status).toBe(400);
  });

  it("answers 404 for a sequence the user can't see", async () => {
    db.sequence.findFirst.mockResolvedValue(null);
    const store = await post({ sequenceId: 5, content: "Hi" });
    expect(store.status).toBe(404);
    expect(db.comment.create).not.toHaveBeenCalled();
  });

  it("stores the trimmed comment as the signed-in user", async () => {
    db.comment.create.mockResolvedValue(comment(1));
    const store = await post({ sequenceId: 5, content: "  Nice one  " });

    expect(store.status).toBe(201);
    expect(db.comment.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { sequenceId: 5, authorId: 1, content: "Nice one" },
      }),
    );
  });
});

describe("DELETE /api/comment/delete", () => {
  it("lets the author or the sequence owner soft-delete it", async () => {
    db.comment.updateMany.mockResolvedValue({ count: 1 });
    const { res, store } = mockResponse();
    await deleteHandler(mockRequest({ method: "DELETE", query: { id: "7" } }), res);

    expect(store.status).toBe(200);
    expect(db.comment.updateMany).toHaveBeenCalledWith({
      where: {
        id: 7,
        isDeleted: false,
        OR: [{ authorId: 1 }, { sequence: { userId: 1 } }],
      },
      data: { isDeleted: true },
    });
  });

  it("answers 404 when the user may not delete it", async () => {
    db.comment.updateMany.mockResolvedValue({ count: 0 });
    const { res, store } = mockResponse();
    await deleteHandler(mockRequest({ method: "DELETE", query: { id: "7" } }), res);
    expect(store.status).toBe(404);
  });
});

describe("characterCount", () => {
  it("counts what people see", () => {
    expect(characterCount("abc")).toBe(3);
    expect(characterCount("👍👍")).toBe(2);
    expect(characterCount("")).toBe(0);
  });
});
