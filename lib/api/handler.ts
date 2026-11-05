import type { NextApiRequest, NextApiResponse } from "next";
import type { Session } from "next-auth";
import { z, type ZodTypeAny } from "zod";
import { requireApiSession } from "@/lib/api/auth";

type Method = "GET" | "POST" | "PUT" | "DELETE";

/** Every API error response has this shape. */
export type ApiErrorBody = {
  message: string;
  issues?: { path: string; message: string }[];
};

/** Throw from a handler or service to answer with a specific status. */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

export const notFound = (what = "Resource") =>
  new ApiError(404, `${what} not found`);

type Context<Q, B> = {
  req: NextApiRequest;
  res: NextApiResponse;
  session: Session;
  userId: number;
  query: Q;
  body: B;
};

type Options<QS extends ZodTypeAny | undefined, BS extends ZodTypeAny | undefined> = {
  method: Method;
  query?: QS;
  body?: BS;
};

type Infer<S> = S extends ZodTypeAny ? z.infer<S> : undefined;

const sendError = (
  res: NextApiResponse,
  status: number,
  body: ApiErrorBody,
) => res.status(status).json(body);

const toIssues = (error: z.ZodError) =>
  error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));

const isPrismaNotFound = (error: unknown) =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  (error as { code?: string }).code === "P2025";

/**
 * Wraps an API route: checks the HTTP method, requires a signed-in user,
 * validates query and body with Zod, and turns thrown errors into
 * consistent `{ message }` responses.
 */
export function withSession<
  QS extends ZodTypeAny | undefined = undefined,
  BS extends ZodTypeAny | undefined = undefined,
>(
  options: Options<QS, BS>,
  handler: (ctx: Context<Infer<QS>, Infer<BS>>) => Promise<unknown>,
) {
  return async function apiRoute(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== options.method) {
      res.setHeader?.("Allow", options.method);
      return sendError(res, 405, { message: "Method not allowed" });
    }

    const sessionResult = await requireApiSession(req, res);
    if (!sessionResult) return;

    let query = undefined as Infer<QS>;
    if (options.query) {
      const parsed = options.query.safeParse(req.query ?? {});
      if (!parsed.success)
        return sendError(res, 400, {
          message: "Invalid query parameters",
          issues: toIssues(parsed.error),
        });
      query = parsed.data;
    }

    let body = undefined as Infer<BS>;
    if (options.body) {
      const parsed = options.body.safeParse(req.body ?? {});
      if (!parsed.success)
        return sendError(res, 400, {
          message: "Invalid request body",
          issues: toIssues(parsed.error),
        });
      body = parsed.data;
    }

    try {
      await handler({
        req,
        res,
        session: sessionResult.session,
        userId: sessionResult.userId,
        query,
        body,
      });
    } catch (error) {
      if (error instanceof ApiError)
        return sendError(res, error.status, { message: error.message });
      if (isPrismaNotFound(error))
        return sendError(res, 404, { message: "Resource not found" });

      console.error(`[api] ${req.method} ${req.url} failed`, error);
      return sendError(res, 500, { message: "Internal server error" });
    }
  };
}
