import fs from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";

/**
 * Where uploaded files go. With BLOB_READ_WRITE_TOKEN set (Vercel) they're
 * stored in Vercel Blob; without it (local dev, e2e) they're written to
 * LOCAL_UPLOAD_DIR and served by /api/asset/file/[...path].
 */
export const LOCAL_UPLOAD_DIR = path.resolve(
  process.cwd(),
  process.env.LOCAL_UPLOAD_DIR ?? ".uploads",
);
export const LOCAL_FILE_ROUTE = "/api/asset/file";

export const usesBlobStorage = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

export async function storeFile(
  pathname: string,
  body: Buffer,
  contentType: string,
): Promise<{ url: string; pathname: string }> {
  if (usesBlobStorage()) {
    const blob = await put(pathname, body, {
      access: "public",
      contentType,
      addRandomSuffix: false,
    });
    return { url: blob.url, pathname: blob.pathname };
  }

  const target = resolveLocalPath(pathname);
  if (!target) throw new Error(`Invalid upload path: ${pathname}`);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, body);
  return { url: `${LOCAL_FILE_ROUTE}/${pathname}`, pathname };
}

/** Absolute path inside LOCAL_UPLOAD_DIR, or null if it would escape it. */
export function resolveLocalPath(pathname: string) {
  const target = path.resolve(LOCAL_UPLOAD_DIR, pathname);
  return target.startsWith(LOCAL_UPLOAD_DIR + path.sep) ? target : null;
}
