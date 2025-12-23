import handler from "../sequence/read";
import { testApiHandler } from "next-test-api-route-handler";
import prisma from "@/lib/prisma";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => {
  const collection = { findUnique: vi.fn() };
  const frame = { findMany: vi.fn() };
  const mockPrisma = { collection, frame };
  return { prisma: mockPrisma, default: mockPrisma };
});

const prismaMock = prisma as unknown as {
  collection: { findUnique: ReturnType<typeof vi.fn> };
  frame: { findMany: ReturnType<typeof vi.fn> };
};

afterEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/sequence/read", () => {
  it("returns 405 for non-GET methods", async () => {
    await testApiHandler({
      pagesHandler: handler,
      test: async ({ fetch }) => {
        const res = await fetch({ method: "POST" });
        expect(res.status).toBe(405);
        expect(await res.json()).toEqual({ message: "Method not allowed" });
      },
    });
  });

  it("returns 400 if id is missing or invalid", async () => {
    await testApiHandler({
      pagesHandler: handler,
      test: async ({ fetch }) => {
        const res = await fetch({ method: "GET" });
        expect(res.status).toBe(400);
        expect(await res.json()).toEqual({ message: "Missing sequence id" });
      },
    });

    await testApiHandler({
      pagesHandler: handler,
      params: { id: "abc" },
      test: async ({ fetch }) => {
        const res = await fetch({ method: "GET" });
        expect(res.status).toBe(400);
        expect(await res.json()).toEqual({
          message: "Sequence id must be a number",
        });
      },
    });
  });

  it("returns 404 when the sequence is not found", async () => {
    prismaMock.collection.findUnique.mockResolvedValueOnce(null);

    await testApiHandler({
      pagesHandler: handler,
      params: { id: "1" },
      test: async ({ fetch }) => {
        const res = await fetch({ method: "GET" });
        expect(res.status).toBe(404);
        expect(await res.json()).toEqual({ message: "Sequence not found" });
      },
    });
  });

  it("returns the sequence with ordered frames", async () => {
    const sequence = {
      id: 1,
      title: "Morning Routine",
      description: "A cozy start",
      url: null,
      userId: 1,
      FrameOrder: [3, 1, 2],
      isDeleted: false,
      visibility: "PUBLIC",
      createdAt: "now",
      updatedAt: "now",
    };

    prismaMock.collection.findUnique.mockResolvedValueOnce(sequence);
    prismaMock.frame.findMany.mockResolvedValueOnce([
      { id: 1, content: "First sip" },
      { id: 2, content: "Second sip" },
      { id: 3, content: "Third sip" },
    ]);

    await testApiHandler({
      pagesHandler: handler,
      params: { id: "1" },
      test: async ({ fetch }) => {
        const res = await fetch({ method: "GET" });
        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body.frames.map((f: any) => f.id)).toEqual([3, 1, 2]);
        expect(body).toMatchObject({ id: 1, title: "Morning Routine" });
      },
    });

    expect(prismaMock.collection.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(prismaMock.frame.findMany).toHaveBeenCalledWith({
      where: { id: { in: sequence.FrameOrder } },
    });
  });
});
