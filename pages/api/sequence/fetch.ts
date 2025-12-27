import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { requireApiSession } from "@/lib/api/auth";
import shuffle from "lodash.shuffle";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" });

  const sessionResult = await requireApiSession(req, res);
  if (!sessionResult) return;

  const { userId: clientId } = sessionResult;

  try {
    const sequences = await prisma.sequence.findMany({
      where: {
        ...(clientId ? { userId: { not: clientId } } : {}),
        isDeleted: false,
        visibility: "PUBLIC",
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!Array.isArray(sequences) || sequences.length === 0)
      return res.status(404).json({ message: "Sequences not found" });

    const firstFrameIds = sequences
      .map((sequence) => sequence.FrameOrder?.[0])
      .filter(Boolean);

    const frames = firstFrameIds.length
      ? await prisma.frame.findMany({ where: { id: { in: firstFrameIds } } })
      : [];

    const framesById = new Map(frames.map((frame) => [frame.id, frame]));

    const sequencesWithFirstFrame = sequences.map((sequence) => ({
      ...sequence,
      firstFrame:
        typeof sequence.FrameOrder?.[0] === "number"
          ? framesById.get(sequence.FrameOrder[0]) ?? null
          : null,
    }));

    const shuffledSequences = shuffle(sequencesWithFirstFrame);

    res.status(200).json(shuffledSequences);
  } catch (error) {
    if (error instanceof Error)
      res
        .status(500)
        .json({ error: "Error fetching sequence", details: error.message });
  }
}
