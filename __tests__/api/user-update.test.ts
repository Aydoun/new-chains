import updateHandler from "@/pages/api/user/update";
import profileHandler from "@/pages/api/user/[id]";
import { requireApiSession } from "@/lib/api/auth";
import { mockRequest, mockResponse } from "../helpers/api";
import { BIO_MAX_LENGTH } from "@/lib/constants";

const db = vi.hoisted(() => ({
  user: { update: vi.fn(), findUnique: vi.fn() },
}));

vi.mock("@/lib/prisma", () => ({ default: db }));
vi.mock("@/lib/api/auth", () => ({
  requireApiSession: vi.fn(async () => ({ session: {}, userId: 3 })),
}));

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(requireApiSession).mockResolvedValue({
    session: {} as never,
    userId: 3,
  });
});

describe("PUT /api/user/update", () => {
  it("prevents updating another user", async () => {
    const { res, store } = mockResponse();
    await updateHandler(
      mockRequest({ method: "PUT", query: { id: "4" }, body: { bio: "hi" } }),
      res,
    );
    expect(store.status).toBe(403);
    expect(db.user.update).not.toHaveBeenCalled();
  });

  it("rejects bios that are too long or not strings", async () => {
    for (const bio of ["a".repeat(BIO_MAX_LENGTH + 1), { nested: true }]) {
      const { res, store } = mockResponse();
      await updateHandler(
        mockRequest({ method: "PUT", query: { id: "3" }, body: { bio } }),
        res,
      );
      expect(store.status).toBe(400);
    }
  });

  it("updates the bio and returns only profile fields", async () => {
    db.user.update.mockResolvedValue({ id: 3, bio: "hello" });

    const { res, store } = mockResponse();
    await updateHandler(
      mockRequest({ method: "PUT", query: { id: "3" }, body: { bio: " hello " } }),
      res,
    );

    expect(store.status).toBe(200);
    const call = db.user.update.mock.calls[0][0];
    expect(call.data).toEqual({ bio: "hello" });
    expect(call.select).not.toHaveProperty("role");
    expect(call.select).toHaveProperty("email", true);
  });

  it("returns 404 when the user no longer exists", async () => {
    db.user.update.mockRejectedValue(Object.assign(new Error("missing"), { code: "P2025" }));

    const { res, store } = mockResponse();
    await updateHandler(
      mockRequest({ method: "PUT", query: { id: "3" }, body: { bio: "x" } }),
      res,
    );
    expect(store.status).toBe(404);
  });
});

describe("GET /api/user/[id]", () => {
  it("hides the email of other users", async () => {
    db.user.findUnique.mockResolvedValue({ id: 9, username: "other" });

    const { res, store } = mockResponse();
    await profileHandler(mockRequest({ method: "GET", query: { id: "9" } }), res);

    expect(store.status).toBe(200);
    expect(db.user.findUnique.mock.calls[0][0].select).not.toHaveProperty("email");
  });

  it("includes the email for yourself", async () => {
    db.user.findUnique.mockResolvedValue({ id: 3, username: "me" });

    const { res } = mockResponse();
    await profileHandler(mockRequest({ method: "GET", query: { id: "3" } }), res);

    expect(db.user.findUnique.mock.calls[0][0].select).toHaveProperty("email", true);
  });
});
