import { randomUUID } from "node:crypto";
import type { IncomingMessage } from "node:http";
import { imageSize } from "image-size";
import prisma from "@/lib/prisma";
import { ApiError } from "@/lib/api/handler";
import {
  EXTENSION_BY_TYPE,
  IMAGE_RULES,
  type ImageContentType,
  type ImageErrorCode,
  validateImage,
} from "@/lib/image-validation";
import { storeFile } from "./storage";

/** Error thrown for a rejected image; `code` matches `images.errors.*`. */
export class ImageRejectedError extends ApiError {
  constructor(public readonly code: ImageErrorCode | "empty") {
    super(code === "tooLarge" ? 413 : 400, `Image rejected: ${code}`);
  }
}

/** Reads the raw request body, refusing anything over `limit` bytes. */
export async function readBody(req: IncomingMessage, limit: number) {
  const chunks: Buffer[] = [];
  let total = 0;
  for await (const chunk of req) {
    total += chunk.length;
    if (total > limit) throw new ImageRejectedError("tooLarge");
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks);
}

const TYPE_BY_DETECTED: Record<string, ImageContentType> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

/**
 * Type and displayed size, read from the file's bytes rather than trusting
 * the client. EXIF orientations 5-8 rotate by 90°, swapping width/height.
 */
export function inspectImage(body: Buffer) {
  let info: ReturnType<typeof imageSize>;
  try {
    info = imageSize(body);
  } catch {
    throw new ImageRejectedError("type");
  }
  const contentType = info.type ? TYPE_BY_DETECTED[info.type] : undefined;
  if (!contentType || !info.width || !info.height)
    throw new ImageRejectedError("type");

  const rotated = (info.orientation ?? 1) >= 5;
  return {
    contentType,
    width: rotated ? info.height : info.width,
    height: rotated ? info.width : info.height,
  };
}

/** Validates an uploaded image, stores it and records who uploaded it. */
export async function createImageAsset(userId: number, body: Buffer) {
  if (body.length === 0) throw new ImageRejectedError("empty");

  const { contentType, width, height } = inspectImage(body);
  const error = validateImage({ contentType, size: body.length, width, height });
  if (error) throw new ImageRejectedError(error);

  // Grouped per uploader, so an "assets" folder per user is a prefix away.
  const pathname = `assets/${userId}/${randomUUID()}.${EXTENSION_BY_TYPE[contentType]}`;
  const stored = await storeFile(pathname, body, contentType);

  return prisma.asset.create({
    data: {
      url: stored.url,
      pathname: stored.pathname,
      contentType,
      size: body.length,
      width,
      height,
      uploadedById: userId,
    },
    select: { id: true, url: true, width: true, height: true, contentType: true },
  });
}

/** Ids among `assetIds` that this user did not upload (or that don't exist). */
export async function findForeignAssetIds(userId: number, assetIds: number[]) {
  if (assetIds.length === 0) return [];
  const owned = await prisma.asset.findMany({
    where: { id: { in: assetIds }, uploadedById: userId },
    select: { id: true },
  });
  const ownedIds = new Set(owned.map((asset) => asset.id));
  return assetIds.filter((id) => !ownedIds.has(id));
}

/**
 * A page of the user's uploaded images, newest first, each with the live
 * sequences it appears in. Sequences don't point at images: an IMAGE frame
 * has the `assetId`, and a sequence lists its frames in `FrameOrder`.
 */
export async function listUserAssets(
  userId: number,
  { page, limit }: { page: number; limit: number },
) {
  const assets = await prisma.asset.findMany({
    where: { uploadedById: userId },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    skip: (page - 1) * limit,
    take: limit + 1,
    select: {
      id: true,
      url: true,
      width: true,
      height: true,
      contentType: true,
      createdAt: true,
      frames: { select: { id: true } },
    },
  });

  const hasMore = assets.length > limit;
  const pageAssets = hasMore ? assets.slice(0, limit) : assets;

  const frameIds = pageAssets.flatMap((asset) => asset.frames.map((f) => f.id));
  // Only the user's own sequences: an image can only go in its uploader's.
  const sequences = frameIds.length
    ? await prisma.sequence.findMany({
        where: { userId, isDeleted: false, FrameOrder: { hasSome: frameIds } },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        select: { id: true, title: true, FrameOrder: true },
      })
    : [];

  return {
    items: pageAssets.map(({ frames, ...asset }) => {
      const ids = new Set(frames.map((frame) => frame.id));
      return {
        ...asset,
        sequences: sequences
          .filter((sequence) => sequence.FrameOrder.some((id) => ids.has(id)))
          .map(({ id, title }) => ({ id, title })),
      };
    }),
    page,
    pageSize: limit,
    hasMore,
    nextPage: hasMore ? page + 1 : null,
  };
}

export const MAX_UPLOAD_BYTES = IMAGE_RULES.maxBytes;
