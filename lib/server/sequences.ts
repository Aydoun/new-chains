import prisma from "@/lib/prisma";
import type { Prisma } from "@/lib/generated/prisma/client";
import { notFound } from "@/lib/api/handler";
import { resolveTimeFilterDate } from "@/lib/time-filter";
import type { z } from "zod";
import type {
  createSequenceBody,
  listSequencesQuery,
  updateSequenceBody,
} from "@/lib/validation";

type ListQuery = z.infer<typeof listSequencesQuery>;

/** What the client needs to draw an IMAGE frame. */
const frameAsset = {
  asset: { select: { url: true, width: true, height: true } },
} satisfies Prisma.FrameInclude;

/** How many live comments a sequence has. */
const commentCount = {
  _count: { select: { comments: { where: { isDeleted: false } } } },
} satisfies Prisma.SequenceInclude;

/** Replaces Prisma's `_count` with a plain `commentCount`. */
function withCommentCount<T extends { _count?: { comments: number } }>(
  sequence: T,
) {
  const { _count, ...rest } = sequence;
  return { ...rest, commentCount: _count?.comments ?? 0 };
}

/** A sequence is visible to its owner, and to everyone when it's public. */
const visibleTo = (viewerId: number): Prisma.SequenceWhereInput => ({
  OR: [{ visibility: "PUBLIC" }, { userId: viewerId }],
});

const searchFilter = (search?: string): Prisma.SequenceWhereInput =>
  search
    ? {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      }
    : {};

async function paginate(where: Prisma.SequenceWhereInput, query: ListQuery) {
  const { page, limit } = query;
  const createdAfter = resolveTimeFilterDate(query.timeFilter);

  const sequences = await prisma.sequence.findMany({
    where: {
      ...where,
      isDeleted: false,
      ...(createdAfter ? { createdAt: { gte: createdAfter } } : {}),
      AND: [searchFilter(query.search)],
    },
    skip: (page - 1) * limit,
    take: limit + 1,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    include: {
      user: { select: { id: true, username: true } },
      ...commentCount,
    },
  });

  const hasMore = sequences.length > limit;
  const pageSequences = hasMore ? sequences.slice(0, limit) : sequences;

  const firstFrameIds = pageSequences
    .map((sequence) => sequence.FrameOrder?.[0])
    .filter((id): id is number => typeof id === "number");

  const frames = firstFrameIds.length
    ? await prisma.frame.findMany({
        where: { id: { in: firstFrameIds } },
        include: frameAsset,
      })
    : [];
  const framesById = new Map(frames.map((frame) => [frame.id, frame]));

  return {
    items: pageSequences.map((sequence) => ({
      ...withCommentCount(sequence),
      firstFrame: framesById.get(sequence.FrameOrder?.[0]) ?? null,
    })),
    page,
    pageSize: limit,
    hasMore,
    nextPage: hasMore ? page + 1 : null,
  };
}

/** Public sequences from other users (home feed). */
export function listFeed(viewerId: number, query: ListQuery) {
  return paginate({ userId: { not: viewerId }, visibility: "PUBLIC" }, query);
}

/** One user's sequences; private ones only when viewing your own studio. */
export function listUserSequences(viewerId: number, query: ListQuery) {
  const ownerId = query.userId ?? viewerId;
  return paginate(
    ownerId === viewerId
      ? { userId: ownerId }
      : { userId: ownerId, visibility: "PUBLIC" },
    query,
  );
}

/** A sequence with its frames in order, if the viewer may see it. */
export async function getSequenceForViewer(id: number, viewerId: number) {
  const sequence = await prisma.sequence.findFirst({
    where: { id, isDeleted: false, ...visibleTo(viewerId) },
    include: commentCount,
  });
  if (!sequence) throw notFound("Sequence");

  const [frames, snippets] = await Promise.all([
    prisma.frame.findMany({
      where: { id: { in: sequence.FrameOrder } },
      include: frameAsset,
    }),
    prisma.snippet.findMany({
      where: { originSequenceId: id, createdById: viewerId },
      select: { frameId: true },
    }),
  ]);

  const position = new Map(
    sequence.FrameOrder.map((frameId, i) => [frameId, i]),
  );
  frames.sort((a, b) => (position.get(a.id) ?? 0) - (position.get(b.id) ?? 0));

  return {
    ...withCommentCount(sequence),
    frames,
    likedFrames: snippets.map((snippet) => snippet.frameId),
  };
}

/** True when the viewer may see this sequence (used before saving snippets). */
export async function findVisibleSequence(
  id: number,
  viewerId: number,
  where: Prisma.SequenceWhereInput = {},
) {
  return prisma.sequence.findFirst({
    where: { id, isDeleted: false, ...where, AND: [visibleTo(viewerId)] },
    select: { id: true, title: true },
  });
}

/** Creates the frames and the sequence in one transaction. */
export function createSequenceWithFrames(
  userId: number,
  input: z.infer<typeof createSequenceBody>,
) {
  return prisma.$transaction(async (tx) => {
    const frameIds: number[] = [];
    for (const frame of input.frames) {
      const created = await tx.frame.create({
        data: {
          type: frame.assetId ? "IMAGE" : "PHRASE",
          content: frame.content,
          description: frame.description,
          assetId: frame.assetId,
          createdById: userId,
        },
        select: { id: true },
      });
      frameIds.push(created.id);
    }

    return tx.sequence.create({
      data: {
        title: input.title,
        description: input.description,
        visibility: input.visibility,
        userId,
        FrameOrder: frameIds,
      },
    });
  });
}

async function findOwnedSequence(id: number, userId: number) {
  const sequence = await prisma.sequence.findFirst({
    where: { id, userId, isDeleted: false },
    select: { id: true },
  });
  // Report someone else's sequence as missing, not forbidden, so ids
  // can't be probed.
  if (!sequence) throw notFound("Sequence");
  return sequence;
}

export async function updateSequence(
  id: number,
  userId: number,
  data: z.infer<typeof updateSequenceBody>,
) {
  await findOwnedSequence(id, userId);
  return prisma.sequence.update({ where: { id }, data });
}

export async function softDeleteSequence(id: number, userId: number) {
  await findOwnedSequence(id, userId);
  await prisma.sequence.update({ where: { id }, data: { isDeleted: true } });
}
