import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { requireApiSession } from "@/lib/api/auth";

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 50;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" });

  const sessionResult = await requireApiSession(req, res);
  if (!sessionResult) return;

  const { userId: clientId } = sessionResult;
  const pageQuery = req.query.page;
  const limitQuery = req.query.limit;

  const page =
    typeof pageQuery === "string" && !Number.isNaN(Number.parseInt(pageQuery))
      ? Math.max(1, Number.parseInt(pageQuery, 10))
      : 1;
  const requestedLimit =
    typeof limitQuery === "string" && !Number.isNaN(Number.parseInt(limitQuery))
      ? Number.parseInt(limitQuery, 10)
      : DEFAULT_PAGE_SIZE;
  const limit = Math.min(Math.max(requestedLimit, 1), MAX_PAGE_SIZE);

  try {
    const sequences = await prisma.sequence.findMany({
      where: {
        userId: clientId,
        isDeleted: false,
        visibility: "PUBLIC",
      },
      skip: (page - 1) * limit,
      take: limit + 1,
      orderBy: [
        {
          createdAt: "desc",
        },
        { id: "desc" },
      ],
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    });

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

    if (
      !Array.isArray(sequencesWithFirstFrame) ||
      sequencesWithFirstFrame.length === 0
    )
      return res.status(404).json({ message: "Sequences not found" });

    const items = sequencesWithFirstFrame.slice(0, limit);
    const hasMore = sequencesWithFirstFrame.length > limit;

    res.status(200).json({
      items,
      page,
      pageSize: limit,
      hasMore,
      nextPage: hasMore ? page + 1 : null,
    });
  } catch (error) {
    if (error instanceof Error)
      res
        .status(500)
        .json({ error: "Error fetching sequence", details: error.message });
  }
}
