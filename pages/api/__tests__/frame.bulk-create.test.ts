import handler from "../frame/bulk-create";
import { testApiHandler } from "next-test-api-route-handler";
import prisma from "@/lib/prisma";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  default: {
    $transaction: vi.fn(),
    frame: {
      create: vi.fn(),
    },
  },
}));

const mockedPrisma = prisma as unknown as {
  $transaction: ReturnType<typeof vi.fn>;
  frame: { create: ReturnType<typeof vi.fn> };
};

afterEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/frame/bulk-create", () => {
  it("returns 405 if method is not POST", async () => {
    await testApiHandler({
      pagesHandler: handler,
      test: async ({ fetch }) => {
        const res = await fetch({ method: "GET" });
        expect(res.status).toBe(405);
        expect(await res.json()).toEqual({ message: "Method not allowed" });
      },
    });

    expect(mockedPrisma.$transaction).not.toHaveBeenCalled();
    expect(mockedPrisma.frame.create).not.toHaveBeenCalled();
  });

  it("returns 400 if frames is missing / not an array / empty", async () => {
    await testApiHandler({
      pagesHandler: handler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({}),
        });
        expect(res.status).toBe(400);
        expect(await res.json()).toEqual({
          message: "frames payload must be a non-empty array",
        });
      },
    });

    // not an array
    await testApiHandler({
      pagesHandler: handler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ frames: "nope" }),
        });
        expect(res.status).toBe(400);
        expect(await res.json()).toEqual({
          message: "frames payload must be a non-empty array",
        });
      },
    });

    // empty array
    await testApiHandler({
      pagesHandler: handler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ frames: [] }),
        });
        expect(res.status).toBe(400);
        expect(await res.json()).toEqual({
          message: "frames payload must be a non-empty array",
        });
      },
    });

    expect(mockedPrisma.$transaction).not.toHaveBeenCalled();
    expect(mockedPrisma.frame.create).not.toHaveBeenCalled();
  });

  it("creates frames in a transaction and returns ids (description defaults to empty string)", async () => {
    // Make frame.create return a recognizable "Prisma promise" object so we can assert its args.
    mockedPrisma.frame.create.mockImplementation(({ data }) => ({
      __op: "frame.create",
      data,
    }));

    mockedPrisma.$transaction.mockImplementation(async (ops) => {
      return ops.map((_: any, i: number) => ({ id: i + 1 }));
    });

    await testApiHandler({
      pagesHandler: handler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            frames: [{ content: "A" }, { content: "B", description: "desc B" }],
          }),
        });

        expect(res.status).toBe(201);
        expect(await res.json()).toEqual({ ids: [1, 2] });
      },
    });

    expect(mockedPrisma.frame.create).toHaveBeenCalledTimes(2);
    expect(mockedPrisma.frame.create).toHaveBeenNthCalledWith(1, {
      data: { content: "A", description: "" },
    });
    expect(mockedPrisma.frame.create).toHaveBeenNthCalledWith(2, {
      data: { content: "B", description: "desc B" },
    });

    expect(mockedPrisma.$transaction).toHaveBeenCalledTimes(1);
    const [opsArg] = mockedPrisma.$transaction.mock.calls[0];
    expect(Array.isArray(opsArg)).toBe(true);
    expect(opsArg).toHaveLength(2);
  });

  it("returns 500 with details if prisma transaction throws", async () => {
    mockedPrisma.$transaction.mockRejectedValueOnce(new Error("DB is down"));

    await testApiHandler({
      pagesHandler: handler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ frames: [{ content: "A" }] }),
        });

        expect(res.status).toBe(500);
        expect(await res.json()).toEqual({
          error: "Error creating frames",
          details: "DB is down",
        });
      },
    });

    expect(mockedPrisma.$transaction).toHaveBeenCalledTimes(1);
  });
});
