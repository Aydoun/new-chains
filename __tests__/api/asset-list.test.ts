import listHandler from "@/pages/api/asset/list";
import { requireApiSession } from "@/lib/api/auth";
import { mockRequest, mockResponse } from "../helpers/api";

const db = vi.hoisted(() => ({
  asset: { findMany: vi.fn() },
  sequence: { findMany: vi.fn() },
}));

vi.mock("@/lib/prisma", () => ({ default: db }));
vi.mock("@/lib/api/auth", () => ({ requireApiSession: vi.fn() }));

const asset = (id: number, frameIds: number[]) => ({
  id,
  url: `https://blob.test/assets/7/${id}.png`,
  width: 1080,
  height: 1080,
  contentType: "image/png",
  createdAt: new Date("2026-11-09T10:00:00Z"),
  frames: frameIds.map((frameId) => ({ id: frameId })),
});

const list = async (query: Record<string, unknown> = {}, method = "GET") => {
  const { res, store } = mockResponse();
  await listHandler(mockRequest({ method, query }), res);
  return store;
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(requireApiSession).mockResolvedValue({
    session: {} as never,
    userId: 7,
  });
  db.asset.findMany.mockResolvedValue([]);
  db.sequence.findMany.mockResolvedValue([]);
});

describe("GET /api/asset/list", () => {
  it("answers 401 without a session", async () => {
    vi.mocked(requireApiSession).mockImplementation(async (_req, res) => {
      res.status(401).json({ message: "Unauthorized" });
      return null;
    });
    const store = await list();

    expect(store.status).toBe(401);
    expect(db.asset.findMany).not.toHaveBeenCalled();
  });

  it("rejects other methods", async () => {
    expect((await list({}, "POST")).status).toBe(405);
  });

  it("rejects an invalid page", async () => {
    expect((await list({ page: "0" })).status).toBe(400);
  });

  it("lists only the user's own uploads, newest first, a page at a time", async () => {
    db.asset.findMany.mockResolvedValue([asset(3, []), asset(2, []), asset(1, [])]);

    const store = await list({ page: "2", limit: "2" });

    expect(store.status).toBe(200);
    expect(db.asset.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { uploadedById: 7 },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        skip: 2,
        take: 3,
      }),
    );
    expect(store.body.items.map((a: { id: number }) => a.id)).toEqual([3, 2]);
    expect(store.body).toMatchObject({ page: 2, pageSize: 2, hasMore: true, nextPage: 3 });
  });

  it("links each image to the live sequences of the user that use it", async () => {
    db.asset.findMany.mockResolvedValue([asset(1, [10, 11]), asset(2, [20]), asset(3, [])]);
    db.sequence.findMany.mockResolvedValue([
      { id: 100, title: "Uses 10", FrameOrder: [9, 10] },
      { id: 101, title: "Uses 11 and 20", FrameOrder: [11, 20] },
    ]);

    const store = await list();

    expect(db.sequence.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: 7, isDeleted: false, FrameOrder: { hasSome: [10, 11, 20] } },
      }),
    );
    const [first, second, unused] = store.body.items;
    expect(first.sequences).toEqual([
      { id: 100, title: "Uses 10" },
      { id: 101, title: "Uses 11 and 20" },
    ]);
    expect(second.sequences).toEqual([{ id: 101, title: "Uses 11 and 20" }]);
    expect(unused.sequences).toEqual([]);
    expect(first).not.toHaveProperty("frames");
    expect(first).toMatchObject({ url: expect.any(String), width: 1080, height: 1080 });
  });

  it("skips the sequence lookup when no image is in a frame", async () => {
    db.asset.findMany.mockResolvedValue([asset(1, [])]);

    const store = await list();

    expect(db.sequence.findMany).not.toHaveBeenCalled();
    expect(store.body.items[0].sequences).toEqual([]);
  });
});
