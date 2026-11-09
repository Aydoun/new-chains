import { z } from "zod";
import {
  BIO_MAX_LENGTH,
  COMMENT_MAX_LENGTH,
  COMMENTS_PAGE_SIZE,
  CONTACT_MESSAGE_MAX_LENGTH,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
} from "@/lib/constants";
import { parseFrameLink } from "@/lib/frame-link";

const MAX_INT32 = 2_147_483_647;

export const SEQUENCE_TITLE_MAX_LENGTH = 120;
export const SEQUENCE_DESCRIPTION_MAX_LENGTH = 500;
export const FRAME_CONTENT_MAX_LENGTH = 1_000;
export const FRAME_DESCRIPTION_MAX_LENGTH = 500;
export const MAX_FRAMES_PER_SEQUENCE = 50;

/** Query values arrive as string | string[]; take the first one. */
const firstValue = (value: unknown) =>
  Array.isArray(value) ? value[0] : value;

/** A positive database id, from a query string or a JSON number. */
export const idSchema = z.preprocess(
  firstValue,
  z.coerce.number().int().positive().max(MAX_INT32),
);

export const idQuery = z.object({ id: idSchema });

const optionalQueryString = z.preprocess(
  firstValue,
  z.string().trim().max(100).optional(),
);

export const listSequencesQuery = z.object({
  page: z.preprocess(firstValue, z.coerce.number().int().min(1).default(1)),
  limit: z.preprocess(
    firstValue,
    z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
  ),
  timeFilter: z.preprocess(
    firstValue,
    z.enum(["last-hour", "today", "this-week", "this-month"]).optional(),
  ),
  search: optionalQueryString,
  userId: z.preprocess(firstValue, idSchema.optional()),
});

const trimmed = (max: number) => z.string().trim().max(max);

export const visibilitySchema = z.enum(["PUBLIC", "PRIVATE", "FRIENDS_ONLY"]);

/**
 * Optional frame link: empty means none; anything else must pass
 * `parseFrameLink` and is stored normalised (e.g. `https://` added).
 */
const frameLinkSchema = z
  .string()
  .optional()
  .transform((value, ctx) => {
    if (!value?.trim()) return undefined;
    const result = parseFrameLink(value);
    if (!result.ok) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: `link:${result.error}` });
      return z.NEVER;
    }
    return result.url;
  });

export const frameInputSchema = z.object({
  content: trimmed(FRAME_CONTENT_MAX_LENGTH).min(1, "Frame content is required"),
  description: trimmed(FRAME_DESCRIPTION_MAX_LENGTH).optional().default(""),
  /** An image the same user uploaded; makes this an IMAGE frame. */
  assetId: idSchema.optional(),
  /** A web link the frame opens in a new tab. */
  linkUrl: frameLinkSchema,
});

export const createSequenceBody = z
  .object({
    title: trimmed(SEQUENCE_TITLE_MAX_LENGTH).min(1, "Title is required"),
    description: trimmed(SEQUENCE_DESCRIPTION_MAX_LENGTH).optional().default(""),
    visibility: visibilitySchema.optional().default("PUBLIC"),
    frames: z
      .array(frameInputSchema)
      .min(1, "At least one frame is required")
      .max(MAX_FRAMES_PER_SEQUENCE),
  })
  .strict();

export const updateSequenceBody = z
  .object({
    title: trimmed(SEQUENCE_TITLE_MAX_LENGTH).min(1).optional(),
    description: trimmed(SEQUENCE_DESCRIPTION_MAX_LENGTH).optional(),
    visibility: visibilitySchema.optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "Nothing to update",
  });

export const createSnippetBody = z.object({
  frameId: idSchema,
  originSequenceId: idSchema,
});

export const updateUserBody = z
  .object({
    bio: z
      .string()
      .trim()
      .max(BIO_MAX_LENGTH, `Bio must be ${BIO_MAX_LENGTH} characters or fewer`),
  })
  .strict();

export const contactBody = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(
      CONTACT_MESSAGE_MAX_LENGTH,
      `Message must be ${CONTACT_MESSAGE_MAX_LENGTH} characters or fewer`,
    ),
});

/**
 * Length in characters as people see them: an emoji counts as one, not as
 * the two UTF-16 units `String.length` reports.
 */
export const characterCount = (value: string) => Array.from(value).length;

export const createCommentBody = z
  .object({
    sequenceId: idSchema,
    content: z
      .string()
      .trim()
      .min(1, "Comment is required")
      .refine((value) => characterCount(value) <= COMMENT_MAX_LENGTH, {
        message: `Comment must be ${COMMENT_MAX_LENGTH} characters or fewer`,
      }),
  })
  .strict();

export const listCommentsQuery = z.object({
  sequenceId: idSchema,
  /** Id of the last comment already shown; the page starts after it. */
  cursor: z.preprocess(firstValue, idSchema.optional()),
  limit: z.preprocess(
    firstValue,
    z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).default(COMMENTS_PAGE_SIZE),
  ),
});

export const listAssetsQuery = z.object({
  page: z.preprocess(firstValue, z.coerce.number().int().min(1).default(1)),
  limit: z.preprocess(
    firstValue,
    z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
  ),
});
