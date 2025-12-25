import deleteHandler from "@/pages/api/sequence/delete";
import type { NextApiRequest, NextApiResponse } from "next";
import { vi } from "vitest";

const mocks = vi.hoisted(() => {
  const findUniqueMock = vi.fn(async ({ where }: { where: { id: number } }) => {
    if (where.id === 99) return null;
    if (where.id === 2) return { id: 2, isDeleted: true };
    return { id: where.id, isDeleted: false };
  });
  const updateMock = vi.fn(async ({ where, data }) => ({
    id: where.id,
    ...data,
  }));

  return { findUniqueMock, updateMock };
});

vi.mock("@/lib/prisma", () => ({
  default: {
    sequence: {
      findUnique: mocks.findUniqueMock,
      update: mocks.updateMock,
    },
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

describe("api/sequence/delete endpoint", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects requests without a valid id", async () => {
    const req = {
      method: "DELETE",
      query: {},
    } as unknown as NextApiRequest;
    const { res, store } = createMockResponse();

    await deleteHandler(req, res);
    expect(store.status).toBe(400);
    expect(mocks.findUniqueMock).not.toHaveBeenCalled();
  });

  it("returns 404 when the sequence is missing or already deleted", async () => {
    const req = {
      method: "DELETE",
      query: { id: "2" },
    } as unknown as NextApiRequest;
    const { res, store } = createMockResponse();

    await deleteHandler(req, res);
    expect(store.status).toBe(404);
    expect(mocks.updateMock).not.toHaveBeenCalled();
  });

  it("marks the sequence as deleted when the id is valid", async () => {
    const req = {
      method: "DELETE",
      query: { id: "10" },
    } as unknown as NextApiRequest;
    const { res, store } = createMockResponse();

    await deleteHandler(req, res);
    expect(store.status).toBe(200);
    expect(store.body).toEqual({ message: "Sequence deleted successfully" });
    expect(mocks.updateMock).toHaveBeenCalledWith({
      where: { id: 10 },
      data: { isDeleted: true },
    });
  });

  it("rejects unsupported methods", async () => {
    const req = {
      method: "POST",
      query: { id: "10" },
    } as unknown as NextApiRequest;
    const { res, store } = createMockResponse();

    await deleteHandler(req, res);
    expect(store.status).toBe(405);
  });
});
