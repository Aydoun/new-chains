/**
 * Rules for frame images, shared by the browser (instant feedback) and the
 * upload API (the real check). Proportions follow Instagram and TikTok:
 * from 9:16 (portrait, stories/reels) to 1.91:1 (landscape feed), square
 * and 4:5 included.
 */
export const IMAGE_RULES = {
  contentTypes: ["image/jpeg", "image/png", "image/webp"],
  /** Below the 4.5 MB request limit of Vercel functions. */
  maxBytes: 4 * 1024 * 1024,
  minWidth: 320,
  minHeight: 320,
  maxWidth: 4096,
  maxHeight: 4096,
  /** width / height */
  minRatio: 9 / 16,
  maxRatio: 1.91,
} as const;

export type ImageContentType = (typeof IMAGE_RULES.contentTypes)[number];

export type ImageMeta = {
  contentType: string;
  size: number;
  width: number;
  height: number;
};

/** Each code has a matching `images.errors.<code>` translation. */
export type ImageErrorCode =
  | "type"
  | "tooLarge"
  | "tooSmall"
  | "tooBig"
  | "ratio";

// A little slack so e.g. 1080x1920 or 1080x566 export sizes pass.
const RATIO_TOLERANCE = 0.01;

export function isAllowedContentType(
  contentType: string,
): contentType is ImageContentType {
  return (IMAGE_RULES.contentTypes as readonly string[]).includes(contentType);
}

export function validateImage(meta: ImageMeta): ImageErrorCode | null {
  if (!isAllowedContentType(meta.contentType)) return "type";
  if (meta.size > IMAGE_RULES.maxBytes) return "tooLarge";
  if (meta.width < IMAGE_RULES.minWidth || meta.height < IMAGE_RULES.minHeight)
    return "tooSmall";
  if (meta.width > IMAGE_RULES.maxWidth || meta.height > IMAGE_RULES.maxHeight)
    return "tooBig";

  const ratio = meta.width / meta.height;
  if (
    ratio < IMAGE_RULES.minRatio - RATIO_TOLERANCE ||
    ratio > IMAGE_RULES.maxRatio + RATIO_TOLERANCE
  )
    return "ratio";

  return null;
}

/** Params for the `images.errors.*` messages. */
export const imageErrorParams = {
  maxMb: IMAGE_RULES.maxBytes / (1024 * 1024),
  minWidth: IMAGE_RULES.minWidth,
  minHeight: IMAGE_RULES.minHeight,
  maxWidth: IMAGE_RULES.maxWidth,
  maxHeight: IMAGE_RULES.maxHeight,
};

export const EXTENSION_BY_TYPE: Record<ImageContentType, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
