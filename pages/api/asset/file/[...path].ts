import fs from "node:fs/promises";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  isAllowedContentType,
  EXTENSION_BY_TYPE,
} from "@/lib/image-validation";
import { resolveLocalPath, usesBlobStorage } from "@/lib/server/storage";

const TYPE_BY_EXTENSION = Object.fromEntries(
  Object.entries(EXTENSION_BY_TYPE).map(([type, ext]) => [ext, type]),
);

/**
 * Serves files stored on local disk when Vercel Blob isn't configured
 * (local dev and e2e). With Blob configured, files have their own public
 * URLs and this route answers 404.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ message: "Method not allowed" });
  }
  if (usesBlobStorage()) return res.status(404).json({ message: "Not found" });

  const segments = ([] as string[]).concat(req.query.path ?? []);
  const pathname = segments.join("/");
  const target = resolveLocalPath(pathname);
  const contentType = TYPE_BY_EXTENSION[pathname.split(".").pop() ?? ""];

  if (!target || !contentType || !isAllowedContentType(contentType))
    return res.status(404).json({ message: "Not found" });

  try {
    const file = await fs.readFile(target);
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    return res.status(200).send(file);
  } catch {
    return res.status(404).json({ message: "Not found" });
  }
}
