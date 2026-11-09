import prisma from "@/lib/prisma";
import type { Prisma } from "@/lib/generated/prisma/client";
import { notFound } from "@/lib/api/handler";
import { findVisibleSequence } from "@/lib/server/sequences";
import type { z } from "zod";
import type { listCommentsQuery } from "@/lib/validation";

type ListQuery = z.infer<typeof listCommentsQuery>;

const commentSelect = {
  id: true,
  content: true,
  sequenceId: true,
  authorId: true,
  createdAt: true,
  updatedAt: true,
  author: { select: { id: true, username: true, avatarUrl: true } },
} satisfies Prisma.CommentSelect;

async function requireVisibleSequence(sequenceId: number, viewerId: number) {
  const sequence = await findVisibleSequence(sequenceId, viewerId);
  if (!sequence) throw notFound("Sequence");
  return sequence;
}

/**
 * A page of a sequence's comments, newest first. Pages follow a cursor (the
 * last comment shown) rather than an offset, so comments posted while
 * someone reads don't make the next page repeat what they've already seen.
 */
export async function listComments(viewerId: number, query: ListQuery) {
  const { sequenceId, cursor, limit } = query;
  await requireVisibleSequence(sequenceId, viewerId);

  const where = { sequenceId, isDeleted: false };
  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      where,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      take: limit + 1,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      select: commentSelect,
    }),
    prisma.comment.count({ where }),
  ]);

  const hasMore = comments.length > limit;
  const items = hasMore ? comments.slice(0, limit) : comments;

  return {
    items,
    hasMore,
    nextCursor: hasMore ? items[items.length - 1].id : null,
    total,
  };
}

/** Adds a comment to a sequence the user can see. */
export async function createComment(
  authorId: number,
  sequenceId: number,
  content: string,
) {
  await requireVisibleSequence(sequenceId, authorId);
  return prisma.comment.create({
    data: { sequenceId, authorId, content },
    select: commentSelect,
  });
}

/**
 * Soft-deletes a comment. Its author and the sequence's owner may delete it;
 * for anyone else it doesn't exist, so ids can't be probed.
 */
export async function deleteComment(userId: number, id: number) {
  const { count } = await prisma.comment.updateMany({
    where: {
      id,
      isDeleted: false,
      OR: [{ authorId: userId }, { sequence: { userId } }],
    },
    data: { isDeleted: true },
  });
  if (count === 0) throw notFound("Comment");
}
