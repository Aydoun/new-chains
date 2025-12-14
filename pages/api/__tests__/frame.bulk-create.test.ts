import handler from "../frame/bulk-create";
import { testApiHandler } from "next-test-api-route-handler";
import { prisma } from "@/lib/prisma";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => {
  const frame = { create: vi.fn() };
  const transaction = vi.fn();
  const mockPrisma = { frame, $transaction: transaction };
  return { prisma: mockPrisma, default: mockPrisma };
});

const prismaMock = prisma as unknown as {
  frame: { create: ReturnType<typeof vi.fn> };
  $transaction: ReturnType<typeof vi.fn>;
};

afterEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/frame/bulk-create", () => {
  it("creates frames in bulk and returns ids", async () => {
    const payload = {
      frames: [
        { type: "IMAGE", url: "https://example.com/1.png" },
        { type: "VIDEO", url: "https://example.com/2.mp4", likes: 5 },
      ],
    };

    prismaMock.frame.create
      .mockResolvedValueOnce({ id: 1, reportedCount: 0, likes: 0, views: 0, ...payload.frames[0] })
      .mockResolvedValueOnce({ id: 2, reportedCount: 0, likes: 5, views: 0, ...payload.frames[1] });

    prismaMock.$transaction.mockImplementation(async (operations) => Promise.all(operations));

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
        expect(body.ids).toEqual([1, 2]);
        expect(body.frames).toHaveLength(2);
      },
    });

    expect(prismaMock.frame.create).toHaveBeenCalledTimes(2);
    expect(prismaMock.$transaction).toHaveBeenCalled();
  });

  it("returns 400 for invalid payload", async () => {
    await testApiHandler({
      pagesHandler: handler,
      test: async ({ fetch }) => {
        const res = await fetch({ method: "POST" });
        expect(res.status).toBe(400);
      },
    });
  });
});
