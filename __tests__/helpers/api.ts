import type { NextApiRequest, NextApiResponse } from "next";

export function mockRequest(init: {
  method: string;
  query?: Record<string, unknown>;
  body?: unknown;
}) {
  return { query: {}, url: "/api/test", ...init } as unknown as NextApiRequest;
}

export function mockResponse() {
  const store: { status?: number; body?: any } = {};
  const res = {
    status(code: number) {
      store.status = code;
      return res;
    },
    json(data: unknown) {
      store.body = data;
      return res;
    },
    setHeader() {
      return res;
    },
  } as unknown as NextApiResponse;

  return { res, store };
}
