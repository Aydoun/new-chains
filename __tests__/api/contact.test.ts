import sendHandler from "@/pages/api/contact/send";
import { requireApiSession } from "@/lib/api/auth";
import { mockRequest, mockResponse } from "../helpers/api";
import { CONTACT_MESSAGE_MAX_LENGTH } from "@/lib/constants";

const db = vi.hoisted(() => ({ contact: { create: vi.fn() } }));

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

describe("POST /api/contact/send", () => {
  it("rejects empty messages", async () => {
    const { res, store } = mockResponse();
    await sendHandler(mockRequest({ method: "POST", body: { message: "   " } }), res);
    expect(store.status).toBe(400);
  });

  it("enforces the message length limit", async () => {
    const { res, store } = mockResponse();
    await sendHandler(
      mockRequest({
        method: "POST",
        body: { message: "a".repeat(CONTACT_MESSAGE_MAX_LENGTH + 1) },
      }),
      res,
    );
    expect(store.status).toBe(400);
  });

  it("creates a contact with trimmed content", async () => {
    db.contact.create.mockResolvedValue({ id: 1 });

    const { res, store } = mockResponse();
    await sendHandler(mockRequest({ method: "POST", body: { message: "  Hi  " } }), res);

    expect(store.status).toBe(201);
    expect(db.contact.create).toHaveBeenCalledWith({
      data: { userId: 3, message: "Hi" },
    });
  });

  it("returns 401 when signed out", async () => {
    vi.mocked(requireApiSession).mockImplementation(async (_req, res) => {
      res.status(401).json({ message: "Unauthorized" });
      return null;
    });

    const { res, store } = mockResponse();
    await sendHandler(mockRequest({ method: "POST", body: { message: "Hi" } }), res);

    expect(store.status).toBe(401);
    expect(db.contact.create).not.toHaveBeenCalled();
  });
});
