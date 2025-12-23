import handler from "@/pages/api/frame/bulk-create";
import type { NextApiRequest, NextApiResponse } from "next";
import { vi } from "vitest";

const mocks = vi.hoisted(() => {
  const createMock = vi.fn(
    async ({ data }: { data: { content: string; description?: string } }) => ({
      id: data.content.length,
      content: data.content,
      description: data.description ?? "",
    })
  );

  return {
    createMock,
    transactionMock: vi.fn(async (actions: Promise<unknown>[]) =>
      Promise.all(actions)
    ),
  };
});

vi.mock("@/lib/prisma", () => ({
  default: {
    frame: {
      create: mocks.createMock,
    },
    $transaction: mocks.transactionMock,
  },
}));

const createMockResponse = () => {
  const store: { status?: number; body?: unknown } = {};
  const res = {
    status(code: number) {
      store.status = code;
      return res as NextApiResponse;
    },
    json(data: unknown) {
      store.body = data;
      return res as NextApiResponse;
    },
  } as unknown as NextApiResponse;

  return { res, store };
};

describe("api/frame/bulk-create", () => {
  beforeEach(() => {
    mocks.createMock.mockClear();
  });

  it("rejects non-POST methods", async () => {
    const req = { method: "GET" } as NextApiRequest;
    const { res, store } = createMockResponse();

    await handler(req, res);
    expect(store.status).toBe(405);
  });

  it("validates that frames payload is a non-empty array", async () => {
    const req = {
      method: "POST",
      body: { frames: [] },
    } as unknown as NextApiRequest;
    const { res, store } = createMockResponse();

    await handler(req, res);
    expect(store.status).toBe(400);
    expect(store.body).toMatchObject({
      message: "frames payload must be a non-empty array",
    });
  });

  it("creates frames inside a transaction and returns their ids", async () => {
    const payload = {
      frames: [
        { content: "First frame" },
        { content: "Second frame", description: "Desc" },
      ],
    };

    const req = {
      method: "POST",
      body: payload,
    } as unknown as NextApiRequest;
    const { res, store } = createMockResponse();

    await handler(req, res);
    expect(store.status).toBe(201);
    expect(store.body).toMatchObject({
      ids: [payload.frames[0].content.length, payload.frames[1].content.length],
    });
    expect(mocks.createMock).toHaveBeenCalledTimes(2);
  });
});
