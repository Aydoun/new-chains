import handler from "../collection/create";
import { testApiHandler } from "next-test-api-route-handler";
import { prisma } from "@/lib/prisma";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => {
  const collection = { create: vi.fn() };
  const mockPrisma = { collection };
  return { prisma: mockPrisma, default: mockPrisma };
});

const prismaMock = prisma as unknown as {
  collection: { create: ReturnType<typeof vi.fn> };
};

afterEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/collection/create", () => {
  it("creates a collection and returns it", async () => {
    const payload = {
      title: "Example Collection",
      description: "Description",
      url: "https://example.com",
      userId: 1,
      frameOrder: [1, 2],
      views: 5,
    };

    prismaMock.collection.create.mockResolvedValue({ id: 1, popularity: 0, visibility: "PUBLIC", engine: "CHESS", ...payload, FrameOrder: payload.frameOrder });

    await testApiHandler({
      pagesHandler: handler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        expect(res.status).toBe(201);
        const body = await res.json();
        expect(body).toMatchObject({ id: 1, title: payload.title, url: payload.url });
      },
    });

    expect(prismaMock.collection.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        title: payload.title,
        url: payload.url,
        userId: payload.userId,
        FrameOrder: payload.frameOrder,
      }),
    });
  });

  it("returns 400 when required fields are missing", async () => {
    await testApiHandler({
      pagesHandler: handler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: "Missing fields" }),
        });

        expect(res.status).toBe(400);
      },
    });
  });
});
