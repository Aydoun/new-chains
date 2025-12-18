import handler from "../sequence/create";
import { testApiHandler } from "next-test-api-route-handler";
import prisma from "@/lib/prisma";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => {
  const sequence = { create: vi.fn() };
  const mockPrisma = { sequence };
  return { prisma: mockPrisma, default: mockPrisma };
});

const prismaMock = prisma as unknown as {
  sequence: { create: ReturnType<typeof vi.fn> };
};

afterEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/sequence/create", () => {
  it("creates a sequence and returns it", async () => {
    const payload = {
      title: "Example sequence",
      description: "Description",
      url: "https://example.com",
      userId: 1,
      frameOrder: [1, 2],
    };

    prismaMock.sequence.create.mockResolvedValue({
      id: 1,
      ...payload,
      FrameOrder: payload.frameOrder,
    });

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
        expect(body).toMatchObject({
          id: 1,
          title: payload.title,
          url: payload.url,
        });
      },
    });

    expect(prismaMock.sequence.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        title: payload.title,
        url: payload.url,
        userId: payload.userId,
        FrameOrder: payload.frameOrder,
      }),
    });
  });

  //   it("returns 400 when required fields are missing", async () => {
  //     await testApiHandler({
  //       pagesHandler: handler,
  //       test: async ({ fetch }) => {
  //         const res = await fetch({
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify({ title: "Missing fields" }),
  //         });

  //         expect(res.status).toBe(400);
  //       },
  //     });
  //   });
});
