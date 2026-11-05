import prisma from "@/lib/prisma";
import { notFound } from "@/lib/api/handler";
import { findVisibleSequence } from "@/lib/server/sequences";

const snippetInclude = {
  frame: true,
  originSequence: { select: { id: true, title: true } },
} as const;

export function listSnippets(userId: number) {
  return prisma.snippet.findMany({
    where: { createdById: userId },
    include: snippetInclude,
    orderBy: { updatedAt: "desc" },
  });
}

/** Saves a frame from a sequence the user can see. */
export async function createSnippet(
  userId: number,
  frameId: number,
  originSequenceId: number,
) {
  const sequence = await findVisibleSequence(originSequenceId, userId, {
    FrameOrder: { has: frameId },
  });
  if (!sequence) throw notFound("Sequence for this frame");

  const frame = await prisma.frame.findUnique({ where: { id: frameId } });
  if (!frame) throw notFound("Frame");

  return prisma.snippet.create({
    data: { frameId, originSequenceId, createdById: userId },
    include: snippetInclude,
  });
}

/** Deletes one of the user's own snippets. */
export async function deleteSnippet(userId: number, id: number) {
  const { count } = await prisma.snippet.deleteMany({
    where: { id, createdById: userId },
  });
  if (count === 0) throw notFound("Snippet");
}
