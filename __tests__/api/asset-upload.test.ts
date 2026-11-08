import { Readable } from "node:stream";
import { beforeEach, describe, expect, it, vi } from "vitest";
import uploadHandler from "@/pages/api/asset/upload";
import { requireApiSession } from "@/lib/api/auth";
import { resolveLocalPath } from "@/lib/server/storage";
import { IMAGE_RULES } from "@/lib/image-validation";
import { mockResponse } from "../helpers/api";
import { makePng } from "../helpers/png";

const db = vi.hoisted(() => ({ asset: { create: vi.fn() } }));
const storeFile = vi.hoisted(() => vi.fn());

vi.mock("@/lib/prisma", () => ({ default: db }));
vi.mock("@/lib/api/auth", () => ({ requireApiSession: vi.fn() }));
vi.mock("@/lib/server/storage", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/server/storage")>()),
  storeFile,
}));

function uploadRequest(body: Buffer) {
  return Object.assign(Readable.from([body]), {
    method: "POST",
    url: "/api/asset/upload",
    query: {},
  }) as never;
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(requireApiSession).mockResolvedValue({
    session: {} as never,
    userId: 7,
  });
  storeFile.mockImplementation(async (pathname: string) => ({
    url: `https://blob.test/${pathname}`,
    pathname,
  }));
  db.asset.create.mockImplementation(async ({ data }) => ({ id: 1, ...data }));
});

describe("POST /api/asset/upload", () => {
  it("stores a valid image under the uploader's folder and records the uploader", async () => {
    const { res, store } = mockResponse();
    await uploadHandler(uploadRequest(makePng(1080, 1350)), res);

    expect(store.status).toBe(201);
    const [pathname, , contentType] = storeFile.mock.calls[0];
    expect(pathname).toMatch(/^assets\/7\/[0-9a-f-]{36}\.png$/);
    expect(contentType).toBe("image/png");
    expect(db.asset.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          uploadedById: 7,
          width: 1080,
          height: 1350,
          contentType: "image/png",
          pathname,
        }),
      }),
    );
  });

  it("rejects proportions outside Instagram/TikTok and stores nothing", async () => {
    const { res, store } = mockResponse();
    await uploadHandler(uploadRequest(makePng(1200, 400)), res);

    expect(store.status).toBe(400);
    expect(store.body.code).toBe("ratio");
    expect(storeFile).not.toHaveBeenCalled();
    expect(db.asset.create).not.toHaveBeenCalled();
  });

  it("checks the bytes, not the claimed type", async () => {
    const { res, store } = mockResponse();
    await uploadHandler(uploadRequest(Buffer.from("not an image at all")), res);

    expect(store.status).toBe(400);
    expect(store.body.code).toBe("type");
  });

  it("refuses bodies over the size limit", async () => {
    const { res, store } = mockResponse();
    await uploadHandler(
      uploadRequest(Buffer.alloc(IMAGE_RULES.maxBytes + 1)),
      res,
    );

    expect(store.status).toBe(413);
    expect(store.body.code).toBe("tooLarge");
  });

  it("requires a signed-in user", async () => {
    vi.mocked(requireApiSession).mockImplementation(async (_req, res) => {
      res.status(401).json({ message: "Unauthorized" });
      return null;
    });
    const { res, store } = mockResponse();
    await uploadHandler(uploadRequest(makePng(1080, 1080)), res);

    expect(store.status).toBe(401);
    expect(storeFile).not.toHaveBeenCalled();
  });
});

describe("resolveLocalPath", () => {
  it("keeps files inside the upload folder", () => {
    expect(resolveLocalPath("assets/7/a.png")).toMatch(/assets\/7\/a\.png$/);
    expect(resolveLocalPath("../../etc/passwd")).toBeNull();
  });
});
