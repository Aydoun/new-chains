import handler from "../frame/create";
import { testApiHandler } from "next-test-api-route-handler";
import prisma from "@/lib/prisma";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => {
  const frame = { create: vi.fn() };
  const mockPrisma = { frame };
  return { prisma: mockPrisma, default: mockPrisma };
});

const prismaMock = prisma as unknown as {
  frame: { create: ReturnType<typeof vi.fn> };
};

afterEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/frame/create", () => {
  it("creates a frame and returns it", async () => {
    const frameData = {
      description: "A test desc",
      content: "test content",
    };

    prismaMock.frame.create.mockResolvedValue({ id: 1, ...frameData });

    await testApiHandler({
      pagesHandler: handler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(frameData),
        });

        expect(res.status).toBe(201);
        expect(await res.json()).toMatchObject({ id: 1, ...frameData });
      },
    });

    expect(prismaMock.frame.create).toHaveBeenCalledWith({
      data: expect.objectContaining(frameData),
    });
  });

  it("returns 405 for non-POST methods", async () => {
    await testApiHandler({
      pagesHandler: handler,
      test: async ({ fetch }) => {
        const res = await fetch({ method: "GET" });
        expect(res.status).toBe(405);
      },
    });
  });

  it("returns 400 if content is empty", async () => {
    const frameData = {
      description: "this is a description",
    };

    await testApiHandler({
      pagesHandler: handler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(frameData),
        });

        expect(res.status).toBe(400);
      },
    });
  });
});
