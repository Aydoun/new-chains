import updateHandler from "@/pages/api/sequence/update";
import deleteHandler from "@/pages/api/sequence/delete";
import { requireApiSession } from "@/lib/api/auth";
import { mockRequest, mockResponse } from "../helpers/api";

const db = vi.hoisted(() => ({
  sequence: { findFirst: vi.fn(), update: vi.fn() },
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

describe("PUT /api/sequence/update", () => {
  it("returns 404 for someone else's sequence and changes nothing", async () => {
    db.sequence.findFirst.mockResolvedValue(null);

    const { res, store } = mockResponse();
    await updateHandler(
      mockRequest({ method: "PUT", query: { id: "8" }, body: { title: "Mine now" } }),
      res,
    );

    expect(db.sequence.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 8, userId: 1, isDeleted: false },
      }),
    );
    expect(store.status).toBe(404);
    expect(db.sequence.update).not.toHaveBeenCalled();
  });

  it("does not accept isDeleted (deletes go through the delete route)", async () => {
    const { res, store } = mockResponse();
    await updateHandler(
      mockRequest({ method: "PUT", query: { id: "8" }, body: { isDeleted: false } }),
      res,
    );

    expect(store.status).toBe(400);
    expect(db.sequence.update).not.toHaveBeenCalled();
  });

  it("updates the owner's sequence", async () => {
    db.sequence.findFirst.mockResolvedValue({ id: 8 });
    db.sequence.update.mockResolvedValue({ id: 8, title: "New" });

    const { res, store } = mockResponse();
    await updateHandler(
      mockRequest({
        method: "PUT",
        query: { id: "8" },
        body: { title: "New", visibility: "PRIVATE" },
      }),
      res,
    );

    expect(store.status).toBe(200);
    expect(db.sequence.update).toHaveBeenCalledWith({
      where: { id: 8 },
      data: { title: "New", visibility: "PRIVATE" },
    });
  });
});

describe("DELETE /api/sequence/delete", () => {
  it("rejects requests without a valid id", async () => {
    const { res, store } = mockResponse();
    await deleteHandler(mockRequest({ method: "DELETE", query: {} }), res);
    expect(store.status).toBe(400);
  });

  it("returns 404 when the sequence is missing, deleted or not yours", async () => {
    db.sequence.findFirst.mockResolvedValue(null);

    const { res, store } = mockResponse();
    await deleteHandler(mockRequest({ method: "DELETE", query: { id: "2" } }), res);

    expect(store.status).toBe(404);
    expect(db.sequence.update).not.toHaveBeenCalled();
  });

  it("soft-deletes the owner's sequence", async () => {
    db.sequence.findFirst.mockResolvedValue({ id: 2 });

    const { res, store } = mockResponse();
    await deleteHandler(mockRequest({ method: "DELETE", query: { id: "2" } }), res);

    expect(store.status).toBe(200);
    expect(db.sequence.update).toHaveBeenCalledWith({
      where: { id: 2 },
      data: { isDeleted: true },
    });
  });

  it("rejects unsupported methods", async () => {
    const { res, store } = mockResponse();
    await deleteHandler(mockRequest({ method: "GET", query: { id: "2" } }), res);
    expect(store.status).toBe(405);
  });
});
